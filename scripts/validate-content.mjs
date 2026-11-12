import process from 'node:process';

const errors = [];
const categoryIds = ['machine-care', 'tooling', 'safety', 'fundamentals', 'lathe', 'milling', 'cnc', 'materials', 'measurement', 'reverse'];
const levels = new Set(['beginner', 'intermediate', 'advanced']);
const models = new Set(['shaft', 'flange', 'bracket', 'vice', 'lathe', 'spacer', 'plate', 'pocket', 'knob', 'practice-shaft', 'practice-flange']);
const isRecord = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const report = (condition, message) => { if (!condition) errors.push(message); };
const nonemptyString = value => typeof value === 'string' && value.trim().length > 0;

function text(value, path) {
  if (!isRecord(value)) {
    errors.push(`${path}: expected an object with uk and en translations`);
    return;
  }
  for (const lang of ['uk', 'en']) report(nonemptyString(value[lang]), `${path}.${lang}: translation is empty or missing`);
}

function list(value, path, minimum = 1) {
  if (!Array.isArray(value)) {
    errors.push(`${path}: expected an array`);
    return [];
  }
  report(value.length >= minimum, `${path}: requires at least ${minimum} item(s), got ${value.length}`);
  return value;
}

function texts(value, path, minimum = 1) {
  list(value, path, minimum).forEach((entry, index) => text(entry, `${path}[${index}]`));
}

function steps(value, path) {
  list(value, path, 5).forEach((entry, index) => {
    const location = `${path}[${index}]`;
    if (!isRecord(entry)) return errors.push(`${location}: expected a step object`);
    text(entry.title, `${location}.title`);
    text(entry.body, `${location}.body`);
    if (entry.check !== undefined) text(entry.check, `${location}.check`);
  });
}

function uniqueIds(entries, path) {
  const ids = new Set();
  entries.forEach((entry, index) => {
    const location = `${path}[${index}]`;
    if (!isRecord(entry)) return errors.push(`${location}: expected an object`);
    report(typeof entry.id === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.id), `${location}.id: requires a nonempty lowercase slug`);
    report(!ids.has(entry.id), `${location}.id: duplicate ID ${JSON.stringify(entry.id)}`);
    ids.add(entry.id);
  });
  return ids;
}

function references(value, path, availableIds, minimum = 0) {
  const entries = list(value, path, minimum);
  const used = new Set();
  entries.forEach((id, index) => {
    report(typeof id === 'string' && availableIds.has(id), `${path}[${index}]: unknown reference ${JSON.stringify(id)}`);
    report(!used.has(id), `${path}[${index}]: repeated reference ${JSON.stringify(id)}`);
    used.add(id);
  });
}

let content;
try {
  content = await import('../src/data/content.ts');
} catch (error) {
  console.error(`Could not load the curriculum: ${error.message}`);
  console.error('Use Node.js 24 or later and ensure src/data/content.ts is complete.');
  process.exit(1);
}

const lessons = list(content.lessons, 'lessons');
const projects = list(content.projects, 'projects');
const sources = list(content.sources, 'sources');
const lessonIds = uniqueIds(lessons, 'lessons');
const projectIds = uniqueIds(projects, 'projects');
const sourceIds = uniqueIds(sources, 'sources');
for (const id of projectIds) report(!lessonIds.has(id), `projects: ID ${JSON.stringify(id)} is also used by a lesson`);

sources.forEach((source, index) => {
  if (!isRecord(source)) return;
  const path = `sources[${index}]`;
  for (const field of ['title', 'publisher']) report(nonemptyString(source[field]), `${path}.${field}: requires a nonempty string`);
  try {
    const url = new URL(source.url);
    report(url.protocol === 'https:' && Boolean(url.hostname), `${path}.url: requires an absolute HTTPS address`);
  } catch {
    errors.push(`${path}.url: invalid source URL`);
  }
});

const counts = Object.fromEntries(categoryIds.map(id => [id, 0]));
lessons.forEach((lesson, index) => {
  if (!isRecord(lesson)) return;
  const path = `lessons[${index}] (${lesson.id})`;
  report(categoryIds.includes(lesson.category), `${path}.category: unknown category`);
  if (categoryIds.includes(lesson.category)) counts[lesson.category]++;
  report(levels.has(lesson.level), `${path}.level: unknown difficulty`);
  report(Number.isInteger(lesson.minutes) && lesson.minutes > 0, `${path}.minutes: requires a positive integer`);
  for (const field of ['title', 'summary']) text(lesson[field], `${path}.${field}`);
  for (const field of ['tags', 'hazards', 'takeaways']) texts(lesson[field], `${path}.${field}`);
  references(lesson.prerequisites, `${path}.prerequisites`, lessonIds);
  report(!Array.isArray(lesson.prerequisites) || !lesson.prerequisites.includes(lesson.id), `${path}.prerequisites: a lesson cannot require itself`);
  references(lesson.sources, `${path}.sources`, sourceIds, 1);
  if (lesson.model !== undefined) report(models.has(lesson.model), `${path}.model: unknown 3D model`);
  steps(lesson.steps, `${path}.steps`);
  if (!isRecord(lesson.quiz)) return errors.push(`${path}.quiz: missing quiz`);
  text(lesson.quiz.question, `${path}.quiz.question`);
  text(lesson.quiz.explanation, `${path}.quiz.explanation`);
  texts(lesson.quiz.options, `${path}.quiz.options`, 2);
  report(Array.isArray(lesson.quiz.options) && Number.isInteger(lesson.quiz.correct) && lesson.quiz.correct >= 0 && lesson.quiz.correct < lesson.quiz.options.length, `${path}.quiz.correct: correct option is outside the options array`);
});
for (const id of categoryIds) report(counts[id] > 0, `lessons: category ${id} has no lessons`);

projects.forEach((project, index) => {
  if (!isRecord(project)) return;
  const path = `projects[${index}] (${project.id})`;
  report(levels.has(project.level), `${path}.level: unknown difficulty`);
  report(models.has(project.model), `${path}.model: unknown 3D model`);
  for (const field of ['title', 'summary', 'material', 'duration', 'dimensions']) text(project[field], `${path}.${field}`);
  for (const field of ['hazards', 'tools', 'inspect']) texts(project[field], `${path}.${field}`);
  references(project.lessons, `${path}.lessons`, lessonIds, 1);
  steps(project.steps, `${path}.steps`);
});

// Detect circular prerequisites independently of the source array order.
const byId = new Map(lessons.filter(isRecord).map(lesson => [lesson.id, lesson]));
const visiting = new Set();
const visited = new Set();
function visit(id, trail = []) {
  if (visiting.has(id)) {
    errors.push(`prerequisites: cycle ${[...trail, id].join(' → ')}`);
    return;
  }
  if (visited.has(id) || !byId.has(id)) return;
  visiting.add(id);
  const prerequisites = byId.get(id).prerequisites;
  if (Array.isArray(prerequisites)) for (const prerequisite of prerequisites) visit(prerequisite, [...trail, id]);
  visiting.delete(id);
  visited.add(id);
}
for (const id of lessonIds) visit(id);

if (errors.length) {
  console.error(`Curriculum validation failed with ${errors.length} issue(s):`);
  errors.forEach(error => console.error(`- ${error}`));
  process.exitCode = 1;
} else {
  console.log(`Curriculum valid: ${lessons.length} lessons, ${projects.length} projects, ${sources.length} sources.`);
  console.log(categoryIds.map(id => `${id}: ${counts[id]}`).join(' | '));
  console.log('Ukrainian/English fields, references, prerequisite graph, steps, quizzes, source URLs and models checked.');
}
