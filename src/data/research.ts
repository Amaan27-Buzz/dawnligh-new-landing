// These are broad approved interests, not achievements or released programs.
// Never add confidential results, methods or unpublished codenames here.
export const researchAreas = [
  { number: '01', title: 'Artificial intelligence', detail: 'How intelligent systems learn, reason and adapt.', art: 'network' },
  { number: '02', title: 'Computing architectures', detail: 'How software and computation can be structured differently.', art: 'architecture' },
  { number: '03', title: 'Efficient & edge intelligence', detail: 'Smaller, more efficient approaches to useful intelligence.', art: 'efficiency' },
  { number: '04', title: 'Multimodal systems', detail: 'Systems that work across different forms of information.', art: 'multimodal' },
  { number: '05', title: 'Human–computer interaction', detail: 'Ways to make complex technologies understandable and controllable.', art: 'interaction' },
  { number: '06', title: 'Hardware & emerging computing', detail: 'The relationship between electronics, software and new computing approaches.', art: 'hardware' },
] as const;

export type ApprovedProgram = {
  slug: string;
  title: string;
  summary: string;
  status: 'exploring' | 'active' | 'published';
  approvedForPublicRelease: true;
};
// Intentionally empty. Add only after an explicit research/IP disclosure review.
export const approvedPrograms: ApprovedProgram[] = [];
