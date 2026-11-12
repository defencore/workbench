const finite = (value) => typeof value === "number" && Number.isFinite(value);
const positive = (value) => finite(value) && value > 0;
const get = (object, path) => {
  if (path === "length" && object.kind === "turned")
    return object.sections.reduce((n, s) => n + s.length, 0);
  return path
    .split(".")
    .reduce(
      (value, key) =>
        value && Object.hasOwn(value, key) ? value[key] : undefined,
      object,
    );
};
export function validateProjects({
  projects,
  lessonIds,
  sourceIds,
  report,
  text,
  texts,
  references,
}) {
  const familyIds = new Set([
    "turning",
    "milling",
    "cnc",
    "hybrid",
    "fixturing",
    "reverse",
  ]);
  const fixtureKinds = new Set([
    "chuck",
    "soft-jaws",
    "split-bush",
    "mandrel",
    "sacrificial-plate",
    "angle-plate",
    "drill-jig",
    "parallels",
    "stop",
    "collet",
    "vise",
    "carrier",
  ]);
  const clampingKinds = new Set([
    "chuck",
    "collet",
    "soft-jaws",
    "mandrel",
    "vise",
    "strap-clamps",
    "fixture-plate",
    "angle-plate",
    "v-block",
  ]);
  let setupCount = 0,
    operationCount = 0,
    madeCount = 0,
    featureCount = 0;
  function array(value, path, min = 1) {
    report(
      Array.isArray(value) && value.length >= min,
      `${path}: expected at least ${min} item(s)`,
    );
    return Array.isArray(value) ? value : [];
  }
  function ids(items, path) {
    const found = new Set();
    array(items, path).forEach((value, i) => {
      report(
        typeof value.id === "string" &&
          /^[A-Za-z][A-Za-z0-9_-]*$/.test(value.id),
        `${path}[${i}]: invalid local ID`,
      );
      report(!found.has(value.id), `${path}: duplicate ID ${value.id}`);
      found.add(value.id);
    });
    return found;
  }
  function geometry(part, path) {
    report(
      part && ["turned", "block"].includes(part.kind),
      `${path}: invalid geometry kind`,
    );
    if (!part) return;
    let length, minDiameter;
    if (part.kind === "turned") {
      const sections = array(part.sections, `${path}.sections`);
      sections.forEach((section, i) => {
        report(
          positive(section.length) && positive(section.diameter),
          `${path}.sections[${i}]: dimensions must be positive`,
        );
      });
      length = sections.reduce((n, s) => n + s.length, 0);
      minDiameter = Math.min(...sections.map((s) => s.diameter));
      if (part.bore) {
        report(
          positive(part.bore.diameter) && part.bore.diameter < minDiameter,
          `${path}.bore: bore must leave material in all traversed sections`,
        );
        report(
          part.bore.depth === undefined ||
            (positive(part.bore.depth) && part.bore.depth <= length),
          `${path}.bore.depth: outside part`,
        );
        if (part.bore.counterbore)
          report(
            positive(part.bore.counterbore.diameter) &&
              part.bore.counterbore.diameter < part.sections[0].diameter &&
              positive(part.bore.counterbore.depth) &&
              part.bore.counterbore.depth <= length,
            `${path}.bore.counterbore: invalid size/depth`,
          );
      }
      if (part.externalThread)
        report(
          finite(part.externalThread.from) &&
            part.externalThread.from >= 0 &&
            positive(part.externalThread.length) &&
            part.externalThread.from + part.externalThread.length <=
              length + 1e-8 &&
            positive(part.externalThread.majorDiameter) &&
            typeof part.externalThread.designation === "string",
          `${path}.externalThread: invalid extent or designation`,
        );
    } else if (part.kind === "block") {
      report(
        positive(part.width) && positive(part.depth) && positive(part.height),
        `${path}: positive block dimensions required`,
      );
      if (part.cornerRadius !== undefined)
        report(
          finite(part.cornerRadius) &&
            part.cornerRadius >= 0 &&
            part.cornerRadius <= Math.min(part.width, part.depth) / 2,
          `${path}.cornerRadius: invalid radius`,
        );
      for (const [i, pocket] of (part.pockets ?? []).entries()) {
        report(
          finite(pocket.x) &&
            pocket.x >= -1e-7 &&
            finite(pocket.y) &&
            pocket.y >= -1e-7 &&
            positive(pocket.width) &&
            positive(pocket.depth) &&
            pocket.x + pocket.width <= part.width + 1e-7 &&
            pocket.y + pocket.depth <= part.depth + 1e-7,
          `${path}.pockets[${i}]: footprint outside block`,
        );
        report(
          positive(pocket.cutDepth) &&
            pocket.cutDepth <= part.height &&
            finite(pocket.cornerRadius) &&
            pocket.cornerRadius >= 0 &&
            pocket.cornerRadius <= Math.min(pocket.width, pocket.depth) / 2,
          `${path}.pockets[${i}]: invalid depth/radius`,
        );
      }
      for (const [i, slot] of (part.slots ?? []).entries()) {
        const halfX = (slot.axis === "x" ? slot.length : slot.width) / 2,
          halfY = (slot.axis === "x" ? slot.width : slot.length) / 2;
        report(
          ["x", "y"].includes(slot.axis) &&
            positive(slot.length) &&
            positive(slot.width) &&
            slot.length >= slot.width &&
            positive(slot.cutDepth) &&
            slot.cutDepth <= part.height,
          `${path}.slots[${i}]: invalid slot size/depth/axis`,
        );
        report(
          finite(slot.x) &&
            finite(slot.y) &&
            slot.x - halfX >= -1e-7 &&
            slot.y - halfY >= -1e-7 &&
            slot.x + halfX <= part.width + 1e-7 &&
            slot.y + halfY <= part.depth + 1e-7,
          `${path}.slots[${i}]: footprint outside block`,
        );
      }
    }
    for (const [i, hole] of (part.holes ?? []).entries()) {
      const diameter = hole.counterbore?.diameter ?? hole.diameter,
        depth = part.kind === "turned" ? length : part.height;
      report(
        positive(hole.diameter) && finite(hole.x) && finite(hole.y),
        `${path}.holes[${i}]: invalid hole geometry`,
      );
      report(
        hole.depth === undefined ||
          (positive(hole.depth) && hole.depth <= depth),
        `${path}.holes[${i}]: invalid blind depth`,
      );
      if (part.kind === "block")
        report(
          hole.x - diameter / 2 >= -1e-7 &&
            hole.y - diameter / 2 >= -1e-7 &&
            hole.x + diameter / 2 <= part.width + 1e-7 &&
            hole.y + diameter / 2 <= part.depth + 1e-7,
          `${path}.holes[${i}]: hole or counterbore breaks an unspecified edge`,
        );
      else if (part.kind === "turned")
        report(
          Math.hypot(hole.x, hole.y) + diameter / 2 <=
            part.sections[0].diameter / 2 + 1e-7,
          `${path}.holes[${i}]: hole breaks the face edge`,
        );
      if (hole.counterbore)
        report(
          positive(hole.counterbore.diameter) &&
            hole.counterbore.diameter >= hole.diameter &&
            positive(hole.counterbore.depth) &&
            hole.counterbore.depth <= depth &&
            (hole.depth === undefined || hole.counterbore.depth <= hole.depth),
          `${path}.holes[${i}].counterbore: invalid diameter/depth`,
        );
    }
  }
  projects.forEach((project, index) => {
    const path = `projects[${index}] (${project.id})`;
    report(
      !("steps" in project) && !("model" in project),
      `${path}: obsolete six-step project schema must not remain`,
    );
    report(
      familyIds.has(project.family),
      `${path}.family: unknown manufacturing family`,
    );
    report(
      ["beginner", "intermediate", "advanced"].includes(project.level),
      `${path}.level: unknown difficulty`,
    );
    report(
      typeof project.revision === "string" && project.revision.length > 0,
      `${path}.revision: missing revision`,
    );
    if (project.quantity !== undefined)
      report(
        Number.isInteger(project.quantity) && project.quantity > 0,
        `${path}.quantity: invalid quantity`,
      );
    for (const field of ["title", "summary", "material", "duration", "purpose"])
      text(project[field], `${path}.${field}`);
    for (const field of ["equipment", "hazards", "qualityPlan", "pitfalls"])
      texts(
        project[field],
        `${path}.${field}`,
        field === "qualityPlan" ? 3 : 2,
      );
    references(project.lessons, `${path}.lessons`, lessonIds, 2);
    references(project.sources, `${path}.sources`, sourceIds, 2);
    report(
      project.stock &&
        typeof project.stock.size === "string" &&
        project.stock.size.length > 0,
      `${path}.stock: missing stock size`,
    );
    if (project.stock) {
      text(project.stock.form, `${path}.stock.form`);
      texts(project.stock.preparation, `${path}.stock.preparation`, 2);
    }
    geometry(project.part, `${path}.part`);
    ids(project.datums, `${path}.datums`);
    array(project.datums, `${path}.datums`, 2).forEach((d) =>
      text(d.description, `${path}.datum ${d.id}`),
    );
    const features = array(project.features, `${path}.features`, 6),
      featureIds = ids(features, `${path}.features`),
      coverage = new Set();
    featureCount += features.length;
    let bindings = 0;
    features.forEach((feature) => {
      const p = `${path}.feature ${feature.id}`;
      text(feature.name, `${p}.name`);
      text(feature.method, `${p}.method`);
      text(feature.instrument, `${p}.instrument`);
      report(
        typeof feature.spec === "string" &&
          feature.spec.length > 0 &&
          typeof feature.datum === "string" &&
          feature.datum.length > 0,
        `${p}: specification and datum required`,
      );
      report(
        ["mm", "deg", "um", "thread", "visual"].includes(feature.unit),
        `${p}.unit: unknown unit`,
      );
      if (["mm", "deg", "um"].includes(feature.unit))
        report(
          finite(feature.nominal) &&
            finite(feature.lower) &&
            finite(feature.upper) &&
            feature.lower <= feature.upper,
          `${p}: numerical requirements need finite nominal and ordered absolute limits`,
        );
      if (feature.geometryRef) {
        bindings++;
        const nominal = get(project.part, feature.geometryRef);
        report(
          finite(nominal) &&
            finite(feature.nominal) &&
            Math.abs(nominal - feature.nominal) < 1e-7,
          `${p}: basic size disagrees with geometry path ${feature.geometryRef}`,
        );
      }
    });
    const minimumBindings =
      project.part?.kind === "turned" &&
      project.part.sections.length === 1 &&
      !project.part.bore &&
      !project.part.holes?.length
        ? 2
        : 3;
    report(
      bindings >= minimumBindings,
      `${path}: bind the main dimension requirements to drawing geometry (minimum ${minimumBindings})`,
    );
    const fixtures = array(project.fixtures, `${path}.fixtures`),
      fixtureIds = ids(fixtures, `${path}.fixtures`),
      usedFixtures = new Set();
    fixtures.forEach((fixture) => {
      const p = `${path}.fixture ${fixture.id}`;
      report(
        fixtureKinds.has(fixture.kind) && typeof fixture.made === "boolean",
        `${p}: invalid fixture category`,
      );
      for (const field of ["name", "purpose", "stock", "dimensions"])
        text(fixture[field], `${p}.${field}`);
      texts(fixture.hardware, `${p}.hardware`, 1);
      texts(fixture.preparation, `${p}.preparation`, 2);
      texts(fixture.acceptance, `${p}.acceptance`, 1);
      texts(fixture.manufacture, `${p}.manufacture`, fixture.made ? 4 : 0);
      if (fixture.made) madeCount++;
      if (fixture.geometry) geometry(fixture.geometry, `${p}.geometry`);
    });
    const setups = array(project.setups, `${path}.setups`, 2);
    ids(setups, `${path}.setups`);
    setupCount += setups.length;
    setups.forEach((setup) => {
      const p = `${path}.setup ${setup.id}`;
      for (const field of [
        "title",
        "machine",
        "purpose",
        "orientation",
        "datums",
        "workholding",
        "release",
        "transfer",
      ])
        text(setup[field], `${p}.${field}`);
      texts(
        setup.preparation,
        `${p}.preparation`,
        setup.diagram?.view === "inspection" ? 1 : 2,
      );
      texts(setup.inspection, `${p}.inspection`, 1);
      references(setup.fixtureIds, `${p}.fixtureIds`, fixtureIds, 1);
      setup.fixtureIds?.forEach((id) => usedFixtures.add(id));
      report(
        setup.diagram &&
          ["turning", "milling", "drilling", "inspection"].includes(
            setup.diagram.view,
          ) &&
          clampingKinds.has(setup.diagram.clamping) &&
          typeof setup.diagram.flip === "boolean",
        `${p}.diagram: invalid setup schematic`,
      );
      if (setup.diagram) {
        text(setup.diagram.highlight, `${p}.diagram.highlight`);
        for (const field of ["gripLength", "supportHeight"])
          if (setup.diagram[field] !== undefined)
            report(
              positive(setup.diagram[field]),
              `${p}.diagram.${field}: positive dimension required`,
            );
      }
      const operations = array(setup.operations, `${p}.operations`, 3);
      ids(operations, `${p}.operations`);
      operationCount += operations.length;
      operations.forEach((operation) => {
        const o = `${p}.operation ${operation.id}`;
        for (const field of [
          "title",
          "instruction",
          "tool",
          "allowance",
          "inspection",
          "stop",
        ])
          text(operation[field], `${o}.${field}`);
        references(operation.featureIds, `${o}.featureIds`, featureIds, 1);
        operation.featureIds?.forEach((id) => coverage.add(id));
      });
    });
    for (const id of featureIds)
      report(
        coverage.has(id),
        `${path}: feature ${id} is not addressed by an operation`,
      );
    for (const id of fixtureIds)
      report(
        usedFixtures.has(id),
        `${path}: fixture ${id} is never used in a setup`,
      );
    for (const example of array(project.cutting, `${path}.cutting`, 0)) {
      for (const field of ["tool", "assumptions", "confirmation"])
        text(example[field], `${path}.cutting.${field}`);
      report(
        positive(example.diameter) &&
          positive(example.vc) &&
          positive(example.rpmLimit),
        `${path}.cutting: invalid diameter, speed or cap`,
      );
      const turning = positive(example.feedPerRev),
        milling =
          Number.isInteger(example.teeth) &&
          example.teeth > 0 &&
          positive(example.feedPerTooth);
      report(
        turning !== milling,
        `${path}.cutting: choose exactly one feed model`,
      );
      report(
        Math.floor(
          Math.min(
            (1000 * example.vc) / (Math.PI * example.diameter),
            example.rpmLimit,
          ),
        ) > 0,
        `${path}.cutting: calculated rpm rounds to zero`,
      );
    }
  });
  return {
    setups: setupCount,
    operations: operationCount,
    fixturesMade: madeCount,
    features: featureCount,
  };
}
