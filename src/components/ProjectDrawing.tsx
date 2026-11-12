import { useId } from 'react';
import type { ReactNode } from 'react';
import type { Lang } from '../data/types';
import './ProjectDrawing.css';

interface Props {
  id: string;
  lang: Lang;
  compact?: boolean;
}
interface DrawingProps {
  compact: boolean;
  lang: Lang;
  marker: string;
  hatch: string;
}
const phrase = (lang: Lang, uk: string, en: string) => lang === 'uk' ? uk : en;
const line = (x1: number, y1: number, x2: number, y2: number, className = '') => <line x1={x1} y1={y1} x2={x2} y2={y2} className={className} />;
function H({ x1, x2, y, edge, label, marker }: { x1: number; x2: number; y: number; edge: number; label: string; marker: string }) {
  return <g className="project-drawing-dimension">
    {line(x1, edge, x1, y + (y > edge ? 7 : -7))}
    {line(x2, edge, x2, y + (y > edge ? 7 : -7))}
    <line x1={x1} y1={y} x2={x2} y2={y} markerStart={`url(#${marker})`} markerEnd={`url(#${marker})`} />
    <text x={(x1 + x2) / 2} y={y - 9} textAnchor="middle">{label}</text>
  </g>;
}
function V({ y1, y2, x, edge, label, marker }: { y1: number; y2: number; x: number; edge: number; label: string; marker: string }) {
  const cy = (y1 + y2) / 2;
  return <g className="project-drawing-dimension">
    {line(edge, y1, x + (x > edge ? 7 : -7), y1)}
    {line(edge, y2, x + (x > edge ? 7 : -7), y2)}
    <line x1={x} y1={y1} x2={x} y2={y2} markerStart={`url(#${marker})`} markerEnd={`url(#${marker})`} />
    <text x={x - 9} y={cy} textAnchor="middle" transform={`rotate(-90 ${x - 9} ${cy})`}>{label}</text>
  </g>;
}
function Leader({ points, x, y, children, anchor = 'start' }: { points: string; x: number; y: number; children: ReactNode; anchor?: 'start' | 'middle' | 'end' }) {
  return <g className="project-drawing-dimension"><polyline points={points} /><text x={x} y={y} textAnchor={anchor}>{children}</text></g>;
}
function Center({ x, y, width, height }: { x: number; y: number; width: number; height: number }) {
  return <g className="project-drawing-center">{line(x - width / 2, y, x + width / 2, y)}{line(x, y - height / 2, x, y + height / 2)}</g>;
}
function Label({ x, y, children }: { x: number; y: number; children: ReactNode }) {
  return <text className="project-drawing-view-label" x={x} y={y} textAnchor="middle">{children}</text>;
}
function Spacer({ compact, lang, marker, hatch }: DrawingProps) {
  if (compact) return <>
    <circle cx="112" cy="118" r="58" /><circle cx="112" cy="118" r="23.2" />
    <Center x={112} y={118} width={145} height={145} />
    <path d="M252 60H339V94.8H252ZM252 141.2H339V176H252Z" fill={`url(#${hatch})`} />
    {line(238, 118, 353, 118, 'project-drawing-center')}
    <V y1={60} y2={176} x={29} edge={54} label="Ø20" marker={marker} />
    <H x1={252} x2={339} y={214} edge={176} label="15" marker={marker} />
    <Leader points="128,102 176,55 207,55" x={177} y={44}>Ø8</Leader>
  </>;
  return <>
    <circle cx="175" cy="180" r="90" /><circle cx="175" cy="180" r="36" />
    <Center x={175} y={180} width={220} height={220} />
    <path d="M415 90H550V144H415ZM415 216H550V270H415Z" fill={`url(#${hatch})`} />
    {line(394, 180, 571, 180, 'project-drawing-center')}
    <V y1={90} y2={270} x={45} edge={85} label="Ø20" marker={marker} />
    <H x1={415} x2={550} y={318} edge={270} label="15" marker={marker} />
    <Leader points="201,154 275,68 315,68" x={280} y={57}>Ø8</Leader>
    <Label x={175} y={357}>{phrase(lang, 'ТОРЦЕВИЙ ВИД', 'END VIEW')}</Label>
    <Label x={483} y={357}>{phrase(lang, 'ОСЬОВИЙ РОЗРІЗ', 'AXIAL SECTION')}</Label>
  </>;
}
function Shaft({ compact, lang, marker }: DrawingProps) {
  if (compact) return <>
    <path d="M70 90H210V104H350V169.3H210V183.3H70Z" />
    {line(52, 136.65, 368, 136.65, 'project-drawing-center')}
    <H x1={70} x2={210} y={48} edge={90} label="30" marker={marker} />
    <H x1={210} x2={350} y={48} edge={104} label="30" marker={marker} />
    <H x1={70} x2={350} y={230} edge={183.3} label="60" marker={marker} />
    <V y1={90} y2={183.3} x={35} edge={70} label="Ø20" marker={marker} />
    <V y1={104} y2={169.3} x={390} edge={350} label="Ø14" marker={marker} />
  </>;
  return <>
    <path d="M105 100H330V122.5H555V227.5H330V250H105Z" />
    {line(80, 175, 580, 175, 'project-drawing-center')}
    <H x1={105} x2={330} y={62} edge={100} label="30" marker={marker} />
    <H x1={330} x2={555} y={62} edge={122.5} label="30" marker={marker} />
    <H x1={105} x2={555} y={313} edge={250} label="60" marker={marker} />
    <V y1={100} y2={250} x={58} edge={105} label="Ø20" marker={marker} />
    <V y1={122.5} y2={227.5} x={610} edge={555} label="Ø14" marker={marker} />
    <Label x={330} y={357}>{phrase(lang, 'БОКОВИЙ ВИД · ВІСЬ ОБЕРТАННЯ', 'SIDE VIEW · AXIS OF ROTATION')}</Label>
  </>;
}
function Plate({ compact, lang, marker }: DrawingProps) {
  if (compact) return <>
    <rect x="92" y="55" width="240" height="150" />
    {[137, 287].flatMap(x => [85, 175].map(y => <g key={`${x}-${y}`}><circle cx={x} cy={y} r="9" /><Center x={x} y={y} width={29} height={29} /></g>))}
    <H x1={92} x2={332} y={242} edge={205} label="80" marker={marker} />
    <V y1={55} y2={205} x={54} edge={92} label="50" marker={marker} />
    <Leader points="287,76 307,28 353,28" x={310} y={19}>4 × Ø6</Leader>
    <text x="370" y="193" className="project-drawing-note" textAnchor="middle">t = 10</text>
  </>;
  return <>
    <rect x="95" y="65" width="360" height="225" />
    {[162.5, 387.5].flatMap(x => [110, 245].map(y => <g key={`${x}-${y}`}><circle cx={x} cy={y} r="13.5" /><Center x={x} y={y} width={42} height={42} /></g>))}
    <H x1={95} x2={455} y={340} edge={290} label="80" marker={marker} />
    <V y1={65} y2={290} x={46} edge={95} label="50" marker={marker} />
    <H x1={95} x2={162.5} y={33} edge={65} label="15" marker={marker} />
    <H x1={162.5} x2={387.5} y={33} edge={65} label="50" marker={marker} />
    <H x1={387.5} x2={455} y={33} edge={65} label="15" marker={marker} />
    <V y1={65} y2={110} x={491} edge={455} label="10" marker={marker} />
    <V y1={110} y2={245} x={491} edge={455} label="30" marker={marker} />
    <V y1={245} y2={290} x={491} edge={455} label="10" marker={marker} />
    <rect x="572" y="65" width="45" height="225" />
    {[96.5, 123.5, 231.5, 258.5].map(y => <line key={y} x1="572" y1={y} x2="617" y2={y} className="project-drawing-hidden" />)}
    <H x1={572} x2={617} y={340} edge={290} label="10" marker={marker} />
    <Leader points="387.5,96.5 443,9 536,9" x={539} y={15}>4 × Ø6</Leader>
    <Label x={275} y={377}>{phrase(lang, 'ВИД ЗВЕРХУ', 'TOP VIEW')}</Label>
    <Label x={595} y={377}>{phrase(lang, 'БОКОВИЙ ВИД', 'SIDE VIEW')}</Label>
  </>;
}
function Pocket({ compact, lang, marker, hatch }: DrawingProps) {
  if (compact) return <>
    <rect x="85" y="61" width="238" height="170" />
    <rect x="119" y="95" width="170" height="102" rx="11" className="project-drawing-pocket" />
    <H x1={85} x2={323} y={34} edge={61} label="70" marker={marker} />
    <V y1={61} y2={231} x={48} edge={85} label="50" marker={marker} />
    <text x="204" y="141" className="project-drawing-note" textAnchor="middle">50 × 30</text>
    <text x="204" y="164" className="project-drawing-note" textAnchor="middle">{phrase(lang, 'глибина 20', 'depth 20')}</text>
    <text x="373" y="169" className="project-drawing-note" textAnchor="middle">h = 30</text>
  </>;
  return <>
    <rect x="80" y="65" width="315" height="225" />
    <rect x="125" y="110" width="225" height="135" rx="13" className="project-drawing-pocket" />
    <H x1={80} x2={395} y={33} edge={65} label="70" marker={marker} />
    <V y1={65} y2={290} x={39} edge={80} label="50" marker={marker} />
    <H x1={125} x2={350} y={333} edge={245} label="50" marker={marker} />
    <V y1={110} y2={245} x={430} edge={350} label="30" marker={marker} />
    <path d="M495 134H522.5V189H660V134H687.5V216.5H495Z" fill={`url(#${hatch})`} />
    <V y1={134} y2={216.5} x={725} edge={687.5} label="30" marker={marker} />
    <V y1={134} y2={189} x={626} edge={660} label="20" marker={marker} />
    <Label x={238} y={377}>{phrase(lang, 'ВИД ЗВЕРХУ', 'TOP VIEW')}</Label>
    <Label x={591} y={263}>{phrase(lang, 'РОЗРІЗ ЧЕРЕЗ КИШЕНЮ', 'SECTION THROUGH POCKET')}</Label>
    <text className="project-drawing-note" x="591" y="304" textAnchor="middle">{phrase(lang, 'R — за інструментом', 'R — to suit the tool')}</text>
  </>;
}
function Flange({ compact, lang, marker }: DrawingProps) {
  const x = compact ? 148 : 222;
  const y = compact ? 139 : 190;
  const scale = compact ? 2.55 : 3.7;
  const ro = 35 * scale;
  const rb = 10 * scale;
  const rp = 25 * scale;
  const rh = 3 * scale;
  const sideX = compact ? 330 : 540;
  const sideWidth = 12 * scale;
  return <>
    <circle cx={x} cy={y} r={ro} />
    <circle cx={x} cy={y} r={rb} />
    <circle cx={x} cy={y} r={rp} className="project-drawing-center" />
    {[[x - rp, y], [x + rp, y], [x, y - rp], [x, y + rp]].map(([cx, cy], i) => <g key={i}><circle cx={cx} cy={cy} r={rh} /><Center x={cx} y={cy} width={rh * 3.6} height={rh * 3.6} /></g>)}
    <Center x={x} y={y} width={ro * 2 + 30} height={ro * 2 + 30} />
    <rect x={sideX} y={y - ro} width={sideWidth} height={ro * 2} />
    {[y - rb, y + rb, y - rp - rh, y - rp + rh, y + rp - rh, y + rp + rh].map(ly => <line key={ly} x1={sideX} y1={ly} x2={sideX + sideWidth} y2={ly} className="project-drawing-hidden" />)}
    {line(sideX - 16, y, sideX + sideWidth + 16, y, 'project-drawing-center')}
    {compact ? <>
      <text x={x} y={y + 5} className="project-drawing-blue-label" textAnchor="middle">Ø20</text>
      <Leader points={`${x - ro * .7},${y - ro * .7} 59,31 24,31`} x={19} y={23}>Ø70</Leader>
      <Leader points={`${x + rp * .7},${y - rp * .7} 237,26 288,26`} x={237} y={18}>PCD Ø50</Leader>
      <text x={148} y={251} className="project-drawing-blue-label" textAnchor="middle">4 × Ø6</text>
      <H x1={sideX} x2={sideX + sideWidth} y={252} edge={y + ro} label="12" marker={marker} />
    </> : <>
      <Leader points={`${x - ro * .7},${y - ro * .7} 92,42 42,42`} x={35} y={33}>Ø70</Leader>
      <Leader points={`${x + rb * .7},${y - rb * .7} 355,90 409,90`} x={415} y={96}>Ø20</Leader>
      <Leader points={`${x + rp * .7},${y + rp * .7} 371,290 427,290`} x={433} y={296}>PCD Ø50</Leader>
      <Leader points={`${x},${y - rp - rh} 313,29 382,29`} x={389} y={35}>4 × Ø6</Leader>
      <H x1={sideX} x2={sideX + sideWidth} y={360} edge={y + ro} label="12" marker={marker} />
      <Label x={x} y={380}>{phrase(lang, 'ТОРЦЕВИЙ ВИД', 'END VIEW')}</Label>
      <Label x={sideX + sideWidth / 2} y={396}>{phrase(lang, 'БОКОВИЙ ВИД', 'SIDE VIEW')}</Label>
    </>}
  </>;
}
function Knob({ compact, lang, marker }: DrawingProps) {
  if (compact) return <>
    <path d="M78 57H120V100H193V150H120V195H78Z" className="project-drawing-provisional" />
    {line(60, 126, 211, 126, 'project-drawing-center')}
    {line(78, 115, 193, 115, 'project-drawing-hidden')}{line(78, 137, 193, 137, 'project-drawing-hidden')}
    <circle cx="313" cy="126" r="69" /><circle cx="313" cy="126" r="12" className="project-drawing-provisional" />
    <Center x={313} y={126} width={158} height={158} />
    <V y1={57} y2={195} x={40} edge={78} label="Ø30" marker={marker} />
    <H x1={78} x2={193} y={235} edge={195} label="25" marker={marker} />
    <Leader points="313,138 340,220 372,220" x={355} y={244}>Ø?</Leader>
    <text x="313" y="25" className="project-drawing-note" textAnchor="middle">{phrase(lang, 'обміряти зразок', 'measure the sample')}</text>
  </>;
  return <>
    <path d="M125 80H190V130H275V210H190V260H125Z" className="project-drawing-provisional" />
    {line(100, 170, 300, 170, 'project-drawing-center')}
    {line(125, 155, 275, 155, 'project-drawing-hidden')}{line(125, 185, 275, 185, 'project-drawing-hidden')}
    <circle cx="510" cy="170" r="90" /><circle cx="510" cy="170" r="16" className="project-drawing-provisional" />
    <Center x={510} y={170} width={215} height={215} />
    <V y1={80} y2={260} x={77} edge={125} label="Ø30" marker={marker} />
    <H x1={125} x2={275} y={316} edge={260} label="25" marker={marker} />
    <Leader points="275,130 326,83 354,83" x={360} y={89}>Ø?</Leader>
    <Leader points="521,158 611,86 659,86" x={665} y={92}>Ø?</Leader>
    <Label x={200} y={359}>{phrase(lang, 'УМОВНИЙ БОКОВИЙ ВИД', 'INDICATIVE SIDE VIEW')}</Label>
    <Label x={510} y={310}>{phrase(lang, 'ТОРЦЕВИЙ ВИД', 'END VIEW')}</Label>
    <text x="510" y="349" className="project-drawing-note" textAnchor="middle">{phrase(lang, 'Отвір і шийку — обміряти', 'Measure the bore and neck')}</text>
  </>;
}
const drawings: Record<string, (props: DrawingProps) => ReactNode> = {
  spacer: Spacer,
  'stepped-shaft': Shaft,
  'fixture-plate': Plate,
  'angle-bracket': Pocket,
  flange: Flange,
  'replacement-knob': Knob,
};
const names: Record<string, Record<Lang, string>> = {
  spacer: { uk: 'Проставка Ø20 × 15 мм з отвором Ø8 мм', en: 'Ø20 × 15 mm spacer with Ø8 mm bore' },
  'stepped-shaft': { uk: 'Валик довжиною 60 мм, дві шийки по 30 мм, діаметри 20 і 14 мм', en: '60 mm shaft, two 30 mm journals, diameters 20 and 14 mm' },
  'fixture-plate': { uk: 'Пластина 80 × 50 × 10 мм з чотирма отворами Ø6 мм', en: '80 × 50 × 10 mm plate with four Ø6 mm holes' },
  'angle-bracket': { uk: 'Блок 70 × 50 × 30 мм із кишенею 50 × 30 × 20 мм', en: '70 × 50 × 30 mm block with a 50 × 30 × 20 mm pocket' },
  flange: { uk: 'Плоский фланець Ø70 × 12 мм, отвір Ø20 мм, чотири отвори Ø6 мм на колі Ø50 мм', en: 'Flat Ø70 × 12 mm flange, Ø20 mm bore, four Ø6 mm holes on a Ø50 mm circle' },
  'replacement-knob': { uk: 'Орієнтир ручки: головка Ø30 мм, загальна довжина 25 мм; отвір і шийка потребують обміру', en: 'Indicative knob: Ø30 mm head, 25 mm overall length; bore and neck require measurement' },
};
export default function ProjectDrawing({ id, lang, compact = false }: Props) {
  const unique = useId().replace(/:/g, '');
  const marker = `dimension-arrow-${unique}`;
  const hatch = `section-hatch-${unique}`;
  const titleId = `drawing-title-${unique}`;
  const descId = `drawing-description-${unique}`;
  const title = names[id]?.[lang] ?? phrase(lang, 'Навчальний ескіз', 'Practice sketch');
  const Drawing = drawings[id];
  const notice = phrase(lang, 'Навчальна схема, не виробниче креслення. Розміри в мм; допуски, матеріал і технологію погодьте до виготовлення.', 'Learning schematic, not a production drawing. Dimensions in mm; agree tolerances, material and process before manufacture.');
  return <figure className={`project-drawing${compact ? ' project-drawing-compact' : ''}`}>
    {!compact && <div className="project-drawing-heading"><span>{phrase(lang, 'Ортогональні види', 'Orthographic views')}</span><span>{phrase(lang, 'Розміри: мм', 'Dimensions: mm')}</span></div>}
    <svg viewBox={compact ? '0 0 420 270' : '0 0 760 410'} role="img" aria-labelledby={`${titleId} ${descId}`}>
      <title id={titleId}>{title}</title><desc id={descId}>{notice}</desc>
      <defs>
        <marker id={marker} markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto-start-reverse" markerUnits="userSpaceOnUse"><path d="M0 0L7 3.5L0 7Z" fill="#205f9b" stroke="none" /></marker>
        <pattern id={hatch} width="8" height="8" patternUnits="userSpaceOnUse"><path d="M-2 2L2-2M0 8L8 0M6 10L10 6" stroke="#a7afb8" strokeWidth=".75" /></pattern>
      </defs>
      <g className="project-drawing-geometry">{Drawing ? <Drawing compact={compact} lang={lang} marker={marker} hatch={hatch} /> : <Label x={compact ? 210 : 380} y={compact ? 135 : 205}>{phrase(lang, 'Ескіз уточнюється', 'Drawing pending')}</Label>}</g>
    </svg>
    <figcaption>
      {compact ? phrase(lang, 'Навчальна схема · мм', 'Learning schematic · mm') : notice}
      {!compact && id === 'angle-bracket' && <span>{phrase(lang, 'Положення й радіуси кишені слід задати окремим кресленням.', 'Define the pocket position and radii in a separate drawing.')}</span>}
      {!compact && id === 'replacement-knob' && <span>{phrase(lang, 'Пунктиром показана умовна форма. Розміри отвору, шийки та товщину головки зніміть з оригіналу.', 'Dashed lines show an indicative shape. Measure the bore, neck and head thickness from the original.')}</span>}
    </figcaption>
  </figure>;
}
