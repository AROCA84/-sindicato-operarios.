import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";

test("la auditoría rechaza argumentos inválidos antes de consultar GitHub", () => {
  const result = spawnSync(process.execPath, ["src/audit.mjs", "no-es-un-repo"], {
    encoding: "utf8",
    timeout: 5000
  });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Uso: npm run audit/);
  assert.match(result.stderr, /Auditoría cancelada/);
});

test("la auditoría incluye límites de seguridad y no ejecuta comandos del repositorio auditado", async () => {
  const { readFile } = await import("node:fs/promises");
  const source = await readFile(new URL("../src/audit.mjs", import.meta.url), "utf8");
  assert.match(source, /config\/repositories\.json/);
  assert.match(source, /No ejecuta código/);
  assert.doesNotMatch(source, /child_process|execSync|spawnSync\(/);
});
