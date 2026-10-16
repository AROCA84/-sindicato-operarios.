import { readFile } from "node:fs/promises";

const API = "https://api.github.com";
const fullName = process.argv[2];
const registryUrl = new URL("../config/repositories.json", import.meta.url);

function headers() {
  const result = { Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" };
  if (process.env.GITHUB_TOKEN) result.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return result;
}

async function getJson(url) {
  const response = await fetch(url, { headers: headers() });
  if (!response.ok) {
    const note = response.status === 404
      ? "El repositorio no existe, es privado o no está autorizado para estas credenciales."
      : response.status === 403
        ? "GitHub ha denegado la petición o se ha alcanzado el límite de API."
        : "";
    throw new Error(`GitHub HTTP ${response.status}: ${url}. ${note}`);
  }
  return response.json();
}

function detectStack(files, pkg) {
  const signals = [];
  if (files.has("next.config.js") || files.has("next.config.mjs") || files.has("next.config.ts")) signals.push("Next.js");
  if (pkg?.dependencies?.react || pkg?.devDependencies?.react) signals.push("React");
  if (pkg?.dependencies?.["@supabase/supabase-js"] || pkg?.devDependencies?.["@supabase/supabase-js"]) signals.push("Supabase JS");
  if (files.has("supabase/config.toml") || [...files].some((name) => name.startsWith("supabase/migrations/"))) signals.push("Supabase files");
  if (files.has("pyproject.toml") || files.has("requirements.txt")) signals.push("Python");
  if (files.has("go.mod")) signals.push("Go");
  if (files.has("Cargo.toml")) signals.push("Rust");
  if (files.has("Dockerfile") || [...files].some((name) => name.endsWith("/Dockerfile"))) signals.push("Docker");
  return signals.length ? [...new Set(signals)] : ["No identificado automáticamente"];
}

async function main() {
  if (!fullName || !/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(fullName)) {
    throw new Error("Uso: npm run audit -- PROPIETARIO/REPOSITORIO");
  }

  const registry = JSON.parse(await readFile(registryUrl, "utf8"));
  const allowed = registry.repositories.some((repo) => repo.fullName.toLowerCase() === fullName.toLowerCase());
  if (!allowed) throw new Error("El repositorio no está en el catálogo autorizado. Añádelo y revísalo primero en config/repositories.json.");

  const repo = await getJson(`${API}/repos/${fullName}`);
  const tree = await getJson(`${API}/repos/${fullName}/git/trees/${encodeURIComponent(repo.default_branch)}?recursive=1`);
  const paths = (tree.tree ?? []).filter((item) => item.type === "blob").map((item) => item.path);
  const fileSet = new Set(paths);
  const wanted = ["README.md", "package.json", "pyproject.toml", "requirements.txt", "go.mod", "Cargo.toml", "composer.json"];
  const contentByPath = new Map();

  for (const file of wanted) {
    if (!fileSet.has(file)) continue;
    try {
      const result = await getJson(`${API}/repos/${fullName}/contents/${encodeURIComponent(file)}?ref=${encodeURIComponent(repo.default_branch)}`);
      if (result.content && result.encoding === "base64") {
        contentByPath.set(file, Buffer.from(result.content, "base64").toString("utf8"));
      }
    } catch (error) {
      console.log(`Aviso: no se pudo leer ${file}: ${error.message}`);
    }
  }

  let pkg = null;
  try { if (contentByPath.has("package.json")) pkg = JSON.parse(contentByPath.get("package.json")); } catch {}
  const dirs = [...new Set(paths.filter((p) => p.includes("/")).map((p) => p.split("/")[0]))].sort();
  const tests = paths.filter((p) => /(^|\/)(test|tests|__tests__|e2e)(\/|$)|\.(test|spec)\.[cm]?[jt]sx?$/.test(p));
  const workflows = paths.filter((p) => p.startsWith(".github/workflows/"));
  const manifestPaths = wanted.filter((p) => fileSet.has(p));

  console.log("\n=== AUDITORÍA INICIAL DE SOLO LECTURA ===");
  console.log(`Repositorio: ${repo.full_name}`);
  console.log(`URL: ${repo.html_url}`);
  console.log(`Rama por defecto: ${repo.default_branch}`);
  console.log(`Visibilidad: ${repo.private ? "privado" : "público"} | Archivado: ${repo.archived} | Tamaño: ${repo.size} KB`);
  console.log(`Última actualización: ${repo.updated_at}`);
  console.log(`Descripción: ${repo.description ?? "Sin descripción"}`);
  console.log(`Licencia declarada por GitHub: ${repo.license?.spdx_id ?? "No detectada; revisar archivos de licencia"}`);
  console.log(`Archivos en árbol: ${paths.length}${tree.truncated ? " (árbol truncado por GitHub)" : ""}`);
  console.log(`Directorios principales: ${dirs.slice(0, 35).join(", ") || "No detectados"}`);
  console.log(`Tecnologías inferidas: ${detectStack(fileSet, pkg).join(", ")}`);
  console.log(`Manifiestos localizados: ${manifestPaths.join(", ") || "Ninguno de los manifiestos comunes"}`);
  console.log(`Archivos relacionados con pruebas: ${tests.length}`);
  for (const file of tests.slice(0, 30)) console.log(`  - ${file}`);
  console.log(`Workflows de GitHub Actions: ${workflows.length}`);
  for (const file of workflows.slice(0, 20)) console.log(`  - ${file}`);
  if (pkg) {
    console.log(`Nombre de paquete: ${pkg.name ?? "No declarado"} | versión: ${pkg.version ?? "No declarada"}`);
    console.log(`Scripts disponibles: ${Object.keys(pkg.scripts ?? {}).join(", ") || "Ninguno"}`);
    console.log(`Dependencias directas: ${Object.keys(pkg.dependencies ?? {}).length} | desarrollo: ${Object.keys(pkg.devDependencies ?? {}).length}`);
  }
  if (contentByPath.has("README.md")) {
    const readme = contentByPath.get("README.md").split("\n").slice(0, 12).join("\n");
    console.log("\n--- Inicio del README (máximo 12 líneas) ---\n" + readme);
  }
  console.log("\nLímites: análisis estático preliminar. No ejecuta código, no lee secretos, no modifica archivos, no consulta datos de producción ni demuestra que el proyecto compile.");
}

main().catch((error) => {
  console.error(`Auditoría cancelada: ${error.message}`);
  process.exitCode = 1;
});
