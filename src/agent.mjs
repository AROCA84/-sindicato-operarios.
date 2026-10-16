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
  for (const repo of registry.repositories) {
    if (!repo.id || !repo.fullName || !repo.role) throw new Error("Cada repositorio necesita id, fullName y role.");
    if (ids.has(repo.id)) throw new Error(`ID duplicado en el catálogo: ${repo.id}`);
    ids.add(repo.id);
  }
  return registry;
}

async function githubRequest(fullName) {
  const headers = { Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const response = await fetch(`https://api.github.com/repos/${fullName}`, { headers });
  if (response.status === 404) return { state: "not-visible", detail: "404: inexistente, privado o no accesible con estas credenciales" };
  if (response.status === 403) return { state: "rate-limited-or-forbidden", detail: "403: límite de API o permisos insuficientes" };
  if (!response.ok) return { state: "error", detail: `HTTP ${response.status}` };
  const data = await response.json();
  return { state: "available", defaultBranch: data.default_branch, visibility: data.visibility, archived: data.archived, sizeKb: data.size };
}

const command = process.argv[2] ?? "help";
const registry = await loadRegistry();

if (command === "repos") {
  console.log("Catálogo de repositorios (no se modifica ninguno):\n");
  for (const repo of [...registry.repositories].sort((a, b) => a.priority - b.priority)) {
    console.log(`[${repo.priority}] ${repo.fullName}\n    ${repo.role}\n    Acceso previsto: ${repo.access}`);
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
  console.log("- Solo inventariar y analizar por defecto.");
  console.log("- Cada repositorio mantiene su historial y su función; no se fusionan repositorios a ciegas.");
  console.log("- Reutilizar componentes solo tras comprobar licencia, dependencias, seguridad y compatibilidad.");
  console.log("- Los cambios deben ir a una rama de trabajo y pasar pruebas.");
  console.log("- Fusionar, tocar secretos, cambiar datos reales o desplegar requiere autorización explícita.");
  console.log("- No se ejecuta código remoto ni se hacen escrituras en GitHub desde este CLI.");
  console.log("\nNota: este prototipo aún no es un agente LLM autónomo. Es la base verificable de coordinación multi-repositorio.");
} else {
  console.log("PLATAFORMA SINDICAL — Agente técnico (prototipo)");
  console.log("Uso: npm run repos | npm run check | npm run plan | npm test");
}
