export interface FontOption {
  id: string;
  name: string;
  family: string;
  category: 'Calligraphic' | 'Romantic' | 'Modern Script' | 'Handwritten' | 'Playful' | 'Vintage' | 'Personalizzato';
  previewText?: string;
  defaultYOffset?: number; // suggested fine-tuning Y offset
}

export interface BigLetterFontOption {
  id: string;
  name: string;
  family: string;
  category: 'Serif' | 'Sans-Serif' | 'Display' | 'Slab' | 'Personalizzato';
}

export const BIG_LETTER_FONTS: BigLetterFontOption[] = [
  { id: 'cinzel', name: 'Cinzel Bold (Classico Elegante)', family: "'Cinzel', serif", category: 'Serif' },
  { id: 'playfair', name: 'Playfair Display (Serif Raffinato)', family: "'Playfair Display', serif", category: 'Serif' },
  { id: 'bodoni', name: 'Bodoni Moda (Alta Moda & Lusso)', family: "'Bodoni Moda', serif", category: 'Serif' },
  { id: 'cormorant', name: 'Cormorant Garamond (Serif Tradizionale)', family: "'Cormorant Garamond', serif", category: 'Serif' },
  { id: 'prata', name: 'Prata (Serif Teatrale)', family: "'Prata', serif", category: 'Serif' },
  { id: 'montserrat', name: 'Montserrat Black (Moderno Geometrico)', family: "'Montserrat', sans-serif", category: 'Sans-Serif' },
  { id: 'bebas', name: 'Bebas Neue (Alto & Impattante)', family: "'Bebas Neue', sans-serif", category: 'Display' },
  { id: 'oswald', name: 'Oswald Bold (Compatto Forte)', family: "'Oswald', sans-serif", category: 'Sans-Serif' },
  { id: 'anton', name: 'Anton (Massiccio Pieno)', family: "'Anton', sans-serif", category: 'Display' },
  { id: 'abril', name: 'Abril Fatface (Slab Curvo Retrò)', family: "'Abril Fatface', serif", category: 'Slab' },
  { id: 'ultra', name: 'Ultra (Ultra Bold Spesso)', family: "'Ultra', serif", category: 'Slab' },
];

export const SCRIPT_FONTS: FontOption[] = [
  { id: 'great-vibes', name: 'Great Vibes', family: "'Great Vibes', cursive", category: 'Romantic', defaultYOffset: 10 },
  { id: 'dancing-script', name: 'Dancing Script', family: "'Dancing Script', cursive", category: 'Modern Script', defaultYOffset: 14 },
  { id: 'alex-brush', name: 'Alex Brush', family: "'Alex Brush', cursive", category: 'Calligraphic', defaultYOffset: 12 },
  { id: 'pacifico', name: 'Pacifico', family: "'Pacifico', cursive", category: 'Playful', defaultYOffset: 16 },
  { id: 'sacramento', name: 'Sacramento', family: "'Sacramento', cursive", category: 'Romantic', defaultYOffset: 12 },
  { id: 'allura', name: 'Allura', family: "'Allura', cursive", category: 'Calligraphic', defaultYOffset: 8 },
  { id: 'parisienne', name: 'Parisienne', family: "'Parisienne', cursive", category: 'Romantic', defaultYOffset: 10 },
  { id: 'tangerine', name: 'Tangerine', family: "'Tangerine', cursive", category: 'Calligraphic', defaultYOffset: 4 },
  { id: 'satisfy', name: 'Satisfy', family: "'Satisfy', cursive", category: 'Modern Script', defaultYOffset: 14 },
  { id: 'cookie', name: 'Cookie', family: "'Cookie', cursive", category: 'Vintage', defaultYOffset: 12 },
  { id: 'courgette', name: 'Courgette', family: "'Courgette', cursive", category: 'Modern Script', defaultYOffset: 15 },
  { id: 'kaushan', name: 'Kaushan Script', family: "'Kaushan Script', cursive", category: 'Modern Script', defaultYOffset: 12 },
  { id: 'caveat', name: 'Caveat', family: "'Caveat', cursive", category: 'Handwritten', defaultYOffset: 16 },
  { id: 'marck-script', name: 'Marck Script', family: "'Marck Script', cursive", category: 'Handwritten', defaultYOffset: 12 },
  { id: 'rochester', name: 'Rochester', family: "'Rochester', cursive", category: 'Vintage', defaultYOffset: 10 },
  { id: 'pinyon-script', name: 'Pinyon Script', family: "'Pinyon Script', cursive", category: 'Calligraphic', defaultYOffset: 8 },
  { id: 'yellowtail', name: 'Yellowtail', family: "'Yellowtail', cursive", category: 'Playful', defaultYOffset: 14 },
  { id: 'italianno', name: 'Italianno', family: "'Italianno', cursive", category: 'Calligraphic', defaultYOffset: 6 },
  { id: 'bad-script', name: 'Bad Script', family: "'Bad Script', cursive", category: 'Handwritten', defaultYOffset: 14 },
  { id: 'petit-formal', name: 'Petit Formal Script', family: "'Petit Formal Script', cursive", category: 'Romantic', defaultYOffset: 10 },
  { id: 'montez', name: 'Montez', family: "'Montez', cursive", category: 'Vintage', defaultYOffset: 12 },
  { id: 'rouge-script', name: 'Rouge Script', family: "'Rouge Script', cursive", category: 'Romantic', defaultYOffset: 8 },
  { id: 'playball', name: 'Playball', family: "'Playball', cursive", category: 'Modern Script', defaultYOffset: 14 },
];

// Default 8 fonts inspired by the 8 variations shown in the attached image
export const DEFAULT_8_FONTS: string[] = [
  'great-vibes',
  'dancing-script',
  'parisienne',
  'alex-brush',
  'pacifico',
  'sacramento',
  'allura',
  'cookie',
];

export const FONT_PRESET_PACKS = [
  {
    name: 'Classico Come Foto (Ispirato all\'Allegato)',
    description: 'La selezione fedele alle 8 incisioni della foto d\'esempio',
    fonts: ['great-vibes', 'dancing-script', 'parisienne', 'alex-brush', 'pacifico', 'sacramento', 'allura', 'cookie'],
  },
  {
    name: 'Matrimonio & Lusso Elegante',
    description: 'Font calligrafici raffinati con svolazzi floreali',
    fonts: ['great-vibes', 'alex-brush', 'pinyon-script', 'allura', 'parisienne', 'petit-formal', 'rouge-script', 'italianno'],
  },
  {
    name: 'Moderno & Chic',
    description: 'Corsivi contemporanei con ritmo fluido e pulito',
    fonts: ['dancing-script', 'satisfy', 'courgette', 'sacramento', 'caveat', 'marck-script', 'playball', 'kaushan'],
  },
  {
    name: 'Bambini & Nascita',
    description: 'Font morbidi, giocosi e dolci per cameretta neonati',
    fonts: ['pacifico', 'cookie', 'yellowtail', 'dancing-script', 'caveat', 'marck-script', 'montez', 'bad-script'],
  },
  {
    name: 'Laser Cut & Legno Rustico',
    description: 'Tratti spessi e continui ideali per taglio laser e traforo',
    fonts: ['pacifico', 'cookie', 'courgette', 'satisfy', 'yellowtail', 'playball', 'kaushan', 'dancing-script'],
  },
];
