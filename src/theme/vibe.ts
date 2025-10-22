export const Vibe = {
  colors: {
    paper: '#F8F5F0',
    ink: '#2A2A2A',
    mutedInk: 'rgba(42, 42, 42, 0.6)',
    panel: 'rgba(255, 255, 255, 0.88)',
    accent: '#B8D8BA', // soft sage
    accentYellow: '#FFF3B0',
    accentPink: '#F6C1D4',
    accentLavender: '#D7C9F5',
    accentCoral: '#F7B7B2',
  },
  borders: {
    width: 1.5,
    radius: 14,
  },
  dustBunnyColorByPersonality: {
    mischievous: '#F7B7B2', // coral
    shy: '#DCEFE2', // pale mint
    chatty: '#FFF3B0', // butter yellow
    grumpy: '#D7C9F5', // lavender
    friendly: '#F6C1D4', // pink
    default: '#EDEBE6',
  } as const,
};
