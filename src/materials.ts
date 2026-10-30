export interface MaterialPreset {
  id: string;
  name: string;
  color: string;
  bevelColor: string;
  shadowColor: string;
  textColor?: string;
  isDark?: boolean;
}

export const LETTER_MATERIALS: MaterialPreset[] = [
  {
    id: 'birch-wood',
    name: 'Legno Betulla / MDF (Foto)',
    color: '#c89f76',
    bevelColor: '#e0b88d',
    shadowColor: '#5a3d22',
  },
  {
    id: 'natural-oak',
    name: 'Rovere Naturale Caldo',
    color: '#b68754',
    bevelColor: '#d6a36d',
    shadowColor: '#4f341b',
  },
  {
    id: 'dark-walnut',
    name: 'Noce Scuro Pregiato',
    color: '#5c3e29',
    bevelColor: '#785337',
    shadowColor: '#2b1a10',
    isDark: true,
  },
  {
    id: 'white-acrylic',
    name: 'Bianco Acrilico / Smalto',
    color: '#f0f3f6',
    bevelColor: '#ffffff',
    shadowColor: '#9ba5b2',
  },
  {
    id: 'matte-black',
    name: 'Nero Opaco Laser Cut',
    color: '#26282b',
    bevelColor: '#3d4045',
    shadowColor: '#0f1012',
    isDark: true,
  },
  {
    id: 'mirror-gold',
    name: 'Oro Specchiato / Ottone',
    color: '#cfa74b',
    bevelColor: '#f1d179',
    shadowColor: '#6a5118',
  },
  {
    id: 'rose-gold',
    name: 'Oro Rosa Metallico',
    color: '#c98a7b',
    bevelColor: '#e5aba0',
    shadowColor: '#643830',
  },
  {
    id: 'sage-green',
    name: 'Verde Salvia Polvere',
    color: '#839683',
    bevelColor: '#a0b3a0',
    shadowColor: '#3c4d3c',
  },
  {
    id: 'dusty-pink',
    name: 'Rosa Antico / Cipria',
    color: '#cb9a9a',
    bevelColor: '#e0b5b5',
    shadowColor: '#663b3b',
  },
  {
    id: 'navy-blue',
    name: 'Blu Notte Intenso',
    color: '#283b54',
    bevelColor: '#3d5575',
    shadowColor: '#101a27',
    isDark: true,
  },
];

export const NAME_MATERIALS: MaterialPreset[] = [
  {
    id: 'ivory-cream',
    name: 'Avorio Panna Lucido (Foto)',
    color: '#f5f3e5',
    bevelColor: '#ffffff',
    shadowColor: '#9c9883',
  },
  {
    id: 'pure-white',
    name: 'Bianco Neve Puro',
    color: '#ffffff',
    bevelColor: '#ffffff',
    shadowColor: '#a1a8b3',
  },
  {
    id: 'warm-gold',
    name: 'Oro Chiaro Perlato',
    color: '#f3dc8e',
    bevelColor: '#fff1bb',
    shadowColor: '#8a7434',
  },
  {
    id: 'rose-gold-name',
    name: 'Oro Rosa Romantico',
    color: '#f4c7be',
    bevelColor: '#ffded7',
    shadowColor: '#885850',
  },
  {
    id: 'light-wood',
    name: 'Legno Betulla Trasparente',
    color: '#e4c9ad',
    bevelColor: '#fae3cb',
    shadowColor: '#7b5e43',
  },
  {
    id: 'jet-black',
    name: 'Nero Notte Lucido',
    color: '#1a1a1d',
    bevelColor: '#35353c',
    shadowColor: '#050507',
    isDark: true,
  },
  {
    id: 'sky-blue',
    name: 'Celeste Baby Pastello',
    color: '#bee1f5',
    bevelColor: '#e1f2fc',
    shadowColor: '#5c7f96',
  },
];

export const BACKGROUND_PRESETS = [
  { id: 'slate-studio', name: 'Grigio Studio (Foto)', color: '#4f5154' },
  { id: 'deep-charcoal', name: 'Carbone Scuro', color: '#27292c' },
  { id: 'pure-black', name: 'Nero Assoluto', color: '#111215' },
  { id: 'light-studio', name: 'Bianco Studio Fotografico', color: '#f3f4f6' },
  { id: 'warm-linen', name: 'Lino Sabbia Caldo', color: '#e5ded5' },
  { id: 'dark-navy', name: 'Blu Notte Navy', color: '#161e2e' },
  { id: 'dark-wood-bg', name: 'Tavola Noce Rustica', color: '#1e1814' },
  { id: 'transparent', name: 'Trasparente (PNG Scontornato)', color: 'transparent' },
];

/**
 * Generates high quality CSS text-shadow for authentic 3D laser-cut look
 */
export function build3DTextShadow(
  depth: number,
  depthColor: string,
  shadowIntensity: number,
  shadowBlur: number,
  angleRad: number = Math.PI / 4 // 45 degrees (top-left to bottom-right)
): string {
  const shadows: string[] = [];
  const cos = Math.cos(angleRad);
  const sin = Math.sin(angleRad);

  // Stepped extrusion layers
  const steps = Math.max(1, Math.round(depth));
  for (let i = 1; i <= steps; i++) {
    const x = (i * cos).toFixed(1);
    const y = (i * sin).toFixed(1);
    shadows.push(`${x}px ${y}px 0px ${depthColor}`);
  }

  // Soft ambient drop shadows
  if (shadowIntensity > 0) {
    const rawDropX = (steps + 2) * cos;
    const rawDropY = (steps + 4) * sin;
    const dropBlur = shadowBlur * 1.2;
    const alpha1 = (0.35 * (shadowIntensity / 100)).toFixed(2);
    const alpha2 = (0.22 * (shadowIntensity / 100)).toFixed(2);
    shadows.push(`${rawDropX.toFixed(1)}px ${rawDropY.toFixed(1)}px ${dropBlur.toFixed(1)}px rgba(0, 0, 0, ${alpha1})`);
    shadows.push(`${(rawDropX * 1.5).toFixed(1)}px ${(rawDropY * 1.8).toFixed(1)}px ${(dropBlur * 1.8).toFixed(1)}px rgba(0, 0, 0, ${alpha2})`);
  }

  return shadows.join(', ');
}
