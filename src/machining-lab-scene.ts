export type LabOperation = "turning" | "milling" | "drilling";
export type LatheExample = "clearance" | "collision";
export const COLLISION_EXAMPLE_PROGRESS = 0.24;
export const COLLISION_EXAMPLE_ANGLE = Math.PI / 2;
type Triple = [number, number, number];
interface BoxPart {
  size: Triple;
  position: Triple;
}
interface ChuckPart {
  x: number;
  length: number;
  radius: number;
  boreRadius: number;
}
export type ToolpostPart =
  | { name: string; shape: "box"; size: Triple; position: Triple }
  | {
      name: string;
      shape: "cylinder";
      radius: number;
      length: number;
      axis: "x" | "y" | "z";
      position: Triple;
    }
  | { name: string; shape: "sphere"; radius: number; position: Triple };

/** A schematic four-way toolpost. Its upper and lower plates capture the shank;
 * separate square-head bolts press onto it. The rear locking post stays clear
 * of the shank, and its handle points away from the chuck.
 */
const fourWayToolpost: ToolpostPart[] = [
  {
    name: "toolpost-lower-plate",
    shape: "box",
    size: [24, 7.4, 30],
    position: [12, -14.3, 39],
  },
  {
    name: "toolpost-upper-plate",
    shape: "box",
    size: [24, 7.6, 30],
    position: [12, 1.2, 39],
  },
  {
    name: "toolpost-rear-pillar",
    shape: "cylinder",
    radius: 4,
    length: 8,
    axis: "y",
    position: [12, -6.6, 47],
  },
  {
    name: "toolpost-locking-stud",
    shape: "cylinder",
    radius: 1.7,
    length: 39,
    axis: "y",
    position: [12, 1.5, 47],
  },
  {
    name: "toolpost-lock-body",
    shape: "cylinder",
    radius: 4,
    length: 12,
    axis: "y",
    position: [12, 11, 47],
  },
  {
    name: "toolpost-lock-handle",
    shape: "cylinder",
    radius: 1.3,
    length: 26,
    axis: "x",
    position: [25, 15, 47],
  },
  {
    name: "toolpost-handle-knob",
    shape: "sphere",
    radius: 2,
    position: [38, 15, 47],
  },
  ...[
    [4, 30],
    [10, 30],
    [20, 32],
    [20, 46],
    [6, 50],
    [18, 50],
    [4, 44],
    [4, 36],
  ].flatMap(([x, z], i): ToolpostPart[] => [
    {
      name: `toolpost-clamp-shaft-${i + 1}`,
      shape: "cylinder",
      radius: 1,
      length: 10.6,
      axis: "y",
      position: [x, 2.7, z],
    },
    {
      name: `toolpost-clamp-head-${i + 1}`,
      shape: "box",
      size: [3, 2.5, 3],
      position: [x, 9.25, z],
    },
  ]),
];
export interface LatheSetup {
  stockLength: number;
  stockDiameter: number;
  cutStart: number;
  cutLength: number;
  clearRadius: number;
  body: ChuckPart;
  face: ChuckPart;
  backplate: ChuckPart;
  jaws: { body: BoxPart; toe: BoxPart };
  holder: BoxPart;
  insert: { points: [number, number][]; thickness: number; position: Triple };
  screw: { position: Triple };
  toolpost: ToolpostPart[];
  jawFrontX: number;
  gripLength: number;
}

/** Nominal scene dimensions, not approved grip lengths or machine settings. */
export const latheSetups: Record<LatheExample, LatheSetup> = {
  clearance: {
    stockLength: 80,
    stockDiameter: 42,
    cutStart: 40,
    cutLength: 40,
    clearRadius: 25,
    body: { x: -50.5, length: 19, radius: 38, boreRadius: 23 },
    face: { x: -40, length: 2, radius: 37, boreRadius: 23 },
    backplate: { x: -60.5, length: 2, radius: 30, boreRadius: 0 },
    jaws: {
      body: { size: [24, 11, 10], position: [-27, 30.5, 0] },
      toe: { size: [25, 5, 8], position: [-27.5, 23.5, 0] },
    },
    holder: { size: [12, 8, 36], position: [7, -6.6, 22] },
    insert: {
      points: [
        [0, 0],
        [11, 3],
        [3, 11],
      ],
      thickness: 2.6,
      position: [0, 0, 0],
    },
    screw: { position: [4, 0.2, 6] },
    toolpost: fourWayToolpost,
    jawFrontX: -15,
    gripLength: 25,
  },
  // Retained only as an explicitly requested, paused how-not-to example.
  collision: {
    stockLength: 60,
    stockDiameter: 42,
    cutStart: 20,
    cutLength: 40,
    clearRadius: 23,
    body: { x: -24.5, length: 19, radius: 31, boreRadius: 23 },
    face: { x: -14, length: 2, radius: 30, boreRadius: 23 },
    backplate: { x: -34.5, length: 2, radius: 30, boreRadius: 0 },
    jaws: {
      body: { size: [10, 10, 10], position: [-12, 25, 0] },
      toe: { size: [3, 5, 8], position: [-6.5, 22.5, 0] },
    },
    holder: { size: [11, 8, 29], position: [-3, -4, 22] },
    insert: {
      points: [
        [0, 0],
        [-8, 8],
        [3, 10],
      ],
      thickness: 2.6,
      position: [0, 1.3, 0],
    },
    screw: { position: [-2, 1.6, 6] },
    toolpost: [],
    jawFrontX: -5,
    gripLength: 25,
  },
};

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));
const tipHeight = 4 / Math.tan((59 * Math.PI) / 180);

/** Coordinates are millimetres; cutX remains in the stock's source frame. */
export function labKinematics(
  operation: LabOperation,
  progress: number,
  example: LatheExample = "clearance",
) {
  if (!Number.isFinite(progress))
    throw new RangeError("Progress must be finite");
  const p = clamp(progress);
  if (operation === "turning") {
    const setup = latheSetups[example];
    const pass = Math.min(2, Math.floor(p * 3));
    const phase = p === 1 ? 1 : p * 3 - pass;
    const before = setup.stockDiameter / 2 - pass,
      after = before - 1;
    const cut = clamp((phase - 0.08) / 0.74);
    const start = setup.stockLength + 0.5;
    const travel = start - setup.cutStart;
    const sourceX =
      phase < 0.9
        ? start - travel * cut
        : setup.cutStart + travel * ((phase - 0.9) / 0.1);
    const safeRadius = example === "clearance" ? setup.clearRadius : before + 2;
    const retractRadius =
      example === "clearance" ? setup.clearRadius : after + 3;
    const radius =
      phase < 0.08
        ? safeRadius + (after - safeRadius) * (phase / 0.08)
        : phase < 0.82
          ? after
          : phase < 0.9
            ? after + (retractRadius - after) * ((phase - 0.82) / 0.08)
            : safeRadius;
    return {
      x: sourceX - setup.stockLength / 2,
      y: 0,
      z: radius,
      pass,
      phase,
      cutX: Math.min(setup.stockLength, start - travel * cut),
      engaged: phase >= 0.08 && phase <= 0.82 && sourceX <= setup.stockLength,
    };
  }
  if (operation === "milling") {
    const x = -42 + 84 * p;
    return {
      x,
      y: 5,
      z: 0,
      pass: 0,
      phase: p,
      cutX: x,
      engaged: x > -36 && x < 36,
    };
  }
  const depth = clamp((p - 0.08) / 0.82) * 17;
  const y =
    p < 0.08
      ? 10 - 4 * (p / 0.08)
      : p <= 0.9
        ? 6 - depth
        : -11 + 23 * ((p - 0.9) / 0.1);
  return {
    x: 0,
    y,
    z: 0,
    pass: 0,
    phase: p,
    cutX: depth,
    engaged: p > 0.08 && p < 0.9 && y + tipHeight > -6,
  };
}

interface SweptPart {
  name: string;
  minX: number;
  maxX: number;
  minR: number;
  maxR: number;
}
interface Bounds {
  min: Triple;
  max: Triple;
}
const nearest = (lo: number, hi: number) =>
  lo <= 0 && hi >= 0 ? 0 : Math.min(Math.abs(lo), Math.abs(hi));
const radialBounds = (
  minY: number,
  maxY: number,
  minZ: number,
  maxZ: number,
) => ({
  min: Math.hypot(nearest(minY, maxY), nearest(minZ, maxZ)),
  max: Math.hypot(
    Math.max(Math.abs(minY), Math.abs(maxY)),
    Math.max(Math.abs(minZ), Math.abs(maxZ)),
  ),
});
const boxBounds = (part: BoxPart, translation: Triple = [0, 0, 0]): Bounds => ({
  min: part.position.map(
    (value, i) => value - part.size[i] / 2 + translation[i],
  ) as Triple,
  max: part.position.map(
    (value, i) => value + part.size[i] / 2 + translation[i],
  ) as Triple,
});

/** Conservative bounds cover every mesh of the moving toolpost assembly. */
export function latheToolpostBounds(
  example: LatheExample = "clearance",
  translation: Triple = [0, 0, 0],
) {
  return latheSetups[example].toolpost.map((part) => {
    let size: Triple;
    if (part.shape === "box") size = part.size;
    else {
      size = [part.radius * 2, part.radius * 2, part.radius * 2];
      if (part.shape === "cylinder")
        size[{ x: 0, y: 1, z: 2 }[part.axis]] = part.length;
    }
    return {
      name: part.name,
      bounds: boxBounds({ size, position: part.position }, translation),
    };
  });
}

/** A full rotation sweeps each rectangular jaw into an exact annular envelope. */
export function latheFixtureEnvelopes(
  example: LatheExample = "clearance",
): SweptPart[] {
  const setup = latheSetups[example];
  const cylinders = (["body", "face", "backplate"] as const).map((name) => ({
    name: `chuck-${name}`,
    minX: setup[name].x - setup[name].length / 2,
    maxX: setup[name].x + setup[name].length / 2,
    minR: setup[name].boreRadius,
    maxR: setup[name].radius,
  }));
  const jaws = (["body", "toe"] as const).map((name) => {
    const bounds = boxBounds(setup.jaws[name]);
    const radii = radialBounds(
      bounds.min[1],
      bounds.max[1],
      bounds.min[2],
      bounds.max[2],
    );
    return {
      name: `jaw-${name}`,
      minX: bounds.min[0],
      maxX: bounds.max[0],
      minR: radii.min,
      maxR: radii.max,
    };
  });
  return [...cylinders, ...jaws];
}

function clipX(
  points: [number, number][],
  limit: number,
  keepGreater: boolean,
): [number, number][] {
  const result: [number, number][] = [];
  for (let i = 0; i < points.length; i++) {
    const a = points[i],
      b = points[(i + 1) % points.length];
    const aInside = keepGreater ? a[0] >= limit : a[0] <= limit;
    const bInside = keepGreater ? b[0] >= limit : b[0] <= limit;
    if (aInside) result.push(a);
    if (aInside !== bInside) {
      const fraction = (limit - a[0]) / (b[0] - a[0]);
      result.push([limit, a[1] + fraction * (b[1] - a[1])]);
    }
  }
  return result;
}

/** Check the complete tool, not just its nose, against continuous 360° sweeps.
 * Holder and insert tests are geometric intersections. The screw uses its
 * conservative bounding boxes, as does every moving toolpost component.
 * This verifies these nominal meshes only.
 */
export function latheClearance(
  progress: number,
  example: LatheExample = "clearance",
) {
  const setup = latheSetups[example],
    state = labKinematics("turning", progress, example);
  const translation: Triple = [state.x, state.y, state.z];
  const holder = boxBounds(setup.holder, translation);
  const screw = boxBounds(
    { size: [2.2, 0.4, 2.2], position: setup.screw.position },
    translation,
  );
  const insert = setup.insert.points.map(([x, z]): [number, number] => [
    x + setup.insert.position[0] + state.x,
    z + setup.insert.position[2] + state.z,
  ]);
  const insertMinY =
    setup.insert.position[1] - setup.insert.thickness + state.y;
  const insertMaxY = setup.insert.position[1] + state.y;
  const toolpostBounds = latheToolpostBounds(example, translation);
  const movingBoxes = [
    { name: "holder", bounds: holder },
    { name: "screw", bounds: screw },
    ...toolpostBounds,
  ];
  const collisions: string[] = [];
  for (const fixture of latheFixtureEnvelopes(example)) {
    for (const { name, bounds: box } of movingBoxes) {
      if (box.min[0] >= fixture.maxX || box.max[0] <= fixture.minX) continue;
      const radial = radialBounds(
        box.min[1],
        box.max[1],
        box.min[2],
        box.max[2],
      );
      if (radial.min < fixture.maxR && radial.max > fixture.minR)
        collisions.push(`${name}:${fixture.name}`);
    }
    const clipped = clipX(
      clipX(insert, fixture.minX, true),
      fixture.maxX,
      false,
    );
    if (
      clipped.length >= 3 &&
      Math.max(...clipped.map((p) => p[0])) -
        Math.min(...clipped.map((p) => p[0])) >
        1e-10
    ) {
      const radial = radialBounds(
        insertMinY,
        insertMaxY,
        Math.min(...clipped.map((p) => p[1])),
        Math.max(...clipped.map((p) => p[1])),
      );
      if (radial.min < fixture.maxR && radial.max > fixture.minR)
        collisions.push(`insert:${fixture.name}`);
    }
  }
  const front = Math.max(
    ...latheFixtureEnvelopes(example).map((part) => part.maxX),
  );
  const minimumToolX = Math.min(
    ...movingBoxes.map((part) => part.bounds.min[0]),
    ...insert.map((point) => point[0]),
  );
  return { minimumAxialGap: minimumToolX - front, collisions };
}
