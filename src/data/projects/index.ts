import type { Project, Source } from "../types";
import { turningProjects, turningSources } from "./turning.ts";
import { millingProjects, millingSources } from "./milling.ts";
const rank = { beginner: 0, intermediate: 1, advanced: 2 };
export const projects: Project[] = [
  ...turningProjects,
  ...millingProjects,
].sort((a, b) => rank[a.level] - rank[b.level]);
export const projectSources: Source[] = [...turningSources, ...millingSources];
