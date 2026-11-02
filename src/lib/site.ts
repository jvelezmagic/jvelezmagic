export const site = {
  name: 'Jesús Vélez Santiago',
  handle: 'jvelezmagic',
  title: 'Jesús Vélez Santiago — AI product design & engineering',
  description:
    'Jesús Vélez Santiago (jvelezmagic) designs and builds AI products, from the model to the interface. Based in Mexico.',
  location: 'Mexico',
  timezone: 'America/Mexico_City',
};

export const socials = [
  { label: 'GitHub', handle: '@jvelezmagic', url: 'https://github.com/jvelezmagic' },
  { label: 'LinkedIn', handle: 'in/jvelezmagic', url: 'https://www.linkedin.com/in/jvelezmagic/' },
  { label: 'X', handle: '@jvelezmagic', url: 'https://x.com/jvelezmagic' },
];

export const sections = [
  { id: 'intro', label: 'Intro' },
  { id: 'about', label: 'About' },
  { id: 'log', label: 'Story' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
];

export const lanes = {
  engineering: { label: 'engineering', branch: 'main', color: '#36A7DF', x: 14, forkFrom: 'science', mergeInto: null },
  science: { label: 'science', branch: 'science', color: '#55D7F9', x: 38, forkFrom: null, mergeInto: 'engineering' },
  teaching: { label: 'teaching', branch: 'teaching', color: '#457AF3', x: 62, forkFrom: 'science', mergeInto: null },
} as const;
export type Lane = keyof typeof lanes;

export function shortHash(id: string) {
  const r = seeded(id);
  return Array.from({ length: 7 }, () => Math.floor(r() * 16).toString(16)).join('');
}

export function seeded(seed: string) {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}
