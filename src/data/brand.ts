export const brand = {
  name: 'Dawnlight Labs',
  short: 'Dawnlight',
  position: 'Technology built around people.',
  email: 'contact@dawnlightlabs.com',
  country: 'India',
  orb: '/dawnlight%20orb%20svg.svg',
  sun: '/dawnlight%20with%20sun%20svg.svg',
  color: {
    paper: '#FCF8F5', ink: '#181916', blue: '#0E4490',
    sky: '#A8DAF9', sunSoft: '#FEE144', sun: '#FFD12B',
    terracotta: '#C47855', sage: '#59715C',
  },
} as const;

export const navigation = [
  { label: 'Research', href: '/research' },
  { label: 'Projects', href: '/projects' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
] as const;

export const founders = [
  {
    name: 'Amaan Syed', title: 'Co-Founder',
    focus: 'Research, product development and creative direction',
    email: 'amaan@dawnlightlabs.com',
    github: 'https://github.com/amaansyed27',
    linkedin: 'https://www.linkedin.com/in/amaansyed27/',
  },
  {
    name: 'Sairaj Jawalikar', title: 'Co-Founder',
    focus: 'Security, software development and infrastructure',
    email: 'sairaj.jawalikar@dawnlightlabs.com',
    github: 'https://github.com/s41r4j',
    linkedin: 'https://www.linkedin.com/in/s41r4j/',
  },
] as const;
