import React, { useRef, useState, useEffect } from 'react';
import { SlotConfig } from '../types';
import { BIG_LETTER_FONTS, SCRIPT_FONTS, BigLetterFontOption, FontOption } from '../fonts';
import { build3DTextShadow } from '../materials';
import { Move, RotateCcw, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Download, Sparkles, X } from 'lucide-react';

interface MonogramItemProps {
  index: number;
  slot: SlotConfig;
  bigLetter: string;
  fullName: string;
  bigLetterFont: BigLetterFontOption;
  letterColor: string;
  letterDepth: number;
  letterDepthColor: string;
  letterShadowIntensity: number;
  nameColor: string;
  nameDepth: number;
  nameDepthColor: string;
  nameShadowIntensity: number;
  letterSize: number;
  letterSpacing?: number;
  nameBaseSize: number;
  showFontLabels: boolean;
  isSelected: boolean;
  customFonts?: import('../types').CustomFont[];
  isExporting?: boolean;
  hideBadgesOnExport?: boolean;
  onSelect: (index: number) => void;
  onUpdateSlot: (index: number, updates: Partial<SlotConfig>) => void;
  onExportSingle: (index: number) => void;
}

export const MonogramItem: React.FC<MonogramItemProps> = ({
  index,
  slot,
  bigLetter,
  fullName,
  bigLetterFont,
  letterColor,
  letterDepth,
  letterDepthColor,
  letterShadowIntensity,
  nameColor,
  nameDepth,
  nameDepthColor,
  nameShadowIntensity,
  letterSize,
  letterSpacing = 0,
  nameBaseSize,
  showFontLabels,
  isSelected,
  customFonts,
  isExporting = false,
  hideBadgesOnExport = false,
  onSelect,
  onUpdateSlot,
  onExportSingle,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ startX: number; startY: number; initialOffsetX: number; initialOffsetY: number } | null>(null);

  const [showScaleFeedback, setShowScaleFeedback] = useState(false);
  const feedbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const customScript = customFonts?.find((f) => f.id === slot.fontId);
  const scriptFont: FontOption = customScript
    ? {
        id: customScript.id,
        name: customScript.name,
        family: customScript.family,
        category: 'Personalizzato',
        defaultYOffset: 12,
      }
    : SCRIPT_FONTS.find((f) => f.id === slot.fontId) || SCRIPT_FONTS[0];

  const letterShadow = build3DTextShadow(letterDepth, letterDepthColor, letterShadowIntensity, 12);
  const nameShadow = build3DTextShadow(nameDepth, nameDepthColor, nameShadowIntensity, 8);

  const computedNameSize = Math.round(nameBaseSize * slot.scale);

  const triggerScaleFeedback = () => {
    setShowScaleFeedback(true);
    if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
    feedbackTimeoutRef.current = setTimeout(() => setShowScaleFeedback(false), 1200);
  };

  // Wheel listener on the name element to scale it up/down with mouse wheel
  useEffect(() => {
    const nameEl = nameRef.current;
    if (!nameEl) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const step = 0.04;
      const direction = e.deltaY < 0 ? 1 : -1;
      const currentScale = slot.scale || 1;
      const nextScale = Math.min(
        2.2,
        Math.max(0.35, Math.round((currentScale + direction * step) * 100) / 100)
      );
      onUpdateSlot(index, { scale: nextScale });
      triggerScaleFeedback();
    };

    nameEl.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      nameEl.removeEventListener('wheel', handleWheel);
    };
  }, [slot.scale, index, onUpdateSlot]);

  // While dragging: also allow rotating the mouse wheel anywhere to scale simultaneously!
  useEffect(() => {
    if (!isDragging) return;

    const handleWindowWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const step = 0.04;
      const direction = e.deltaY < 0 ? 1 : -1;
      const currentScale = slot.scale || 1;
      const nextScale = Math.min(
        2.2,
        Math.max(0.35, Math.round((currentScale + direction * step) * 100) / 100)
      );
      onUpdateSlot(index, { scale: nextScale });
      triggerScaleFeedback();
    };

    window.addEventListener('wheel', handleWindowWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', handleWindowWheel);
    };
  }, [isDragging, slot.scale, index, onUpdateSlot]);

  // Drag handling
  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    onSelect(index);
    setIsDragging(true);
    setDragStart({
      startX: e.clientX,
      startY: e.clientY,
      initialOffsetX: slot.offsetX,
      initialOffsetY: slot.offsetY,
    });
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !dragStart) return;
    const deltaX = e.clientX - dragStart.startX;
    const deltaY = e.clientY - dragStart.startY;
    onUpdateSlot(index, {
      offsetX: Math.round(dragStart.initialOffsetX + deltaX),
      offsetY: Math.round(dragStart.initialOffsetY + deltaY),
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      setDragStart(null);
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // ignore pointer capture errors if already released
      }
    }
  };

  const nudge = (dx: number, dy: number) => {
    onUpdateSlot(index, {
      offsetX: slot.offsetX + dx,
      offsetY: slot.offsetY + dy,
    });
  };

  return (
    <div
      ref={containerRef}
      onClick={(e) => {
        e.stopPropagation();
        if (isSelected) {
          onSelect(-1); // Deselect on clicking again
        } else {
          onSelect(index);
        }
      }}
      className={`group relative flex flex-col items-center justify-center p-3 select-none transition-all duration-200 rounded-2xl ${
        !isExporting && isSelected
          ? 'ring-2 ring-amber-400 bg-black/20 shadow-lg backdrop-blur-xs cursor-pointer'
          : !isExporting
          ? 'hover:bg-white/5 border border-transparent hover:border-white/10 cursor-pointer'
          : 'border border-transparent bg-transparent'
      }`}
      style={{
        minWidth: `${letterSize * ((bigLetter || '').length > 1 ? 1.4 : 1.05)}px`,
        minHeight: `${letterSize * 1.15}px`,
      }}
    >
      {/* Slot Index Badge - ESEMPIO 1, ESEMPIO 2, etc. (Can be hidden during export if requested) */}
      {(!isExporting || !hideBadgesOnExport) && (
        <div
          data-export-badge="true"
          className="absolute top-2 left-2 z-20 flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity"
        >
          <span
            className={`px-2.5 py-1 text-[11px] font-black tracking-wider uppercase rounded-md backdrop-blur-md transition-colors ${
              !isExporting && isSelected
                ? 'bg-amber-400 text-slate-950 font-bold shadow-xs ring-1 ring-amber-300'
                : 'bg-black/50 text-slate-200 border border-white/10'
            }`}
          >
            ESEMPIO {index + 1}
          </span>
        </div>
      )}

      {/* Quick floating action buttons when selected - NEVER visible during export */}
      {!isExporting && isSelected && (
        <div
          data-export-ignore="true"
          className="export-ignore absolute -top-11 z-30 flex items-center gap-1 bg-slate-900/95 border border-amber-400/50 shadow-xl px-2 py-1 rounded-xl backdrop-blur-md"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="text-xs font-medium text-amber-300 mr-1 max-w-[110px] truncate">
            {scriptFont.name}
          </span>
          <div className="flex items-center gap-0.5 border-l border-slate-700 pl-1">
            <button
              title="Sposta a Sinistra (-2px)"
              onClick={() => nudge(-2, 0)}
              className="p-1 hover:bg-slate-800 text-slate-200 hover:text-white rounded"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              title="Sposta in Alto (-2px)"
              onClick={() => nudge(0, -2)}
              className="p-1 hover:bg-slate-800 text-slate-200 hover:text-white rounded"
            >
              <ChevronUp size={14} />
            </button>
            <button
              title="Sposta in Basso (+2px)"
              onClick={() => nudge(0, 2)}
              className="p-1 hover:bg-slate-800 text-slate-200 hover:text-white rounded"
            >
              <ChevronDown size={14} />
            </button>
            <button
              title="Sposta a Destra (+2px)"
              onClick={() => nudge(2, 0)}
              className="p-1 hover:bg-slate-800 text-slate-200 hover:text-white rounded"
            >
              <ChevronRight size={14} />
            </button>
          </div>
          <div className="flex items-center gap-1 border-l border-slate-700 pl-1">
            <button
              title="Reimposta Posizione (X=0, Y=default)"
              onClick={() =>
                onUpdateSlot(index, {
                  offsetX: 0,
                  offsetY: scriptFont.defaultYOffset || 12,
                })
              }
              className="p-1 hover:bg-slate-800 text-slate-400 hover:text-amber-300 rounded"
            >
              <RotateCcw size={13} />
            </button>
            <button
              title="Scarica solo questo esempio come PNG"
              onClick={() => onExportSingle(index)}
              className="p-1 hover:bg-amber-400/20 text-amber-400 rounded"
            >
              <Download size={13} />
            </button>
            <button
              title="Deseleziona (ESC)"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(-1);
              }}
              className="p-1 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded ml-0.5"
            >
              <X size={13} />
            </button>
          </div>
        </div>
      )}

      {/* Monogram Display Container */}
      <div className="relative flex items-center justify-center my-auto">
        {/* Background Big Uppercase Letter */}
        <div
          className="select-none leading-none tracking-normal font-black text-center whitespace-nowrap"
          style={{
            fontFamily: bigLetterFont.family,
            fontSize: `${letterSize}px`,
            color: letterColor,
            textShadow: letterShadow,
            filter: 'contrast(1.05)',
            transform: 'translateZ(0)',
            letterSpacing: `${letterSpacing}px`,
            marginRight: letterSpacing !== 0 ? `-${letterSpacing}px` : undefined,
          }}
        >
          {bigLetter || 'A'}
        </div>

        {/* Live Scale Feedback Pill when rotating mouse wheel - hidden during export */}
        {!isExporting && showScaleFeedback && (
          <div
            data-export-ignore="true"
            className="export-ignore absolute -top-7 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 font-black text-[11px] px-2.5 py-0.5 rounded-full shadow-2xl pointer-events-none z-30 flex items-center gap-1 ring-2 ring-slate-900 animate-in fade-in zoom-in duration-150"
          >
            <span>Scala:</span>
            <span>{Math.round(slot.scale * 100)}%</span>
          </div>
        )}

        {/* Foreground Cursive Name (Draggable & Scalable with Mouse Wheel) */}
        <div
          ref={nameRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className={`absolute select-none leading-none whitespace-nowrap cursor-grab active:cursor-grabbing transition-transform ${
            isDragging ? 'scale-105 opacity-90' : ''
          }`}
          style={{
            fontFamily: scriptFont.family,
            fontSize: `${computedNameSize}px`,
            color: nameColor,
            textShadow: nameShadow,
            transform: `translate(${slot.offsetX}px, ${slot.offsetY}px)`,
            touchAction: 'none',
            zIndex: 10,
          }}
          title="Trascina per spostare. Ruota la rotella del mouse per scalare la dimensione!"
        >
          {fullName || 'Nome'}
        </div>
      </div>

      {/* Font Label at Bottom (Toggleable) */}
      {showFontLabels && (
        <div className="mt-3 text-center z-10">
          <span className="text-[11px] font-medium tracking-wide text-slate-300/80 bg-black/40 px-2.5 py-0.5 rounded-full border border-white/5">
            {scriptFont.name}
          </span>
        </div>
      )}

      {/* Drag & Wheel Helper Tooltip when hovering - hidden during export */}
      {!isExporting && (
        <div
          data-export-ignore="true"
          className="export-ignore absolute bottom-1 right-2 opacity-0 group-hover:opacity-80 text-[10px] text-slate-300 pointer-events-none flex items-center gap-1 transition-opacity"
        >
          <span className="flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded-md border border-white/10">
            <Move size={10} /> Trascina • Rotella per scalare
          </span>
        </div>
      )}
    </div>
  );
};
