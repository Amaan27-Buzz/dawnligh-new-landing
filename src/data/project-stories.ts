import type { Project } from './projects';

export type StoryStep = { index: string; eyebrow: string; title: string; summary: string; tag: string };
export type ProjectStory = {
  claim: string;
  question: string;
  sceneTitle: string;
  sceneIntro: string;
  label: string;
  steps: readonly StoryStep[];
  quote: string;
  discipline: string;
};
export const projectStories: Record<Project['slug'], ProjectStory> = {
  oscar: {
    claim: 'One intelligence. Many places to be.',
    question: 'What if an assistant could work with your digital environment, rather than live inside a single window?',
    sceneTitle: 'A system of connections.',
    sceneIntro: 'Explore three ideas behind OSCAR. This is a conceptual illustration of the direction of the project, not a connected live instance.',
    label: 'SYSTEM CONCEPT / OSCAR',
    discipline: 'PERSONAL INTELLIGENCE',
    quote: 'An intelligence should adapt to the world around you—not ask you to reorganize your world around it.',
    steps: [
      { index:'01', eyebrow:'CONTEXT', title:'One evolving context.', summary:'A personal intelligence designed to keep relevant information connected across tasks and environments.', tag:'CONTEXT LAYER' },
      { index:'02', eyebrow:'COORDINATION', title:'Tools, working together.', summary:'Coordinating applications and actions rather than making people manage separate interfaces for every task.', tag:'TOOL CONNECTIONS' },
      { index:'03', eyebrow:'WORKERS', title:'Specialists, under control.', summary:'A main assistant and specialized Workers designed to tackle different parts of a task while respecting permissions.', tag:'WORKER SYSTEM' },
    ],
  },
  takokit: {
    claim: 'Your voice. Your machine.',
    question: 'Can powerful voice workflows feel approachable without tying every interaction to a remote service?',
    sceneTitle: 'A voice runtime, not a single model.',
    sceneIntro: 'Switch between illustrative processing paths. The animated waveform is synthetic artwork, not recorded or generated speech.',
    label: 'VOICE WORKFLOW / TAKOKIT',
    discipline: 'VOICE SYSTEMS',
    quote: 'The best voice tools should feel effortless on the surface—even when the system underneath is flexible.',
    steps: [
      { index:'01', eyebrow:'LISTEN', title:'From sound to text.', summary:'Explore local speech recognition with selectable model backends and visible processing stages.', tag:'SPEECH-TO-TEXT' },
      { index:'02', eyebrow:'SPEAK', title:'From text to sound.', summary:'Bring text-to-speech workflows together in a unified interface instead of isolated installations.', tag:'TEXT-TO-SPEECH' },
      { index:'03', eyebrow:'ROUTE', title:'Choose the right backend.', summary:'Make model and backend choices clear, with the runtime designed around the machine it runs on.', tag:'RUNTIME LAYER' },
    ],
  },
  kinetable: {
    claim: 'Make the invisible understandable.',
    question: 'What if working with electronics could feel more like thinking through ideas on a living surface?',
    sceneTitle: 'Connections you can follow.',
    sceneIntro: 'An exploratory representation of an electronics workspace. This is not a circuit simulator or a validated electronic design.',
    label: 'HARDWARE CONCEPT / KINETABLE',
    discipline: 'VISUAL HARDWARE',
    quote: 'Complex systems become more useful when people can see, explore and understand their relationships.',
    steps: [
      { index:'01', eyebrow:'COMPOSE', title:'See the components.', summary:'A visual environment for exploring the pieces and relationships that make up electronic systems.', tag:'COMPONENT SPACE' },
      { index:'02', eyebrow:'CONNECT', title:'Follow the logic.', summary:'Make paths, connections and dependencies easier to explore rather than hiding them in disconnected tools.', tag:'CONNECTION MAP' },
      { index:'03', eyebrow:'EXPLORE', title:'Iterate visibly.', summary:'Investigate approaches that make hardware experimentation more intuitive and accessible.', tag:'EXPLORATION' },
    ],
  },
  aish: {
    claim: 'A clearer path from intent to action.',
    question: 'What if using a command line began with what you want to accomplish—and always let you inspect what happens next?',
    sceneTitle: 'An intention, made inspectable.',
    sceneIntro: 'A non-executing preview of a potential command workflow. No terminal actions are performed here.',
    label: 'WORKFLOW CONCEPT / AISH',
    discipline: 'INTELLIGENT SHELL',
    quote: 'Understanding what a tool will do is part of being in control of it.',
    steps: [
      { index:'01', eyebrow:'INTENT', title:'Start in plain language.', summary:'Describe the outcome you want, rather than starting with precise command syntax.', tag:'USER INTENT' },
      { index:'02', eyebrow:'PREVIEW', title:'Inspect before acting.', summary:'See a proposed sequence and retain the opportunity to check it before execution.', tag:'VISIBLE COMMANDS' },
      { index:'03', eyebrow:'CONTROL', title:'Approval stays explicit.', summary:'Keep the human responsible for whether a planned command is actually run.', tag:'USER APPROVAL' },
    ],
  },
};
