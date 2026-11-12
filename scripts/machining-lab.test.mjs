import test from "node:test";
import assert from "node:assert/strict";
import {
  COLLISION_EXAMPLE_PROGRESS,
  COLLISION_EXAMPLE_ANGLE,
  labKinematics,
  latheClearance,
  latheFixtureEnvelopes,
  latheToolpostBounds,
  latheSetups,
} from "../src/machining-lab-scene.ts";

const bounds = (part, translation = [0, 0, 0]) => ({
  min: part.position.map((v, i) => v - part.size[i] / 2 + translation[i]),
  max: part.position.map((v, i) => v + part.size[i] / 2 + translation[i]),
});
const close = (actual, expected, tolerance = 1e-9) =>
  assert.ok(
    Math.abs(actual - expected) < tolerance,
    `${actual} differs from ${expected}`,
  );
const phaseState = (pass, phase) =>
  labKinematics("turning", (pass + phase) / 3);

test("the complete corrected tool clears the continuous 360-degree chuck/jaw sweeps along every motion phase", () => {
  let minimum = Infinity;
  for (let i = 0; i <= 6000; i++) {
    const progress = i / 6000;
    const result = latheClearance(progress, "clearance");
    assert.deepEqual(
      result.collisions,
      [],
      `collision at progress ${progress}`,
    );
    minimum = Math.min(minimum, result.minimumAxialGap);
  }
  // This is the separation of these authored meshes, not an OEM safety limit.
  close(minimum, 15);
});

test("an independent 90-degree jaw pose reproduces the reported holder impact even when the nose is clear", () => {
  const progress = COLLISION_EXAMPLE_PROGRESS;
  const setup = latheSetups.collision;
  const state = labKinematics("turning", progress, "collision");
  assert.ok(state.x > setup.jawFrontX, "the nose itself is ahead of the jaws");
  const holder = bounds(setup.holder, [state.x, state.y, state.z]);
  const jaw = bounds(setup.jaws.body);
  close(COLLISION_EXAMPLE_ANGLE, Math.PI / 2);
  // Rotating the Y-positive jaw by +90 degrees about X gives Y=-Z, Z=Y.
  const rotatedJaw = {
    min: [jaw.min[0], -jaw.max[2], jaw.min[1]],
    max: [jaw.max[0], -jaw.min[2], jaw.max[1]],
  };
  const overlaps = holder.min.map(
    (value, axis) =>
      Math.min(holder.max[axis], rotatedJaw.max[axis]) -
      Math.max(value, rotatedJaw.min[axis]),
  );
  assert.ok(
    overlaps.every((value) => value > 0),
    `expected solid intersection: ${overlaps}`,
  );
  assert.ok(overlaps.reduce((volume, value) => volume * value, 1) > 70);
  const report = latheClearance(progress, "collision");
  assert.ok(report.collisions.includes("holder:jaw-body"));
  assert.ok(report.minimumAxialGap < 0);
});

test("the unsafe setup is not mislabeled as an all-position collision or accepted from the tip alone", () => {
  assert.deepEqual(latheClearance(0, "collision").collisions, []);
  assert.ok(
    latheClearance(0.26, "collision").collisions.includes("holder:jaw-body"),
  );
  assert.deepEqual(latheClearance(1, "collision").collisions, []);
  const wrong = latheSetups.collision;
  const tipAtShoulder = wrong.cutStart - wrong.stockLength / 2;
  assert.ok(tipAtShoulder < wrong.jawFrontX);
  assert.ok(wrong.insert.points.some(([x]) => x < 0));
});

test("all three passes retract and return above the original stock using the same clearance radius", () => {
  const setup = latheSetups.clearance;
  for (let pass = 0; pass < 3; pass++) {
    for (const phase of [0, 0.9, 0.95, 0.999999]) {
      const state = phaseState(pass, phase);
      close(state.z, 25);
      assert.ok(state.z > setup.stockDiameter / 2);
    }
    const contact = phaseState(pass, 0.5);
    close(contact.z, 20 - pass);
    assert.equal(contact.engaged, true);
    const approach = phaseState(pass, 0.04);
    assert.ok(approach.x > setup.stockLength / 2);
  }
  const finished = labKinematics("turning", 1);
  close(finished.x, 40.5);
  close(finished.z, 25);
  close(finished.cutX, 40);
});

test("tool approach, feed, retraction, return and pass transitions are position-continuous", () => {
  const boundaries = [0.08, 0.82, 0.9];
  for (let pass = 0; pass < 3; pass++) {
    for (const phase of boundaries) {
      const p = (pass + phase) / 3;
      const a = labKinematics("turning", p - 1e-10);
      const b = labKinematics("turning", p + 1e-10);
      for (const coordinate of ["x", "y", "z"])
        close(a[coordinate], b[coordinate], 1e-5);
    }
  }
  for (const boundary of [1 / 3, 2 / 3]) {
    const a = labKinematics("turning", boundary - 1e-10);
    const b = labKinematics("turning", boundary + 1e-10);
    for (const coordinate of ["x", "y", "z"])
      close(a[coordinate], b[coordinate], 1e-5);
  }
});

test("stock, gripping contact and the uncut land use the same actual scene coordinates", () => {
  const setup = latheSetups.clearance;
  const toe = bounds(setup.jaws.toe);
  const stockStart = -setup.stockLength / 2;
  const shoulder = setup.cutStart - setup.stockLength / 2;
  close(toe.min[0], stockStart);
  close(toe.max[0], setup.jawFrontX);
  close(toe.max[0] - toe.min[0], setup.gripLength);
  close(toe.min[1], setup.stockDiameter / 2);
  close(shoulder - setup.jawFrontX, 15);
  close(setup.stockLength - setup.cutStart, setup.cutLength);
  assert.ok(setup.body.boreRadius > setup.stockDiameter / 2);
  assert.ok(setup.face.boreRadius > setup.stockDiameter / 2);
  assert.ok(
    latheFixtureEnvelopes()
      .filter((p) => p.name.startsWith("jaw-"))
      .every((p) => p.maxR < setup.body.radius),
  );
});

test("the insert rake face is on centre height and the holder supports its lower seat", () => {
  const setup = latheSetups.clearance;
  close(setup.insert.position[1], 0);
  close(
    setup.holder.position[1] + setup.holder.size[1] / 2,
    -setup.insert.thickness,
  );
  close(setup.screw.position[1] - 0.2, 0);
  const seat = bounds(setup.holder);
  assert.ok(
    setup.screw.position[0] > seat.min[0] &&
      setup.screw.position[0] < seat.max[0],
  );
  assert.ok(
    setup.screw.position[2] > seat.min[2] &&
      setup.screw.position[2] < seat.max[2],
  );
  assert.ok(setup.insert.points.every(([x, z]) => x >= 0 && z >= 0));
  assert.deepEqual(setup.insert.points[0], [0, 0]);
  // The complete forward-facing insert remains on the already-cut side of the shoulder.
  for (let pass = 0; pass < 3; pass++) {
    const state = phaseState(pass, 0.82);
    close(state.x, 0);
    assert.ok(setup.insert.points.every(([x]) => state.x + x >= -1e-9));
    const holder = bounds(setup.holder, [state.x, state.y, state.z]);
    assert.ok(holder.min[2] > setup.stockDiameter / 2);
  }
});

test("the rear mounting plate connects the shaft and chuck while clearing the fixed headstock and stock", () => {
  for (const setup of Object.values(latheSetups)) {
    const rear = setup.body.x - setup.body.length / 2;
    const plateMin = setup.backplate.x - setup.backplate.length / 2;
    const plateMax = setup.backplate.x + setup.backplate.length / 2;
    assert.ok(plateMin > rear - 2);
    assert.ok(plateMax > rear && plateMin < rear);
    assert.ok(setup.backplate.radius > setup.body.boreRadius);
    assert.equal(setup.backplate.boreRadius, 0);
    assert.ok(-setup.stockLength / 2 > plateMax);
  }
});

test("the four-way toolpost seats the shank between its plates and has supported, separate clamping bolts", () => {
  const setup = latheSetups.clearance;
  const find = (name) => setup.toolpost.find((part) => part.name === name);
  const lower = bounds(find("toolpost-lower-plate"));
  const upper = bounds(find("toolpost-upper-plate"));
  const shank = bounds(setup.holder);
  close(lower.max[1], shank.min[1]);
  close(upper.min[1], shank.max[1]);
  assert.ok(
    Math.min(lower.max[2], shank.max[2]) -
      Math.max(lower.min[2], shank.min[2]) >=
      16,
  );
  const pillar = find("toolpost-rear-pillar");
  close(pillar.position[1] - pillar.length / 2, lower.max[1]);
  close(pillar.position[1] + pillar.length / 2, upper.min[1]);
  assert.ok(pillar.position[2] - pillar.radius > shank.max[2]);
  const lock = find("toolpost-lock-body");
  close(lock.position[1] - lock.length / 2, upper.max[1]);
  const handle = find("toolpost-lock-handle");
  const clampHeadTop = Math.max(
    ...setup.toolpost
      .filter((part) => part.name.startsWith("toolpost-clamp-head-"))
      .map((part) => part.position[1] + part.size[1] / 2),
  );
  assert.ok(
    handle.position[1] - handle.radius > clampHeadTop,
    "the locking handle clears the square bolt heads",
  );
  assert.ok(
    handle.position[1] - handle.radius > lock.position[1] - lock.length / 2,
  );
  assert.ok(
    handle.position[1] + handle.radius < lock.position[1] + lock.length / 2,
  );
  let loadedBolts = 0;
  for (const shaft of setup.toolpost.filter((part) =>
    part.name.startsWith("toolpost-clamp-shaft-"),
  )) {
    const index = shaft.name.split("-").at(-1);
    const head = bounds(find(`toolpost-clamp-head-${index}`));
    close(shaft.position[1] + shaft.length / 2, head.min[1]);
    assert.ok(head.min[0] > upper.min[0] && head.max[0] < upper.max[0]);
    assert.ok(head.min[2] > upper.min[2] && head.max[2] < upper.max[2]);
    if (
      shaft.position[0] > shank.min[0] &&
      shaft.position[0] < shank.max[0] &&
      shaft.position[2] > shank.min[2] &&
      shaft.position[2] < shank.max[2]
    ) {
      close(shaft.position[1] - shaft.length / 2, shank.max[1]);
      loadedBolts++;
    }
  }
  assert.ok(
    loadedBolts >= 2,
    "the tool shank is held by separate square-head bolts",
  );
  assert.ok(
    setup.screw.position[2] < lower.min[2],
    "the insert screw is a different fastener ahead of the toolpost",
  );
  assert.equal(
    latheSetups.collision.toolpost.length,
    0,
    "the paused negative fragment retains its original isolated tool",
  );
});

test("every added moving toolpost mesh enters the same 360-degree clearance inventory", () => {
  const setup = latheSetups.clearance;
  const inventory = latheToolpostBounds();
  assert.equal(inventory.length, setup.toolpost.length);
  assert.equal(
    new Set(inventory.map((part) => part.name)).size,
    setup.toolpost.length,
  );
  assert.deepEqual(latheToolpostBounds("collision"), []);
  for (const progress of [0, 0.12, 0.273333333333, 0.5, 0.61, 0.94, 1]) {
    const state = labKinematics("turning", progress);
    for (const part of latheToolpostBounds("clearance", [
      state.x,
      state.y,
      state.z,
    ])) {
      assert.ok(
        part.bounds.min[0] >= -1e-9,
        `${part.name} remains on the machined side`,
      );
      assert.ok(
        part.bounds.min[2] > setup.stockDiameter / 2,
        `${part.name} clears the raw stock radius`,
      );
    }
    assert.deepEqual(latheClearance(progress).collisions, []);
  }
  // Move a new assembly part into the jaw sweep to prove it cannot bypass checking.
  const part = setup.toolpost.find(
    (part) => part.name === "toolpost-upper-plate",
  );
  const original = part.position;
  const state = labKinematics("turning", 0);
  try {
    part.position = [-27 - state.x, 0, 30 - state.z];
    assert.ok(
      latheClearance(0).collisions.some((name) =>
        name.startsWith(`${part.name}:`),
      ),
    );
  } finally {
    part.position = original;
  }
});

test("milling/drilling trajectories retain their dimensions and nonfinite input fails visibly", () => {
  close(labKinematics("milling", 0).x, -42);
  close(labKinematics("milling", 1).x, 42);
  close(labKinematics("milling", 0.5).y, 5);
  close(labKinematics("drilling", 0).y, 10);
  close(labKinematics("drilling", 0.9).y, -11);
  close(labKinematics("drilling", 1).y, 12);
  assert.throws(() => labKinematics("turning", NaN), RangeError);
  assert.throws(() => labKinematics("turning", Infinity), RangeError);
  assert.deepEqual(labKinematics("turning", -1), labKinematics("turning", 0));
  assert.deepEqual(labKinematics("turning", 2), labKinematics("turning", 1));
});
