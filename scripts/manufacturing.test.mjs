import test from "node:test";
import assert from "node:assert/strict";
import { projects } from "../src/data/projects/index.ts";
import {
  calculateCutting,
  classifyMeasurementRange,
  geometryValue,
  measurementKey,
  operationKey,
} from "../src/manufacturing.ts";
import {
  readPreferences,
  writePreferences,
  STORAGE_KEY,
} from "../src/storage.ts";
test("actual spacer tolerances include both boundary values and accept decimal comma", () => {
  const feature = projects
    .find((p) => p.id === "spacer")
    .features.find((f) => f.id === "F1");
  assert.equal(classifyMeasurementRange("19,98", "20,00", feature), "within");
  assert.equal(classifyMeasurementRange("19.979", "20", feature), "below");
  assert.equal(classifyMeasurementRange("19.99", "20.001", feature), "above");
  assert.equal(classifyMeasurementRange("20.00", "19.99", feature), "reversed");
  assert.equal(classifyMeasurementRange("", "", feature), "empty");
  assert.equal(classifyMeasurementRange("19.99", "", feature), "partial");
  for (const invalid of ["NaN", "Infinity", "0x14", "2e1", "20 mm", "19,9,9"])
    assert.equal(classifyMeasurementRange(invalid, "20", feature), "invalid");
});
test("thread, visual and unspecified bounds never produce automatic numeric acceptance", () => {
  for (const feature of [
    { unit: "thread" },
    { unit: "visual" },
    { unit: "mm" },
  ])
    assert.equal(
      classifyMeasurementRange("GO fits, NO-GO does not", "", feature),
      "manual",
    );
});
test("tool arithmetic caps RPM before computing feed; milling and turning use different feed units", () => {
  const milling = calculateCutting({
    diameter: 10,
    vc: 80,
    rpmLimit: 1000,
    teeth: 3,
    feedPerTooth: 0.03,
  });
  assert.equal(milling.rpm, 1000);
  assert.equal(milling.feed, 90);
  assert.ok(Math.abs(milling.theoreticalRpm - 2546.4790894703256) < 1e-9);
  const turning = calculateCutting({
    diameter: 40,
    vc: 50,
    rpmLimit: 2000,
    feedPerRev: 0.1,
  });
  assert.equal(turning.rpm, 397);
  assert.equal(turning.feed, 39.7);
});
test("parametric dimensions resolve real geometry and reject prototype traversal", () => {
  const spacer = projects.find((p) => p.id === "spacer");
  assert.equal(geometryValue(spacer.part, "length"), 15);
  assert.equal(geometryValue(spacer.part, "sections.0.diameter"), 20);
  assert.equal(geometryValue(spacer.part, "constructor.name"), undefined);
  assert.equal(geometryValue(spacer.part, "sections.99.length"), undefined);
  const revised = { ...spacer, revision: spacer.revision + "-new" };
  assert.notEqual(measurementKey(spacer, "F1"), measurementKey(revised, "F1"));
  assert.notEqual(
    operationKey(spacer, "S10", "O10"),
    operationKey(revised, "S10", "O10"),
  );
});
test("browser records survive a reload and reject damaged or excessive data", () => {
  const data = new Map();
  globalThis.localStorage = {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => data.set(key, value),
  };
  try {
    data.set(STORAGE_KEY, "{broken");
    assert.deepEqual(readPreferences().measurements, {});
    const incoming = JSON.parse(
      '{"language":"en","saved":["spacer","spacer",42],"checks":[],"measurements":{"good":"19,99","bad":42,"tooLong":"x","__proto__":"literal"}}',
    );
    incoming.measurements.tooLong = "x".repeat(1001);
    data.set(STORAGE_KEY, JSON.stringify(incoming));
    const prefs = readPreferences();
    assert.equal(prefs.language, "en");
    assert.deepEqual(prefs.saved, ["spacer"]);
    assert.equal(prefs.measurements.good, "19,99");
    assert.equal(prefs.measurements.bad, undefined);
    assert.equal(prefs.measurements.tooLong, undefined);
    assert.equal(Object.getPrototypeOf(prefs.measurements), Object.prototype);
    assert.equal(prefs.measurements.__proto__, "literal");
    assert.equal(
      writePreferences({
        ...prefs,
        measurements: { ...prefs.measurements, note: "Two readings; 20 °C" },
      }),
      true,
    );
    assert.equal(readPreferences().measurements.note, "Two readings; 20 °C");
    globalThis.localStorage.setItem = () => {
      throw new Error("quota");
    };
    assert.equal(writePreferences(prefs), false);
  } finally {
    delete globalThis.localStorage;
  }
});
