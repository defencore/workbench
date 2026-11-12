import { useId } from "react";
import type { CSSProperties, ReactNode } from "react";
import type { Lang, Text } from "../data/types";
import "./LatheConstructionDrawing.css";

interface Entry {
  number: number;
  name: Text;
}
interface Props {
  lang: Lang;
  view: "machine" | "toolpost";
  entries: Entry[];
  activeNumber: number;
  onSelect: (number: number) => void;
}
interface Callout {
  number: number;
  badge: [number, number];
  point: [number, number];
  elbow?: [number, number];
}
const machineCallouts: Callout[] = [
  { number: 1, badge: [82, 572], elbow: [164, 572], point: [250, 540] },
  { number: 2, badge: [82, 488], elbow: [152, 488], point: [306, 542] },
  { number: 3, badge: [82, 386], elbow: [161, 386], point: [281, 433] },
  { number: 4, badge: [82, 232], elbow: [122, 232], point: [166, 289] },
  { number: 5, badge: [356, 102], elbow: [356, 153], point: [348, 235] },
  { number: 6, badge: [190, 102], elbow: [190, 157], point: [235, 211] },
  { number: 7, badge: [527, 102], elbow: [527, 166], point: [506, 256] },
  { number: 8, badge: [734, 102], elbow: [734, 164], point: [726, 365] },
  { number: 9, badge: [979, 102], elbow: [979, 172], point: [978, 331] },
  { number: 10, badge: [1166, 432], elbow: [1118, 432], point: [1027, 488] },
  { number: 11, badge: [1166, 509], elbow: [1120, 509], point: [1031, 517] },
  { number: 12, badge: [1166, 589], elbow: [1110, 589], point: [1038, 550] },
  { number: 13, badge: [1166, 351], elbow: [1128, 351], point: [1021, 421] },
  { number: 14, badge: [1069, 706], elbow: [1069, 666], point: [996, 613] },
  { number: 15, badge: [872, 706], elbow: [872, 656], point: [930, 460] },
  { number: 16, badge: [631, 706], elbow: [631, 648], point: [748, 531] },
  { number: 17, badge: [389, 706], elbow: [389, 668], point: [330, 615] },
  { number: 18, badge: [171, 706], elbow: [171, 660], point: [228, 611] },
];
const toolpostCallouts: Callout[] = [
  { number: 1, badge: [255, 76], elbow: [414, 76], point: [501, 137] },
  { number: 2, badge: [710, 78], elbow: [640, 78], point: [552, 187] },
  { number: 3, badge: [882, 194], elbow: [800, 194], point: [670, 147] },
  { number: 4, badge: [876, 405], elbow: [816, 405], point: [684, 275] },
  { number: 5, badge: [173, 553], elbow: [270, 553], point: [431, 451] },
];
const say = (lang: Lang, uk: string, en: string) => (lang === "uk" ? uk : en);

function Part({
  number,
  active,
  bounds,
  onSelect,
  children,
}: {
  number: number;
  active: number;
  bounds: [number, number, number, number];
  onSelect: (number: number) => void;
  children: ReactNode;
}) {
  return (
    <g
      className={`lc-part${active === number ? " is-active" : ""}`}
      aria-hidden="true"
      onClick={() => onSelect(number)}
      data-part-number={number}
    >
      {children}
      {active === number && (
        <rect
          className="lc-selection"
          x={bounds[0]}
          y={bounds[1]}
          width={bounds[2]}
          height={bounds[3]}
          rx="7"
        />
      )}
    </g>
  );
}

function Handwheel({
  x,
  y,
  radius,
  ellipse = false,
}: {
  x: number;
  y: number;
  radius: number;
  ellipse?: boolean;
}) {
  return (
    <g className="lc-handwheel" transform={`translate(${x} ${y})`}>
      <ellipse rx={ellipse ? radius * 0.42 : radius} ry={radius} />
      <path
        d={
          ellipse
            ? `M0 ${-radius + 4}V${radius - 4}M${-radius * 0.36} 0H${radius * 0.36}`
            : `M0 ${-radius + 4}V${radius - 4}M${-radius + 4} 0H${radius - 4}`
        }
      />
      <circle r="4" />
      <rect
        x={ellipse ? radius * 0.2 : radius * 0.56}
        y={radius * 0.35}
        width="8"
        height="15"
        rx="3"
      />
    </g>
  );
}

function Gear({ x, y, radius }: { x: number; y: number; radius: number }) {
  const points = Array.from({ length: 48 }, (_, index) => {
    const angle = (index * Math.PI) / 24;
    const r = index % 4 < 2 ? radius : radius - 4;
    return `${x + Math.cos(angle) * r},${y + Math.sin(angle) * r}`;
  }).join(" ");
  return (
    <g className="lc-gear">
      <polygon points={points} />
      <circle cx={x} cy={y} r={radius * 0.46} />
      <circle cx={x} cy={y} r="4" />
    </g>
  );
}

function Machine({
  active,
  onSelect,
}: {
  active: number;
  onSelect: (number: number) => void;
}) {
  const part = (
    number: number,
    bounds: [number, number, number, number],
    children: ReactNode,
  ) => (
    <Part number={number} active={active} bounds={bounds} onSelect={onSelect}>
      {children}
    </Part>
  );
  return (
    <g className="lc-machine">
      <path
        className="lc-floor-shadow"
        d="M183 684 1049 684 1114 652 250 652Z"
      />
      {part(
        18,
        [213, 486, 192, 199],
        <>
          <path
            className="lc-painted-side"
            d="M225 505 260 485 405 485 370 505V677L405 657V485"
          />
          <path className="lc-painted" d="M225 505H370V677H225Z" />
          <rect
            className="lc-opening"
            x="244"
            y="576"
            width="111"
            height="78"
            rx="6"
          />
          <path className="lc-panel-seam" d="M235 566H359M237 665H358" />
          <circle className="lc-bolt" cx="238" cy="661" r="3" />
          <circle className="lc-bolt" cx="357" cy="661" r="3" />
        </>,
      )}
      {part(
        14,
        [932, 487, 150, 198],
        <>
          <path
            className="lc-painted-side"
            d="M940 506 972 486H1080L1048 506V680L1080 660V486"
          />
          <path className="lc-painted" d="M940 506H1048V680H940Z" />
          <rect
            className="lc-panel"
            x="957"
            y="554"
            width="74"
            height="99"
            rx="3"
          />
          <path
            className="lc-panel-seam"
            d="M964 564H1024M964 573H1024M964 582H1024"
          />
          <circle className="lc-bolt" cx="951" cy="665" r="3" />
          <circle className="lc-bolt" cx="1037" cy="665" r="3" />
        </>,
      )}
      {part(
        17,
        [274, 579, 92, 81],
        <>
          <path
            className="lc-motor"
            d="M296 590H347Q365 590 365 619T347 648H296Z"
          />
          <ellipse className="lc-motor-end" cx="296" cy="619" rx="20" ry="29" />
          <path
            className="lc-motor-fins"
            d="M309 595V644M318 593V646M327 593V646M336 594V645M345 597V642"
          />
          <path className="lc-steel-line" d="M271 619H296" />
          <path className="lc-motor-feet" d="M302 647V655H349V647" />
        </>,
      )}
      {part(
        6,
        [198, 196, 114, 463],
        <>
          <path
            className="lc-belt"
            d="M204 251 250 620Q253 653 281 653T310 620L297 251"
          />
          <path
            className="lc-belt-inner"
            d="M211 251 258 620Q261 646 281 646T303 620L290 251"
          />
          <circle className="lc-pulley" cx="250" cy="250" r="47" />
          <circle className="lc-pulley-inner" cx="250" cy="250" r="34" />
          <circle className="lc-pulley" cx="281" cy="621" r="29" />
          <circle className="lc-pulley-inner" cx="281" cy="621" r="18" />
          <circle className="lc-bolt" cx="250" cy="250" r="6" />
          <circle className="lc-bolt" cx="281" cy="621" r="5" />
        </>,
      )}
      {part(
        12,
        [186, 505, 930, 64],
        <>
          <path className="lc-pan-inner" d="M190 531 229 507H1111L1072 531Z" />
          <path className="lc-pan-rim" d="M190 531H1072V560H190Z" />
          <path
            className="lc-painted-side"
            d="M1072 531 1111 507V536L1072 560Z"
          />
          <path className="lc-pan-lip" d="M194 533H1067M1077 532 1104 515" />
        </>,
      )}
      {part(
        13,
        [222, 378, 867, 99],
        <>
          <path className="lc-painted" d="M228 405H1050V468H228Z" />
          <path
            className="lc-painted-side"
            d="M1050 405 1083 385V448L1050 468Z"
          />
          <path className="lc-way" d="M235 400 267 381H1075L1043 400Z" />
          <path className="lc-way-edge" d="M235 400H1043V411H235Z" />
          <path className="lc-way" d="M235 423 267 404H1075L1043 423Z" />
          <path className="lc-way-edge" d="M235 423H1043V434H235Z" />
          <path className="lc-guide-line" d="M287 388H1029M288 410H1030" />
        </>,
      )}
      {part(
        15,
        [412, 444, 649, 29],
        <>
          <rect className="lc-rack" x="418" y="449" width="635" height="15" />
          {Array.from({ length: 64 }, (_, i) => (
            <path
              key={i}
              className="lc-rack-tooth"
              d={`M${422 + i * 9.8} 450v9h5v-9`}
            />
          ))}
        </>,
      )}
      {part(
        10,
        [411, 476, 663, 28],
        <>
          <rect
            className="lc-shaft"
            x="418"
            y="481"
            width="646"
            height="15"
            rx="7"
          />
          {Array.from({ length: 60 }, (_, i) => (
            <path
              key={i}
              className="lc-thread"
              d={`M${425 + i * 10.5} 481l6 15`}
            />
          ))}
          <rect
            className="lc-bearing"
            x="413"
            y="478"
            width="15"
            height="21"
            rx="3"
          />
          <rect
            className="lc-bearing"
            x="1055"
            y="478"
            width="16"
            height="21"
            rx="3"
          />
        </>,
      )}
      {part(
        11,
        [411, 507, 663, 24],
        <>
          <rect
            className="lc-shaft"
            x="418"
            y="512"
            width="646"
            height="11"
            rx="5"
          />
          <path className="lc-shaft-highlight" d="M435 515H1048" />
          <rect
            className="lc-bearing"
            x="413"
            y="509"
            width="15"
            height="17"
            rx="3"
          />
          <rect
            className="lc-bearing"
            x="1055"
            y="509"
            width="16"
            height="17"
            rx="3"
          />
        </>,
      )}
      {part(
        5,
        [218, 199, 258, 207],
        <>
          <path className="lc-painted" d="M226 224H437V396H226Z" />
          <path className="lc-painted-top" d="M226 224 261 203H472L437 224Z" />
          <path className="lc-painted-side" d="M437 224 472 203V375L437 396Z" />
          <path className="lc-panel-seam" d="M238 242H420V381H238Z" />
          <path className="lc-panel-seam" d="M239 261H420" />
          <circle className="lc-bolt" cx="247" cy="251" r="3" />
          <circle className="lc-bolt" cx="410" cy="251" r="3" />
          <circle className="lc-bolt" cx="247" cy="371" r="3" />
          <circle className="lc-bolt" cx="410" cy="371" r="3" />
          <path className="lc-spindle" d="M449 284H480V317H449Z" />
          <ellipse
            className="lc-spindle-end"
            cx="480"
            cy="300"
            rx="9"
            ry="17"
          />
        </>,
      )}
      {part(
        4,
        [116, 236, 96, 153],
        <>
          <path
            className="lc-open-cover"
            d="M128 244 191 230 208 367 143 384Z"
          />
          <Gear x={151} y={264} radius={22} />
          <Gear x={173} y={301} radius={24} />
          <Gear x={160} y={349} radius={28} />
        </>,
      )}
      {part(
        3,
        [230, 396, 189, 99],
        <>
          <path className="lc-painted" d="M236 407H407V487H236Z" />
          <path className="lc-painted-top" d="M236 407 256 396H427L407 407Z" />
          <path className="lc-painted-side" d="M407 407 427 396V476L407 487Z" />
          <rect
            className="lc-panel"
            x="251"
            y="420"
            width="139"
            height="52"
            rx="3"
          />
          <path
            className="lc-panel-seam"
            d="M260 433H381M260 445H381M260 457H381"
          />
        </>,
      )}
      {part(
        7,
        [466, 238, 83, 123],
        <>
          <ellipse
            className="lc-chuck-rear"
            cx="480"
            cy="300"
            rx="19"
            ry="53"
          />
          <path className="lc-chuck-body" d="M480 247H518V353H480" />
          <ellipse
            className="lc-chuck-face"
            cx="518"
            cy="300"
            rx="23"
            ry="53"
          />
          <ellipse className="lc-chuck-bore" cx="520" cy="300" rx="7" ry="15" />
          <path className="lc-jaw" d="M516 250 530 253 529 276 516 273Z" />
          <path className="lc-jaw" d="M500 319 511 313 522 331 510 337Z" />
          <path className="lc-jaw" d="M530 313 541 318 534 341 522 335Z" />
          <path
            className="lc-jaw-groove"
            d="M520 257 528 259M519 264 527 266M506 321 514 317M510 328 517 324M531 322 537 325M528 329 534 332"
          />
        </>,
      )}
      <path className="lc-centreline" d="M542 300H1000" aria-hidden="true" />
      {part(
        8,
        [631, 300, 218, 145],
        <>
          <path className="lc-painted" d="M640 401H819V437H640Z" />
          <path className="lc-painted-top" d="M640 401 675 381H854L819 401Z" />
          <path className="lc-painted-side" d="M819 401 854 381V416L819 437Z" />
          <path
            className="lc-slide"
            d="M669 364 699 347H808L778 364V391H669Z"
          />
          <path className="lc-slide-front" d="M669 364H778V391H669Z" />
          <path
            className="lc-slide"
            d="M687 346 718 329H812L781 346V362H687Z"
          />
          <path className="lc-slide-front" d="M687 346H781V362H687Z" />
          <path
            className="lc-toolpost"
            d="M708 320 735 305 788 319 761 334V349L708 335Z"
          />
          <path
            className="lc-toolpost-top"
            d="M708 320 735 305 788 319 761 334Z"
          />
          <path className="lc-toolpost-lock" d="M748 317V295L779 287" />
          <circle className="lc-handle-end" cx="779" cy="287" r="5" />
          <rect
            className="lc-shaft"
            x="778"
            y="370"
            width="25"
            height="7"
            rx="3"
          />
          <Handwheel x={814} y={374} radius={15} ellipse />
        </>,
      )}
      {part(
        16,
        [635, 435, 197, 109],
        <>
          <path className="lc-apron" d="M644 440H819V536H644Z" />
          <path className="lc-apron-side" d="M819 440 833 431V526L819 536Z" />
          <rect
            className="lc-panel"
            x="656"
            y="451"
            width="151"
            height="72"
            rx="4"
          />
          <Handwheel x={704} y={483} radius={28} />
          <path
            className="lc-control-lever"
            d="M771 482 792 461M778 511 798 501"
          />
          <circle className="lc-handle-end" cx="792" cy="461" r="6" />
          <circle className="lc-handle-end" cx="798" cy="501" r="6" />
          <circle className="lc-bolt" cx="665" cy="460" r="3" />
          <circle className="lc-bolt" cx="799" cy="514" r="3" />
        </>,
      )}
      {part(
        9,
        [860, 269, 247, 149],
        <>
          <path className="lc-painted" d="M918 388H1041V412H918Z" />
          <path
            className="lc-painted-top"
            d="M918 388 950 370H1073L1041 388Z"
          />
          <path
            className="lc-painted-side"
            d="M1041 388 1073 370V394L1041 412Z"
          />
          <path
            className="lc-tailstock-body"
            d="M938 300H1016L1041 365V386H918V341Z"
          />
          <path
            className="lc-painted-top"
            d="M938 300 964 285H1040L1016 300Z"
          />
          <path
            className="lc-painted-side"
            d="M1016 300 1040 285 1066 349V371L1041 386V365Z"
          />
          <rect
            className="lc-quill"
            x="879"
            y="289"
            width="64"
            height="23"
            rx="4"
          />
          <path className="lc-centre" d="M879 292 858 300 879 309Z" />
          <path className="lc-control-lever" d="M981 300V277L1008 270" />
          <circle className="lc-handle-end" cx="1008" cy="270" r="5" />
          <rect
            className="lc-shaft"
            x="1045"
            y="313"
            width="30"
            height="8"
            rx="4"
          />
          <Handwheel x={1085} y={317} radius={29} ellipse />
        </>,
      )}
      {part(
        1,
        [239, 509, 122, 56],
        <>
          <rect
            className="lc-button-station"
            x="244"
            y="516"
            width="111"
            height="45"
            rx="5"
          />
          <path className="lc-panel-seam" d="M249 522H350" />
        </>,
      )}
      {part(
        2,
        [254, 526, 94, 29],
        <>
          <circle className="lc-neutral-button" cx="269" cy="541" r="10" />
          <circle className="lc-neutral-button" cx="300" cy="541" r="10" />
          <circle className="lc-neutral-button" cx="331" cy="541" r="10" />
        </>,
      )}
    </g>
  );
}

function SquareBolt({ x, y }: { x: number; y: number }) {
  return (
    <g className="lc-square-bolt" transform={`translate(${x} ${y})`}>
      <path className="lc-bolt-shank" d="M-5 0V-28H5V0" />
      <path
        className="lc-bolt-head-side"
        d="M-12 -29 1 -36 13 -29V-17L0 -10 -12 -17Z"
      />
      <path className="lc-bolt-head-top" d="M-12 -29 1 -36 13 -29 0 -22Z" />
      <path className="lc-bolt-detail" d="M-4 -13V-1M3 -16V-1" />
    </g>
  );
}

function Toolpost({
  active,
  onSelect,
}: {
  active: number;
  onSelect: (number: number) => void;
}) {
  return (
    <g className="lc-toolpost-drawing">
      <path className="lc-floor-shadow" d="M242 541 620 590 805 478 428 413Z" />
      <Part
        number={5}
        active={active}
        onSelect={onSelect}
        bounds={[244, 174, 536, 377]}
      >
        <path className="lc-steel-top" d="M250 380 610 480 770 390 410 290Z" />
        <path className="lc-steel-front" d="M250 380 610 480V545L250 445Z" />
        <path className="lc-steel-side" d="M610 480 770 390V455L610 545Z" />
        <path className="lc-tool-slot" d="M270 382 599 474V497L270 405Z" />
        <path className="lc-tool-slot" d="M627 480 752 410V433L627 504Z" />
        <path className="lc-toolpost-web" d="M400 313 574 362V449L400 400Z" />
        <path className="lc-steel-top" d="M250 265 610 365 770 275 410 175Z" />
        <path className="lc-steel-front" d="M250 265 610 365V419L250 319Z" />
        <path className="lc-steel-side" d="M610 365 770 275V329L610 419Z" />
        <path
          className="lc-machined-edge"
          d="M260 276 610 373 760 287M260 431 610 528 758 445"
        />
      </Part>
      <Part
        number={4}
        active={active}
        onSelect={onSelect}
        bounds={[320, 169, 392, 171]}
      >
        {[
          [340, 250],
          [430, 275],
          [520, 300],
          [610, 325],
          [687, 279],
          [601, 255],
          [515, 231],
          [430, 207],
        ].map(([x, y], index) => (
          <SquareBolt key={index} x={x} y={y} />
        ))}
      </Part>
      <g aria-hidden="true">
        <path
          className="lc-fixator-base"
          d="M460 227 472 141Q501 122 529 141L543 228Q506 250 460 227Z"
        />
        <ellipse
          className="lc-fixator-ring"
          cx="501"
          cy="226"
          rx="42"
          ry="15"
        />
        <path className="lc-fixator-line" d="M469 184Q501 203 537 186" />
      </g>
      <Part
        number={1}
        active={active}
        onSelect={onSelect}
        bounds={[469, 119, 67, 39]}
      >
        <ellipse className="lc-fixator-top" cx="501" cy="141" rx="29" ry="13" />
        <ellipse className="lc-fixator-screw" cx="501" cy="136" rx="9" ry="5" />
        <path className="lc-screw-slot" d="M496 135 506 137" />
      </Part>
      <Part
        number={2}
        active={active}
        onSelect={onSelect}
        bounds={[533, 171, 40, 35]}
      >
        <path
          className="lc-fixator-pin"
          d="M536 180 557 175 567 185 562 198 541 201Z"
        />
        <path className="lc-pin-edge" d="M542 184 560 179M545 196 561 192" />
      </Part>
      <Part
        number={3}
        active={active}
        onSelect={onSelect}
        bounds={[555, 119, 165, 78]}
      >
        <path className="lc-lever-shaft" d="M559 185 643 151" />
        <path
          className="lc-lever-grip"
          d="M632 143 686 124Q708 121 712 135T698 154L647 170Z"
        />
        <path className="lc-grip-highlight" d="M645 146 692 133" />
        <ellipse
          className="lc-grip-end"
          cx="705"
          cy="140"
          rx="8"
          ry="13"
          transform="rotate(-20 705 140)"
        />
      </Part>
    </g>
  );
}

export default function LatheConstructionDrawing({
  lang,
  view,
  entries,
  activeNumber,
  onSelect,
}: Props) {
  const uid = `lc-${useId().replace(/:/g, "")}`;
  const titleId = `${uid}-title`;
  const descriptionId = `${uid}-description`;
  const selected = entries.find((entry) => entry.number === activeNumber);
  const callouts = view === "machine" ? machineCallouts : toolpostCallouts;
  const title =
    view === "machine"
      ? say(
          lang,
          "Вузли токарно-гвинторізного верстата ТВ-6М",
          "TV-6M screw-cutting lathe assemblies",
        )
      : say(lang, "Чотирипозиційний різцетримач", "Four-way tool post");
  const description =
    view === "machine"
      ? say(
          lang,
          "Схема з 18 нумерованими вузлами. Ходовий гвинт показано з різьбою, ходовий вал — гладким, зубчасту рейку — окремою смугою із зубцями.",
          "Overview with 18 numbered assemblies. The leadscrew is threaded, the feed rod is smooth, and the rack is a separate toothed strip.",
        )
      : say(
          lang,
          "Різцетримач із корпусом, затискними болтами та фіксатором. Цей вузол закріплює різець на супорті.",
          "Tool post with its body, clamping bolts and locking mechanism. This assembly secures the cutting tool to the carriage.",
        );
  return (
    <figure className={`lathe-construction-drawing lc-view-${view}`}>
      <header className="lc-heading">
        <strong>{title}</strong>
        <span>
          {say(lang, "Виберіть номер на схемі", "Select a numbered callout")}
        </span>
      </header>
      <div className="lc-pan-hint">
        {say(
          lang,
          "На вузькому екрані прокрутіть схему вбік.",
          "On a narrow screen, scroll the drawing horizontally.",
        )}
      </div>
      <div
        className="lc-viewport"
        tabIndex={0}
        aria-label={say(
          lang,
          "Область схеми з горизонтальним прокручуванням",
          "Horizontally scrollable drawing",
        )}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox={view === "machine" ? "0 0 1240 760" : "0 0 1000 640"}
          role="group"
          aria-labelledby={`${titleId} ${descriptionId}`}
        >
          <title id={titleId}>{title}</title>
          <desc id={descriptionId}>{description}</desc>
          <defs>
            <linearGradient id={`${uid}-metal`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#f4f7f8" />
              <stop offset=".45" stopColor="#b6c4ce" />
              <stop offset=".6" stopColor="#e1e7eb" />
              <stop offset="1" stopColor="#8497a6" />
            </linearGradient>
          </defs>
          <g
            className="lc-art"
            style={{ "--lc-metal": `url(#${uid}-metal)` } as CSSProperties}
          >
            {view === "machine" ? (
              <Machine active={activeNumber} onSelect={onSelect} />
            ) : (
              <Toolpost active={activeNumber} onSelect={onSelect} />
            )}
          </g>
          <g className="lc-callouts">
            {callouts.map((callout) => {
              const entry = entries.find(
                (candidate) => candidate.number === callout.number,
              );
              const label = entry
                ? `${entry.number}. ${entry.name[lang]}`
                : String(callout.number);
              const elbow = callout.elbow ?? callout.point;
              return (
                <g
                  key={callout.number}
                  className={`lc-callout${activeNumber === callout.number ? " is-active" : ""}`}
                >
                  <path
                    className="lc-leader"
                    d={`M${callout.badge[0]} ${callout.badge[1]}L${elbow[0]} ${elbow[1]}L${callout.point[0]} ${callout.point[1]}`}
                    aria-hidden="true"
                  />
                  <circle
                    className="lc-target"
                    cx={callout.point[0]}
                    cy={callout.point[1]}
                    r="3.5"
                    aria-hidden="true"
                  />
                  <g
                    className="lc-callout-button"
                    role="button"
                    tabIndex={0}
                    aria-label={label}
                    aria-pressed={activeNumber === callout.number}
                    onClick={() => onSelect(callout.number)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        onSelect(callout.number);
                      }
                    }}
                  >
                    <title>{label}</title>
                    <circle
                      className="lc-hit-target"
                      cx={callout.badge[0]}
                      cy={callout.badge[1]}
                      r="30"
                    />
                    <circle
                      className="lc-badge"
                      cx={callout.badge[0]}
                      cy={callout.badge[1]}
                      r="21"
                    />
                    <text
                      x={callout.badge[0]}
                      y={callout.badge[1]}
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      {callout.number}
                    </text>
                  </g>
                </g>
              );
            })}
          </g>
        </svg>
      </div>
      <figcaption>
        <div className="lc-current" aria-live="polite">
          <b>{selected?.number ?? "—"}</b>
          <strong>
            {selected?.name[lang] ??
              say(lang, "Виберіть вузол", "Select an assembly")}
          </strong>
        </div>
        <p>
          {view === "machine"
            ? say(
                lang,
                "Оглядова схема з нумерацією вузлів ТВ-6М. Частину корпусів умовно прибрано, щоб показати привод. Положення органів керування перевіряйте за паспортом конкретного верстата.",
                "Overview using the TV-6M assembly numbering. Some housings are shown open to expose the drive. Locate controls using the actual machine’s manual.",
              )
            : say(
                lang,
                "Різцетримач закріплюють на верхніх полозках супорта. Різець затискають у його пазу болтами; корпус різця та різальна пластина є окремими деталями.",
                "The tool post mounts on the compound slide. Clamping bolts secure the cutting tool in its slot; the tool shank and cutting insert are separate parts.",
              )}
        </p>
      </figcaption>
    </figure>
  );
}
