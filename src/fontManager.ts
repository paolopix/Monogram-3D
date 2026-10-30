import { CustomFont } from './types';

const STORAGE_KEY = 'monogram_custom_fonts_list';

/**
 * Reads stored custom fonts from localStorage
 */
export function getStoredCustomFonts(): CustomFont[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading custom fonts from storage:', err);
  }
  return [];
}

/**
 * Injects @font-face or Google Fonts link into the DOM
 */
export function registerCustomFontInDOM(font: CustomFont): void {
  try {
    if (font.sourceType === 'file' && font.dataUrl) {
      // Create or update the custom-fonts-style tag
      let styleTag = document.getElementById('custom-fonts-style') as HTMLStyleElement | null;
      if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = 'custom-fonts-style';
        document.head.appendChild(styleTag);
      }

      // Check format (ttf, otf, woff, woff2)
      let formatStr = 'truetype';
      if (font.fileName) {
        const lower = font.fileName.toLowerCase();
        if (lower.endsWith('.otf')) formatStr = 'opentype';
        else if (lower.endsWith('.woff2')) formatStr = 'woff2';
        else if (lower.endsWith('.woff')) formatStr = 'woff';
      }

      const fontFaceRule = `
@font-face {
  font-family: '${font.id}';
  src: url('${font.dataUrl}') format('${formatStr}');
  font-display: swap;
}
`;
      // Append rule if not already present
      if (!styleTag.textContent?.includes(`'${font.id}'`)) {
        styleTag.textContent += fontFaceRule;
      }

      // Also register via FontFace API for instant availability
      if ('fonts' in document) {
        const fontFace = new FontFace(font.id, `url(${font.dataUrl})`);
        fontFace.load().then((loadedFace) => {
          document.fonts.add(loadedFace);
        }).catch((err) => {
          console.warn(`FontFace API load warning for ${font.name}:`, err);
        });
      }
    } else if (font.sourceType === 'google' && font.googleFontName) {
      const linkId = `google-font-${font.id}`;
      if (!document.getElementById(linkId)) {
        const link = document.createElement('link');
        link.id = linkId;
        link.rel = 'stylesheet';
        const formattedName = font.googleFontName.trim().replace(/\s+/g, '+');
        link.href = `https://fonts.googleapis.com/css2?family=${formattedName}&display=swap`;
        document.head.appendChild(link);
      }
    }
  } catch (err) {
    console.error(`Failed to register custom font ${font.name}:`, err);
  }
}

/**
 * Initializes all stored custom fonts in the DOM
 */
export function initAllCustomFonts(): CustomFont[] {
  const fonts = getStoredCustomFonts();
  fonts.forEach((font) => registerCustomFontInDOM(font));
  return fonts;
}

/**
 * Saves a new custom font, registers it, and persists to localStorage
 */
export function saveCustomFont(font: CustomFont): CustomFont[] {
  const current = getStoredCustomFonts();
  // Filter out duplicate id if exists
  const updated = [font, ...current.filter((f) => f.id !== font.id)];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Storage quota exceeded while saving custom font:', err);
    throw new Error('Spazio di memoria locale insufficiente per salvare questo file font.');
  }
  registerCustomFontInDOM(font);
  return updated;
}

/**
 * Deletes a custom font by ID
 */
export function deleteCustomFont(id: string): CustomFont[] {
  const current = getStoredCustomFonts();
  const updated = current.filter((f) => f.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Error saving updated fonts list:', err);
  }
  return updated;
}
