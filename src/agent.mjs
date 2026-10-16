import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const registryPath = path.join(root, "config", "repositories.json");
const API = "https://api.github.com";
const headers = () => {
  const value = { Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" };
  if (process.env.GITHUB_TOKEN) value.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return value;
};

async function loadRegistry() {
  const registry = JSON.parse(await readFile(registryPath, "utf8"));
  if (registry.schemaVersion !== 1 || !Array.isArray(registry.repositories)) throw new Error("Formato de config/repositories.json no válido.");
  const ids = new Set();
  const names = new Set();
  for (const repo of registry.repositories) {
    if (!repo.id || !repo.fullName || !repo.role) throw new Error("Cada repositorio necesita id, fullName y role.");
    if (ids.has(repo.id)) throw new Error(`ID duplicado en el catálogo: ${repo.id}`);
    ids.add(repo.id);
    names.add(repo.fullName.toLowerCase());
  }
  return { ...registry, registeredNames: names };
}

async function apiJson(url) {
  const response = await fetch(url, { headers: headers() });
  if (!response.ok) {
    const hint = response.status === 401 || response.status === 403
      ? " Comprueba el token, sus permisos y el límite de API."
      : "";
    throw new Error(`GitHub respondió HTTP ${response.status} para ${url}.${hint}`);
  }
  return response.json();
}

async function allPages(urlForPage, maxPages = 10) {
  const all = [];
  for (let page = 1; page <= maxPages; page += 1) {
    const url = urlForPage(page);
    const data = await apiJson(url);
    const rows = Array.isArray(data) ? data : data.items;
    if (!Array.isArray(rows)) throw new Error("Respuesta de GitHub inesperada.");
    all.push(...rows);
    if (rows.length < 100) break;
  }
  return all;
}

async function checkRepository(fullName) {
  try {
    const data = await apiJson(`${API}/repos/${fullName}`);
    return { state: "available", fullName, defaultBranch: data.default_branch, visibility: data.visibility, archived: data.archived, sizeKb: data.size };
  } catch (error) {
    const message = error.message;
    if (message.includes("HTTP 404")) return { state: "not-visible", fullName, detail: "404: inexistente, privado o no accesible con estas credenciales" };
    if (message.includes("HTTP 403")) return { state: "rate-limited-or-forbidden", fullName, detail: "403: límite de API o permisos insuficientes" };
    return { state: "error", fullName, detail: message };
  }
}

async function discoverRepositories(registry) {
  const token = Boolean(process.env.GITHUB_TOKEN);
  const repos = token
    ? await allPages((page) => `${API}/user/repos?per_page=100&page=${page}&sort=updated&affiliation=owner,collaborator,organization_member`)
    : await allPages((page) => `${API}/users/AROCA84/repos?per_page=100&page=${page}&sort=updated`);
  const newRepos = repos.filter((repo) => !registry.registeredNames.has(repo.full_name.toLowerCase()));
  console.log(`Repositorios visibles para esta consulta: ${repos.length}`);
  console.log(token
    ? "Consulta autenticada: incluye solo repositorios permitidos por la identidad y los permisos del token."
    : "Consulta pública: solo repositorios públicos propios; no revela repositorios privados ni los de colaboradores.");
  console.log(`Ya registrados: ${repos.length - newRepos.length} | Nuevos por revisar: ${newRepos.length}\n`);
  if (!newRepos.length) console.log("No se encontraron repositorios nuevos sin registrar.");
  for (const repo of newRepos) {
    console.log(`[POR AUDITAR] ${repo.full_name}`);
    console.log(`  ${repo.description ?? "Sin descripción"}`);
    console.log(`  visibilidad=${repo.private ? "privado" : "público"} | rama=${repo.default_branch} | archivado=${repo.archived} | actualizado=${repo.updated_at}`);
  }
  console.log("\nSolo lectura: no añade repositorios al catálogo ni modifica código.");
}

async function searchPublicRepositories() {
  const queries = [
    "topic:ai-agent topic:software-engineering",
    "topic:github-app topic:automation",
    "multi repository coding agent",
    "GitHub MCP server repository management",
    "OpenHands software agent SDK OpenCode coding agent"
  ];
  const found = new Map();
  for (const query of queries) {
    const url = `${API}/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=30`;
    try {
      const data = await apiJson(url);
      for (const repo of data.items ?? []) {
        if (!repo.fork && !repo.archived) found.set(repo.full_name, { fullName: repo.full_name, stars: repo.stargazers_count, updatedAt: repo.updated_at, description: repo.description ?? "Sin descripción", url: repo.html_url, license: repo.license?.spdx_id ?? "Licencia por verificar" });
      }
      console.log(`Búsqueda completada: ${query}`);
    } catch (error) {
      console.log(`Búsqueda no completada (${query}): ${error.message}`);
    }
  }
  const sorted = [...found.values()].sort((a, b) => b.stars - a.stars);
  console.log(`\nRepositorios públicos candidatos únicos: ${sorted.length}\n`);
  for (const repo of sorted.slice(0, 100)) {
    console.log(`[${repo.stars} stars] ${repo.fullName} | licencia=${repo.license} | actualizado=${repo.updatedAt}`);
    console.log(`  ${repo.description}\n  ${repo.url}`);
  }
  console.log("\nEsta es una lista de descubrimiento, no una auditoría de código ni una autorización para copiar.");
}

const command = process.argv[2] ?? "help";
const registry = await loadRegistry();

if (command === "repos") {
  console.log("Catálogo de repositorios (no se modifica ninguno):\n");
  for (const repo of [...registry.repositories].sort((a, b) => a.priority - b.priority)) {
    console.log(`[${repo.priority}] ${repo.fullName}\n    ${repo.role}\n    Acceso previsto: ${repo.access}`);
  }
} else if (command === "discover") {
  try { await discoverRepositories(registry); }
  catch (error) { console.error(`No se pudo completar el descubrimiento: ${error.message}`); process.exitCode = 1; }
} else if (command === "search") {
  await searchPublicRepositories();
} else if (command === "check") {
  console.log("Comprobación de visibilidad en GitHub. Solo lectura.\n");
  for (const repo of [...registry.repositories].sort((a, b) => a.priority - b.priority)) {
    const result = await checkRepository(repo.fullName);
    console.log(`${result.state.padEnd(25)} ${result.fullName} — ${result.detail ?? `rama=${result.defaultBranch}, visibilidad=${result.visibility}, tamaño=${result.sizeKb} KB`}`);
  }
} else if (command === "plan") {
  console.log("Modo seguro del agente:");
  console.log("- Inventariar y analizar por defecto; descubrir y buscar es solo lectura.");
  console.log("- Los repositorios privados requieren autenticación válida y permisos concedidos por su propietario.");
  console.log("- La búsqueda pública encuentra candidatos; no significa que todos estén auditados ni que puedan copiarse.");
  console.log("- Cada repositorio conserva su historial; los cambios van a ramas y PRs revisables.");
  console.log("- Fusionar, tocar secretos, cambiar datos reales o desplegar requiere autorización explícita.");
  console.log("- No se ejecuta código remoto desde esta CLI.");
  console.log("\nEste prototipo todavía no es un agente LLM autónomo: es la base de coordinación multi-repositorio.");
} else {
  console.log("PLATAFORMA SINDICAL — Agente técnico (prototipo)");
  console.log("Uso: npm run repos | npm run discover | npm run search | npm run check | npm run plan | npm test");
}
