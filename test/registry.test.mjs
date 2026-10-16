import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("el catálogo incluye la web principal y conserva separados los repositorios", async () => {
  const config = JSON.parse(await readFile(new URL("../config/repositories.json", import.meta.url), "utf8"));
  assert.equal(config.primaryProject, "AROCA84/-sindicato-operarios");
  assert.ok(config.repositories.some((repo) => repo.fullName === config.primaryProject));
  assert.ok(config.repositories.length >= 5);
  assert.equal(new Set(config.repositories.map((repo) => repo.id)).size, config.repositories.length);
});

test("la política bloquea fusiones y despliegues sin autorización", async () => {
  const config = JSON.parse(await readFile(new URL("../config/repositories.json", import.meta.url), "utf8"));
  assert.equal(config.policy.neverMergeOrDeployWithoutExplicitApproval, true);
  assert.equal(config.policy.preserveSourceRepositories, true);
  assert.equal(config.policy.auditBeforeReuse, true);
});

test("los proyectos upstream están catalogados para evaluación y no para copia ciega", async () => {
  const config = JSON.parse(await readFile(new URL("../config/upstreams.json", import.meta.url), "utf8"));
  assert.ok(config.candidates.some((item) => item.repository === "OpenHands/OpenHands"));
  assert.ok(config.candidates.some((item) => item.repository === "SWE-agent/SWE-agent"));
  assert.equal(config.policy.copyWholeRepositoryByDefault, false);
  assert.equal(config.policy.reviewLicenseBeforeReuse, true);
});
