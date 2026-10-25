import { readFileSync, existsSync } from 'node:fs';
const read = (p) => readFileSync(p, 'utf8');
const required = [
  'assets/dawnlight orb svg.svg', 'assets/dawnlight with sun svg.svg',
  'assets/fonts/Azonix.otf', 'assets/fonts/Neuhade Regular.otf',
  'assets/fonts/Neuhade Light.otf', 'assets/fonts/DMMono-Regular.ttf',
  'src/pages/index.astro', 'src/pages/research.astro',
  'src/pages/projects/index.astro', 'src/pages/projects/[slug].astro',
  'src/pages/about.astro', 'src/pages/contact.astro',
];
const failed = [];
for (const file of required) if (!existsSync(file)) failed.push('Missing file: ' + file);
const brand = read('src/data/brand.ts');
for (const phrase of ['contact@dawnlightlabs.com','Amaan Syed','Sairaj Jawalikar','#0E4490','#FCF8F5']) {
  if (!brand.includes(phrase)) failed.push('Missing approved brand fact: ' + phrase);
}
const projects = read('src/data/projects.ts');
for (const name of ['OSCAR','KineTable','Takokit','AiSH']) {
  if (!projects.includes(name)) failed.push('Missing selected project: ' + name);
}
const header = read('src/components/Header.astro');
if (!header.includes('wordmark-labs')) failed.push('Single-line wordmark must include LABS.');
const pages = ['src/pages/index.astro','src/pages/research.astro','src/pages/projects/index.astro','src/pages/projects/[slug].astro','src/pages/about.astro','src/pages/contact.astro'].map(read).join('\n');
for (const confidential of ['Arif Syed','40%','Dawnlight Group', 'world-model implementation']) {
  if (pages.includes(confidential)) failed.push('Potential internal disclosure: ' + confidential);
}
if (failed.length) { console.error(failed.join('\n')); process.exit(1); }
console.log('Public-content and asset checks passed.');
