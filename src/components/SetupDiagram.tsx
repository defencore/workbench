import { useId } from "react";
import type {
  Lang,
  ManufacturingSetup,
  Project,
  TurnedGeometry,
} from "../data/types";
import "./SetupDiagram.css";
interface Props {
  project: Project;
  setup: ManufacturingSetup;
  lang: Lang;
}
const t = (lang: Lang, uk: string, en: string) => (lang === "uk" ? uk : en);
const clampNames: Record<
  ManufacturingSetup["diagram"]["clamping"],
  { uk: string; en: string }
> = {
  chuck: { uk: "Патрон", en: "Chuck" },
  collet: { uk: "Цанга", en: "Collet" },
  "soft-jaws": { uk: "Розточені м’які губки", en: "Bored soft jaws" },
  mandrel: {
    uk: "Оправка з визначеним утриманням",
    en: "Mandrel with defined retention",
  },
  vise: { uk: "Лещата", en: "Machine vice" },
  "strap-clamps": { uk: "Притиски", en: "Strap clamps" },
  "fixture-plate": { uk: "Плита оснащення", en: "Fixture plate" },
  "angle-plate": { uk: "Кутова плита", en: "Angle plate" },
  "v-block": { uk: "Призми", en: "V-blocks" },
};
function Arrow({
  x1,
  y1,
  x2,
  y2,
  label,
  uid,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  label?: string;
  uid: string;
}) {
  return (
    <g className="setup-arrow">
      <path d={`M${x1} ${y1}L${x2} ${y2}`} markerEnd={`url(#${uid}-arrow)`} />
      {label && (
        <text x={x1 + 7} y={y1 - 9}>
          {label}
        </text>
      )}
    </g>
  );
}
function TurnedSetup({
  project,
  setup,
  lang,
  uid,
}: {
  project: Project;
  setup: ManufacturingSetup;
  lang: Lang;
  uid: string;
}) {
  const part = project.part as TurnedGeometry,
    L = part.sections.reduce((sum, s) => sum + s.length, 0),
    D = Math.max(...part.sections.map((s) => s.diameter));
  const scale = Math.min(420 / L, 135 / D),
    left = 150,
    cy = 205,
    width = L * scale;
  const aRight = setup.diagram.datumA === "right";
  const sections = aRight ? [...part.sections].reverse() : part.sections;
  let x = left;
  const top: string[] = [`M${left} ${cy - (sections[0].diameter * scale) / 2}`];
  sections.forEach((s) => {
    top.push(`V${cy - (s.diameter * scale) / 2}H${x + s.length * scale}`);
    x += s.length * scale;
  });
  const bottom: string[] = [];
  [...sections].reverse().forEach((s) => {
    bottom.push(`V${cy + (s.diameter * scale) / 2}H${x - s.length * scale}`);
    x -= s.length * scale;
  });
  const profile = [...top, ...bottom, "Z"].join(" ");
  const gripLength = setup.diagram.gripLength;
  const grip = Math.min(
    width,
    gripLength === undefined ? Math.max(25, width * 0.16) : gripLength * scale,
  );
  const maxR = (D * scale) / 2;
  const inInspection = setup.diagram.view === "inspection";
  const isMandrel = setup.diagram.clamping === "mandrel";
  const boreLength = Math.min(part.bore?.depth ?? L, L) * scale;
  const boreStart = aRight ? left + width - boreLength : left;
  const boreEnd = aRight ? left + width : left + boreLength;
  const boreBottom = aRight ? boreStart : boreEnd;

  return (
    <>
      <path d={`M90 ${cy}H${left + width + 40}`} className="setup-center" />
      <path d={profile} fill="#e8eef7" stroke="#355b85" strokeWidth={2} />
      {part.bore && (
        <g>
          <path
            d={`M${boreStart} ${cy - (part.bore.diameter * scale) / 2}H${boreEnd}M${boreStart} ${cy + (part.bore.diameter * scale) / 2}H${boreEnd}${part.bore.depth !== undefined && part.bore.depth < L ? `M${boreBottom} ${cy - (part.bore.diameter * scale) / 2}V${cy + (part.bore.diameter * scale) / 2}` : ""}`}
            className="setup-hidden"
          />
          {isMandrel && (
            <rect
              x={left - 50}
              y={cy - part.bore.diameter * scale * 0.4}
              width={width + 65}
              height={part.bore.diameter * scale * 0.8}
              fill="#c4d1df"
              stroke="#617d9e"
            />
          )}
        </g>
      )}
      {inInspection ? (
        <>
          <path
            d={`M${left + width * 0.18 - 23} ${cy + maxR + 48}l23 -30 23 30Zm${width * 0.64} 0l23 -30 23 30Z`}
            fill="#c6d3e2"
            stroke="#617d9e"
          />
          <path
            d={`M${left + width * 0.5} 78v${cy - maxR - 78}`}
            stroke="#516b8b"
            strokeWidth={5}
          />
          <circle cx={left + width * 0.5} cy={cy - maxR} r={4} fill="#2457d6" />
          <circle
            cx={left + width * 0.5}
            cy={62}
            r={27}
            fill="#fff"
            stroke="#627a99"
            strokeWidth={2}
          />
          <path
            d={`M${left + width * 0.5} 62l16 -11`}
            stroke="#2457d6"
            strokeWidth={2}
          />
        </>
      ) : (
        <>
          <rect
            x={left - 75}
            y={cy - maxR - 37}
            width={75}
            height={maxR * 2 + 74}
            rx={4}
            fill="#e0e6ed"
            stroke="#72849a"
            strokeWidth={2}
          />
          <rect
            x={left - 7}
            y={cy - maxR - 24}
            width={grip + 7}
            height={24}
            fill="#7898bb"
            stroke="#3f628c"
          />
          <rect
            x={left - 7}
            y={cy + maxR}
            width={grip + 7}
            height={24}
            fill="#7898bb"
            stroke="#3f628c"
          />
          <rect
            x={left}
            y={cy - maxR}
            width={grip}
            height={maxR * 2}
            fill={`url(#${uid}-contact)`}
            stroke="none"
          />
          <path
            d={`M${left + grip} ${cy - maxR - 33}V${cy + maxR + 34}`}
            className="setup-contact-line"
          />
          <text x={left + grip + 7} y={cy + maxR + 53} className="setup-note">
            {gripLength === undefined
              ? t(lang, "Зона затиску: за картою", "Grip zone: see setup card")
              : `${t(lang, "Затиск", "Grip")} ${gripLength} mm`}
          </text>
          {setup.diagram.toolApproach === "axial" ? (
            <>
              <path
                d={`M${left + width + 112} ${cy - 11}h-60l-23 11 23 11h60Z`}
                fill="#91accd"
                stroke="#41658f"
                strokeWidth={1.5}
              />
              <Arrow
                x1={left + width + 110}
                y1={cy - 55}
                x2={left + width + 45}
                y2={cy - 55}
                uid={uid}
                label={t(lang, "Осьовий інструмент", "Axial tool")}
              />
            </>
          ) : (
            <>
              <path
                d={`M${left + width - 20} ${cy + maxR + 55}l-12 -38 29 8 18 32Z`}
                fill="#607f9e"
                stroke="#365571"
                strokeWidth={2}
              />
              <path
                d={`M${left + width - 32} ${cy + maxR + 17}l18 4-9 14Z`}
                fill="#3f6eb0"
              />
              <Arrow
                x1={left + width - 70}
                y1={cy + maxR + 75}
                x2={left + width - 25}
                y2={cy + maxR + 34}
                uid={uid}
                label={t(lang, "Інструмент / доступ", "Tool / access")}
              />
            </>
          )}
        </>
      )}
      <g className="setup-datum">
        <circle cx={aRight ? left + width : left} cy={cy - maxR - 14} r={14} />
        <text
          x={aRight ? left + width : left}
          y={cy - maxR - 9}
          textAnchor="middle"
        >
          A
        </text>
        <circle cx={aRight ? left : left + width} cy={cy - maxR - 14} r={14} />
        <text
          x={aRight ? left : left + width}
          y={cy - maxR - 9}
          textAnchor="middle"
        >
          {setup.diagram.oppositeFace || "E"}
        </text>
      </g>
      <g className="setup-datum">
        <path d={`M${left - 96} ${cy}H${left - 77}`} stroke="#41689f" />
        <circle cx={left - 110} cy={cy} r={14} />
        <text x={left - 110} y={cy + 5} textAnchor="middle">
          B
        </text>
      </g>
      <text
        x={left + width * 0.5}
        y={385}
        textAnchor="middle"
        className="setup-orientation-label"
      >
        {aRight
          ? t(
              lang,
              "База A праворуч; B — вісь обертання",
              "Datum A on the right; B is the rotation axis",
            )
          : t(
              lang,
              "База A ліворуч; B — вісь обертання",
              "Datum A on the left; B is the rotation axis",
            )}
      </text>
      <text x={48} y={55} className="setup-small-label">
        {clampNames[setup.diagram.clamping][lang]}
      </text>
    </>
  );
}
function RoundFaceSetup({
  project,
  setup,
  lang,
  uid,
}: {
  project: Project;
  setup: ManufacturingSetup;
  lang: Lang;
  uid: string;
}) {
  const part = project.part as TurnedGeometry,
    L = part.sections.reduce((sum, s) => sum + s.length, 0),
    D = Math.max(...part.sections.map((s) => s.diameter)),
    scale = Math.min(340 / D, 125 / L),
    cx = 365,
    baseY = 300;
  const aTop = setup.diagram.datumA === "top";
  const sections = aTop ? [...part.sections].reverse() : part.sections;
  let z = 0;
  const bodies = sections.map((section, i) => {
    const r = (section.diameter * scale) / 2,
      ry = r * 0.35,
      bottom = baseY - z * scale;
    z += section.length;
    const top = baseY - z * scale;
    return (
      <g key={i}>
        <path
          d={`M${cx - r} ${top}V${bottom}A${r} ${ry} 0 0 0 ${cx + r} ${bottom}V${top}Z`}
          fill="#c1d2e6"
          stroke="#44678f"
          strokeWidth={1.8}
        />
        <ellipse
          cx={cx}
          cy={top}
          rx={r}
          ry={ry}
          fill="#e9f1fa"
          stroke="#44678f"
          strokeWidth={1.8}
        />
      </g>
    );
  });
  const top = baseY - L * scale,
    r = (D * scale) / 2,
    ry = r * 0.35,
    first = part.holes?.[0],
    tx = cx + (first?.x ?? 0) * scale,
    ty = top - (first?.y ?? 0) * scale * 0.35;
  return (
    <>
      <text x={48} y={55} className="setup-small-label">
        {clampNames[setup.diagram.clamping][lang]}
      </text>
      <path
        d={`M${cx - r - 65} ${baseY + ry + 18}h${r * 2 + 130}l30 -24H${cx - r - 35}Z`}
        fill="#e1e8f1"
        stroke="#7089a8"
        strokeWidth={1.8}
      />
      {bodies}
      {part.bore &&
        (aTop || part.bore.depth === undefined || part.bore.depth >= L) && (
          <ellipse
            cx={cx}
            cy={top}
            rx={(part.bore.diameter * scale) / 2}
            ry={part.bore.diameter * scale * 0.175}
            fill="#b0c5df"
            stroke="#41658f"
            strokeWidth={1.5}
          />
        )}
      {(part.holes || []).map((hole, i) => (
        <g key={i}>
          <ellipse
            cx={cx + hole.x * scale}
            cy={top - hole.y * scale * 0.35}
            rx={(hole.diameter * scale) / 2}
            ry={hole.diameter * scale * 0.175}
            fill="#9bb6d8"
            stroke="#41658f"
            strokeWidth={1.5}
          />
          <text
            x={cx + hole.x * scale + (hole.diameter * scale) / 2 + 7}
            y={top - hole.y * scale * 0.35 - 7}
            className="setup-note"
          >
            H{i + 1}
          </text>
        </g>
      ))}
      {[-1, 1].map((side) => (
        <g key={side}>
          <path
            d={`M${cx + side * r * 0.64 - 18} ${top + ry * 0.65}l36 -8 4 12-35 8Z`}
            fill="#6d8fb7"
            stroke="#40658f"
            strokeWidth={1.6}
          />
          <path
            d={`M${cx + side * r * 0.64} ${top + ry * 0.65 - 4}v-25`}
            stroke="#40658f"
            strokeWidth={4}
          />
        </g>
      ))}
      <path
        d={`M${tx - 10} ${ty - 98}h20v43h-20Z`}
        fill="#9db3cf"
        stroke="#4e6e97"
        strokeWidth={1.5}
      />
      <path
        d={`M${tx - 7} ${ty - 55}l7 24 7 -24Z`}
        fill="#6488b9"
        stroke="#40658f"
      />
      <Arrow
        x1={tx + 36}
        y1={ty - 98}
        x2={tx + 36}
        y2={ty - 38}
        uid={uid}
        label="Z"
      />
      <g className="setup-datum">
        <circle cx={cx - r - 22} cy={baseY + 11} r={14} />
        <text x={cx - r - 22} y={baseY + 16} textAnchor="middle">
          {aTop ? setup.diagram.oppositeFace || "E" : "A"}
        </text>
        <circle cx={cx - r - 22} cy={top - 11} r={14} />
        <text x={cx - r - 22} y={top - 6} textAnchor="middle">
          {aTop ? "A" : setup.diagram.oppositeFace || "E"}
        </text>
      </g>
      <g className="setup-datum">
        <path d={`M${cx} ${top - 35}V${top - 90}`} className="setup-center" />
        <circle cx={cx} cy={top - 107} r={14} />
        <text x={cx} y={top - 102} textAnchor="middle">
          B
        </text>
      </g>
      <text
        x={cx}
        y={393}
        textAnchor="middle"
        className="setup-orientation-label"
      >
        {t(
          lang,
          "Кругла деталь торцем на опорі; B — вісь, Z — подача",
          "Round part supported on an end face; B is the axis, Z the feed",
        )}
      </text>
    </>
  );
}
function BlockSetup({
  project,
  setup,
  lang,
  uid,
}: {
  project: Project;
  setup: ManufacturingSetup;
  lang: Lang;
  uid: string;
}) {
  const part = project.part;
  if (part.kind !== "block") return null;
  const W = part.width,
    D = part.depth,
    H = part.height;
  const face = setup.diagram.datumA || "bottom";
  const orient = (x: number, y: number, z: number): [number, number, number] =>
    face === "top"
      ? [x, D - y, H - z]
      : face === "front"
        ? [x, z, D - y]
        : face === "back"
          ? [x, H - z, y]
          : face === "left"
            ? [z, y, W - x]
            : face === "right"
              ? [H - z, y, x]
              : [x, y, z];
  const dimensions =
    face === "front" || face === "back"
      ? [W, H, D]
      : face === "left" || face === "right"
        ? [H, D, W]
        : [W, D, H];
  const physicalSupport = setup.diagram.supportHeight ?? Math.min(5, H * 0.5),
    scale = Math.min(
      360 / dimensions[0],
      130 / dimensions[1],
      160 / (dimensions[2] + physicalSupport),
    );
  const w = dimensions[0] * scale,
    d = dimensions[1] * scale,
    h = dimensions[2] * scale,
    support = physicalSupport * scale,
    ox = 145,
    oy = 320 - support;
  const screen = (x: number, y: number, z: number): [number, number] => [
    ox + x + y * 0.47,
    oy - y * 0.35 - z,
  ];
  const point = (x: number, y: number, z: number) => screen(x, y, z).join(",");
  const source = (x: number, y: number, z: number) => {
    const v = orient(x, y, z);
    return screen(v[0] * scale, v[1] * scale, v[2] * scale);
  };
  const quad = (
    a: [number, number, number],
    b: [number, number, number],
    c: [number, number, number],
    e: [number, number, number],
  ) => [a, b, c, e].map((v) => point(...v)).join(" ");
  const sourceQuad = (
    x: number,
    y: number,
    z: number,
    width: number,
    depth: number,
  ) =>
    [
      [x, y, z],
      [x + width, y, z],
      [x + width, y + depth, z],
      [x, y + depth, z],
    ]
      .map((v) => source(v[0], v[1], v[2]).join(","))
      .join(" ");
  const sourceTopVisible =
    face === "bottom" || face === "back" || face === "left";
  const isVice =
      setup.diagram.clamping === "vise" ||
      setup.diagram.clamping === "soft-jaws",
    inspection = setup.diagram.view === "inspection";
  const approach = setup.diagram.toolApproach || "top";
  const defaultTarget = screen(w * 0.55, d * 0.5, h),
    holeTarget = part.holes?.[0]
      ? source(part.holes[0].x, part.holes[0].y, H)
      : defaultTarget;
  const target =
    approach === "left"
      ? screen(0, d * 0.3, h * 0.6)
      : approach === "right"
        ? screen(w, d * 0.3, h * 0.6)
        : setup.diagram.view === "drilling"
          ? holeTarget
          : defaultTarget;
  const toolX =
      target[0] + (approach === "left" ? -18 : approach === "right" ? 18 : 0),
    toolY = target[1];
  const aPoint = source(W * 0.3, D * 0.5, 0),
    bPoint = source(W * 0.75, 0, H * 0.45),
    cPoint = source(0, D * 0.55, H * 0.5);
  const aOffset =
    face === "top"
      ? [0, -29]
      : face === "bottom"
        ? [0, 32]
        : face === "left"
          ? [-31, 0]
          : face === "right"
            ? [32, 0]
            : face === "back"
              ? [38, -28]
              : [-7, 30];
  const datum = (
    label: string,
    p: [number, number],
    offset: [number, number],
  ) => (
    <g className="setup-datum">
      <path
        d={`M${p[0]} ${p[1]}L${p[0] + offset[0]} ${p[1] + offset[1]}`}
        stroke="#41689f"
      />
      <circle cx={p[0] + offset[0]} cy={p[1] + offset[1]} r={14} />
      <text x={p[0] + offset[0]} y={p[1] + offset[1] + 5} textAnchor="middle">
        {label}
      </text>
    </g>
  );
  const faceNames = {
    left: ["ліворуч", "left"],
    right: ["праворуч", "right"],
    top: ["зверху", "on top"],
    bottom: ["знизу", "underneath"],
    front: ["спереду", "at the front"],
    back: ["біля задньої губки", "at the back jaw"],
  };
  return (
    <>
      <text x={48} y={55} className="setup-small-label">
        {clampNames[setup.diagram.clamping][lang]}
      </text>
      <path
        d={`M${ox - 45} ${oy + support + 8}h${w + d * 0.47 + 90}l28 -25H${ox - 18}Z`}
        fill="#e8edf3"
        stroke="#71869f"
        strokeWidth={1.5}
      />
      {[w * 0.18, w * 0.72].map((x, i) => (
        <polygon
          key={i}
          points={quad(
            [x, -8, -support],
            [x + w * 0.1, -8, -support],
            [x + w * 0.1, d + 5, 0],
            [x, d + 5, 0],
          )}
          fill="#9fb5cf"
          stroke="#617e9f"
          strokeWidth={1.5}
        />
      ))}
      {isVice && (
        <polygon
          points={quad(
            [-14, d + 7, -support],
            [w + 14, d + 7, -support],
            [w + 14, d + 7, h * 0.6],
            [-14, d + 7, h * 0.6],
          )}
          fill="#819bb9"
          stroke="#506d90"
          strokeWidth={1.6}
        />
      )}
      <g className="setup-nominal-envelope">
        <polygon
          points={quad([0, 0, 0], [w, 0, 0], [w, d, 0], [0, d, 0])}
          fill="#e8eef6"
        />
        <polygon
          points={quad([0, 0, 0], [w, 0, 0], [w, 0, h], [0, 0, h])}
          fill="#c6d5e8"
        />
        <polygon
          points={quad([w, 0, 0], [w, d, 0], [w, d, h], [w, 0, h])}
          fill="#b5c9e1"
        />
        <polygon
          points={quad([0, 0, h], [w, 0, h], [w, d, h], [0, d, h])}
          fill="#edf3fa"
        />
      </g>
      {sourceTopVisible &&
        (part.pockets || []).map((p, i) => (
          <polygon
            key={i}
            points={sourceQuad(p.x, p.y, H, p.width, p.depth)}
            fill="#c1d3e9"
            stroke="#6688b2"
            strokeWidth={1.3}
          />
        ))}
      {sourceTopVisible &&
        (part.holes || []).map((hole, i) => {
          const points = Array.from({ length: 49 }, (_, j) => {
            const a = (j * Math.PI) / 24;
            return source(
              hole.x + (Math.cos(a) * hole.diameter) / 2,
              hole.y + (Math.sin(a) * hole.diameter) / 2,
              H,
            ).join(",");
          }).join(" ");
          return (
            <polygon
              key={i}
              points={points}
              fill="#a9c2e0"
              stroke="#6688b2"
              strokeWidth={1.1}
            />
          );
        })}
      {isVice ? (
        <>
          <polygon
            points={quad(
              [-15, -15, -support],
              [w + 15, -15, -support],
              [w + 15, -15, h * 0.48],
              [-15, -15, h * 0.48],
            )}
            fill="#7f9ab9"
            stroke="#506d90"
            strokeWidth={1.6}
          />
          <Arrow
            x1={ox + w * 0.55}
            y1={oy + h * 0.18 + 36}
            x2={ox + w * 0.55}
            y2={oy - h * 0.15}
            uid={uid}
          />
        </>
      ) : setup.diagram.clamping === "angle-plate" ? (
        <polygon
          points={quad(
            [w + 19, 0, -support],
            [w + 19, d + 14, -support],
            [w + 19, d + 14, h + 30],
            [w + 19, 0, h + 30],
          )}
          fill="#9eb4cd"
          stroke="#5c7b9e"
          strokeWidth={1.7}
        />
      ) : !inspection ? (
        <>
          {[w * 0.12, w * 0.82].map((x, i) => (
            <g key={i}>
              <path
                d={`M${ox + x - 9} ${oy - h - 9}l30 -10 12 8-28 11Z`}
                fill="#6f8daf"
                stroke="#42658d"
              />
              <path
                d={`M${ox + x + 7} ${oy - h - 16}v-24`}
                stroke="#42658d"
                strokeWidth={4}
              />
            </g>
          ))}
        </>
      ) : null}
      {inspection ? (
        <>
          <circle
            cx={defaultTarget[0]}
            cy={defaultTarget[1] - 65}
            r={24}
            fill="#fff"
            stroke="#627d9d"
            strokeWidth={2}
          />
          <path
            d={`M${defaultTarget[0]} ${defaultTarget[1] - 41}v41`}
            stroke="#526e90"
            strokeWidth={4}
          />
        </>
      ) : (
        <>
          <path
            d={`M${toolX - 10} ${toolY - 83}h20v43h-20Z`}
            fill="#9db3cf"
            stroke="#4e6e97"
            strokeWidth={1.5}
          />
          {setup.diagram.view === "drilling" ? (
            <path
              d={`M${toolX - 7} ${toolY - 40}l7 24 7 -24Z`}
              fill="#6488b9"
              stroke="#40658f"
            />
          ) : (
            <path
              d={`M${toolX - 7} ${toolY - 40}h14v32h-14Zm4 0 7 32m-7-22 7 22`}
              fill="#6488b9"
              stroke="#40658f"
            />
          )}
          {approach === "left" || approach === "right" ? (
            <Arrow
              x1={toolX + (approach === "left" ? -66 : 66)}
              y1={toolY - 25}
              x2={toolX + (approach === "left" ? -15 : 15)}
              y2={toolY - 25}
              uid={uid}
              label={t(lang, "Бічна подача", "Side feed")}
            />
          ) : (
            <Arrow
              x1={toolX + 44}
              y1={toolY - 83}
              x2={toolX + 44}
              y2={toolY - 24}
              uid={uid}
              label="Z"
            />
          )}
        </>
      )}
      {datum("A", aPoint, [aOffset[0], aOffset[1]])}
      {datum("B", bPoint, [10, 29])}
      {datum("C", cPoint, [-30, -7])}
      <text
        x={380}
        y={391}
        textAnchor="middle"
        className="setup-orientation-label"
      >
        {setup.diagram.datumA
          ? `${t(lang, "База A", "Datum A")} ${faceNames[face][lang === "uk" ? 0 : 1]}`
          : t(
              lang,
              "Номінальний габарит; фізичні бази задає карта",
              "Nominal envelope; the setup card defines physical datums",
            )}
      </text>
    </>
  );
}
export default function SetupDiagram({ project, setup, lang }: Props) {
  const uid = `setup-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const fixtures = setup.fixtureIds
    .map((id) => project.fixtures.find((f) => f.id === id))
    .filter((f) => !!f);
  const turning =
    project.part.kind === "turned" &&
    (setup.diagram.view === "turning" || setup.diagram.view === "inspection");
  return (
    <figure className="setup-diagram">
      <div className="setup-diagram-heading">
        <strong>
          {setup.id.toUpperCase()} ·{" "}
          {t(lang, "Схема встановлення", "Setup schematic")}
        </strong>
        <span>
          {setup.diagram.flip
            ? t(lang, "Перестановка / переворот", "Remount / reversal")
            : t(lang, "Орієнтація за картою", "Orientation from setup card")}
        </span>
      </div>
      <div
        className="setup-diagram-viewport"
        tabIndex={0}
        role="region"
        aria-label={`${setup.id} ${setup.title[lang]}`}
      >
        <svg
          viewBox="0 0 760 420"
          role="img"
          aria-labelledby={`${uid}-title ${uid}-desc`}
        >
          <title id={`${uid}-title`}>{setup.title[lang]}</title>
          <desc id={`${uid}-desc`}>
            {setup.orientation[lang]} {setup.workholding[lang]}
          </desc>
          <defs>
            <marker
              id={`${uid}-arrow`}
              markerWidth={9}
              markerHeight={9}
              refX={8}
              refY={4.5}
              orient="auto-start-reverse"
              markerUnits="userSpaceOnUse"
            >
              <path d="M0 0L9 4.5L0 9Z" fill="#2457d6" />
            </marker>
            <pattern
              id={`${uid}-contact`}
              width={8}
              height={8}
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M0 0L8 8M-4 4L4 12M4-4L12 4"
                stroke="#587daa"
                strokeWidth={1}
              />
            </pattern>
          </defs>
          {turning ? (
            <TurnedSetup
              project={project}
              setup={setup}
              lang={lang}
              uid={uid}
            />
          ) : project.part.kind === "turned" ? (
            <RoundFaceSetup
              project={project}
              setup={setup}
              lang={lang}
              uid={uid}
            />
          ) : (
            <BlockSetup project={project} setup={setup} lang={lang} uid={uid} />
          )}
        </svg>
      </div>
      <figcaption>
        <strong>{setup.diagram.highlight[lang]}</strong>
        <p>{setup.orientation[lang]}</p>
        <div className="setup-fixture-links">
          {fixtures.map((fixture) => (
            <a
              key={fixture.id}
              href={`#manufacture-${project.id}-${fixture.id}`}
              onClick={(event) => {
                event.preventDefault();
                document
                  .getElementById(`manufacture-${project.id}-${fixture.id}`)
                  ?.scrollIntoView({
                    behavior: matchMedia("(prefers-reduced-motion: reduce)")
                      .matches
                      ? "instant"
                      : "smooth",
                    block: "start",
                  });
              }}
            >
              <span>{fixture.id.toUpperCase()}</span>
              {fixture.name[lang]}
            </a>
          ))}
        </div>
        <small>
          {t(
            lang,
            "Схема чистового номінального габариту без масштабу, а не проміжного стану заготовки. Розміри затиску, опори, зазори й стан заготовки задає карта встановлення; схема не розраховує силу утримання.",
            "Finished nominal-envelope orientation schematic, not to scale; it does not show the in-process stock condition. The setup card defines gripping dimensions, supports, clearances and stock condition; this drawing does not calculate retention force.",
          )}
        </small>
      </figcaption>
    </figure>
  );
}
