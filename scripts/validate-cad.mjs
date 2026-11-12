import { readFile, readdir } from "node:fs/promises";
import { createHash } from "node:crypto";
const sha = (value) => createHash("sha256").update(value).digest("hex");
const canonical = (value) =>
  Array.isArray(value)
    ? value.map(canonical)
    : value && typeof value === "object"
      ? Object.fromEntries(
          Object.keys(value)
            .sort()
            .map((key) => [key, canonical(value[key])]),
        )
      : value;
export async function validateCad(projects, report) {
  const directory = new URL("../public/models/", import.meta.url);
  const manifest = JSON.parse(
    await readFile(new URL("index.json", directory), "utf8"),
  );
  report(
    manifest.schemaVersion === 1 && manifest.units === "mm",
    "CAD: unsupported schema or units",
  );
  const expected = projects.flatMap((project) => [
    { project, fixtureId: null, role: "part", geometry: project.part },
    ...project.fixtures
      .filter((f) => f.made && f.geometry)
      .map((f) => ({
        project,
        fixtureId: f.id,
        role: "fixture",
        geometry: f.geometry,
      })),
  ]);
  report(
    manifest.projectCount === projects.length &&
      manifest.modelCount === expected.length,
    "CAD: model counts are stale",
  );
  report(
    manifest.models.length === expected.length,
    "CAD: unexpected model count",
  );
  const files = new Set();
  for (const entry of expected) {
    const context = `CAD ${entry.project.id}/${entry.fixtureId || "part"}`;
    const matches = manifest.models.filter(
      (m) =>
        m.projectId === entry.project.id && m.fixtureId === entry.fixtureId,
    );
    report(matches.length === 1, `${context}: expected exactly one model`);
    const model = matches[0];
    if (!model) continue;
    const hash = sha(JSON.stringify(canonical(entry.geometry)));
    const geometry = entry.geometry;
    const expectedSize =
      geometry.kind === "turned"
        ? [
            geometry.sections.reduce((sum, section) => sum + section.length, 0),
            ...Array(2).fill(
              Math.max(...geometry.sections.map((section) => section.diameter)),
            ),
          ]
        : [geometry.width, geometry.depth, geometry.height];
    report(
      model.geometrySha256 === hash,
      `${context}: geometry has changed; regenerate the STEP model`,
    );
    report(
      model.revision === entry.project.revision,
      `${context}: revision is stale`,
    );
    report(model.role === entry.role, `${context}: incorrect role`);
    report(
      /^[a-zA-Z0-9-]+\.step$/.test(model.file),
      `${context}: unsafe file name`,
    );
    report(
      model.file.includes(hash.slice(0, 12)) &&
        model.url === `/models/${model.file}`,
      `${context}: immutable URL does not match geometry hash`,
    );
    report(!files.has(model.file), `${context}: duplicate file`);
    files.add(model.file);
    const data = await readFile(new URL(model.file, directory));
    report(
      data.length === model.bytes && sha(data) === model.sha256,
      `${context}: STEP file bytes/hash mismatch`,
    );
    report(
      data.toString("utf8").startsWith("ISO-10303-21;") &&
        data.toString("utf8").includes("END-ISO-10303-21;"),
      `${context}: invalid STEP container`,
    );
    for (const key of ["shape", "roundTrip"]) {
      const shape = model[key];
      report(
        shape?.valid === true &&
          shape?.solidCount === 1 &&
          shape?.volumeMM3 > 0,
        `${context}: ${key} must be a valid positive single solid`,
      );
      report(
        shape?.boundsMM?.size?.length === 3 &&
          shape.boundsMM.size.every((v) => Number.isFinite(v) && v > 0),
        `${context}: ${key} invalid bounding box`,
      );
      report(
        shape?.boundsMM?.size?.every(
          (value, index) => Math.abs(value - expectedSize[index]) < 1e-5,
        ),
        `${context}: ${key} dimensions disagree with the drawing geometry`,
      );
    }
    if (model.shape && model.roundTrip) {
      report(
        Math.abs(model.shape.volumeMM3 - model.roundTrip.volumeMM3) < 1e-5,
        `${context}: STEP round-trip volume mismatch`,
      );
      report(
        model.shape.boundsMM.size.every(
          (v, i) => Math.abs(v - model.roundTrip.boundsMM.size[i]) < 1e-5,
        ),
        `${context}: STEP round-trip bounds mismatch`,
      );
    }
  }
  for (const name of await readdir(directory))
    if (name.endsWith(".step"))
      report(files.has(name), `CAD: orphaned STEP file ${name}`);
  return expected.length;
}
