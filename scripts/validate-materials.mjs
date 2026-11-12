export function validateMaterials({
  guides,
  lessonIds,
  projectIds,
  sourceIds,
  report,
  text,
  texts,
  references,
}) {
  const ids = new Set([
    "aluminium",
    "carbon-steel",
    "stainless",
    "brass",
    "pom",
    "pa6",
    "cast-iron",
    "copper",
    "titanium",
  ]);
  const seen = new Set();
  let exercises = 0;
  for (const guide of guides) {
    const path = `materials.${guide.id}`;
    report(
      ids.has(guide.id) && !seen.has(guide.id),
      `${path}: unknown/duplicate material`,
    );
    seen.add(guide.id);
    report(
      !lessonIds.has(`material-${guide.id}`),
      `${path}: bookmark ID collides with lesson`,
    );
    for (const field of ["name", "grades", "summary"])
      text(guide[field], `${path}.${field}`);
    report(
      ["beginner", "intermediate", "advanced"].includes(guide.level),
      `${path}: invalid level`,
    );
    for (const field of ["behaviour", "preparation", "finishing", "hazards"])
      texts(guide[field], `${path}.${field}`);
    references(guide.sources, `${path}.sources`, sourceIds, 1);
    const methods = new Set();
    for (const method of guide.methods) {
      report(
        ["turning", "milling", "drilling", "finishing"].includes(
          method.operation,
        ) && !methods.has(method.operation),
        `${path}: invalid/duplicate method`,
      );
      methods.add(method.operation);
      for (const field of [
        "tool",
        "setup",
        "technique",
        "chips",
        "expected",
        "avoid",
      ])
        text(method[field], `${path}.${method.operation}.${field}`);
    }
    report(methods.size === 4, `${path}: must cover all four methods`);
    report(
      guide.defects.length >= 4,
      `${path}: needs at least four diagnostic cases`,
    );
    for (const [i, defect] of guide.defects.entries())
      for (const field of ["symptom", "cause", "checks", "response"])
        text(defect[field], `${path}.defects[${i}].${field}`);
    report(
      guide.exercises.length >= (guide.id === "titanium" ? 1 : 2),
      `${path}: missing practical exercises`,
    );
    for (const [i, exercise] of guide.exercises.entries()) {
      exercises++;
      for (const field of ["title", "goal", "stock", "result"])
        text(exercise[field], `${path}.exercises[${i}].${field}`);
      for (const field of ["tools", "measure"])
        texts(exercise[field], `${path}.exercises[${i}].${field}`);
      report(
        exercise.steps.length >= 4,
        `${path}.exercises[${i}]: incomplete sequence`,
      );
      for (const [n, step] of exercise.steps.entries())
        for (const field of ["title", "body", "check"])
          text(step[field], `${path}.exercises[${i}].steps[${n}].${field}`);
      references(
        exercise.projectIds,
        `${path}.exercises[${i}].projectIds`,
        projectIds,
      );
    }
    report(
      /^#[a-f\d]{6}$/i.test(guide.appearance.color),
      `${path}: invalid color`,
    );
    for (const key of ["metalness", "roughness"])
      report(
        Number.isFinite(guide.appearance[key]) &&
          guide.appearance[key] >= 0 &&
          guide.appearance[key] <= 1,
        `${path}: invalid ${key}`,
      );
    report(
      ["ribbon", "segmented", "short", "dust"].includes(guide.appearance.chip),
      `${path}: invalid chip form`,
    );
  }
  report(seen.size === ids.size, "materials: all nine guides must be present");
  return exercises;
}
