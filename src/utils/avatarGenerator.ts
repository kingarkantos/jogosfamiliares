import { AvatarConfig, AvatarStyle } from '../types';

export const AVATAR_STYLES: { id: AvatarStyle; label: string; description: string; emoji: string }[] = [
  { id: 'personas', label: 'Personas 3D', description: 'Estilo moderno e refinado', emoji: '🧑‍🎨' },
  { id: 'adventurer', label: 'Aventureiro RPG', description: 'Guerreiros e exploradores épicos', emoji: '🧙‍♂️' },
  { id: 'bottts-neutral', label: 'Robô Futurista', description: 'Cyborgs e mechas tecnológicos', emoji: '🤖' },
  { id: 'lorelei', label: 'Anime Moderno', description: 'Estilo ilustrado elegante', emoji: '✨' },
  { id: 'micah', label: 'Estilo Cartoon', description: 'Expressivo e vibrante', emoji: '🎨' },
  { id: 'fun-emoji', label: 'Emoji 3D', description: 'Super expressivo e divertido', emoji: '😎' },
  { id: 'croodles', label: 'Rabisco Doodle', description: 'Divertido e artístico', emoji: '✏️' },
  { id: 'big-smile', label: 'Super Sorriso', description: 'Alegre e simpático', emoji: '😁' },
  { id: 'thumbs', label: 'Thumbs Up', description: 'Bonequinhos animados', emoji: '👍' },
  { id: 'open-peeps', label: 'Open Peeps', description: 'Casual e descontraído', emoji: '👥' },
];

export const AVATAR_COLORS = [
  '#8b5cf6', // Purple
  '#3b82f6', // Blue
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#ec4899', // Pink
  '#06b6d4', // Cyan
  '#84cc16', // Lime
  '#6366f1', // Indigo
  '#f97316', // Orange
];

export function buildAvatarUrl(config: AvatarConfig): string {
  const { style, seed, backgroundColor } = config;
  const baseUrl = `https://api.dicebear.com/9.x/${style || 'personas'}/svg`;
  const params = new URLSearchParams();
  
  params.append('seed', seed || 'Player');
  
  if (backgroundColor && backgroundColor !== 'transparent') {
    params.append('backgroundColor', backgroundColor.replace('#', ''));
  } else {
    params.append('backgroundColor', '6366f1,8b5cf6,ec4899,3b82f6');
  }

  return `${baseUrl}?${params.toString()}`;
}

export function generateRandomAvatarConfig(preferredSeed?: string): AvatarConfig {
  const randomStyle = AVATAR_STYLES[Math.floor(Math.random() * AVATAR_STYLES.length)].id;
  const randomColor = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
  const seed = preferredSeed || `Player_${Math.random().toString(36).substring(2, 8)}`;

  return {
    style: randomStyle,
    seed: seed,
    backgroundColor: randomColor.replace('#', ''),
    glasses: Math.random() > 0.5,
  };
}
