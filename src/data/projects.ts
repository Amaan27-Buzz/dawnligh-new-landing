export type Project = {
  slug: 'oscar' | 'kinetable' | 'takokit' | 'aish';
  name: string;
  type: string;
  summary: string;
  description: string;
  status: 'In development' | 'Active project';
  art: string;
  detail: string[];
};
export const projects: Project[] = [
  {
    slug: 'oscar', name: 'OSCAR', type: 'Personal intelligence',
    summary: 'A personal intelligence designed to work across devices, applications and environments.',
    description: 'OSCAR explores how a personal intelligence could help coordinate tasks, work with tools and delegate through specialized Workers while keeping people in control.',
    status: 'In development', art: 'oscar',
    detail: ['Coordinate tasks across tools and environments.', 'Delegate through specialized Workers.', 'Keep permissions and approvals under user control.'],
  },
  {
    slug: 'kinetable', name: 'KineTable', type: 'Visual hardware development',
    summary: 'A more intuitive way to explore electronics and hardware development.',
    description: 'KineTable explores an AI-native visual environment for circuits, components, connections and hardware logic.',
    status: 'In development', art: 'kinetable',
    detail: ['Explore electronics and components visually.', 'Understand relationships between connections and hardware logic.', 'Investigate more approachable hardware workflows.'],
  },
  {
    slug: 'takokit', name: 'Takokit', type: 'Voice-model runtime',
    summary: 'Run and manage voice models on your own machine.',
    description: 'Takokit brings speech-to-text, text-to-speech and related workflows into a unified local runtime with multiple models and execution backends.',
    status: 'Active project', art: 'takokit',
    detail: ['Speech-to-text and text-to-speech workflows.', 'Multiple voice-model backends.', 'Local processing and user control.'],
  },
  {
    slug: 'aish', name: 'AiSH', type: 'Intelligent shell',
    summary: 'Turn plain-language intentions into commands you can inspect and control.',
    description: 'AiSH helps people plan terminal operations in natural language, with visible commands and user-controlled execution.',
    status: 'Active project', art: 'aish',
    detail: ['Describe a task in natural language.', 'Inspect the proposed commands.', 'Keep execution subject to user approval.'],
  },
];
// Subdomain sites and DawnlightLabs repositories are planned, NOT verified live.
// Add external links only after an explicit availability and factual review.
export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
