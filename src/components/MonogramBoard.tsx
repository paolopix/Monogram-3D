import React, { forwardRef } from 'react';
import { MonogramProjectState, SlotConfig } from '../types';
import { BIG_LETTER_FONTS, BigLetterFontOption } from '../fonts';
import { MonogramItem } from './MonogramItem';

interface MonogramBoardProps {
  project: MonogramProjectState;
  customFonts?: import('../types').CustomFont[];
  isExporting?: boolean;
  hideBadgesOnExport?: boolean;
  onSelectSlot: (index: number) => void;
  onUpdateSlot: (index: number, updates: Partial<SlotConfig>) => void;
  onExportSingle: (index: number) => void;
}

export const MonogramBoard = forwardRef<HTMLDivElement, MonogramBoardProps>(
  (
    {
      project,
      customFonts,
      isExporting = false,
      hideBadgesOnExport = false,
      onSelectSlot,
      onUpdateSlot,
      onExportSingle,
    },
    ref
  ) => {
    const customBig = customFonts?.find((f) => f.id === project.bigLetterFontId);
    const bigLetterFont: BigLetterFontOption = customBig
      ? {
          id: customBig.id,
          name: customBig.name,
          family: customBig.family,
          category: 'Personalizzato',
        }
      : BIG_LETTER_FONTS.find((f) => f.id === project.bigLetterFontId) || BIG_LETTER_FONTS[0];

    // Grid columns configuration based on selected layout
    let gridColsClass = 'grid-cols-4';
    if (project.gridLayout === '2x4') {
      gridColsClass = 'grid-cols-2';
    } else if (project.gridLayout === '8x1') {
      gridColsClass = 'grid-cols-8';
    } else if (project.gridLayout === '1x8') {
      gridColsClass = 'grid-cols-1';
    }

    return (
      <div className="w-full flex items-center justify-center p-2 sm:p-6 overflow-auto">
        {/* Main Exportable Artboard */}
        <div
          ref={ref}
          id="monogram-artboard"
          onClick={() => onSelectSlot(-1)}
          className="relative transition-all duration-300 shadow-2xl rounded-2xl flex flex-col items-center justify-center max-w-none cursor-default"
          style={{
            backgroundColor: project.backgroundColor,
            padding: `${project.padding}px`,
            backgroundImage:
              project.backgroundColor === 'transparent'
                ? 'repeating-conic-gradient(#333 0% 25%, #222 0% 50%) 50% / 20px 20px'
                : undefined,
          }}
        >
          {/* Grid of the 8 monograms */}
          <div
            className={`grid ${gridColsClass} items-center justify-items-center transition-all`}
            style={{
              columnGap: `${project.gridGapX}px`,
              rowGap: `${project.gridGapY}px`,
            }}
          >
            {project.slots.map((slot, index) => (
              <MonogramItem
                key={index}
                index={index}
                slot={slot}
                bigLetter={project.bigLetter}
                fullName={project.fullName}
                bigLetterFont={bigLetterFont}
                letterColor={project.letterColor}
                letterDepth={project.letterDepth}
                letterDepthColor={project.letterDepthColor}
                letterShadowIntensity={project.letterShadowIntensity}
                letterWeight={project.letterWeight ?? 400}
                letterWidthScale={project.letterWidthScale ?? 1.0}
                nameColor={project.nameColor}
                nameDepth={project.nameDepth}
                nameDepthColor={project.nameDepthColor}
                nameShadowIntensity={project.nameShadowIntensity}
                nameWeight={project.nameWeight ?? 400}
                letterSize={project.letterSize}
                letterSpacing={project.letterSpacing || 0}
                nameBaseSize={project.nameBaseSize}
                showFontLabels={project.showFontLabels}
                isSelected={project.selectedSlotIndex === index}
                customFonts={customFonts}
                isExporting={isExporting}
                hideBadgesOnExport={hideBadgesOnExport}
                onSelect={onSelectSlot}
                onUpdateSlot={onUpdateSlot}
                onExportSingle={onExportSingle}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
);

MonogramBoard.displayName = 'MonogramBoard';
