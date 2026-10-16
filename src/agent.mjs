import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const registryPath = path.join(root, "config", "repositories.json");

async function loadRegistry() {
  const registry = JSON.parse(await readFile(registryPath, "utf8"));
  if (registry.schemaVersion !== 1 || !Array.isArray(registry.repositories)) {
    throw new Error("Formato de config/repositories.json no válido.");
  }
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

function githubHeaders() {
  const headers = { Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return headers;
}

async function githubRequest(fullName) {
  const response = await fetch(`https://api.github.com/repos/${fullName}`, { headers: githubHeaders() });
  if (response.status === 404) return { state: "not-visible", detail: "404: inexistente, privado o no accesible con estas credenciales" };
  if (response.status === 403) return { state: "rate-limited-or-forbidden", detail: "403: límite de API o permisos insuficientes" };
  if (!response.ok) return { state: "error", detail: `HTTP ${response.status}` };
  const data = await response.json();
  return { state: "available", defaultBranch: data.default_branch, visibility: data.visibility, archived: data.archived, sizeKb: data.size };
}

async function discoverRepositories(registry) {
  const token = Boolean(process.env.GITHUB_TOKEN);
  const endpoint = token
    ? "https://api.github.com/user/repos?per_page=100&sort=updated&affiliation=owner,collaborator,organization_member"
    : "https://api.github.com/users/AROCA84/repos?per_page=100&sort=updated";
  const response = await fetch(endpoint, { headers: githubHeaders() });
  if (!response.ok) throw new Error(`GitHub respondió HTTP ${response.status}. ${token ? "Comprueba los permisos del token." : "Sin token solo se listan repositorios públicos."}`);
  const repos = await response.json();
  const newRepos = repos.filter((repo) => !registry.registeredNames.has(repo.full_name.toLowerCase()));
  console.log(`Repositorios devueltos por GitHub: ${repos.length}`);
  console.log(token ? "Consulta autenticada: puede incluir repositorios privados según los permisos del token." : "Consulta pública: no incluye repositorios privados.");
  console.log(`Ya registrados: ${repos.length - newRepos.length} | Nuevos por revisar: ${newRepos.length}\n`);
  if (!newRepos.length) console.log("No se encontraron repositorios nuevos en esta página.");
  for (const repo of newRepos) {
    console.log(`[POR AUDITAR] ${repo.full_name}`);
    console.log(`  ${repo.description ?? "Sin descripción"}`);
    console.log(`  visibilidad=${repo.private ? "privado" : "público"} | rama=${repo.default_branch} | archivado=${repo.archived} | actualizado=${repo.updated_at}`);
  }
  console.log("\nLa búsqueda es de solo lectura. No añade repositorios al catálogo automáticamente; hay que revisar su contenido y decidir su función.");
}

const command = process.argv[2] ?? "help";
const registry = await loadRegistry();

if (command === "repos") {
  console.log("Catálogo de repositorios (no se modifica ninguno):\n");
  for (const repo of [...registry.repositories].sort((a, b) => a.priority - b.priority)) {
    console.log(`[${repo.priority}] ${repo.fullName}\n    ${repo.role}\n    Acceso previsto: ${repo.access}`);
  }
} else if (command === "discover") {
  try {
    await discoverRepositories(registry);
  } catch (error) {
    console.error(`No se pudo completar el descubrimiento: ${error.message}`);
    process.exitCode = 1;
  }
} else if (command === "check") {
  console.log("Comprobación de visibilidad en GitHub. Es una consulta de solo lectura.\n");
  for (const repo of [...registry.repositories].sort((a, b) => a.priority - b.priority)) {
    try {
      const result = await githubRequest(repo.fullName);
      console.log(`${result.state.padEnd(23)} ${repo.fullName} — ${result.detail ?? `rama=${result.defaultBranch}, visibilidad=${result.visibility}, tamaño=${result.sizeKb} KB`}`);
    } catch (error) {
      console.log(`network-error            ${repo.fullName} — ${error.message}`);
    }
  }
} else if (command === "plan") {
  console.log("Modo seguro del agente:");
  console.log("- Inventariar y analizar por defecto; descubrimiento de repositorios solo lectura.");
  console.log("- Cada repositorio mantiene su historial y su función; no se fusionan repositorios a ciegas.");
  console.log("- Reutilizar componentes solo tras comprobar licencia, dependencias, seguridad y compatibilidad.");
  console.log("- Los cambios deben ir a una rama de trabajo y pasar pruebas.");
  console.log("- Fusionar, tocar secretos, cambiar datos reales o desplegar requiere autorización explícita.");
  console.log("- No se ejecuta código remoto ni se hacen escrituras en GitHub desde este CLI.");
  console.log("\nNota: este prototipo aún no es un agente LLM autónomo. Es la base verificable de coordinación multi-repositorio.");
} else {
  console.log("PLATAFORMA SINDICAL — Agente técnico (prototipo)");
  console.log("Uso: npm run repos | npm run discover | npm run check | npm run plan | npm test");
}
