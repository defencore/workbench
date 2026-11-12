export type Lang = "uk" | "en";
export type Text = Record<Lang, string>;
export type CategoryId =
  | "machine-care"
  | "tooling"
  | "safety"
  | "fundamentals"
  | "lathe"
  | "milling"
  | "cnc"
  | "materials"
  | "measurement"
  | "reverse";
export type Level = "beginner" | "intermediate" | "advanced";
export type ModelKind =
  "shaft" | "flange" | "bracket" | "vice" | "lathe" | "pocket";
export interface Step {
  title: Text;
  body: Text;
  check?: Text;
}
export interface Lesson {
  id: string;
  category: CategoryId;
  title: Text;
  summary: Text;
  minutes: number;
  level: Level;
  tags: Text[];
  prerequisites: string[];
  hazards: Text[];
  steps: Step[];
  takeaways: Text[];
  sources: string[];
  model?: ModelKind;
  quiz: { question: Text; options: Text[]; correct: number; explanation: Text };
}
export type ProjectFamily =
  "turning" | "milling" | "cnc" | "hybrid" | "fixturing" | "reverse";
export interface HoleGeometry {
  /** Hole centre in the face plane: box coordinates from the lower-left datum corner; turned coordinates from the axis. */
  x: number;
  y: number;
  diameter: number;
  depth?: number;
  thread?: string;
  counterbore?: { diameter: number; depth: number };
}
export interface TurnedGeometry {
  kind: "turned";
  /** Sections follow the axis from the left reference face A; all geometry is in millimetres. */
  sections: { length: number; diameter: number }[];
  bore?: {
    diameter: number;
    depth?: number;
    thread?: string;
    counterbore?: { diameter: number; depth: number };
  };
  holes?: HoleGeometry[];
  externalThread?: {
    from: number;
    length: number;
    designation: string;
    majorDiameter: number;
  };
}
export interface BlockGeometry {
  kind: "block";
  width: number;
  depth: number;
  height: number;
  cornerRadius?: number;
  holes?: HoleGeometry[];
  /** Pocket x/y locate the lower-left corner; cutDepth is measured down from the top face. */
  pockets?: {
    x: number;
    y: number;
    width: number;
    depth: number;
    cutDepth: number;
    cornerRadius: number;
  }[];
  /** Slot x/y locate its centre; length is the total end-to-end length. */
  slots?: {
    x: number;
    y: number;
    length: number;
    width: number;
    cutDepth: number;
    axis: "x" | "y";
  }[];
}
export type PartGeometry = TurnedGeometry | BlockGeometry;
export interface ProjectFeature {
  id: string;
  name: Text;
  spec: string;
  datum: string;
  unit: "mm" | "deg" | "um" | "thread" | "visual";
  nominal?: number;
  lower?: number;
  upper?: number;
  /** Optional numeric path in part geometry, such as sections.0.diameter; length sums turned sections. */
  geometryRef?: string;
  method: Text;
  instrument: Text;
}
export interface ProjectFixture {
  id: string;
  name: Text;
  kind:
    | "chuck"
    | "soft-jaws"
    | "split-bush"
    | "mandrel"
    | "sacrificial-plate"
    | "angle-plate"
    | "drill-jig"
    | "parallels"
    | "stop"
    | "collet"
    | "vise"
    | "carrier";
  made: boolean;
  purpose: Text;
  stock: Text;
  dimensions: Text;
  hardware: Text[];
  manufacture: Text[];
  preparation: Text[];
  acceptance: Text[];
  geometry?: PartGeometry;
}
export interface ManufacturingOperation {
  id: string;
  title: Text;
  instruction: Text;
  tool: Text;
  allowance: Text;
  inspection: Text;
  stop: Text;
  featureIds: string[];
}
export interface ManufacturingSetup {
  id: string;
  title: Text;
  machine: Text;
  purpose: Text;
  orientation: Text;
  datums: Text;
  workholding: Text;
  fixtureIds: string[];
  preparation: Text[];
  operations: ManufacturingOperation[];
  inspection: Text[];
  release: Text;
  transfer: Text;
  diagram: {
    view: "turning" | "milling" | "drilling" | "inspection";
    clamping:
      | "chuck"
      | "collet"
      | "soft-jaws"
      | "mandrel"
      | "vise"
      | "strap-clamps"
      | "fixture-plate"
      | "angle-plate"
      | "v-block";
    flip: boolean;
    gripLength?: number;
    supportHeight?: number;
    datumA?: "left" | "right" | "top" | "bottom" | "front" | "back";
    oppositeFace?: string;
    toolApproach?: "top" | "left" | "right" | "axial";
    highlight: Text;
  };
}
export interface CuttingCalculation {
  tool: Text;
  diameter: number;
  vc: number;
  teeth?: number;
  feedPerTooth?: number;
  feedPerRev?: number;
  rpmLimit: number;
  /** Values are an explicitly assumed arithmetic example, not an approved machine cutting schedule. */
  assumptions: Text;
  confirmation: Text;
}
export interface Project {
  id: string;
  revision: string;
  title: Text;
  summary: Text;
  level: Level;
  family: ProjectFamily;
  quantity?: number;
  material: Text;
  duration: Text;
  purpose: Text;
  equipment: Text[];
  stock: { form: Text; size: string; preparation: Text[] };
  part: PartGeometry;
  datums: { id: string; description: Text }[];
  features: ProjectFeature[];
  fixtures: ProjectFixture[];
  setups: ManufacturingSetup[];
  cutting: CuttingCalculation[];
  qualityPlan: Text[];
  pitfalls: Text[];
  hazards: Text[];
  lessons: string[];
  sources: string[];
}
export interface Source {
  id: string;
  title: string;
  url: string;
  publisher: string;
}

export type MaterialId =
  | "aluminium"
  | "carbon-steel"
  | "stainless"
  | "brass"
  | "pom"
  | "pa6"
  | "cast-iron"
  | "copper"
  | "titanium";
export interface MaterialMethod {
  operation: "turning" | "milling" | "drilling" | "finishing";
  tool: Text;
  setup: Text;
  technique: Text;
  chips: Text;
  expected: Text;
  avoid: Text;
}
export interface MaterialDefect {
  symptom: Text;
  cause: Text;
  checks: Text;
  response: Text;
}
export interface MaterialExercise {
  title: Text;
  goal: Text;
  stock: Text;
  tools: Text[];
  steps: Step[];
  result: Text;
  measure: Text[];
  projectIds: string[];
}
export interface MaterialGuide {
  id: MaterialId;
  name: Text;
  grades: Text;
  level: Level;
  summary: Text;
  behaviour: Text[];
  preparation: Text[];
  methods: MaterialMethod[];
  defects: MaterialDefect[];
  exercises: MaterialExercise[];
  finishing: Text[];
  hazards: Text[];
  sources: string[];
  appearance: {
    color: string;
    metalness: number;
    roughness: number;
    chip: "ribbon" | "segmented" | "short" | "dust";
  };
}
