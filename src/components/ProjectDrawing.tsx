import { useId } from "react";
import polygonClipping from "polygon-clipping";
import type { Pair, MultiPolygon } from "polygon-clipping";
import type { ReactNode } from "react";
import type {
  BlockGeometry,
  HoleGeometry,
  Lang,
  PartGeometry,
  Project,
  ProjectFeature,
  Text,
  TurnedGeometry,
} from "../data/types";
import "./ProjectDrawing.css";

interface Props {
  project: Project;
  lang: Lang;
  compact?: boolean;
}
interface GeometryProps {
  geometry: PartGeometry;
  lang: Lang;
  title?: Text;
  compact?: boolean;
  features?: ProjectFeature[];
}
interface ViewProps {
  geometry: PartGeometry;
  lang: Lang;
  compact: boolean;
  uid: string;
  features: ProjectFeature[];
}
const phrase = (lang: Lang, uk: string, en: string) =>
  lang === "uk" ? uk : en;
const n = (value: number) => Number(value.toFixed(3)).toString();
const totalLength = (part: TurnedGeometry) =>
  part.sections.reduce((sum, section) => sum + section.length, 0);
const maxDiameter = (part: TurnedGeometry) =>
  Math.max(...part.sections.map((section) => section.diameter));
function labelFor(features: ProjectFeature[], path: string, fallback: string) {
  const feature = features.find((f) => f.geometryRef === path);
  return feature ? `${fallback} [${feature.id}]` : fallback;
}
function H({
  x1,
  x2,
  y,
  edge,
  label,
  uid,
}: {
  x1: number;
  x2: number;
  y: number;
  edge: number;
  label: string;
  uid: string;
}) {
  return (
    <g className="project-drawing-dimension">
      <path d={`M${x1},${edge}V${y + 7}M${x2},${edge}V${y + 7}`} />
      <path
        d={`M${x1},${y}H${x2}`}
        markerStart={`url(#${uid}-arrow)`}
        markerEnd={`url(#${uid}-arrow)`}
      />
      <text x={(x1 + x2) / 2} y={y - 9} textAnchor="middle">
        {label}
      </text>
    </g>
  );
}
function V({
  y1,
  y2,
  x,
  edge,
  label,
  uid,
}: {
  y1: number;
  y2: number;
  x: number;
  edge: number;
  label: string;
  uid: string;
}) {
  const y = (y1 + y2) / 2;
  return (
    <g className="project-drawing-dimension">
      <path d={`M${edge},${y1}H${x + 7}M${edge},${y2}H${x + 7}`} />
      <path
        d={`M${x},${y1}V${y2}`}
        markerStart={`url(#${uid}-arrow)`}
        markerEnd={`url(#${uid}-arrow)`}
      />
      <text
        x={x - 10}
        y={y}
        textAnchor="middle"
        transform={`rotate(-90 ${x - 10} ${y})`}
      >
        {label}
      </text>
    </g>
  );
}
function Center({
  x,
  y,
  w,
  h,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
}) {
  return (
    <path
      className="project-drawing-center"
      d={`M${x - w / 2},${y}h${w}M${x},${y - h / 2}v${h}`}
    />
  );
}
function Datum({
  x,
  y,
  label,
  axis = "x",
}: {
  x: number;
  y: number;
  label: string;
  axis?: "x" | "y";
}) {
  return (
    <g className="project-drawing-datum">
      {axis === "x" ? (
        <path d={`M${x},${y}l-9,-5v10Z`} />
      ) : (
        <path d={`M${x},${y}l-5,9h10Z`} />
      )}
      <rect
        x={axis === "x" ? x - 36 : x - 10}
        y={axis === "x" ? y - 10 : y + 17}
        width={20}
        height={20}
      />
      <text
        x={axis === "x" ? x - 26 : x}
        y={axis === "x" ? y + 5 : y + 32}
        textAnchor="middle"
      >
        {label}
      </text>
    </g>
  );
}
function Leader({
  points,
  x,
  y,
  children,
}: {
  points: string;
  x: number;
  y: number;
  children: ReactNode;
}) {
  return (
    <g className="project-drawing-dimension">
      <polyline points={points} />
      <text x={x} y={y}>
        {children}
      </text>
    </g>
  );
}
function ViewTitle({
  x,
  y,
  children,
}: {
  x: number;
  y: number;
  children: ReactNode;
}) {
  return (
    <text
      className="project-drawing-view-label"
      x={x}
      y={y}
      textAnchor="middle"
    >
      {children}
    </text>
  );
}
function holeNote(hole: HoleGeometry) {
  return `${hole.thread || `Ø${n(hole.diameter)}`}${hole.depth === undefined ? "" : ` ↧${n(hole.depth)}`}${hole.counterbore ? ` · ⌴ Ø${n(hole.counterbore.diameter)} ↧${n(hole.counterbore.depth)}` : ""}`;
}

function rectangle(
  x: number,
  y: number,
  width: number,
  height: number,
): Pair[] {
  return [
    [x, y],
    [x + width, y],
    [x + width, y + height],
    [x, y + height],
  ];
}
function sectionSvg(
  outer: Pair[],
  cuts: Pair[][],
  project: (p: Pair) => Pair,
): string {
  const polygons: MultiPolygon = cuts.length
    ? polygonClipping.difference([outer], ...cuts.map((ring) => [ring]))
    : [[outer]];
  return polygons
    .map((poly) =>
      poly
        .map(
          (ring) =>
            ring
              .map((p, i) => `${i ? "L" : "M"}${project(p).join(",")}`)
              .join(" ") + "Z",
        )
        .join(" "),
    )
    .join(" ");
}
function turnedSection(
  part: TurnedGeometry,
  left: number,
  cy: number,
  scale: number,
) {
  let cursor = 0;
  const upper: Pair[] = [],
    lower: Pair[] = [];
  part.sections.forEach((section) => {
    upper.push([cursor, section.diameter / 2]);
    cursor += section.length;
    upper.push([cursor, section.diameter / 2]);
  });
  [...part.sections].reverse().forEach((section) => {
    lower.push([cursor, -section.diameter / 2]);
    cursor -= section.length;
    lower.push([cursor, -section.diameter / 2]);
  });
  const length = totalLength(part),
    cuts: Pair[][] = [];
  if (part.bore) {
    cuts.push(
      rectangle(
        0,
        -part.bore.diameter / 2,
        part.bore.depth ?? length,
        part.bore.diameter,
      ),
    );
    if (part.bore.counterbore)
      cuts.push(
        rectangle(
          0,
          -part.bore.counterbore.diameter / 2,
          part.bore.counterbore.depth,
          part.bore.counterbore.diameter,
        ),
      );
  }
  part.holes?.forEach((hole) => {
    const r = hole.diameter / 2;
    if (Math.abs(hole.x) < r) {
      const v = Math.sqrt(r * r - hole.x ** 2);
      cuts.push(rectangle(0, hole.y - v, hole.depth ?? length, v * 2));
    }
    if (hole.counterbore) {
      const r = hole.counterbore.diameter / 2;
      if (Math.abs(hole.x) < r) {
        const v = Math.sqrt(r * r - hole.x ** 2);
        cuts.push(rectangle(0, hole.y - v, hole.counterbore.depth, v * 2));
      }
    }
  });
  return sectionSvg([...upper, ...lower], cuts, (p) => [
    left + p[0] * scale,
    cy - p[1] * scale,
  ]);
}
function blockSection(
  part: BlockGeometry,
  axis: "x" | "y",
  offset: number,
  left: number,
  top: number,
  scale: number,
) {
  const width = axis === "x" ? part.width : part.depth,
    cuts: Pair[][] = [];
  part.pockets?.forEach((p) => {
    const transformed =
        axis === "x"
          ? p
          : { ...p, x: p.y, y: p.x, width: p.depth, depth: p.width },
      bounds = roundedSection(transformed, offset);
    if (bounds)
      cuts.push(
        rectangle(
          bounds[0],
          part.height - p.cutDepth,
          bounds[1] - bounds[0],
          p.cutDepth,
        ),
      );
  });
  part.holes?.forEach((hole) => {
    const delta = offset - (axis === "x" ? hole.y : hole.x),
      center = axis === "x" ? hole.x : hole.y,
      r = hole.diameter / 2;
    if (Math.abs(delta) < r) {
      const half = Math.sqrt(r * r - delta * delta);
      cuts.push(
        rectangle(
          center - half,
          part.height - (hole.depth ?? part.height),
          half * 2,
          hole.depth ?? part.height,
        ),
      );
    }
    if (hole.counterbore) {
      const r = hole.counterbore.diameter / 2;
      if (Math.abs(delta) < r) {
        const half = Math.sqrt(r * r - delta * delta);
        cuts.push(
          rectangle(
            center - half,
            part.height - hole.counterbore.depth,
            half * 2,
            hole.counterbore.depth,
          ),
        );
      }
    }
  });
  part.slots?.forEach((slot) => {
    const parallel = slot.axis === axis,
      center = axis === "x" ? slot.x : slot.y,
      delta = Math.abs(offset - (axis === "x" ? slot.y : slot.x)),
      r = slot.width / 2,
      straight = (slot.length - slot.width) / 2;
    if (parallel) {
      if (delta > r) return;
      const half = straight + Math.sqrt(Math.max(0, r * r - delta * delta));
      cuts.push(
        rectangle(
          center - half,
          part.height - slot.cutDepth,
          half * 2,
          slot.cutDepth,
        ),
      );
    } else {
      if (delta > straight + r) return;
      const half =
        delta <= straight
          ? r
          : Math.sqrt(Math.max(0, r * r - (delta - straight) ** 2));
      cuts.push(
        rectangle(
          center - half,
          part.height - slot.cutDepth,
          half * 2,
          slot.cutDepth,
        ),
      );
    }
  });
  return sectionSvg(rectangle(0, 0, width, part.height), cuts, (p) => [
    left + p[0] * scale,
    top + (part.height - p[1]) * scale,
  ]);
}
function TurnedView({ geometry, lang, compact, uid, features }: ViewProps) {
  const part = geometry as TurnedGeometry,
    L = totalLength(part),
    D = maxDiameter(part);
  const scale = compact
    ? Math.min(275 / L, 130 / D)
    : Math.min(520 / L, 205 / D);
  const left = compact ? 58 : 90,
    cy = compact ? 130 : 225;
  const top = cy - (D * scale) / 2,
    bottom = cy + (D * scale) / 2;
  const right = left + L * scale;
  const outline = turnedSection(part, left, cy, scale);
  const endX = compact ? 0 : 810,
    endY = 225,
    endScale = Math.min(190 / D, 3.8);
  return (
    <>
      <path d={outline} fill={`url(#${uid}-hatch)`} />
      <Center x={(left + right) / 2} y={cy} w={right - left + 35} h={0} />
      <H
        x1={left}
        x2={right}
        y={compact ? 230 : 425}
        edge={bottom}
        label={labelFor(features, "length", n(L))}
        uid={uid}
      />
      <V
        y1={top}
        y2={bottom}
        x={compact ? 29 : 46}
        edge={left}
        label={`Ø${n(D)}`}
        uid={uid}
      />
      {!compact && (
        <>
          <Datum x={left} y={cy + (D * scale) / 2 - 15} label="A" />
          <ViewTitle x={(left + right) / 2} y={480}>
            {phrase(
              lang,
              "ПОЗДОВЖНІЙ РОЗРІЗ ЧЕРЕЗ ВІСЬ",
              "LONGITUDINAL SECTION THROUGH THE AXIS",
            )}
          </ViewTitle>
        </>
      )}
      {part.sections.length > 1 &&
        !compact &&
        (() => {
          let x = left;
          return part.sections.map((section, i) => {
            const x1 = x;
            x += section.length * scale;
            return (
              <g key={i}>
                <H
                  x1={x1}
                  x2={x}
                  y={92}
                  edge={cy - (section.diameter * scale) / 2}
                  label={labelFor(
                    features,
                    `sections.${i}.length`,
                    n(section.length),
                  )}
                  uid={uid}
                />
                <text
                  x={(x1 + x) / 2}
                  y={cy - (section.diameter * scale) / 2 - 16}
                  textAnchor="middle"
                  className="project-drawing-blue-label"
                >
                  {labelFor(
                    features,
                    `sections.${i}.diameter`,
                    `Ø${n(section.diameter)}`,
                  )}
                </text>
              </g>
            );
          });
        })()}
      {part.sections.length === 1 && (
        <text
          className="project-drawing-blue-label"
          x={(left + right) / 2}
          y={top - 18}
          textAnchor="middle"
        >
          {labelFor(
            features,
            "sections.0.diameter",
            `Ø${n(part.sections[0].diameter)}`,
          )}
        </text>
      )}
      {part.bore && (
        <Leader
          points={`${left + Math.min(part.bore.depth ?? L, L) * scale * 0.55},${cy + (part.bore.diameter * scale) / 2} ${left + 55},${compact ? 190 : 345} ${left + 145},${compact ? 190 : 345}`}
          x={left + 150}
          y={compact ? 196 : 351}
        >
          {part.bore.thread ||
            labelFor(features, "bore.diameter", `Ø${n(part.bore.diameter)}`)}
        </Leader>
      )}
      {!compact && (
        <>
          {[...new Set(part.sections.map((s) => s.diameter))]
            .sort((a, b) => b - a)
            .map((d) => (
              <circle
                key={d}
                cx={endX}
                cy={endY}
                r={(d * endScale) / 2}
                className={
                  d < part.sections[0].diameter ? "project-drawing-hidden" : ""
                }
              />
            ))}
          {part.bore && (
            <circle
              cx={endX}
              cy={endY}
              r={(part.bore.diameter * endScale) / 2}
            />
          )}
          {part.bore?.counterbore && (
            <circle
              cx={endX}
              cy={endY}
              r={(part.bore.counterbore.diameter * endScale) / 2}
            />
          )}
          {(part.holes || []).map((hole, i) => (
            <g key={i}>
              <circle
                cx={endX + hole.x * endScale}
                cy={endY - hole.y * endScale}
                r={(hole.diameter * endScale) / 2}
              />
              {hole.counterbore && (
                <circle
                  cx={endX + hole.x * endScale}
                  cy={endY - hole.y * endScale}
                  r={(hole.counterbore.diameter * endScale) / 2}
                />
              )}
              <Center
                x={endX + hole.x * endScale}
                y={endY - hole.y * endScale}
                w={hole.diameter * endScale + 14}
                h={hole.diameter * endScale + 14}
              />
              <text
                className="project-drawing-hole-index"
                x={
                  endX + hole.x * endScale + (hole.diameter * endScale) / 2 + 6
                }
                y={endY - hole.y * endScale - 7}
              >
                H{i + 1}
              </text>
            </g>
          ))}
          <Center
            x={endX}
            y={endY}
            w={D * endScale + 35}
            h={D * endScale + 35}
          />
          <ViewTitle x={endX} y={480}>
            {phrase(lang, "ВИД ІЗ ТОРЦЯ A", "VIEW FROM FACE A")}
          </ViewTitle>
        </>
      )}
      {part.externalThread && (
        <Leader
          points={`${left + (part.externalThread.from + part.externalThread.length / 2) * scale},${cy - (D * scale) / 2} ${left + (L * scale) / 2},${compact ? 40 : 42}`}
          x={left + (L * scale) / 2 + 8}
          y={compact ? 43 : 47}
        >
          {part.externalThread.designation}
        </Leader>
      )}
    </>
  );
}

function roundedSection(
  pocket: NonNullable<BlockGeometry["pockets"]>[number],
  y: number,
) {
  if (y < pocket.y || y > pocket.y + pocket.depth) return null;
  const r = pocket.cornerRadius;
  let inset = 0;
  if (r > 0 && y < pocket.y + r)
    inset = r - Math.sqrt(Math.max(0, r * r - (y - pocket.y - r) ** 2));
  if (r > 0 && y > pocket.y + pocket.depth - r)
    inset =
      r -
      Math.sqrt(Math.max(0, r * r - (y - pocket.y - pocket.depth + r) ** 2));
  return [pocket.x + inset, pocket.x + pocket.width - inset];
}
function slotPath(
  slot: NonNullable<BlockGeometry["slots"]>[number],
  left: number,
  top: number,
  depth: number,
  scale: number,
) {
  const horizontal = slot.axis === "x",
    w = (horizontal ? slot.length : slot.width) * scale,
    h = (horizontal ? slot.width : slot.length) * scale;
  return (
    <rect
      x={left + slot.x * scale - w / 2}
      y={top + (depth - slot.y) * scale - h / 2}
      width={w}
      height={h}
      rx={(slot.width * scale) / 2}
      className="project-drawing-pocket"
    />
  );
}
function BlockView({ geometry, lang, compact, uid, features }: ViewProps) {
  const part = geometry as BlockGeometry;
  const scale = compact
    ? Math.min(285 / part.width, 155 / part.depth)
    : Math.min(460 / part.width, 220 / part.depth, 125 / part.height);
  const left = compact ? 58 : 95,
    top = compact ? 50 : 100,
    w = part.width * scale,
    d = part.depth * scale;
  const bottom = top + d;
  const sectionY = part.pockets?.length
    ? part.pockets[0].y + part.pockets[0].depth / 2
    : (part.slots?.[0]?.y ?? part.holes?.[0]?.y ?? part.depth / 2);
  const sy = compact ? 0 : 455,
    sh = part.height * scale;
  return (
    <>
      <rect
        x={left}
        y={top}
        width={w}
        height={d}
        rx={(part.cornerRadius || 0) * scale}
        fill="#f7f9fc"
      />
      {(part.pockets || []).map((p, i) => (
        <g key={i}>
          <rect
            x={left + p.x * scale}
            y={top + (part.depth - p.y - p.depth) * scale}
            width={p.width * scale}
            height={p.depth * scale}
            rx={p.cornerRadius * scale}
            className="project-drawing-pocket"
          />
          <text
            x={left + (p.x + p.width / 2) * scale}
            y={top + (part.depth - p.y - p.depth / 2) * scale - 4}
            textAnchor="middle"
            className="project-drawing-hole-index"
          >
            P{i + 1}
          </text>
          {!compact && (
            <text
              x={left + (p.x + p.width / 2) * scale}
              y={top + (part.depth - p.y - p.depth / 2) * scale + 17}
              textAnchor="middle"
              className="project-drawing-pocket-label"
            >
              {n(p.width)} × {n(p.depth)} · ↧{n(p.cutDepth)} · R
              {n(p.cornerRadius)}
            </text>
          )}
        </g>
      ))}
      {(part.slots || []).map((slot, i) => (
        <g key={i}>
          {slotPath(slot, left, top, part.depth, scale)}
          <text
            x={left + slot.x * scale}
            y={top + (part.depth - slot.y) * scale + 5}
            textAnchor="middle"
            className="project-drawing-hole-index"
          >
            S{i + 1}
          </text>
        </g>
      ))}
      {(part.holes || []).map((hole, i) => {
        const x = left + hole.x * scale,
          y = top + (part.depth - hole.y) * scale;
        return (
          <g key={i}>
            <circle cx={x} cy={y} r={(hole.diameter * scale) / 2} />
            {hole.counterbore && (
              <circle
                cx={x}
                cy={y}
                r={(hole.counterbore.diameter * scale) / 2}
              />
            )}
            <Center
              x={x}
              y={y}
              w={(hole.counterbore?.diameter || hole.diameter) * scale + 14}
              h={(hole.counterbore?.diameter || hole.diameter) * scale + 14}
            />
            {!compact && (
              <text
                x={
                  x +
                  ((hole.counterbore?.diameter || hole.diameter) * scale) / 2 +
                  7
                }
                y={y - 7}
                className="project-drawing-hole-index"
              >
                H{i + 1}
              </text>
            )}
          </g>
        );
      })}
      <H
        x1={left}
        x2={left + w}
        y={compact ? 235 : 365}
        edge={bottom}
        label={labelFor(features, "width", n(part.width))}
        uid={uid}
      />
      <V
        y1={top}
        y2={bottom}
        x={compact ? 28 : 48}
        edge={left}
        label={labelFor(features, "depth", n(part.depth))}
        uid={uid}
      />
      {compact ? (
        <text
          x={left + w + 22}
          y={top + d / 2}
          className="project-drawing-note"
        >
          h {n(part.height)}
        </text>
      ) : (
        <>
          <Datum x={left} y={bottom - 15} label="C" />
          <Datum x={left + w * 0.22} y={bottom} label="B" axis="y" />
          <path
            d={`M${left - 5},${top + (part.depth - sectionY) * scale}H${left + w + 5}`}
            className="project-drawing-cutting-plane"
          />
          <text
            x={left + w + 15}
            y={top + (part.depth - sectionY) * scale + 5}
            className="project-drawing-hole-index"
          >
            Q
          </text>
          <ViewTitle x={left + w / 2} y={410}>
            {phrase(lang, "ВИД ЗВЕРХУ · X → · Y ↑", "TOP VIEW · X → · Y ↑")}
          </ViewTitle>
          <path
            d={blockSection(part, "x", sectionY, left, sy, scale)}
            fill={`url(#${uid}-hatch)`}
          />
          <V
            y1={sy}
            y2={sy + sh}
            x={left + w + 45}
            edge={left + w}
            label={labelFor(features, "height", n(part.height))}
            uid={uid}
          />
          <Datum x={left + w * 0.23} y={sy + sh} label="A" axis="y" />
          <ViewTitle x={left + w / 2} y={665}>
            {phrase(
              lang,
              "РОЗРІЗ Q ЧЕРЕЗ ЗАЗНАЧЕНІ ЕЛЕМЕНТИ",
              "SECTION Q THROUGH THE INDICATED FEATURES",
            )}
          </ViewTitle>
          <path
            d={blockSection(part, "y", part.width / 2, 720, top, scale)}
            fill={`url(#${uid}-hatch)`}
          />
          <path
            d={`M${left + w / 2},${top - 9}V${bottom + 9}`}
            className="project-drawing-cutting-plane"
          />
          <text
            x={left + w / 2 + 8}
            y={top - 12}
            className="project-drawing-hole-index"
          >
            R
          </text>
          <H
            x1={720}
            x2={720 + d}
            y={top + sh + 47}
            edge={top + sh}
            label={n(part.depth)}
            uid={uid}
          />
          <V
            y1={top}
            y2={top + sh}
            x={720 + d + 36}
            edge={720 + d}
            label={n(part.height)}
            uid={uid}
          />
          <ViewTitle x={720 + d / 2} y={top + sh + 92}>
            {phrase(lang, "РОЗРІЗ R", "SECTION R")}
          </ViewTitle>
          {(part.cornerRadius || 0) > 0 && (
            <text x={720} y={400} className="project-drawing-note">
              R{n(part.cornerRadius!)}{" "}
              {phrase(lang, "зовнішні кути", "outside corners")}
            </text>
          )}
        </>
      )}
    </>
  );
}
function coordinateRows(geometry: PartGeometry) {
  const rows: { id: string; coordinates: string; description: string }[] = [];
  if (geometry.kind === "turned" && geometry.bore)
    rows.push({
      id: "B0",
      coordinates: "X 0 · Y 0",
      description: holeNote({ x: 0, y: 0, ...geometry.bore }),
    });
  if (geometry.kind === "turned" && geometry.externalThread)
    rows.push({
      id: "T0",
      coordinates: `A + ${n(geometry.externalThread.from)}`,
      description: `${geometry.externalThread.designation} · L ${n(geometry.externalThread.length)}`,
    });
  (geometry.holes || []).forEach((h, i) =>
    rows.push({
      id: `H${i + 1}`,
      coordinates: `X ${n(h.x)} · Y ${n(h.y)}`,
      description: holeNote(h),
    }),
  );
  if (geometry.kind === "block") {
    geometry.pockets?.forEach((p, i) =>
      rows.push({
        id: `P${i + 1}`,
        coordinates: `X ${n(p.x)} · Y ${n(p.y)}`,
        description: `${n(p.width)} × ${n(p.depth)} · ↧${n(p.cutDepth)} · R${n(p.cornerRadius)}`,
      }),
    );
    geometry.slots?.forEach((s, i) =>
      rows.push({
        id: `S${i + 1}`,
        coordinates: `X ${n(s.x)} · Y ${n(s.y)}`,
        description: `${n(s.length)} × ${n(s.width)} · ↧${n(s.cutDepth)} · ${s.axis.toUpperCase()}`,
      }),
    );
  }
  return rows;
}
export function GeometryDrawing({
  geometry,
  lang,
  title,
  compact = false,
  features = [],
}: GeometryProps) {
  const uid = `project-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const name =
    title?.[lang] || phrase(lang, "Геометрія деталі", "Part geometry");
  const hasThread =
    geometry.kind === "turned"
      ? !!(
          geometry.bore?.thread ||
          geometry.externalThread ||
          geometry.holes?.some((h) => h.thread)
        )
      : geometry.holes?.some((h) => h.thread);
  const rows = coordinateRows(geometry);
  return (
    <figure
      className={`project-drawing${compact ? " project-drawing-compact" : ""}`}
    >
      {!compact && (
        <div className="project-drawing-heading">
          <strong>{name}</strong>
          <span>
            {phrase(lang, "Номінальні розміри · мм", "Nominal dimensions · mm")}
          </span>
        </div>
      )}
      {!compact && (
        <p className="project-drawing-scroll-hint">
          {phrase(
            lang,
            "↔ Проведіть убік або прокрутіть, щоб переглянути весь вид.",
            "↔ Swipe sideways or scroll to inspect the full view.",
          )}
        </p>
      )}
      <div
        className="project-drawing-viewport"
        tabIndex={compact ? undefined : 0}
        role={compact ? undefined : "region"}
        aria-label={name}
      >
        <svg
          viewBox={
            compact
              ? "0 0 420 270"
              : geometry.kind === "turned"
                ? "0 0 1000 525"
                : "0 0 1050 700"
          }
          role="img"
          aria-labelledby={`${uid}-title ${uid}-desc`}
        >
          <title id={`${uid}-title`}>{name}</title>
          <desc id={`${uid}-desc`}>
            {phrase(
              lang,
              "Ортогональні види та розрізи побудовані з числової геометрії. Граничні розміри й методи приймання наведені в таблиці вимог.",
              "Orthographic views and sections generated from numeric geometry. Limit dimensions and acceptance methods appear in the requirements table.",
            )}
          </desc>
          <defs>
            <marker
              id={`${uid}-arrow`}
              markerWidth="8"
              markerHeight="8"
              refX="7"
              refY="4"
              orient="auto-start-reverse"
              markerUnits="userSpaceOnUse"
            >
              <path d="M0 0L8 4L0 8Z" fill="#205f9b" />
            </marker>
            <pattern
              id={`${uid}-hatch`}
              width="9"
              height="9"
              patternUnits="userSpaceOnUse"
            >
              <rect width="9" height="9" fill="#f5f7fa" />
              <path
                d="M-2 2L2-2M0 9L9 0M7 11L11 7"
                stroke="#b7c1cc"
                strokeWidth=".8"
              />
            </pattern>
          </defs>
          <style>{`.project-drawing-geometry{fill:none;stroke:#263340;stroke-width:1.6;stroke-linejoin:round}.project-drawing-geometry text{fill:#33404d;stroke:none;font:17px ui-monospace,Consolas,monospace}.project-drawing-dimension{stroke:#205f9b;stroke-width:1;fill:none}.project-drawing-dimension text,.project-drawing-blue-label{fill:#205f9b!important;font-size:18px}.project-drawing-center{fill:none;stroke:#8b97a2;stroke-width:.9;stroke-dasharray:13 4 2 4}.project-drawing-hidden{fill:none;stroke:#8b97a2;stroke-width:1;stroke-dasharray:6 5}.project-drawing-pocket{fill:#edf2f8;stroke:#344e6b;stroke-width:1.5}.project-drawing-geometry .project-drawing-view-label{font-size:13px;fill:#687583}.project-drawing-geometry .project-drawing-note{font-size:16px;fill:#536170}.project-drawing-geometry .project-drawing-hole-index{font-size:15px;fill:#2457a1}.project-drawing-geometry .project-drawing-pocket-label{font-size:13px;fill:#5c7493}.project-drawing-cutting-plane{stroke:#7891af;stroke-width:1;stroke-dasharray:14 5 3 5}.project-drawing-datum{stroke:#27394c;stroke-width:1.3}.project-drawing-datum>path{fill:#27394c}.project-drawing-datum>rect{fill:#fff}.project-drawing-geometry .project-drawing-datum>text{font-size:14px;fill:#27394c;font-weight:600}`}</style>
          <g className="project-drawing-geometry">
            {geometry.kind === "turned" ? (
              <TurnedView
                geometry={geometry}
                lang={lang}
                compact={compact}
                uid={uid}
                features={features}
              />
            ) : (
              <BlockView
                geometry={geometry}
                lang={lang}
                compact={compact}
                uid={uid}
                features={features}
              />
            )}
          </g>
        </svg>
      </div>
      {!compact && rows.length > 0 && (
        <div className="project-drawing-coordinates">
          <div className="project-drawing-subheading">
            {phrase(
              lang,
              geometry.kind === "turned"
                ? "Координати від осі на торці A"
                : "Координати від кута C/B; кишені — від нижнього лівого кута",
              "Feature coordinates " +
                (geometry.kind === "turned"
                  ? "from the axis on face A"
                  : "from corner C/B; pockets use their lower-left corner"),
            )}
          </div>
          <table>
            <thead>
              <tr>
                <th>{phrase(lang, "Елемент", "Feature")}</th>
                <th>X / Y · mm</th>
                <th>{phrase(lang, "Геометрія", "Geometry")}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <th>{row.id}</th>
                  <td>{row.coordinates}</td>
                  <td>{row.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {!compact && features.length > 0 && (
        <div className="project-drawing-features">
          {features.map((feature) => (
            <span key={feature.id}>
              <b>{feature.id}</b>
              {feature.spec}
            </span>
          ))}
        </div>
      )}
      <figcaption>
        {compact
          ? phrase(lang, "Числова геометрія · мм", "Numeric geometry · mm")
          : phrase(
              lang,
              "Габарити, координати й розрізи — за моделлю; допуски та приймання — за таблицею вимог. Розташування видів пояснювальне; масштаб екрана не є масштабом креслення. Малі фаски та заокруглення кромок задаються окремо.",
              "Envelope, coordinates and sections follow the model; tolerances and acceptance follow the requirements table. Views are arranged for explanation; screen scale is not a drawing scale. Small edge breaks and chamfers are specified separately.",
            )}
        {!compact && hasThread && (
          <span>
            {phrase(
              lang,
              "Різьбу позначено умовно. Точна форма профілю, допуск і довжина повної різьби контролюються за вимогами проєкту.",
              "Threads are represented symbolically. Verify the exact profile, tolerance and full-thread length against the project requirements.",
            )}
          </span>
        )}
      </figcaption>
    </figure>
  );
}
export default function ProjectDrawing({
  project,
  lang,
  compact = false,
}: Props) {
  return (
    <GeometryDrawing
      geometry={project.part}
      title={project.title}
      lang={lang}
      compact={compact}
      features={project.features}
    />
  );
}
