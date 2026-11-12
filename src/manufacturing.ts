import type {
  CuttingCalculation,
  Lang,
  PartGeometry,
  Project,
  ProjectFeature,
} from "./data/types";

export function geometryValue(
  part: PartGeometry,
  path: string,
): number | undefined {
  if (path === "length" && part.kind === "turned")
    return part.sections.reduce((n, s) => n + s.length, 0);
  let value: unknown = part;
  for (const segment of path.split(".")) {
    if (
      segment === "__proto__" ||
      segment === "constructor" ||
      segment === "prototype"
    )
      return undefined;
    if (
      value === null ||
      typeof value !== "object" ||
      !Object.hasOwn(value, segment)
    )
      return undefined;
    value = (value as Record<string, unknown>)[segment];
  }
  return typeof value === "number" && Number.isFinite(value)
    ? value
    : undefined;
}
export function operationCount(project: Project) {
  return project.setups.reduce((n, s) => n + s.operations.length, 0);
}
export function formatNumber(value: number, lang: Lang, decimals = 4) {
  return new Intl.NumberFormat(lang === "uk" ? "uk-UA" : "en-GB", {
    maximumFractionDigits: decimals,
  }).format(value);
}
export function featureLimits(feature: ProjectFeature, lang: Lang) {
  if (feature.lower === undefined || feature.upper === undefined)
    return feature.spec;
  return `${formatNumber(feature.lower, lang)} … ${formatNumber(feature.upper, lang)} ${feature.unit === "um" ? "µm" : feature.unit === "deg" ? "°" : feature.unit}`;
}
export type MeasurementResult =
  "empty" | "invalid" | "within" | "below" | "above" | "manual";
export function classifyMeasurement(
  value: string,
  feature: ProjectFeature,
): MeasurementResult {
  if (!value.trim()) return "empty";
  if (
    feature.unit === "thread" ||
    feature.unit === "visual" ||
    feature.lower === undefined ||
    feature.upper === undefined
  )
    return "manual";
  const normalized = value.trim().replace(",", ".");
  if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(normalized)) return "invalid";
  const number = Number(normalized);
  if (!Number.isFinite(number)) return "invalid";
  return number < feature.lower
    ? "below"
    : number > feature.upper
      ? "above"
      : "within";
}
export function calculateCutting(example: CuttingCalculation) {
  const theoreticalRpm = (1000 * example.vc) / (Math.PI * example.diameter);
  const rpm = Math.floor(Math.min(theoreticalRpm, example.rpmLimit));
  const feed =
    example.feedPerRev !== undefined
      ? rpm * example.feedPerRev
      : rpm * (example.teeth ?? 0) * (example.feedPerTooth ?? 0);
  return { theoreticalRpm, rpm, feed };
}
export const operationKey = (
  project: Project,
  setupId: string,
  operationId: string,
) => `${project.id}:${project.revision}:op:${setupId}:${operationId}`;
export const measurementKey = (project: Project, featureId: string) =>
  `${project.id}:${project.revision}:measure:${featureId}`;
export const families = {
  turning: { uk: "Токарні деталі", en: "Turned parts" },
  milling: { uk: "Ручне фрезерування", en: "Manual milling" },
  cnc: { uk: "ЧПУ", en: "CNC" },
  hybrid: { uk: "Кілька верстатів", en: "Multiple machines" },
  fixturing: { uk: "Оснащення", en: "Fixtures & tooling" },
  reverse: { uk: "За зразком", en: "Reverse engineering" },
} as const;

export function countTerm(
  n: number,
  lang: Lang,
  kind: "setup" | "operation" | "fixture" | "feature" | "route",
) {
  const uk = {
    setup: ["встановлення", "встановлення", "встановлень"],
    operation: ["операція", "операції", "операцій"],
    fixture: ["пристрій", "пристрої", "пристроїв"],
    feature: ["ознака", "ознаки", "ознак"],
    route: ["маршрут", "маршрути", "маршрутів"],
  };
  if (lang === "en") return `${n} ${kind}${n === 1 ? "" : "s"}`;
  const form = new Intl.PluralRules("uk").select(n);
  return `${n} ${uk[kind][form === "one" ? 0 : form === "few" ? 1 : 2]}`;
}

export type RangeResult = MeasurementResult | "partial" | "reversed";
export function classifyMeasurementRange(
  minimum: string,
  maximum: string,
  feature: ProjectFeature,
): RangeResult {
  if (feature.unit === "thread" || feature.unit === "visual")
    return classifyMeasurement(minimum, feature);
  const a = classifyMeasurement(minimum, feature),
    b = classifyMeasurement(maximum, feature);
  if (a === "empty" && b === "empty") return "empty";
  if (a === "invalid" || b === "invalid") return "invalid";
  if (a === "manual" || b === "manual") return "manual";
  if (a === "empty" || b === "empty") return "partial";
  if (
    Number(minimum.trim().replace(",", ".")) >
    Number(maximum.trim().replace(",", "."))
  )
    return "reversed";
  if (a === "below" || b === "below") return "below";
  if (a === "above" || b === "above") return "above";
  return "within";
}
