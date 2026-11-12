import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { Box, Layers3, RotateCcw, ScanLine } from "lucide-react";
import polygonClipping from "polygon-clipping";
import type { MultiPolygon, Polygon, Pair } from "polygon-clipping";
import type { Lang, ModelKind, PartGeometry, Text } from "../data/types";
import "./ModelViewer.css";

interface ModelViewerProps {
  kind?: ModelKind;
  part?: PartGeometry;
  title?: Text;
  lang: Lang;
  compact?: boolean;
}
interface ViewerActions {
  reset: () => void;
  front: () => void;
  wire: (value: boolean) => void;
  explode: (value: boolean) => void;
  navigate: (key: string) => void;
}
type Part = THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>;
const labels: Record<ModelKind, { uk: string[]; en: string[] }> = {
  lathe: {
    uk: ["Передня бабка", "Патрон і заготовка", "Супорт", "Задня бабка"],
    en: ["Headstock", "Chuck & workpiece", "Carriage", "Tailstock"],
  },
  shaft: {
    uk: ["Базовий торець", "Посадковий діаметр", "Уступ", "Шпонковий паз"],
    en: ["Datum face", "Journal diameter", "Shoulder", "Keyway"],
  },
  flange: {
    uk: ["Базова площина", "Маточина", "Кріпильні отвори", "Вісь обертання"],
    en: ["Datum plane", "Hub", "Mounting holes", "Rotation axis"],
  },
  bracket: {
    uk: ["Базова поверхня", "Вертикальна полиця", "Отвори", "Ребро жорсткості"],
    en: ["Datum surface", "Upright", "Holes", "Stiffening rib"],
  },
  pocket: {
    uk: [
      "Габарит 70 × 50 × 30",
      "Кишеня 50 × 30",
      "Глибина 20",
      "Дно завтовшки 10",
    ],
    en: [
      "Envelope 70 × 50 × 30",
      "Pocket 50 × 30",
      "Depth 20",
      "Floor thickness 10",
    ],
  },
  vice: {
    uk: ["Нерухома губка", "Рухома губка", "Ходовий гвинт", "Основа"],
    en: ["Fixed jaw", "Moving jaw", "Lead screw", "Base"],
  },
};
const names: Record<ModelKind, { uk: string; en: string }> = {
  pocket: {
    uk: "Блок із кишенею 70 × 50 × 30",
    en: "Pocketed block 70 × 50 × 30",
  },
  lathe: { uk: "Токарний верстат", en: "Engine lathe" },
  shaft: { uk: "Ступінчастий вал", en: "Stepped shaft" },
  flange: { uk: "Фланець", en: "Mounting flange" },
  bracket: { uk: "Кутовий кронштейн", en: "Angle bracket" },
  vice: { uk: "Машинні лещата", en: "Machine vice" },
};

interface GeometryLayer {
  from: number;
  to: number;
  section: MultiPolygon;
}
function circlePolygon(x: number, y: number, radius: number): Polygon {
  return [
    Array.from({ length: 128 }, (_, i): Pair => [
      x + Math.cos((i * Math.PI) / 64) * radius,
      y + Math.sin((i * Math.PI) / 64) * radius,
    ]),
  ];
}
function roundedRectanglePolygon(
  x: number,
  y: number,
  width: number,
  depth: number,
  radius = 0,
): Polygon {
  const r = Math.min(Math.max(radius, 0), width / 2, depth / 2);
  if (!r)
    return [
      [
        [x, y],
        [x + width, y],
        [x + width, y + depth],
        [x, y + depth],
      ],
    ];
  const ring: Pair[] = [];
  for (const [cx, cy, start] of [
    [x + width - r, y + r, -Math.PI / 2],
    [x + width - r, y + depth - r, 0],
    [x + r, y + depth - r, Math.PI / 2],
    [x + r, y + r, Math.PI],
  ])
    for (let i = 0; i <= 24; i++) {
      const a = start + (i * Math.PI) / 48;
      ring.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
    }
  return [ring];
}
function subtractSection(subject: Polygon, cuts: Polygon[]): MultiPolygon {
  return cuts.length ? polygonClipping.difference(subject, ...cuts) : [subject];
}
function partSections(part: PartGeometry): GeometryLayer[] {
  if (part.kind === "turned") {
    const length = part.sections.reduce((sum, s) => sum + s.length, 0),
      breaks = new Set<number>([0, length]);
    let end = 0;
    part.sections.forEach((section) => {
      end += section.length;
      breaks.add(end);
    });
    if (part.bore) {
      breaks.add(Math.min(part.bore.depth ?? length, length));
      if (part.bore.counterbore) breaks.add(part.bore.counterbore.depth);
    }
    part.holes?.forEach((hole) => {
      breaks.add(hole.depth ?? length);
      if (hole.counterbore) breaks.add(hole.counterbore.depth);
    });
    const boundaries = [...breaks]
      .filter((v) => v >= 0 && v <= length)
      .sort((a, b) => a - b);
    return boundaries.slice(0, -1).map((from, i) => {
      const to = boundaries[i + 1],
        mid = (from + to) / 2;
      let cursor = 0;
      const segment = part.sections.find((section) => {
        cursor += section.length;
        return mid < cursor + 1e-8;
      })!;
      const cuts: Polygon[] = [];
      if (part.bore && mid < (part.bore.depth ?? length))
        cuts.push(
          circlePolygon(
            0,
            0,
            part.bore.counterbore && mid < part.bore.counterbore.depth
              ? part.bore.counterbore.diameter / 2
              : part.bore.diameter / 2,
          ),
        );
      part.holes?.forEach((hole) => {
        if (mid < (hole.depth ?? length))
          cuts.push(
            circlePolygon(
              hole.x,
              hole.y,
              hole.counterbore && mid < hole.counterbore.depth
                ? hole.counterbore.diameter / 2
                : hole.diameter / 2,
            ),
          );
      });
      return {
        from,
        to,
        section: subtractSection(
          circlePolygon(0, 0, segment.diameter / 2),
          cuts,
        ),
      };
    });
  }
  const breaks = new Set<number>([0, part.height]);
  part.holes?.forEach((h) => {
    breaks.add(part.height - (h.depth ?? part.height));
    if (h.counterbore) breaks.add(part.height - h.counterbore.depth);
  });
  part.pockets?.forEach((p) => breaks.add(part.height - p.cutDepth));
  part.slots?.forEach((slot) => breaks.add(part.height - slot.cutDepth));
  const boundaries = [...breaks]
    .filter((v) => v >= 0 && v <= part.height)
    .sort((a, b) => a - b);
  return boundaries.slice(0, -1).map((from, i) => {
    const to = boundaries[i + 1],
      mid = (from + to) / 2,
      cuts: Polygon[] = [];
    part.holes?.forEach((h) => {
      if (mid > part.height - (h.depth ?? part.height))
        cuts.push(
          circlePolygon(
            h.x,
            h.y,
            h.counterbore && mid > part.height - h.counterbore.depth
              ? h.counterbore.diameter / 2
              : h.diameter / 2,
          ),
        );
    });
    part.pockets?.forEach((p) => {
      if (mid > part.height - p.cutDepth)
        cuts.push(
          roundedRectanglePolygon(p.x, p.y, p.width, p.depth, p.cornerRadius),
        );
    });
    part.slots?.forEach((slot) => {
      if (mid > part.height - slot.cutDepth) {
        const w = slot.axis === "x" ? slot.length : slot.width,
          d = slot.axis === "y" ? slot.length : slot.width;
        cuts.push(
          roundedRectanglePolygon(
            slot.x - w / 2,
            slot.y - d / 2,
            w,
            d,
            slot.width / 2,
          ),
        );
      }
    });
    return {
      from,
      to,
      section: subtractSection(
        roundedRectanglePolygon(
          0,
          0,
          part.width,
          part.depth,
          part.cornerRadius,
        ),
        cuts,
      ),
    };
  });
}
/** Build the boundary of each solid layer, removing internal caps between adjoining sections. */
export function createParametricPartGeometry(
  part: PartGeometry,
): THREE.BufferGeometry {
  const layers = partSections(part),
    vertices: number[] = [];
  const triangle = (
    a: THREE.Vector3,
    b: THREE.Vector3,
    c: THREE.Vector3,
    normal: THREE.Vector3,
  ) => {
    if (
      new THREE.Vector3()
        .subVectors(b, a)
        .cross(new THREE.Vector3().subVectors(c, a))
        .dot(normal) < 0
    )
      [b, c] = [c, b];
    vertices.push(...a.toArray(), ...b.toArray(), ...c.toArray());
  };
  const clean = (ring: Pair[]) => {
    const points = ring.slice();
    if (
      points.length > 1 &&
      points[0][0] === points[points.length - 1][0] &&
      points[0][1] === points[points.length - 1][1]
    )
      points.pop();
    return points;
  };
  const cap = (polygons: MultiPolygon, z: number, up: boolean) => {
    for (const polygon of polygons) {
      const rings = polygon.map((ring) =>
          clean(ring).map((p) => new THREE.Vector2(...p)),
        ),
        points = rings.flat();
      for (const indices of THREE.ShapeUtils.triangulateShape(
        rings[0],
        rings.slice(1),
      )) {
        const [a, b, c] = indices.map(
          (i) => new THREE.Vector3(points[i].x, points[i].y, z),
        );
        triangle(a, b, c, new THREE.Vector3(0, 0, up ? 1 : -1));
      }
    }
  };
  for (let i = 0; i < layers.length; i++) {
    const layer = layers[i],
      previous = layers[i - 1]?.section,
      next = layers[i + 1]?.section;
    cap(
      previous
        ? polygonClipping.difference(layer.section, previous)
        : layer.section,
      layer.from,
      false,
    );
    cap(
      next ? polygonClipping.difference(layer.section, next) : layer.section,
      layer.to,
      true,
    );
    for (const polygon of layer.section)
      for (const raw of polygon) {
        const ring = clean(raw);
        ring.forEach((p, j) => {
          const q = ring[(j + 1) % ring.length],
            normal = new THREE.Vector3(q[1] - p[1], p[0] - q[0], 0),
            a = new THREE.Vector3(p[0], p[1], layer.from),
            b = new THREE.Vector3(q[0], q[1], layer.from),
            c = new THREE.Vector3(q[0], q[1], layer.to),
            d = new THREE.Vector3(p[0], p[1], layer.to);
          triangle(a, b, c, normal);
          triangle(a, c, d, normal);
        });
      }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3),
  );
  const length =
    part.kind === "turned"
      ? part.sections.reduce((sum, s) => sum + s.length, 0)
      : part.width;
  const depth =
    part.kind === "turned"
      ? Math.max(...part.sections.map((s) => s.diameter))
      : part.depth;
  const height = part.kind === "turned" ? depth : part.height;
  const scale = 8 / Math.max(length, depth, height);
  const positions = geometry.getAttribute("position");
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i),
      y = positions.getY(i),
      z = positions.getZ(i);
    if (part.kind === "turned")
      positions.setXYZ(i, (z - length / 2) * scale, y * scale, -x * scale);
    else
      positions.setXYZ(
        i,
        (x - length / 2) * scale,
        (z - height / 2) * scale,
        (depth / 2 - y) * scale,
      );
  }
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  geometry.userData = {
    millimetresPerUnit: 1 / scale,
    nominalDimensions: [length, height, depth],
  };
  return geometry;
}
function partDimensions(part: PartGeometry, lang: Lang): string[] {
  if (part.kind === "turned") {
    const length = part.sections.reduce((sum, s) => sum + s.length, 0),
      diameter = Math.max(...part.sections.map((s) => s.diameter));
    return [
      `${lang === "uk" ? "Довжина" : "Length"}: ${length} mm`,
      `${lang === "uk" ? "Найбільший діаметр" : "Largest diameter"}: Ø${diameter}`,
      part.bore
        ? `${lang === "uk" ? "Осьовий отвір" : "Axial bore"}: Ø${part.bore.diameter}${part.bore.depth ? ` × ${part.bore.depth}` : ""}`
        : lang === "uk"
          ? "Суцільна осьова геометрія"
          : "Solid axial geometry",
      `${lang === "uk" ? "Отвори на торці" : "End-face holes"}: ${part.holes?.length || 0}`,
    ];
  }
  return [
    `X: ${part.width} mm`,
    `Y: ${part.depth} mm`,
    `Z: ${part.height} mm`,
    `${lang === "uk" ? "Отвори / кишені / пази" : "Holes / pockets / slots"}: ${part.holes?.length || 0} / ${part.pockets?.length || 0} / ${part.slots?.length || 0}`,
  ];
}
export default function ModelViewer({
  kind = "lathe",
  part,
  title,
  lang,
  compact = false,
}: ModelViewerProps) {
  const mount = useRef<HTMLDivElement>(null);
  const actions = useRef<ViewerActions | null>(null);
  const markers = useRef<(HTMLSpanElement | null)[]>([]);
  const [failed, setFailed] = useState(false);
  const [wireframe, setWireframe] = useState(false);
  const [exploded, setExploded] = useState(false);
  const [front, setFront] = useState(false);
  const uk = lang === "uk";
  const modelName =
    title?.[lang] ||
    (part
      ? uk
        ? "Деталь за числовою геометрією"
        : "Part from numeric geometry"
      : names[kind][lang]);
  useEffect(() => {
    const host = mount.current;
    if (!host) return;
    setFailed(false);
    setWireframe(false);
    setExploded(false);
    setFront(false);
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      setFailed(true);
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    renderer.domElement.setAttribute("aria-hidden", "true");
    host.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 200);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = false;
    controls.enablePan = false;
    controls.minPolarAngle = 0.15;
    controls.maxPolarAngle = Math.PI / 2 + 0.12;
    controls.zoomSpeed = 0.65;
    controls.rotateSpeed = 0.65;
    controls.touches.ONE = THREE.TOUCH.ROTATE;
    controls.touches.TWO = THREE.TOUCH.DOLLY_PAN;
    const group = new THREE.Group();
    scene.add(group);
    const parts: Part[] = [];
    const materials = {
      sage: new THREE.MeshStandardMaterial({
        color: "#778b9c",
        metalness: 0.35,
        roughness: 0.52,
      }),
      deep: new THREE.MeshStandardMaterial({
        color: "#4b6275",
        metalness: 0.45,
        roughness: 0.48,
      }),
      silver: new THREE.MeshStandardMaterial({
        color: "#bec6ce",
        metalness: 0.82,
        roughness: 0.38,
      }),
      dark: new THREE.MeshStandardMaterial({
        color: "#27343f",
        metalness: 0.6,
        roughness: 0.4,
      }),
      lime: new THREE.MeshStandardMaterial({
        color: "#397ac1",
        metalness: 0.3,
        roughness: 0.5,
      }),
    };
    type Finish = keyof typeof materials;
    function add(
      geometry: THREE.BufferGeometry,
      finish: Finish,
      position: [number, number, number],
      rotation?: [number, number, number],
    ) {
      const mesh = new THREE.Mesh(geometry, materials[finish].clone());
      mesh.position.set(...position);
      if (rotation) mesh.rotation.set(...rotation);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      group.add(mesh);
      parts.push(mesh);
      mesh.userData.home = mesh.position.clone();
      const edges = new THREE.LineSegments(
        new THREE.EdgesGeometry(geometry, 30),
        new THREE.LineBasicMaterial({
          color: "#253443",
          transparent: true,
          opacity: 0.3,
        }),
      );
      mesh.add(edges);
      return mesh;
    }
    const box = (
      x: number,
      y: number,
      z: number,
      finish: Finish,
      pos: [number, number, number],
    ) => add(new THREE.BoxGeometry(x, y, z), finish, pos);
    const cylinder = (
      r: number,
      length: number,
      finish: Finish,
      pos: [number, number, number],
      axis: "x" | "y" | "z" = "x",
      r2 = r,
    ) =>
      add(
        new THREE.CylinderGeometry(r, r2, length, 64),
        finish,
        pos,
        axis === "x"
          ? [0, 0, Math.PI / 2]
          : axis === "z"
            ? [Math.PI / 2, 0, 0]
            : undefined,
      );
    function wheel(
      pos: [number, number, number],
      radius = 0.28,
      axis: "x" | "z" = "z",
    ) {
      const rotation: [number, number, number] =
        axis === "x" ? [0, Math.PI / 2, 0] : [0, 0, 0];
      add(new THREE.TorusGeometry(radius, 0.035, 8, 40), "dark", pos, rotation);
      cylinder(0.07, 0.11, "silver", pos, axis);
      for (let i = 0; i < 3; i++) {
        const spoke = box(radius, 0.025, 0.025, "silver", [...pos]);
        spoke.rotation.z = (i * Math.PI * 2) / 3;
        spoke.position.x += (Math.cos((i * Math.PI * 2) / 3) * radius) / 2;
        spoke.position.y += (Math.sin((i * Math.PI * 2) / 3) * radius) / 2;
        if (axis === "x") {
          const angle = (i * Math.PI * 2) / 3;
          spoke.position.set(
            pos[0],
            pos[1] + (Math.cos(angle) * radius) / 2,
            pos[2] + (Math.sin(angle) * radius) / 2,
          );
          spoke.rotation.set(angle, 0, Math.PI / 2);
        }
        spoke.userData.home = spoke.position.clone();
      }
    }
    function bolts(
      points: [number, number, number][],
      axis: "x" | "y" | "z" = "y",
    ) {
      points.forEach((p) => cylinder(0.055, 0.04, "dark", p, axis));
    }
    if (part) {
      try {
        add(createParametricPartGeometry(part), "silver", [0, 0, 0]);
      } catch {
        controls.dispose();
        Object.values(materials).forEach((material) => material.dispose());
        renderer.dispose();
        renderer.domElement.remove();
        setFailed(true);
        return;
      }
    } else if (kind === "pocket") {
      const outline = [
        new THREE.Vector2(-3.5, -2.5),
        new THREE.Vector2(3.5, -2.5),
        new THREE.Vector2(3.5, 2.5),
        new THREE.Vector2(-3.5, 2.5),
      ];
      const innerShape = new THREE.Shape();
      const r = 0.3;
      innerShape.moveTo(-2.5 + r, -1.5);
      innerShape.lineTo(2.5 - r, -1.5);
      innerShape.quadraticCurveTo(2.5, -1.5, 2.5, -1.5 + r);
      innerShape.lineTo(2.5, 1.5 - r);
      innerShape.quadraticCurveTo(2.5, 1.5, 2.5 - r, 1.5);
      innerShape.lineTo(-2.5 + r, 1.5);
      innerShape.quadraticCurveTo(-2.5, 1.5, -2.5, 1.5 - r);
      innerShape.lineTo(-2.5, -1.5 + r);
      innerShape.quadraticCurveTo(-2.5, -1.5, -2.5 + r, -1.5);
      const inner = innerShape.getPoints(10);
      if (inner[0].equals(inner[inner.length - 1])) inner.pop();
      const vertices: number[] = [];
      function triangle(
        a: THREE.Vector3,
        b: THREE.Vector3,
        c: THREE.Vector3,
        normal: THREE.Vector3,
      ) {
        if (
          new THREE.Vector3()
            .subVectors(b, a)
            .cross(new THREE.Vector3().subVectors(c, a))
            .dot(normal) < 0
        )
          [b, c] = [c, b];
        vertices.push(...a.toArray(), ...b.toArray(), ...c.toArray());
      }
      function face(
        contour: THREE.Vector2[],
        holes: THREE.Vector2[][],
        height: number,
        normal: THREE.Vector3,
      ) {
        const points = [...contour, ...holes.flat()];
        for (const indices of THREE.ShapeUtils.triangulateShape(
          contour,
          holes,
        )) {
          const [a, b, c] = indices.map(
            (i) => new THREE.Vector3(points[i].x, height, points[i].y),
          );
          triangle(a, b, c, normal);
        }
      }
      face(outline, [inner], 1.5, new THREE.Vector3(0, 1, 0));
      face(inner, [], -0.5, new THREE.Vector3(0, 1, 0));
      face(outline, [], -1.5, new THREE.Vector3(0, -1, 0));
      function walls(points: THREE.Vector2[], bottom: number, inward: boolean) {
        points.forEach((point, i) => {
          const next = points[(i + 1) % points.length],
            normal = new THREE.Vector3(
              (point.x + next.x) * (inward ? -1 : 1),
              0,
              (point.y + next.y) * (inward ? -1 : 1),
            );
          const a = new THREE.Vector3(point.x, bottom, point.y),
            b = new THREE.Vector3(next.x, bottom, next.y),
            c = new THREE.Vector3(next.x, 1.5, next.y),
            d = new THREE.Vector3(point.x, 1.5, point.y);
          triangle(a, b, c, normal);
          triangle(a, c, d, normal);
        });
      }
      walls(outline, -1.5, false);
      walls(inner, -0.5, true);
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(vertices, 3),
      );
      geometry.computeVertexNormals();
      add(geometry, "silver", [0, 0, 0]);
    } else if (kind === "lathe") {
      box(7.8, 0.27, 1.75, "deep", [0, -0.12, 0]);
      box(1.3, 1.15, 1.35, "deep", [-2.8, -0.8, 0]);
      box(1, 1.15, 1.35, "deep", [2.8, -0.8, 0]);
      box(7.2, 0.18, 0.3, "silver", [0, 0.14, -0.47]);
      box(7.2, 0.18, 0.3, "silver", [0, 0.14, 0.47]);
      box(1.5, 1.5, 1.6, "sage", [-2.8, 0.9, 0]);
      box(1.62, 0.13, 1.72, "deep", [-2.8, 1.7, 0]);
      box(0.5, 0.65, 0.08, "deep", [-2.9, 1.05, 0.84]);
      cylinder(0.095, 0.09, "lime", [-3, 1.2, 0.92], "z");
      cylinder(0.07, 0.09, "dark", [-2.8, 0.9, 0.92], "z");
      cylinder(0.37, 0.28, "dark", [-1.98, 1.25, 0]);
      cylinder(0.51, 0.37, "silver", [-1.72, 1.25, 0]);
      cylinder(0.23, 0.39, "dark", [-1.7, 1.25, 0]);
      for (let i = 0; i < 3; i++) {
        const angle = (i * Math.PI * 2) / 3;
        const jaw = box(0.22, 0.15, 0.3, "silver", [
          -1.47,
          1.25 + Math.cos(angle) * 0.32,
          Math.sin(angle) * 0.32,
        ]);
        jaw.rotation.x = -angle;
      }
      cylinder(0.19, 2.62, "silver", [-0.04, 1.25, 0]);
      cylinder(0.24, 0.65, "silver", [-0.77, 1.25, 0]);
      box(1.4, 0.26, 1.45, "sage", [0.13, 0.4, 0.17]);
      box(0.85, 0.2, 0.85, "silver", [0.13, 0.62, 0.46]);
      box(0.44, 0.54, 0.43, "deep", [0.13, 0.97, 0.46]);
      box(0.14, 0.12, 0.58, "silver", [0.13, 1.25, 0.55]);
      box(0.15, 0.09, 0.12, "lime", [0.13, 1.25, 0.25]);
      cylinder(0.06, 6.45, "silver", [0, -0.04, 0.83]);
      wheel([0.1, 0.35, 1.04], 0.28);
      box(0.9, 0.37, 1.35, "sage", [2.55, 0.39, 0]);
      box(0.84, 0.7, 0.76, "sage", [2.55, 0.92, 0]);
      cylinder(0.21, 0.8, "silver", [2, 1.25, 0]);
      cylinder(0.02, 0.35, "silver", [1.45, 1.25, 0], "x", 0.16);
      cylinder(0.1, 0.45, "silver", [3.13, 1.25, 0]);
      wheel([3.41, 1.25, 0], 0.29, "x");
      bolts([
        [-2.4, 1.79, -0.5],
        [-3.2, 1.79, -0.5],
        [-2.4, 1.79, 0.5],
        [-3.2, 1.79, 0.5],
      ]);
    } else if (kind === "shaft") {
      cylinder(0.57, 3.6, "silver", [0, 0, 0]);
      cylinder(0.85, 0.345, "silver", [-2.2275, 0, 0]);
      cylinder(0.85, 0.305, "silver", [-0.9525, 0, 0]);
      const keyway = new THREE.Shape();
      const slotHalf = 0.075,
        journalRadius = 0.85;
      const slotTop = Math.sqrt(journalRadius ** 2 - slotHalf ** 2);
      keyway.moveTo(-slotHalf, slotTop);
      keyway.lineTo(-slotHalf, 0.69);
      keyway.lineTo(slotHalf, 0.69);
      keyway.lineTo(slotHalf, slotTop);
      const slotAngle = Math.atan2(slotTop, slotHalf);
      keyway.absarc(0, 0, journalRadius, slotAngle, Math.PI - slotAngle, true);
      keyway.closePath();
      add(
        new THREE.ExtrudeGeometry(keyway, { depth: 0.95, bevelEnabled: false }),
        "silver",
        [-2.055, 0, 0],
        [0, Math.PI / 2, 0],
      );
      cylinder(1, 0.35, "sage", [-2.55, 0, 0]);
      cylinder(0.39, 1.5, "silver", [2.55, 0, 0]);
      cylinder(0.39, 0.14, "silver", [3.37, 0, 0], "x", 0.32);
      class ThreadCurve extends THREE.Curve<THREE.Vector3> {
        constructor() {
          super();
        }
        getPoint(t: number, target = new THREE.Vector3()) {
          const angle = t * Math.PI * 24;
          return target.set(
            2.35 + t * 0.84,
            Math.cos(angle) * 0.391,
            Math.sin(angle) * 0.391,
          );
        }
      }
      add(
        new THREE.TubeGeometry(new ThreadCurve(), 240, 0.018, 5, false),
        "silver",
        [0, 0, 0],
      );
      cylinder(0.085, 0.025, "dark", [3.45, 0, 0]);
    } else if (kind === "flange") {
      const shape = new THREE.Shape();
      shape.absarc(0, 0, 2.1, 0, Math.PI * 2, false);
      const bore = new THREE.Path();
      bore.absarc(0, 0, 0.56, 0, Math.PI * 2, true);
      shape.holes.push(bore);
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI) / 3;
        const hole = new THREE.Path();
        hole.absarc(
          Math.cos(a) * 1.55,
          Math.sin(a) * 1.55,
          0.19,
          0,
          Math.PI * 2,
          true,
        );
        shape.holes.push(hole);
      }
      const plate = add(
        new THREE.ExtrudeGeometry(shape, {
          depth: 0.38,
          bevelEnabled: true,
          bevelSegments: 2,
          steps: 1,
          bevelSize: 0.035,
          bevelThickness: 0.035,
        }),
        "silver",
        [0, -0.19, 0],
        [-Math.PI / 2, 0, 0],
      );
      plate.userData.explodeAxis = "y";
      const hubShape = new THREE.Shape();
      hubShape.absarc(0, 0, 0.94, 0, Math.PI * 2, false);
      const hubBore = new THREE.Path();
      hubBore.absarc(0, 0, 0.56, 0, Math.PI * 2, true);
      hubShape.holes.push(hubBore);
      add(
        new THREE.ExtrudeGeometry(hubShape, {
          depth: 0.85,
          bevelEnabled: true,
          bevelSegments: 2,
          steps: 1,
          bevelSize: 0.035,
          bevelThickness: 0.035,
        }),
        "sage",
        [0, 0.19, 0],
        [-Math.PI / 2, 0, 0],
      );
    } else if (kind === "bracket") {
      const base = new THREE.Shape();
      base.moveTo(-2, -1.5);
      base.lineTo(2, -1.5);
      base.lineTo(2, 1.5);
      base.lineTo(-2, 1.5);
      base.closePath();
      for (const x of [-1.3, 1.3]) {
        const hole = new THREE.Path();
        hole.absarc(x, 0.6, 0.23, 0, Math.PI * 2, true);
        base.holes.push(hole);
      }
      add(
        new THREE.ExtrudeGeometry(base, {
          depth: 0.3,
          bevelEnabled: true,
          bevelSize: 0.035,
          bevelThickness: 0.035,
          bevelSegments: 1,
        }),
        "silver",
        [0, -1.1, 0],
        [Math.PI / 2, 0, 0],
      );
      const upright = new THREE.Shape();
      upright.moveTo(-2, -1.1);
      upright.lineTo(2, -1.1);
      upright.lineTo(2, 1.7);
      upright.lineTo(-2, 1.7);
      upright.closePath();
      for (const x of [-1.3, 1.3]) {
        const h = new THREE.Path();
        h.absarc(x, 0.9, 0.23, 0, Math.PI * 2, true);
        upright.holes.push(h);
      }
      add(
        new THREE.ExtrudeGeometry(upright, {
          depth: 0.32,
          bevelEnabled: true,
          bevelSize: 0.025,
          bevelThickness: 0.025,
          bevelSegments: 1,
        }),
        "sage",
        [0, 0, -1.48],
      );
      const rib = new THREE.Shape();
      rib.moveTo(-0.9, -1.1);
      rib.lineTo(1.16, -1.1);
      rib.lineTo(1.16, 1.3);
      rib.closePath();
      add(
        new THREE.ExtrudeGeometry(rib, { depth: 0.24, bevelEnabled: false }),
        "deep",
        [-0.12, 0, 0],
        [0, Math.PI / 2, 0],
      );
    } else {
      box(5, 0.35, 2.7, "deep", [0, -0.8, 0]);
      box(4.5, 0.22, 1.5, "silver", [0, -0.5, 0]);
      box(1, 1.18, 2.05, "sage", [-1.8, 0.02, 0]);
      box(0.8, 1.05, 2.05, "sage", [0.8, -0.04, 0]);
      box(0.14, 0.5, 2.05, "silver", [-1.22, 0.35, 0]);
      box(0.14, 0.5, 2.05, "silver", [0.33, 0.35, 0]);
      box(1.41, 0.75, 1.28, "lime", [-0.445, 0.21, 0]);
      box(1.41, 0.23, 0.12, "silver", [-0.445, -0.275, -0.45]);
      box(1.41, 0.23, 0.12, "silver", [-0.445, -0.275, 0.45]);
      cylinder(0.14, 3.2, "silver", [1.05, -0.2, 0]);
      for (let i = 0; i < 18; i++)
        cylinder(0.17, 0.045, "dark", [0.8 + i * 0.09, -0.2, 0]);
      cylinder(0.23, 0.4, "silver", [2.85, -0.2, 0]);
      cylinder(0.07, 1.6, "silver", [3.1, -0.2, 0], "y");
      cylinder(0.12, 0.15, "dark", [3.1, 0.65, 0], "y");
      cylinder(0.12, 0.15, "dark", [3.1, -1.05, 0], "y");
      bolts([
        [-2.1, -0.6, 1.05],
        [-2.1, -0.6, -1.05],
        [2.1, -0.6, 1.05],
        [2.1, -0.6, -1.05],
      ]);
    }
    const bounds = new THREE.Box3().setFromObject(group);
    const center = bounds.getCenter(new THREE.Vector3());
    const size = bounds.getSize(new THREE.Vector3());
    const radius = size.length() / 2;
    controls.target.copy(center);
    const floorY = bounds.min.y - 0.08;
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(200, 200),
      new THREE.ShadowMaterial({ color: 0x243447, opacity: 0.14 }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = floorY;
    ground.receiveShadow = true;
    scene.add(ground);
    scene.add(new THREE.AmbientLight(0xf2f5f8, 1.7));
    const key = new THREE.DirectionalLight(0xffffff, 4);
    key.position.set(-5, 10, 7);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.left = -9;
    key.shadow.camera.right = 9;
    key.shadow.camera.top = 9;
    key.shadow.camera.bottom = -9;
    key.shadow.bias = -0.001;
    key.shadow.normalBias = 0.02;
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xd7e5f4, 2.3);
    rim.position.set(3, 4, -6);
    scene.add(rim);
    const fill = new THREE.DirectionalLight(0xadc6d4, 1);
    fill.position.set(5, 0, 7);
    scene.add(fill);
    const anchorPositions: Record<ModelKind, [number, number, number][]> = {
      pocket: [
        [3.5, 0.5, 1.5],
        [2.45, 1.5, 1.2],
        [2.45, 0.3, 0],
        [0, -0.5, 0],
      ],
      lathe: [
        [-2.8, 1.65, 0.82],
        [-1.47, 1.52, 0.26],
        [0.13, 0.6, 1],
        [2.55, 1.25, 0.4],
      ],
      shaft: [
        [3.46, 0.04, 0],
        [-1.6, 0.45, 0.72],
        [-0.8, 0.44, 0.67],
        [-1.55, 0.85, 0],
      ],
      flange: [
        [1.7, 0.23, 0.7],
        [0.55, 1.06, 0.73],
        [1.55, 0.23, 0],
        [0, 1.15, 0],
      ],
      bracket: [
        [1, -1.06, 0.4],
        [0.7, 1.3, -1.12],
        [1.3, 0.9, -1.12],
        [0.14, -0.2, -0.4],
      ],
      vice: [
        [-1.15, 0.54, 0.8],
        [0.26, 0.52, 0.8],
        [2, -0.1, 0.16],
        [1, -0.61, 1.3],
      ],
    };
    const anchors = (part ? [] : anchorPositions[kind]).map((position) => {
      const point = new THREE.Vector3(...position);
      let closest = parts[0];
      let distance = Infinity;
      parts.forEach((part) => {
        const bounds = new THREE.Box3().setFromObject(part);
        const candidate = bounds.distanceToPoint(point);
        if (candidate < distance) {
          closest = part;
          distance = candidate;
        }
      });
      return { point, part: closest };
    });
    function render() {
      renderer.render(scene, camera);
      anchors.forEach((anchor, i) => {
        const marker = markers.current[i];
        if (!marker) return;
        const point = anchor.point
          .clone()
          .add(anchor.part.position)
          .sub(anchor.part.userData.home as THREE.Vector3);
        point.project(camera);
        marker.style.left = `${((point.x + 1) * host!.clientWidth) / 2}px`;
        marker.style.top = `${((1 - point.y) * host!.clientHeight) / 2}px`;
        marker.style.visibility =
          point.z > -1 &&
          point.z < 1 &&
          Math.abs(point.x) < 0.95 &&
          Math.abs(point.y) < 0.9
            ? "visible"
            : "hidden";
      });
    }
    function resetView(isFront = false) {
      const fit = radius / Math.sin(THREE.MathUtils.degToRad(17));
      const aspect = host!.clientWidth / Math.max(host!.clientHeight, 1);
      const distance = fit * (aspect < 1.3 ? 1.16 : 0.81);
      const direction = isFront
        ? new THREE.Vector3(0, 0.2, 1)
        : new THREE.Vector3(
            part?.kind === "turned" ? -1 : 1,
            0.68,
            1.1,
          ).normalize();
      camera.position.copy(center).addScaledVector(direction, distance);
      controls.target.copy(center);
      controls.minDistance = radius * 1.2;
      controls.maxDistance = radius * 7;
      camera.updateProjectionMatrix();
      controls.update();
      render();
    }
    function resize() {
      const w = host!.clientWidth,
        h = host!.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      render();
    }
    const observer = new ResizeObserver(resize);
    observer.observe(host);
    resize();
    resetView();
    controls.addEventListener("change", render);
    const handleContextLost = (event: Event) => {
      event.preventDefault();
      setFailed(true);
    };
    renderer.domElement.addEventListener("webglcontextlost", handleContextLost);
    actions.current = {
      reset: () => resetView(),
      front: () => resetView(true),
      navigate: (key) => {
        const offset = camera.position.clone().sub(controls.target);
        const spherical = new THREE.Spherical().setFromVector3(offset);
        if (key === "ArrowLeft") spherical.theta -= 0.12;
        if (key === "ArrowRight") spherical.theta += 0.12;
        if (key === "ArrowUp") spherical.phi -= 0.12;
        if (key === "ArrowDown") spherical.phi += 0.12;
        if (key === "+" || key === "=") spherical.radius *= 0.9;
        if (key === "-") spherical.radius *= 1.1;
        spherical.phi = THREE.MathUtils.clamp(
          spherical.phi,
          controls.minPolarAngle,
          controls.maxPolarAngle,
        );
        spherical.radius = THREE.MathUtils.clamp(
          spherical.radius,
          controls.minDistance,
          controls.maxDistance,
        );
        camera.position
          .copy(controls.target)
          .add(new THREE.Vector3().setFromSpherical(spherical));
        controls.update();
        render();
      },
      wire: (value) => {
        parts.forEach((part) => {
          part.material.wireframe = value;
        });
        render();
      },
      explode: (value) => {
        parts.forEach((part) => {
          const home = part.userData.home as THREE.Vector3;
          part.position.copy(home);
          if (value) {
            part.position.x += (home.x - center.x) * 0.24;
            part.position.y += (home.y - center.y) * 0.6 + 0.15;
            part.position.z += (home.z - center.z) * 0.5;
          }
        });
        render();
      },
    };
    return () => {
      observer.disconnect();
      controls.removeEventListener("change", render);
      controls.dispose();
      renderer.domElement.removeEventListener(
        "webglcontextlost",
        handleContextLost,
      );
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Line) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material)
            ? object.material
            : [object.material];
          materials.forEach((material) => material.dispose());
        }
      });
      Object.values(materials).forEach((material) => material.dispose());
      key.shadow.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      actions.current = null;
    };
  }, [kind, part]);
  return (
    <div className={`model-viewer ${compact ? "model-compact" : ""}`}>
      <div className="model-topline">
        <Box size={15} />
        <span>{uk ? "Навчальна 3D-модель" : "Learning 3D model"}</span>
      </div>
      <div
        className="model-canvas"
        ref={mount}
        role="img"
        tabIndex={0}
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
            ].includes(event.key)
          ) {
            event.preventDefault();
            actions.current?.navigate(event.key);
          }
        }}
        aria-label={`${modelName}. ${uk ? "Обертайте перетягуванням або стрілками, масштабуйте прокручуванням або клавішами плюс і мінус." : "Drag or use arrow keys to orbit; scroll or use plus and minus to zoom."}`}
      >
        {!part &&
          !compact &&
          !failed &&
          labels[kind][lang].map((label, i) => (
            <span
              className="model-marker"
              key={i}
              title={label}
              ref={(element) => {
                markers.current[i] = element;
              }}
              aria-hidden="true"
            >
              {String(i + 1).padStart(2, "0")}
            </span>
          ))}
        {failed && (
          <div className="model-fallback">
            <Box size={42} strokeWidth={1.2} />
            <p>
              {uk
                ? "3D недоступне в цьому браузері"
                : "3D is unavailable in this browser"}
            </p>
            <small>
              {uk
                ? "Інструкції та креслення можна переглядати без WebGL."
                : "Guides and drawings are available without WebGL."}
            </small>
          </div>
        )}
      </div>
      {!part && !compact && (
        <div className="model-legend">
          {labels[kind][lang].map((label, i) => (
            <span key={label}>
              <b>{String(i + 1).padStart(2, "0")}</b>
              {label}
            </span>
          ))}
        </div>
      )}
      {part && !compact && (
        <div className="model-specs">
          {partDimensions(part, lang).map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
      )}
      <div className="model-bottom">
        <div className="model-caption">
          <span>{modelName}</span>
          <small>
            {part
              ? uk
                ? "Номінальна геометрія · розміри в мм"
                : "Nominal geometry · dimensions in mm"
              : uk
                ? "Навчальна геометрія · не в масштабі"
                : "Learning geometry · not to scale"}
          </small>
        </div>
        <div className="model-controls">
          {!compact && (
            <button
              type="button"
              onClick={() => {
                const next = !front;
                setFront(next);
                if (next) actions.current?.front();
                else actions.current?.reset();
              }}
              title={
                uk ? "Вигляд спереду / ізометрія" : "Front / isometric view"
              }
              aria-label={
                uk ? "Вигляд спереду / ізометрія" : "Front / isometric view"
              }
              aria-pressed={front}
              disabled={failed}
            >
              <ScanLine size={16} />
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              const next = !wireframe;
              setWireframe(next);
              actions.current?.wire(next);
            }}
            title={uk ? "Показати каркас" : "Show wireframe"}
            aria-label={uk ? "Показати каркас" : "Show wireframe"}
            aria-pressed={wireframe}
            disabled={failed}
          >
            <Box size={16} />
          </button>
          {!part && !compact && (kind === "lathe" || kind === "vice") && (
            <button
              type="button"
              onClick={() => {
                const next = !exploded;
                setExploded(next);
                actions.current?.explode(next);
              }}
              title={uk ? "Рознесений вигляд" : "Exploded view"}
              aria-label={uk ? "Рознесений вигляд" : "Exploded view"}
              aria-pressed={exploded}
              disabled={failed}
            >
              <Layers3 size={16} />
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              actions.current?.reset();
              setFront(false);
            }}
            title={uk ? "Скинути ракурс" : "Reset view"}
            aria-label={uk ? "Скинути ракурс" : "Reset view"}
            disabled={failed}
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>
      <span className="model-hint">
        {uk
          ? "Перетягування — обертати · прокручування — масштаб"
          : "Drag to orbit · scroll to zoom"}
      </span>
      {part && (
        <p className="model-geometry-note">
          {uk
            ? "Числові діаметри, уступи, отвори, кишені та пази відтворено за геометрією проєкту. Різьба й малі фаски умовні; допуски та приймання визначає таблиця вимог."
            : "Numeric diameters, shoulders, holes, pockets and slots follow the project geometry. Threads and small chamfers are symbolic; tolerances and acceptance follow the requirements table."}
        </p>
      )}
      {!part && kind === "pocket" && (
        <p className="model-geometry-note">
          {uk
            ? "Кишеня 50 × 30 × 20 мм. Радіуси кутів показано умовно та потрібно узгодити з інструментом."
            : "Pocket 50 × 30 × 20 mm. Corner radii are illustrative and must be agreed for the selected tool."}
        </p>
      )}
    </div>
  );
}
