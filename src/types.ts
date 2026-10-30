export interface SlotConfig {
  fontId: string;
  offsetX: number;
  offsetY: number;
  scale: number;
}

export interface MonogramProjectState {
  bigLetter: string;
  fullName: string;
  bigLetterFontId: string;
  slots: SlotConfig[];
  
  // Big Letter Styling
  letterColor: string;
  letterDepth: number;
  letterDepthColor: string;
  letterShadowIntensity: number;
  
  // Foreground Name Styling
  nameColor: string;
  nameDepth: number;
  nameDepthColor: string;
  nameShadowIntensity: number;
  
  // Board & Spacing Layout
  backgroundColor: string;
  gridGapX: number;
  gridGapY: number;
  padding: number;
  letterSize: number;
  letterSpacing: number;
  nameBaseSize: number;
  gridLayout: '4x2' | '2x4' | '8x1' | '1x8';
  showFontLabels: boolean;
  selectedSlotIndex: number;
}

export interface SavedProject {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  data: MonogramProjectState;
}

export interface CustomFont {
  id: string;
  name: string;
  family: string;
  target: 'letter' | 'name' | 'both';
  sourceType: 'file' | 'google';
  dataUrl?: string;
  googleFontName?: string;
  fileName?: string;
  createdAt: string;
}
