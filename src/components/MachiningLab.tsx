import { useEffect, useId, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import polygonClipping from "polygon-clipping";
import type { Pair, Polygon } from "polygon-clipping";
import {
  ArrowRight,
  CirclePause,
  CirclePlay,
  Focus,
  RotateCcw,
  Scissors,
  Shapes,
} from "lucide-react";
import type { Lang, MaterialGuide, PartGeometry } from "../data/types";
import { createParametricPartGeometry } from "./ModelViewer";
import "./MachiningLab.css";

type Operation = "turning" | "milling" | "drilling";
interface MachiningLabProps {
  lang: Lang;
  material: MaterialGuide;
  initialOperation?: Operation;
}
interface LabActions {
  progress: (value: number) => void;
  play: (value: boolean) => void;
  front: () => void;
  camera: () => void;
  finish: (value: boolean) => void;
  ghost: (value: boolean) => void;
  navigate: (key: string) => void;
}
const operations: Operation[] = ["turning", "milling", "drilling"];
const operationNames = {
  turning: { uk: "Точіння", en: "Turning" },
  milling: { uk: "Фрезерування", en: "Milling" },
  drilling: { uk: "Свердління", en: "Drilling" },
};
const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));
const TIP_HEIGHT = 4 / Math.tan((59 * Math.PI) / 180);

/** All scene coordinates are millimetres; progress is geometric, not a cutting schedule. */
export function labKinematics(operation: Operation, progress: number) {
  const p = clamp(progress);
  if (operation === "turning") {
    const pass = Math.min(2, Math.floor(p * 3));
    const phase = p === 1 ? 1 : p * 3 - pass;
    const before = 21 - pass,
      after = before - 1;
    const cut = clamp((phase - 0.08) / 0.74);
    const sourceX =
      phase < 0.9 ? 60.5 - 40.5 * cut : 20 + 40.5 * ((phase - 0.9) / 0.1);
    const radius =
      phase < 0.08
        ? before + 2 - (before + 2 - after) * (phase / 0.08)
        : phase < 0.82
          ? after
          : phase < 0.9
            ? after + 3 * ((phase - 0.82) / 0.08)
            : before + 2;
    return {
      x: sourceX - 30,
      y: 0,
      z: radius,
      pass,
      phase,
      cutX: Math.min(60, 60.5 - 40.5 * cut),
      engaged: phase >= 0.08 && phase <= 0.82 && sourceX <= 60,
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
    engaged: p > 0.08 && p < 0.9 && y + TIP_HEIGHT > -6,
  };
}

function applySurfaceGroups(
  geometry: THREE.BufferGeometry,
  operation: Operation,
) {
  const p = geometry.getAttribute("position");
  geometry.clearGroups();
  let start = 0,
    material = -1;
  for (let i = 0; i < p.count; i += 3) {
    const x = (p.getX(i) + p.getX(i + 1) + p.getX(i + 2)) / 3;
    const y = (p.getY(i) + p.getY(i + 1) + p.getY(i + 2)) / 3;
    const z = (p.getZ(i) + p.getZ(i + 1) + p.getZ(i + 2)) / 3;
    const maxRadius = Math.max(
      ...[i, i + 1, i + 2].map((j) => Math.hypot(p.getY(j), p.getZ(j))),
    );
    const axialFace =
      Math.max(p.getX(i), p.getX(i + 1), p.getX(i + 2)) -
        Math.min(p.getX(i), p.getX(i + 1), p.getX(i + 2)) <
      1e-5;
    const machined =
      operation === "turning"
        ? x > -10.001 && (maxRadius < 20.999 || (axialFace && x < 29.999))
        : y > 4.999 && y < 6.999 && Math.abs(z) <= 6.001;
    const next = machined ? 1 : 0;
    if (next !== material) {
      if (material >= 0) geometry.addGroup(start, i - start, material);
      material = next;
      start = i;
    }
  }
  if (p.count) geometry.addGroup(start, p.count - start, material);
  return geometry;
}

/** The swept milling envelope and each lathe pass are boolean solid removal. */
export function createLabWorkpieceGeometry(
  operation: Operation,
  progress: number,
  section = true,
) {
  if (operation === "drilling")
    return createDrillingLabGeometry(progress, section);
  const state = labKinematics(operation, progress);
  let part: PartGeometry;
  if (operation === "turning") {
    const sections = [{ length: 20, diameter: 42 }];
    const cutX = clamp(state.cutX, 20, 60);
    if (cutX > 20 + 1e-6)
      sections.push({ length: cutX - 20, diameter: 42 - 2 * state.pass });
    if (cutX < 60 - 1e-6)
      sections.push({ length: 60 - cutX, diameter: 40 - 2 * state.pass });
    part = { kind: "turned", sections };
  } else {
    const start = -42,
      end = state.x;
    part = {
      kind: "block",
      width: 60,
      depth: 40,
      height: 14,
      slots: [
        {
          x: (start + end) / 2 + 30,
          y: 20,
          length: end - start + 12,
          width: 12,
          cutDepth: 2,
          axis: "x",
        },
      ],
    };
  }
  const geometry = createParametricPartGeometry(part);
  const scale = geometry.userData.millimetresPerUnit as number;
  geometry.scale(scale, scale, scale);
  return applySurfaceGroups(geometry, operation);
}

/** A 118° drill leaves a true conical bottom, including partial breakout. */
export function createDrillingLabGeometry(progress: number, section: boolean) {
  const depth = labKinematics("drilling", progress).cutX;
  const tip = 6 - depth;
  const radiusAt = (y: number) =>
    clamp((y - tip) * Math.tan((59 * Math.PI) / 180), 0, 4);
  const vertices: number[] = [],
    groups: { start: number; count: number; materialIndex: number }[] = [];
  const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
  const triangle = (
    a: THREE.Vector3,
    b: THREE.Vector3,
    c: THREE.Vector3,
    normal: THREE.Vector3,
    material = 0,
  ) => {
    const cross = new THREE.Vector3()
      .subVectors(b, a)
      .cross(new THREE.Vector3().subVectors(c, a));
    if (cross.lengthSq() < 1e-14) return;
    if (cross.dot(normal) < 0) [b, c] = [c, b];
    const start = vertices.length / 3;
    vertices.push(...a.toArray(), ...b.toArray(), ...c.toArray());
    const last = groups[groups.length - 1];
    if (last?.materialIndex === material) last.count += 3;
    else groups.push({ start, count: 3, materialIndex: material });
  };
  const quad = (
    a: THREE.Vector3,
    b: THREE.Vector3,
    c: THREE.Vector3,
    d: THREE.Vector3,
    normal: THREE.Vector3,
    material = 0,
  ) => {
    triangle(a, b, c, normal, material);
    triangle(a, c, d, normal, material);
  };
  const zFront = section ? 0 : 20;
  const rectangle: Polygon = [
    [
      [-30, -20],
      [30, -20],
      [30, zFront],
      [-30, zFront],
    ],
  ];
  for (const y of [-6, 6]) {
    const r = radiusAt(y);
    const hole: Polygon = [
      Array.from({ length: 128 }, (_, i): Pair => [
        Math.cos((i * Math.PI) / 64) * r,
        Math.sin((i * Math.PI) / 64) * r,
      ]),
    ];
    const polygons =
      r > 1e-7 ? polygonClipping.difference(rectangle, hole) : [rectangle];
    for (const polygon of polygons) {
      const rings = polygon.map((raw) => {
        const ring = raw.map(([x, z]) => new THREE.Vector2(x, z));
        if (ring.length > 1 && ring[0].equals(ring[ring.length - 1]))
          ring.pop();
        return ring;
      });
      const points = rings.flat();
      for (const [a, b, c] of THREE.ShapeUtils.triangulateShape(
        rings[0],
        rings.slice(1),
      ))
        triangle(
          v(points[a].x, y, points[a].y),
          v(points[b].x, y, points[b].y),
          v(points[c].x, y, points[c].y),
          v(0, Math.sign(y), 0),
        );
    }
  }
  quad(
    v(-30, -6, -20),
    v(30, -6, -20),
    v(30, 6, -20),
    v(-30, 6, -20),
    v(0, 0, -1),
  );
  quad(
    v(-30, -6, -20),
    v(-30, -6, zFront),
    v(-30, 6, zFront),
    v(-30, 6, -20),
    v(-1, 0, 0),
  );
  quad(
    v(30, -6, -20),
    v(30, -6, zFront),
    v(30, 6, zFront),
    v(30, 6, -20),
    v(1, 0, 0),
  );
  if (!section)
    quad(
      v(-30, -6, 20),
      v(30, -6, 20),
      v(30, 6, 20),
      v(-30, 6, 20),
      v(0, 0, 1),
    );
  const boundaries = [
    ...new Set([-6, 6, clamp(tip, -6, 6), clamp(tip + TIP_HEIGHT, -6, 6)]),
  ].sort((a, b) => a - b);
  boundaries.slice(0, -1).forEach((from, j) => {
    const to = boundaries[j + 1],
      r0 = radiusAt(from),
      r1 = radiusAt(to);
    if (section) {
      quad(
        v(-30, from, 0),
        v(-r0, from, 0),
        v(-r1, to, 0),
        v(-30, to, 0),
        v(0, 0, 1),
        2,
      );
      quad(
        v(r0, from, 0),
        v(30, from, 0),
        v(30, to, 0),
        v(r1, to, 0),
        v(0, 0, 1),
        2,
      );
    }
    if (r0 < 1e-7 && r1 < 1e-7) return;
    const steps = section ? 64 : 128;
    for (let i = 0; i < steps; i++) {
      const a = (section ? Math.PI : 0) + (i * Math.PI) / 64;
      const b = a + Math.PI / 64;
      quad(
        v(Math.cos(a) * r0, from, Math.sin(a) * r0),
        v(Math.cos(b) * r0, from, Math.sin(b) * r0),
        v(Math.cos(b) * r1, to, Math.sin(b) * r1),
        v(Math.cos(a) * r1, to, Math.sin(a) * r1),
        v(-Math.cos((a + b) / 2), 0, -Math.sin((a + b) / 2)),
        1,
      );
    }
  });
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3),
  );
  for (const group of groups)
    geometry.addGroup(group.start, group.count, group.materialIndex);
  geometry.computeVertexNormals();
  return geometry;
}

function flutedTool(
  radius: number,
  height: number,
  count: number,
  point = false,
) {
  const rows = 48,
    segments = 120,
    vertices: number[] = [],
    indices: number[] = [];
  for (let j = 0; j <= rows; j++) {
    const y = (height * j) / rows;
    for (let i = 0; i <= segments; i++) {
      const a = (i * Math.PI * 2) / segments;
      const flute =
        (1 + Math.cos(count * (a - (y * Math.tan(Math.PI / 6)) / radius))) / 2;
      const r =
        radius *
        (0.62 + 0.38 * Math.pow(flute, 0.32)) *
        (point ? Math.min(1, y / TIP_HEIGHT) : 1);
      vertices.push(Math.cos(a) * r, y, Math.sin(a) * r);
      if (j < rows && i < segments) {
        const n = j * (segments + 1) + i;
        indices.push(
          n,
          n + segments + 1,
          n + 1,
          n + 1,
          n + segments + 1,
          n + segments + 2,
        );
      }
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3),
  );
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function buildChipGeometry(
  kind: MaterialGuide["appearance"]["chip"],
  index: number,
) {
  if (kind === "dust")
    return new THREE.IcosahedronGeometry(0.15 + (index % 4) * 0.05, 0);
  if (kind === "short")
    return new THREE.BoxGeometry(0.6, 0.28, 1.4 + (index % 3) * 0.5);
  const points = Array.from({ length: 28 }, (_, i) => {
    const t = i / 27,
      a = t * Math.PI * (kind === "ribbon" ? 4.2 : 2.2);
    return new THREE.Vector3(
      Math.cos(a) * (0.8 + t * 0.35),
      t * (kind === "ribbon" ? 5 : 2.5),
      Math.sin(a) * (0.8 + t * 0.35),
    );
  });
  return new THREE.TubeGeometry(
    new THREE.CatmullRomCurve3(points),
    32,
    kind === "ribbon" ? 0.15 : 0.22,
    4,
    false,
  );
}

function surfaceTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const context = canvas.getContext("2d")!;
  context.fillStyle = "#b6b6b6";
  context.fillRect(0, 0, 128, 128);
  for (let x = 0; x < 128; x++) {
    const value = 160 + Math.floor(45 * (Math.sin(x * 2.53) * 0.5 + 0.5));
    context.fillStyle = `rgb(${value},${value},${value})`;
    context.fillRect(x, 0, 1, 128);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

function addSurfaceUV(geometry: THREE.BufferGeometry, operation: Operation) {
  const p = geometry.getAttribute("position"),
    uv: number[] = [];
  for (let i = 0; i < p.count; i++) {
    if (operation === "turning")
      uv.push(p.getX(i) / 3, Math.atan2(p.getY(i), p.getZ(i)) / (2 * Math.PI));
    else uv.push(p.getX(i) / 8, p.getZ(i) / 8 + p.getY(i) / 8);
  }
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
}

function stageText(operation: Operation, progress: number, lang: Lang) {
  const p = progress / 100,
    s = labKinematics(operation, p);
  if (progress === 0)
    return lang === "uk"
      ? "До різання · вихідна заготовка"
      : "Before cutting · original stock";
  if (progress === 100)
    return lang === "uk"
      ? "Після проходу · результат обробки"
      : "After the pass · machined result";
  if (operation === "turning") {
    const phase =
      s.phase < 0.08
        ? { uk: "підвід", en: "approach" }
        : s.phase <= 0.82
          ? { uk: "поздовжня подача", en: "longitudinal feed" }
          : s.phase < 0.9
            ? { uk: "відвід", en: "retract" }
            : { uk: "повернення", en: "return" };
    return `${lang === "uk" ? "Прохід" : "Pass"} ${s.pass + 1}/3 · ${phase[lang]}`;
  }
  if (operation === "milling")
    return lang === "uk"
      ? "Прямолінійна подача · паз утворює слід фрези"
      : "Linear feed · the cutter sweeps the slot";
  if (p < 0.08)
    return lang === "uk"
      ? "Підвід до верхньої площини"
      : "Approach to the top face";
  if (p > 0.9)
    return lang === "uk"
      ? "Відвід із наскрізного отвору"
      : "Retract from the through hole";
  if (s.y > -6)
    return lang === "uk"
      ? "Заглиблення · конічне дно отвору"
      : "Plunging · conical hole bottom";
  if (s.y + TIP_HEIGHT > -6)
    return lang === "uk"
      ? "Вихід вістря · отвір ще не повного діаметра"
      : "Point breakout · exit is not yet full diameter";
  return lang === "uk"
    ? "Повний вихід Ø8 · отвір наскрізний"
    : "Full Ø8 breakout · through hole";
}

export default function MachiningLab({
  lang,
  material,
  initialOperation = "turning",
}: MachiningLabProps) {
  const [operation, setOperation] = useState<Operation>(initialOperation);
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [finish, setFinish] = useState(true);
  const [ghost, setGhost] = useState(true);
  const [section, setSection] = useState(true);
  const [error, setError] = useState(false);
  const [ready, setReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const mount = useRef<HTMLDivElement>(null);
  const actions = useRef<LabActions | null>(null);
  const progressRef = useRef(0),
    playingRef = useRef(false),
    finishRef = useRef(true),
    ghostRef = useRef(true);
  const id = useId();
  const method = material.methods.find((item) => item.operation === operation);
  const uk = lang === "uk";
  const tr = (ua: string, en: string) => (uk ? ua : en);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setReducedMotion(preference.matches);
      if (preference.matches) {
        playingRef.current = false;
        setPlaying(false);
        actions.current?.play(false);
      }
    };
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const node = mount.current;
    if (!node) return;
    setError(false);
    setReady(false);
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: "low-power",
      });
    } catch {
      setError(true);
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    node.append(renderer.domElement);
    renderer.domElement.setAttribute("aria-hidden", "true");
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#eaf0f4");
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 800);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = false;
    controls.enablePan = false;
    controls.minDistance = 75;
    controls.maxDistance = 230;
    controls.maxPolarAngle = Math.PI * 0.91;
    const pmrem = new THREE.PMREMGenerator(renderer),
      environment = new RoomEnvironment();
    const reflection = pmrem.fromScene(environment, 0.04);
    scene.environment = reflection.texture;
    environment.dispose();
    pmrem.dispose();
    const light = new THREE.DirectionalLight("#fff8ed", 3.1);
    light.position.set(25, 100, 70);
    light.castShadow = true;
    light.shadow.mapSize.set(1024, 1024);
    Object.assign(light.shadow.camera, {
      left: -90,
      right: 90,
      top: 90,
      bottom: -90,
      near: 1,
      far: 230,
    });
    light.shadow.bias = -0.0005;
    light.shadow.normalBias = 0.08;
    scene.add(light, new THREE.HemisphereLight("#f6fbff", "#798a95", 2));
    const fill = new THREE.DirectionalLight("#d0e3f4", 1.4);
    fill.position.set(-60, 35, -60);
    scene.add(fill);
    const metal = new THREE.MeshStandardMaterial({
      color: "#485b6c",
      metalness: 0.78,
      roughness: 0.33,
    });
    const dark = new THREE.MeshStandardMaterial({
      color: "#273844",
      metalness: 0.62,
      roughness: 0.4,
    });
    const toolSteel = new THREE.MeshStandardMaterial({
      color: "#b6c2ca",
      metalness: 0.93,
      roughness: 0.22,
    });
    const carbide = new THREE.MeshStandardMaterial({
      color: "#b99b53",
      metalness: 0.73,
      roughness: 0.28,
    });
    const texture = surfaceTexture();
    const appearance = material.appearance;
    const stockMaterial = new THREE.MeshStandardMaterial({
      color: appearance.color,
      metalness: appearance.metalness,
      roughness: clamp(appearance.roughness + 0.2, 0.2, 0.95),
      bumpMap: texture,
      bumpScale: 0.065,
    });
    const cutMaterial = new THREE.MeshStandardMaterial({
      color: appearance.color,
      metalness: appearance.metalness,
      roughness: appearance.roughness,
      bumpMap: texture,
      bumpScale: 0.02,
    });
    const sectionMaterial = new THREE.MeshStandardMaterial({
      color: appearance.color,
      metalness: appearance.metalness * 0.7,
      roughness: 0.72,
    });
    const chipMaterial = new THREE.MeshStandardMaterial({
      color: appearance.color,
      metalness: appearance.metalness,
      roughness: Math.min(0.7, appearance.roughness + 0.12),
      side: THREE.DoubleSide,
    });
    const fixture = new THREE.Group();
    scene.add(fixture);
    const mesh = (
      geometry: THREE.BufferGeometry,
      mat: THREE.MeshStandardMaterial,
      parent: THREE.Object3D,
      x = 0,
      y = 0,
      z = 0,
    ) => {
      const item = new THREE.Mesh(geometry, mat);
      item.position.set(x, y, z);
      item.castShadow = item.receiveShadow = true;
      parent.add(item);
      return item;
    };
    const box = (
      x: number,
      y: number,
      z: number,
      px: number,
      py: number,
      pz: number,
      mat = metal,
      parent: THREE.Object3D = fixture,
    ) => mesh(new THREE.BoxGeometry(x, y, z), mat, parent, px, py, pz);
    const floorY = operation === "turning" ? -38 : -26;
    const ground = mesh(
      new THREE.PlaneGeometry(500, 500),
      new THREE.MeshStandardMaterial({ color: "#e4ebef", roughness: 1 }),
      scene,
      0,
      floorY,
      0,
    );
    ground.rotation.x = -Math.PI / 2;
    ground.castShadow = false;
    const grid = new THREE.GridHelper(180, 18, "#b6c6d1", "#cbd6dd");
    grid.position.y = floorY + 0.04;
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.38;
    scene.add(grid);
    const chuck = new THREE.Group();
    fixture.add(chuck);
    if (operation === "turning") {
      const body = mesh(
        new THREE.CylinderGeometry(31, 31, 19, 96),
        metal,
        chuck,
        -24.5,
        0,
        0,
      );
      body.rotation.z = Math.PI / 2;
      const face = mesh(
        new THREE.CylinderGeometry(30, 30, 2, 96),
        toolSteel,
        chuck,
        -14,
        0,
        0,
      );
      face.rotation.z = Math.PI / 2;
      for (let i = 0; i < 3; i++) {
        const jaw = new THREE.Group();
        jaw.rotation.x = (i * Math.PI * 2) / 3;
        chuck.add(jaw);
        box(10, 10, 10, -12, 25, 0, dark, jaw);
        box(3, 5, 8, -6.5, 22.5, 0, toolSteel, jaw);
      }
      box(28, 8, 52, -26, -34, 0, dark);
    } else {
      box(78, 5, 56, 0, -22.5, 0, dark);
      const supportHeight = operation === "milling" ? 13 : 14;
      box(13, supportHeight, 40, -22, -20 + supportHeight / 2, 0, metal);
      box(13, supportHeight, 40, 22, -20 + supportHeight / 2, 0, metal);
      if (operation === "milling") {
        box(74, 12, 7, 0, -7, -23.5, metal);
        box(74, 12, 7, 0, -7, 23.5, metal);
        box(64, 2, 3, 0, -0.5, -21.5, toolSteel);
        box(64, 2, 3, 0, -0.5, 21.5, toolSteel);
      } else {
        for (const sign of [-1, 1]) {
          box(8, 26, 6, sign * 24, -7, sign * 30, dark);
          box(8, 3, 16, sign * 24, 7.5, sign * 24, metal);
          mesh(
            new THREE.CylinderGeometry(1.4, 1.4, 30, 16),
            dark,
            fixture,
            sign * 24,
            -5,
            sign * 28,
          );
          mesh(
            new THREE.CylinderGeometry(2.8, 2.8, 2, 6),
            toolSteel,
            fixture,
            sign * 24,
            10,
            sign * 28,
          );
        }
      }
    }
    const stock = new THREE.Mesh(new THREE.BufferGeometry(), [
      stockMaterial,
      cutMaterial,
      sectionMaterial,
    ]);
    stock.castShadow = stock.receiveShadow = true;
    scene.add(stock);
    const originalGeometry =
      operation === "turning"
        ? new THREE.CylinderGeometry(21, 21, 60, 64).rotateZ(Math.PI / 2)
        : new THREE.BoxGeometry(60, operation === "milling" ? 14 : 12, 40);
    const ghostLines = new THREE.LineSegments(
      new THREE.EdgesGeometry(originalGeometry, 25),
      new THREE.LineBasicMaterial({
        color: "#a77832",
        transparent: true,
        opacity: 0.38,
        depthWrite: false,
      }),
    );
    originalGeometry.dispose();
    ghostLines.visible = ghostRef.current;
    scene.add(ghostLines);
    const tool = new THREE.Group();
    scene.add(tool);
    const spindle = new THREE.Group();
    tool.add(spindle);
    if (operation === "turning") {
      box(11, 8, 29, -3, -4, 22, dark, tool);
      const shape = new THREE.Shape();
      shape.moveTo(0, 0);
      shape.lineTo(-8, 8);
      shape.lineTo(3, 10);
      shape.closePath();
      const insert = mesh(
        new THREE.ExtrudeGeometry(shape, {
          depth: 2.6,
          bevelEnabled: true,
          bevelSize: 0.15,
          bevelThickness: 0.12,
          bevelSegments: 1,
          steps: 1,
        }),
        carbide,
        tool,
        0,
        1.3,
        0,
      );
      insert.rotation.x = Math.PI / 2;
      const screw = mesh(
        new THREE.CylinderGeometry(1.1, 1.1, 0.4, 16),
        dark,
        tool,
        -2,
        1.6,
        6,
      );
      screw.castShadow = false;
    } else {
      const drill = operation === "drilling",
        r = drill ? 4 : 6;
      mesh(
        flutedTool(r, drill ? 29 : 22, drill ? 2 : 3, drill),
        toolSteel,
        spindle,
      );
      mesh(
        new THREE.CylinderGeometry(r, r, 13, 48),
        toolSteel,
        spindle,
        0,
        drill ? 35.5 : 28.5,
        0,
      );
      mesh(
        new THREE.CylinderGeometry(12, 9, 14, 64),
        dark,
        spindle,
        0,
        drill ? 48 : 41,
        0,
      );
      mesh(
        new THREE.CylinderGeometry(12.5, 12.5, 3, 64),
        metal,
        spindle,
        0,
        drill ? 54 : 47,
        0,
      );
      if (!drill) {
        const cap = mesh(
          new THREE.CylinderGeometry(r, r, 0.18, 48),
          toolSteel,
          spindle,
          0,
          0.09,
          0,
        );
        cap.castShadow = false;
      }
    }
    const chips = new THREE.Group();
    scene.add(chips);
    const chipCount = appearance.chip === "dust" ? 30 : 11;
    for (let i = 0; i < chipCount; i++) {
      const chip = mesh(
        buildChipGeometry(appearance.chip, i),
        chipMaterial,
        chips,
      );
      chip.rotation.set(i * 1.3, i * 2.7, i * 0.8);
      chip.position.set(
        Math.sin(i * 2.1) * (3 + i * 0.55),
        -3 - (i % 5) * 1.5,
        2 + Math.cos(i * 1.7) * (3 + i * 0.5),
      );
      if (operation !== "turning") chip.position.y = 2 + (i % 5) * 1.4;
    }
    const feed = new THREE.ArrowHelper(
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(),
      15,
      "#387da8",
      3.4,
      1.8,
    );
    scene.add(feed);
    let frame = 0,
      previous = 0,
      lastBuild = 0,
      lastState = 0,
      disposed = false;
    const render = () => {
      if (!disposed) renderer.render(scene, camera);
    };
    const finishSurface = (value: boolean) => {
      cutMaterial.roughness = clamp(
        appearance.roughness + (value ? -0.1 : 0.18),
        0.12,
        0.94,
      );
      cutMaterial.bumpScale = value ? 0.018 : 0.13;
      cutMaterial.needsUpdate = true;
    };
    finishSurface(finishRef.current);
    const update = (value: number) => {
      const state = labKinematics(operation, value);
      stock.geometry.dispose();
      stock.geometry = createLabWorkpieceGeometry(operation, value, section);
      addSurfaceUV(stock.geometry, operation);
      tool.position.set(state.x, state.y, state.z);
      chips.visible = value > 0 && state.engaged;
      chips.position.set(state.x, state.y, state.z);
      if (operation === "turning") chips.position.z -= 1;
      if (operation === "drilling") chips.position.y = 8;
      const feedDirection =
        operation === "turning"
          ? state.phase < 0.08
            ? new THREE.Vector3(0, 0, -1)
            : state.phase <= 0.82
              ? new THREE.Vector3(-1, 0, 0)
              : state.phase < 0.9
                ? new THREE.Vector3(0, 0, 1)
                : new THREE.Vector3(1, 0, 0)
          : operation === "milling"
            ? new THREE.Vector3(1, 0, 0)
            : new THREE.Vector3(0, value > 0.9 ? 1 : -1, 0);
      feed.setDirection(feedDirection);
      feed.position.set(
        state.x,
        state.y + (operation === "drilling" ? 8 : 12),
        state.z + (operation === "drilling" ? 13 : 12),
      );
      feed.visible = value < 1;
      render();
    };
    const resetCamera = (front = false) => {
      controls.target.set(
        operation === "turning" ? -1 : 0,
        operation === "turning" ? 0 : 8,
        0,
      );
      if (front)
        camera.position.set(
          0,
          operation === "drilling" ? 12 : operation === "milling" ? 78 : 25,
          145,
        );
      else
        camera.position.set(
          operation === "turning" ? 83 : 88,
          operation === "turning" ? 63 : 88,
          operation === "turning" ? 125 : 115,
        );
      controls.update();
      render();
    };
    const animate = (time: number) => {
      if (disposed || !playingRef.current) return;
      const elapsed = previous ? Math.min(time - previous, 100) : 0;
      previous = time;
      progressRef.current = Math.min(
        1,
        progressRef.current +
          elapsed / (operation === "turning" ? 24000 : 18000),
      );
      if (time - lastBuild >= 42 || progressRef.current === 1) {
        lastBuild = time;
        spindle.rotation.y = time * 0.003;
        chuck.rotation.x = -time * 0.002;
        update(progressRef.current);
        if (time - lastState > 120 || progressRef.current === 1) {
          lastState = time;
          setProgress(progressRef.current * 100);
        }
      }
      if (progressRef.current >= 1) {
        playingRef.current = false;
        setPlaying(false);
        frame = 0;
      } else frame = window.requestAnimationFrame(animate);
    };
    actions.current = {
      progress(value) {
        progressRef.current = value;
        update(value);
      },
      play(value) {
        if (frame) window.cancelAnimationFrame(frame);
        frame = 0;
        previous = 0;
        if (value) frame = window.requestAnimationFrame(animate);
      },
      camera() {
        resetCamera();
      },
      front() {
        resetCamera(true);
      },
      finish(value) {
        finishSurface(value);
        render();
      },
      ghost(value) {
        ghostLines.visible = value;
        render();
      },
      navigate(key) {
        const offset = camera.position.clone().sub(controls.target);
        if (key === "+" || key === "=") offset.multiplyScalar(0.9);
        else if (key === "-") offset.multiplyScalar(1.1);
        else if (key === "Home") {
          resetCamera();
          return;
        } else {
          const spherical = new THREE.Spherical().setFromVector3(offset);
          if (key === "ArrowLeft") spherical.theta -= 0.12;
          if (key === "ArrowRight") spherical.theta += 0.12;
          if (key === "ArrowUp") spherical.phi -= 0.12;
          if (key === "ArrowDown") spherical.phi += 0.12;
          spherical.phi = clamp(spherical.phi, 0.1, Math.PI * 0.9);
          offset.setFromSpherical(spherical);
        }
        offset.clampLength(controls.minDistance, controls.maxDistance);
        camera.position.copy(controls.target).add(offset);
        controls.update();
        render();
      },
    };
    controls.addEventListener("change", render);
    const resize = () => {
      const width = Math.max(1, node.clientWidth),
        height = Math.max(1, node.clientHeight);
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.fov = camera.aspect < 1 ? 45 : 35;
      camera.updateProjectionMatrix();
      render();
    };
    const pauseWhenHidden = () => {
      if (document.hidden) {
        playingRef.current = false;
        setPlaying(false);
        actions.current?.play(false);
      }
    };
    document.addEventListener("visibilitychange", pauseWhenHidden);
    const observer = new ResizeObserver(resize);
    observer.observe(node);
    resetCamera();
    resize();
    update(progressRef.current);
    setReady(true);
    return () => {
      disposed = true;
      actions.current = null;
      if (frame) window.cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener("visibilitychange", pauseWhenHidden);
      controls.removeEventListener("change", render);
      controls.dispose();
      const geometries = new Set<THREE.BufferGeometry>(),
        materials = new Set<THREE.Material>();
      scene.traverse((object) => {
        const item = object as THREE.Mesh;
        if (item.geometry) geometries.add(item.geometry);
        if (Array.isArray(item.material))
          item.material.forEach((entry) => materials.add(entry));
        else if (item.material) materials.add(item.material);
      });
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((entry) => entry.dispose());
      texture.dispose();
      reflection.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, [
    operation,
    material.id,
    material.appearance.color,
    material.appearance.metalness,
    material.appearance.roughness,
    material.appearance.chip,
    section,
  ]);

  useEffect(
    () => () => {
      playingRef.current = false;
    },
    [],
  );
  const pause = () => {
    playingRef.current = false;
    setPlaying(false);
    actions.current?.play(false);
  };
  const chooseOperation = (value: Operation) => {
    pause();
    progressRef.current = 0;
    setProgress(0);
    setOperation(value);
  };
  const seek = (value: number) => {
    pause();
    setProgress(value);
    progressRef.current = value / 100;
    actions.current?.progress(value / 100);
  };
  const togglePlay = () => {
    if (reducedMotion) {
      seek(progress >= 100 ? 0 : Math.min(100, progress + 10));
      return;
    }
    const next = !playing;
    if (next && progressRef.current >= 1) {
      progressRef.current = 0;
      setProgress(0);
      actions.current?.progress(0);
    }
    playingRef.current = next;
    setPlaying(next);
    actions.current?.play(next);
  };
  const dimensions =
    operation === "turning"
      ? tr("Ø42 × 60 → Ø36 на довжині 40 мм", "Ø42 × 60 → Ø36 over 40 mm")
      : operation === "milling"
        ? tr("60 × 40 × 14 · паз 12 × 2 мм", "60 × 40 × 14 · slot 12 × 2 mm")
        : tr("60 × 40 × 12 · отвір Ø8 · 118°", "60 × 40 × 12 · Ø8 hole · 118°");
  return (
    <section className="machining-lab" aria-labelledby={`${id}-title`}>
      <div className="machining-lab__heading">
        <div>
          <span className="machining-lab__eyebrow">
            {tr("ПОБАЧИТИ ПРОЦЕС", "SEE THE PROCESS")}
          </span>
          <h3 id={`${id}-title`}>
            {tr(
              "Як інструмент знімає матеріал",
              "How the tool removes material",
            )}
          </h3>
          <p>
            {tr(
              "Проведіть інструмент крізь заготовку й порівняйте початок із результатом.",
              "Move the tool through the stock and compare the start with the result.",
            )}
          </p>
        </div>
        <span className="machining-lab__material">
          <i style={{ background: material.appearance.color }} />
          {material.name[lang]}
        </span>
      </div>
      <div
        className="machining-lab__tabs"
        role="group"
        aria-label={tr("Операція обробки", "Machining operation")}
      >
        {operations.map((value, i) => (
          <button
            type="button"
            key={value}
            aria-pressed={operation === value}
            onClick={() => chooseOperation(value)}
          >
            <span>0{i + 1}</span>
            {operationNames[value][lang]}
            <ArrowRight size={16} aria-hidden="true" />
          </button>
        ))}
      </div>
      <div className="machining-lab__body">
        <div className="machining-lab__visual">
          <div
            className="machining-lab__viewport"
            ref={mount}
            tabIndex={error ? -1 : 0}
            role="region"
            aria-label={`${operationNames[operation][lang]}. ${dimensions}. ${tr("Обертання: стрілки. Масштаб: плюс і мінус. Початковий ракурс: Home.", "Orbit: arrow keys. Zoom: plus and minus. Reset view: Home.")}`}
            onKeyDown={(event) => {
              if (
                [
                  "ArrowLeft",
                  "ArrowRight",
                  "ArrowUp",
                  "ArrowDown",
                  "+",
                  "=",
                  "-",
                  "Home",
                ].includes(event.key)
              ) {
                event.preventDefault();
                actions.current?.navigate(event.key);
              }
            }}
          >
            {error && (
              <div className="machining-lab__fallback">
                <Shapes size={36} />
                <strong>
                  {tr(
                    "3D недоступне у цьому браузері",
                    "3D is unavailable in this browser",
                  )}
                </strong>
                <span>
                  {tr(
                    "Увімкніть WebGL, щоб побачити об’ємне різання. Пояснення операції доступне поруч.",
                    "Enable WebGL to see the solid cutting model. The operation explanation remains available alongside.",
                  )}
                </span>
              </div>
            )}
            {!error && !ready && (
              <div className="machining-lab__loading">
                {tr("Підготовка 3D…", "Preparing 3D…")}
              </div>
            )}
            {!error && (
              <>
                <div className="machining-lab__scene-label">
                  <span>{tr("ГЕОМЕТРИЧНИЙ ПРИКЛАД", "GEOMETRIC EXAMPLE")}</span>
                  <strong>{dimensions}</strong>
                </div>
                <div className="machining-lab__camera">
                  <button
                    type="button"
                    onClick={() => actions.current?.front()}
                    title={tr("Вигляд спереду", "Front view")}
                  >
                    <Focus size={17} />
                    <span>{tr("Спереду", "Front")}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => actions.current?.camera()}
                    title={tr("Відновити ракурс", "Reset view")}
                  >
                    <RotateCcw size={17} />
                  </button>
                </div>
                <div className="machining-lab__orbit">
                  {tr(
                    "Обертайте · наближайте · досліджуйте",
                    "Orbit · zoom · explore",
                  )}
                </div>
                {operation === "drilling" && section && (
                  <span className="machining-lab__section-badge">
                    <Scissors size={13} />
                    {tr(
                      "Половину деталі приховано для розрізу",
                      "Half the part is hidden for the section",
                    )}
                  </span>
                )}
              </>
            )}
          </div>
          <div className="machining-lab__transport">
            <button
              type="button"
              className="machining-lab__play"
              onClick={togglePlay}
              disabled={error || !ready}
              aria-label={
                reducedMotion
                  ? tr("Наступний крок візуалізації", "Next visualization step")
                  : playing
                    ? tr("Призупинити візуалізацію", "Pause visualization")
                    : tr("Відтворити візуалізацію", "Play visualization")
              }
            >
              {playing ? <CirclePause size={24} /> : <CirclePlay size={24} />}
              <span>
                {reducedMotion
                  ? tr("Далі", "Next step")
                  : playing
                    ? tr("Пауза", "Pause")
                    : tr("Відтворити", "Play")}
              </span>
            </button>
            <div className="machining-lab__scrubber">
              <label htmlFor={`${id}-progress`}>
                <span>{stageText(operation, progress, lang)}</span>
                <output>{Math.round(progress)}%</output>
              </label>
              <input
                id={`${id}-progress`}
                type="range"
                min="0"
                max="100"
                step="0.1"
                value={progress}
                onChange={(event) => seek(Number(event.target.value))}
                disabled={error}
                aria-label={tr("Перебіг операції", "Operation progress")}
                aria-valuetext={`${Math.round(progress)}% · ${stageText(operation, progress, lang)}`}
              />
              <div>
                <button type="button" onClick={() => seek(0)}>
                  {tr("Заготовка", "Original stock")}
                </button>
                <button type="button" onClick={() => seek(100)}>
                  {tr("Результат", "Finished result")}
                </button>
              </div>
            </div>
            <button
              type="button"
              className="machining-lab__reset"
              onClick={() => seek(0)}
              title={tr("Почати спочатку", "Reset progress")}
              aria-label={tr("Почати спочатку", "Reset progress")}
            >
              <RotateCcw size={19} />
            </button>
          </div>
          <div className="machining-lab__options">
            <label>
              <input
                type="checkbox"
                checked={ghost}
                onChange={(event) => {
                  setGhost(event.target.checked);
                  ghostRef.current = event.target.checked;
                  actions.current?.ghost(event.target.checked);
                }}
              />
              {tr("Контур вихідної заготовки", "Original stock outline")}
            </label>
            {operation === "drilling" && (
              <label>
                <input
                  type="checkbox"
                  checked={section}
                  onChange={(event) => {
                    pause();
                    setSection(event.target.checked);
                  }}
                />
                {tr("Поздовжній розріз", "Longitudinal section")}
              </label>
            )}
            <label>
              <input
                type="checkbox"
                checked={finish}
                onChange={(event) => {
                  setFinish(event.target.checked);
                  finishRef.current = event.target.checked;
                  actions.current?.finish(event.target.checked);
                }}
              />
              {tr("Показати чистішу поверхню", "Show a finer surface")}
            </label>
            {reducedMotion && (
              <span className="machining-lab__motion-note">
                {tr(
                  "Зменшення руху: покроковий режим",
                  "Reduced motion: step mode",
                )}
              </span>
            )}
          </div>
        </div>
        <aside className="machining-lab__explanation">
          <div className="machining-lab__result-title">
            <span>{tr("ЩО ОТРИМАЄМО", "WHAT TO EXPECT")}</span>
            <h4>{operationNames[operation][lang]}</h4>
          </div>
          <p className="machining-lab__result">
            {method?.expected[lang] ??
              tr(
                "Порівнюйте форму, оброблені поверхні та геометрію інструмента.",
                "Compare the shape, machined surfaces, and tool geometry.",
              )}
          </p>
          <dl>
            <div>
              <dt>
                {tr("Інструмент для матеріалу", "Tool for this material")}
              </dt>
              <dd>{method?.tool[lang]}</dd>
            </div>
            <div>
              <dt>{tr("На що дивитися", "What to observe")}</dt>
              <dd>
                {operation === "turning"
                  ? tr(
                      "Три послідовні проходи змінюють радіус на 1 мм кожний. Плече залишається на відстані 20 мм від лівого торця.",
                      "Three successive passes reduce the radius by 1 mm each. The shoulder stays 20 mm from the left face.",
                    )
                  : operation === "milling"
                    ? tr(
                        "Фреза Ø12 заходить ззовні, лишає дно на глибині 2 мм і повністю виходить за край.",
                        "The Ø12 cutter enters from outside, leaves a floor 2 mm deep, and exits beyond the edge.",
                      )
                    : tr(
                        "Спочатку утворюється конус 118°. Вістря виходить раніше, ніж отвір стає наскрізним на повний Ø8.",
                        "A 118° cone forms first. The point exits before the hole breaks through at the full Ø8.",
                      )}
              </dd>
            </div>
            <div>
              <dt>
                {tr("Стружка цього матеріалу", "Chips from this material")}
              </dt>
              <dd>{method?.chips[lang]}</dd>
            </div>
          </dl>
          <p className="machining-lab__qualitative">
            {tr(
              "Блиск і сліди різання показано умовно. Перемикач поверхні не змінює розмірів і не задає шорсткість Ra.",
              "Sheen and cutting marks are illustrative. The surface switch changes neither dimensions nor an Ra specification.",
            )}
          </p>
        </aside>
      </div>
      <div className="machining-lab__legend">
        <span>
          <i
            className="machining-lab__key-stock"
            style={{ background: material.appearance.color }}
          />
          {tr("Заготовка", "Workpiece")}
        </span>
        <span>
          <i className="machining-lab__key-tool" />
          {tr("Різальна частина", "Cutting tool")}
        </span>
        <span>
          <i className="machining-lab__key-removed" />
          {tr("Вихідний контур", "Original envelope")}
        </span>
        <span>
          <i
            className="machining-lab__key-chip"
            style={{ background: material.appearance.color }}
          />
          {tr("Стружка: знятий матеріал", "Chips: removed material")}
        </span>
        <span>
          <ArrowRight size={15} color="#387da8" />
          {tr("Подача / підвід / відвід", "Feed / approach / retract")}
        </span>
      </div>
      <p className="machining-lab__caption">
        {tr(
          "Навчальна 3D-візуалізація, не CAM-перевірка: геометрія в мм, рух, стружка та вигляд поверхні умовні. Зміна матеріалу змінює вигляд і пояснення; режими різання, сили, нагрівання, зіткнення та надійність затиску тут не розраховуються.",
          "Educational 3D visualization, not CAM verification: geometry is in mm; motion, chips, and surface appearance are illustrative. Changing material changes appearance and guidance; cutting parameters, forces, heat, collisions, and workholding capacity are not calculated here.",
        )}
      </p>
    </section>
  );
}
