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
  | "shaft"
  | "flange"
  | "bracket"
  | "vice"
  | "lathe"
  | "spacer"
  | "plate"
  | "pocket"
  | "knob"
  | "practice-shaft"
  | "practice-flange";
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
export interface Project {
  id: string;
  title: Text;
  summary: Text;
  level: Level;
  material: Text;
  duration: Text;
  model: ModelKind;
  lessons: string[];
  dimensions: Text;
  steps: Step[];
  hazards: Text[];
  tools: Text[];
  inspect: Text[];
}
export interface Source {
  id: string;
  title: string;
  url: string;
  publisher: string;
}
