import React, { useState } from 'react';
import { MonogramProjectState, SlotConfig, CustomFont } from '../types';
import {
  BIG_LETTER_FONTS,
  SCRIPT_FONTS,
  FONT_PRESET_PACKS,
  DEFAULT_8_FONTS,
  FontOption,
} from '../fonts';
import {
  LETTER_MATERIALS,
  NAME_MATERIALS,
  BACKGROUND_PRESETS,
} from '../materials';
import {
  Type,
  Palette,
  LayoutGrid,
  Sliders,
  Sparkles,
  Shuffle,
  RotateCcw,
  ChevronDown,
  Layers,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Move,
  MoveHorizontal,
  Maximize2,
  Check,
  X,
  FolderOpen,
  Save,
  PlusCircle,
  Upload,
} from 'lucide-react';

interface ControlPanelProps {
  project: MonogramProjectState;
  customFonts?: CustomFont[];
  onOpenAddFont?: (target: 'letter' | 'name' | 'both') => void;
  onUpdateProject: (updates: Partial<MonogramProjectState>) => void;
  onUpdateSlot: (index: number, updates: Partial<SlotConfig>) => void;
  onResetToDefaults: () => void;
  onShuffleFonts: () => void;
  onApplyPresetPack: (fonts: string[]) => void;
  onOpenProjects?: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  project,
  customFonts = [],
  onOpenAddFont,
  onUpdateProject,
  onUpdateSlot,
  onResetToDefaults,
  onShuffleFonts,
  onApplyPresetPack,
  onOpenProjects,
}) => {
  const [activeTab, setActiveTab] = useState<'text' | 'fonts' | 'colors' | 'layout'>('text');

  const selectedSlot = project.slots[project.selectedSlotIndex] || project.slots[0];
  const customSlotFont = customFonts.find((f) => f.id === selectedSlot.fontId);
  const selectedSlotFont = customSlotFont
    ? {
        id: customSlotFont.id,
        name: customSlotFont.name,
        family: customSlotFont.family,
        category: 'Personalizzato',
        defaultYOffset: 12,
      }
    : SCRIPT_FONTS.find((f) => f.id === selectedSlot.fontId) || SCRIPT_FONTS[0];

  const letterCustomFonts = customFonts.filter((f) => f.target === 'letter' || f.target === 'both');
  const nameCustomFonts = customFonts.filter((f) => f.target === 'name' || f.target === 'both');

  const quickLetters = ['A', 'B', 'M', 'S', 'AB', 'MG', '25', '18', '50', '99'];

  return (
    <div className="w-full lg:w-96 bg-slate-900 border-r border-slate-800 flex flex-col h-full overflow-hidden text-slate-200">
      {/* Navigation Tabs */}
      <div className="grid grid-cols-4 border-b border-slate-800 bg-slate-950/60 p-1.5 gap-1 shrink-0">
        <button
          onClick={() => setActiveTab('text')}
          className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-xs font-medium transition-all ${
            activeTab === 'text'
              ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Type size={16} className="mb-1" />
          <span>Testi</span>
        </button>

        <button
          onClick={() => setActiveTab('fonts')}
          className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-xs font-medium transition-all ${
            activeTab === 'fonts'
              ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Sparkles size={16} className="mb-1" />
          <span>8 Font</span>
        </button>

        <button
          onClick={() => setActiveTab('colors')}
          className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-xs font-medium transition-all ${
            activeTab === 'colors'
              ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Palette size={16} className="mb-1" />
          <span>Colori 3D</span>
        </button>

        <button
          onClick={() => setActiveTab('layout')}
          className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-xs font-medium transition-all ${
            activeTab === 'layout'
              ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Sliders size={16} className="mb-1" />
          <span>Spazi</span>
        </button>
      </div>

      {/* Tab Contents (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* ================= TAB 1: TESTI & FONT LETTERA ================= */}
        {activeTab === 'text' && (
          <div className="space-y-6">
            {/* Quick Project Save / Open Banner */}
            {onOpenProjects && (
              <div className="p-3 bg-slate-950/70 border border-amber-500/30 rounded-2xl flex items-center justify-between shadow-xs">
                <div>
                  <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <Save size={13} className="text-amber-400" />
                    <span>Salva o Riprendi Progetto</span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Archivia le modifiche o carica progetti salvati
                  </div>
                </div>
                <button
                  onClick={onOpenProjects}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-1"
                >
                  <FolderOpen size={12} />
                  <span>Progetti</span>
                </button>
              </div>
            )}

            {/* Big Letter Input */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center justify-between">
                <span>1. Lettera Maiuscola Sfondo</span>
                <span className="text-[10px] text-slate-400 font-normal">Identica per tutte le 8 varianti</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={4}
                  value={project.bigLetter}
                  onChange={(e) =>
                    onUpdateProject({ bigLetter: e.target.value.toUpperCase() })
                  }
                  placeholder="Es. A, AB, 25"
                  className="w-28 text-center text-2xl font-black bg-slate-800/80 border border-slate-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl py-2 text-white outline-none"
                />
                <div className="flex-1 flex flex-wrap gap-1 items-center bg-slate-800/40 p-2 rounded-xl border border-slate-800">
                  {quickLetters.map((char) => (
                    <button
                      key={char}
                      onClick={() => onUpdateProject({ bigLetter: char })}
                      className={`px-2 h-7 text-xs font-bold rounded-lg transition-all ${
                        project.bigLetter === char
                          ? 'bg-amber-400 text-slate-950 font-black'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {char}
                    </button>
                  ))}
                </div>
              </div>

              {/* Spaziatura tra 2 lettere o 2 numeri */}
              {project.bigLetter.trim().length >= 2 && (
                <div className="p-3 bg-slate-950/70 border border-amber-500/30 rounded-xl space-y-2 mt-2 animate-in fade-in">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-amber-300 font-semibold flex items-center gap-1.5">
                      <MoveHorizontal size={14} /> Spazio tra le {project.bigLetter.trim().length} Lettere / Numeri
                    </span>
                    <span className="font-mono text-amber-400 font-bold">
                      {project.letterSpacing || 0} px
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-60"
                    max="100"
                    step="1"
                    value={project.letterSpacing || 0}
                    onChange={(e) =>
                      onUpdateProject({ letterSpacing: parseInt(e.target.value, 10) })
                    }
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                  <div className="grid grid-cols-4 gap-1 pt-1">
                    <button
                      onClick={() => onUpdateProject({ letterSpacing: -25 })}
                      className="text-[10px] py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700"
                    >
                      Sovrapposte (-25)
                    </button>
                    <button
                      onClick={() => onUpdateProject({ letterSpacing: -8 })}
                      className="text-[10px] py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700"
                    >
                      Vicini (-8)
                    </button>
                    <button
                      onClick={() => onUpdateProject({ letterSpacing: 0 })}
                      className="text-[10px] py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700"
                    >
                      Normale (0)
                    </button>
                    <button
                      onClick={() => onUpdateProject({ letterSpacing: 30 })}
                      className="text-[10px] py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700"
                    >
                      Distanziate (+30)
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Full Name Input */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center justify-between">
                <span>2. Nome Intero Davanti</span>
                <span className="text-[10px] text-slate-400 font-normal">In corsivo sovrapposto</span>
              </label>
              <div className="space-y-2">
                <input
                  type="text"
                  value={project.fullName}
                  onChange={(e) => onUpdateProject({ fullName: e.target.value })}
                  placeholder="Es. Anna, Sofia, Leonardo..."
                  className="w-full text-lg font-medium bg-slate-800/80 border border-slate-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl px-4 py-2.5 text-white outline-none"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      if (!project.fullName) return;
                      const formatted =
                        project.fullName.charAt(0).toUpperCase() +
                        project.fullName.slice(1).toLowerCase();
                      onUpdateProject({ fullName: formatted });
                    }}
                    className="text-[11px] px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700"
                  >
                    Iniziale Maiuscola (Anna)
                  </button>
                  <button
                    onClick={() =>
                      onUpdateProject({ fullName: project.fullName.toUpperCase() })
                    }
                    className="text-[11px] px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700"
                  >
                    Tutto Maiuscolo (ANNA)
                  </button>
                </div>
              </div>
            </div>

            {/* Font Big Letter Selector */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                  3. Font Lettera Grande
                </label>
                {onOpenAddFont && (
                  <button
                    onClick={() => onOpenAddFont('letter')}
                    className="text-[11px] text-amber-300 hover:text-white font-bold flex items-center gap-1 bg-amber-500/10 hover:bg-amber-500/20 px-2 py-0.5 rounded-lg border border-amber-500/30 transition-all"
                  >
                    <PlusCircle size={12} />
                    <span>+ Tuo Font</span>
                  </button>
                )}
              </div>

              <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                {/* Custom User Fonts for Big Letter */}
                {letterCustomFonts.length > 0 && (
                  <div className="space-y-1 mb-2 pb-2 border-b border-amber-500/20">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                      <Sparkles size={11} />
                      <span>I Tuoi Font Personalizzati ({letterCustomFonts.length})</span>
                    </div>
                    {letterCustomFonts.map((cFont) => (
                      <button
                        key={cFont.id}
                        onClick={() => onUpdateProject({ bigLetterFontId: cFont.id })}
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                          project.bigLetterFontId === cFont.id
                            ? 'border-amber-400 bg-amber-500/20 text-white shadow-xs'
                            : 'border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/15 text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className="text-2xl font-bold w-8 text-center text-amber-300"
                            style={{ fontFamily: cFont.family }}
                          >
                            {project.bigLetter.charAt(0) || 'A'}
                          </span>
                          <div>
                            <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                              <span>{cFont.name}</span>
                              <span className="text-[9px] px-1.5 py-0.2 bg-amber-400 text-slate-950 font-black rounded">
                                TUO
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {cFont.sourceType === 'file' ? `File ${cFont.fileName || ''}` : 'Google Font'}
                            </div>
                          </div>
                        </div>
                        {project.bigLetterFontId === cFont.id && (
                          <Check size={16} className="text-amber-400" />
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {/* Predefined Fonts */}
                {BIG_LETTER_FONTS.map((font) => (
                  <button
                    key={font.id}
                    onClick={() => onUpdateProject({ bigLetterFontId: font.id })}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                      project.bigLetterFontId === font.id
                        ? 'border-amber-400 bg-amber-500/15 text-white'
                        : 'border-slate-800 bg-slate-800/40 hover:bg-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="text-2xl font-bold w-8 text-center text-amber-300"
                        style={{ fontFamily: font.family }}
                      >
                        {project.bigLetter.charAt(0) || 'A'}
                      </span>
                      <div>
                        <div className="text-xs font-semibold">{font.name}</div>
                        <div className="text-[10px] text-slate-400">{font.category}</div>
                      </div>
                    </div>
                    {project.bigLetterFontId === font.id && (
                      <Check size={16} className="text-amber-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Spessore & Snellezza Lettera Grande (Risolve il problema del font spesso) */}
            <div className="space-y-3 pt-3 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Sliders size={13} className="text-amber-400" />
                  <span>4. Spessore & Snellezza Lettera</span>
                </label>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/70 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  Foto 1 vs Foto 2
                </span>
              </div>

              {/* Spessore del Tratto (Font Weight) */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Spessore del Tratto (Peso Font):</span>
                  <span className="font-mono text-amber-400 font-bold">
                    {project.letterWeight === 300
                      ? 'Sottile (Light 300)'
                      : (project.letterWeight || 400) === 400
                      ? 'Normale (Regular 400 - Foto 1)'
                      : project.letterWeight === 500
                      ? 'Medio (500)'
                      : project.letterWeight === 600
                      ? 'Semigrassetto (600)'
                      : project.letterWeight === 700
                      ? 'Grassetto (Bold 700)'
                      : 'Black (Massiccio 900)'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { label: 'Sottile (300)', weight: 300 },
                    { label: 'Normale (400)', weight: 400, highlight: true },
                    { label: 'Medio (500)', weight: 500 },
                    { label: 'SemiBold (600)', weight: 600 },
                    { label: 'Grassetto (700)', weight: 700 },
                    { label: 'Black (900)', weight: 900 },
                  ].map((w) => (
                    <button
                      key={w.weight}
                      onClick={() => onUpdateProject({ letterWeight: w.weight })}
                      className={`py-1.5 px-2 text-xs rounded-xl border text-center transition-all ${
                        (project.letterWeight || 400) === w.weight
                          ? 'border-amber-400 bg-amber-500/20 text-white font-bold shadow-xs'
                          : 'border-slate-800 bg-slate-800/40 hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <span>{w.label}</span>
                      {w.highlight && (
                        <span className="block text-[9px] text-amber-400 font-normal">
                          ★ Come Foto 1
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Larghezza / Snellezza (Scala Orizzontale X) */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Larghezza Lettera (Snella vs Larga):</span>
                  <span className="font-mono text-amber-400 font-bold">
                    {Math.round((project.letterWidthScale || 1.0) * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.65"
                  max="1.35"
                  step="0.01"
                  value={project.letterWidthScale || 1.0}
                  onChange={(e) =>
                    onUpdateProject({ letterWidthScale: parseFloat(e.target.value) })
                  }
                  className="w-full accent-amber-400 cursor-pointer"
                />
                <div className="grid grid-cols-4 gap-1 pt-0.5">
                  <button
                    onClick={() => onUpdateProject({ letterWidthScale: 0.78 })}
                    className={`text-[10px] py-1 rounded border transition-all ${
                      Math.abs((project.letterWidthScale || 1.0) - 0.78) < 0.02
                        ? 'bg-amber-400 text-slate-950 font-bold border-amber-400'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                    }`}
                  >
                    Molto Snella (78%)
                  </button>
                  <button
                    onClick={() => onUpdateProject({ letterWidthScale: 0.88 })}
                    className={`text-[10px] py-1 rounded border transition-all ${
                      Math.abs((project.letterWidthScale || 1.0) - 0.88) < 0.02
                        ? 'bg-amber-400 text-slate-950 font-bold border-amber-400'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                    }`}
                  >
                    Snella / Foto 1 (88%)
                  </button>
                  <button
                    onClick={() => onUpdateProject({ letterWidthScale: 1.0 })}
                    className={`text-[10px] py-1 rounded border transition-all ${
                      Math.abs((project.letterWidthScale || 1.0) - 1.0) < 0.02
                        ? 'bg-amber-400 text-slate-950 font-bold border-amber-400'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                    }`}
                  >
                    Naturale (100%)
                  </button>
                  <button
                    onClick={() => onUpdateProject({ letterWidthScale: 1.15 })}
                    className={`text-[10px] py-1 rounded border transition-all ${
                      Math.abs((project.letterWidthScale || 1.0) - 1.15) < 0.02
                        ? 'bg-amber-400 text-slate-950 font-bold border-amber-400'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                    }`}
                  >
                    Allargata (115%)
                  </button>
                </div>
              </div>

              {/* Spiegazione e Risoluzione per l'utente */}
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-1 text-[11px] text-amber-200/90 leading-relaxed">
                <div className="font-bold text-amber-300 flex items-center gap-1">
                  <span>💡 Come è stato risolto:</span>
                </div>
                <p>
                  Nei software di grafica il font viene mostrato con il suo tratto originale (Regular 400).
                  Selezionando <strong>Normale (400)</strong> e una larghezza dell&apos;<strong>85%-100%</strong>,
                  la lettera acquista la forma affusolata, sottile ed elegante della prima foto senza alcun ispessimento forzato.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: GLI 8 FONT PER I NOMI ================= */}
        {activeTab === 'fonts' && (
          <div className="space-y-6">
            {/* Quick Actions for 8 Fonts */}
            <div className="flex gap-2">
              <button
                onClick={onShuffleFonts}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-all active:scale-95"
                title="Mischia 8 font diversi per i nomi"
              >
                <Shuffle size={13} className="text-amber-400" />
                <span>Mischia 8 Font</span>
              </button>

              {onOpenAddFont && (
                <button
                  onClick={() => onOpenAddFont('name')}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
                  title="Aggiungi o carica il tuo font per i nomi in rilievo"
                >
                  <PlusCircle size={14} />
                  <span>+ Tuo Font Nome</span>
                </button>
              )}
            </div>

            {/* Presets Packs */}
            <div className="space-y-2">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Collezioni Tematiche Preimpostate
              </label>
              <div className="grid grid-cols-1 gap-1.5">
                {FONT_PRESET_PACKS.map((pack, idx) => (
                  <button
                    key={idx}
                    onClick={() => onApplyPresetPack(pack.fonts)}
                    className="p-2 text-left bg-slate-800/50 hover:bg-slate-800 border border-slate-800 hover:border-amber-400/50 rounded-xl transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-200 group-hover:text-amber-300">
                        {pack.name}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">{pack.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Active Selected Slot Inspector & Position Editor */}
            {project.selectedSlotIndex >= 0 ? (
              <div className="p-3.5 bg-slate-950/70 border border-amber-500/40 rounded-2xl space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-md">
                      ESEMPIO {project.selectedSlotIndex + 1}
                    </span>
                    <span className="text-xs font-bold text-amber-300 truncate">
                      {selectedSlotFont.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() =>
                        onUpdateSlot(project.selectedSlotIndex, {
                          offsetX: 0,
                          offsetY: selectedSlotFont.defaultYOffset || 12,
                          scale: 1,
                        })
                      }
                      title="Reimposta Posizione Predefinita"
                      className="text-[10px] flex items-center gap-1 text-slate-400 hover:text-amber-300 bg-slate-800 px-2 py-1 rounded-md transition-colors"
                    >
                      <RotateCcw size={10} /> Reset
                    </button>
                    <button
                      onClick={() => onUpdateProject({ selectedSlotIndex: -1 })}
                      title="Deseleziona la lettera attiva (ESC)"
                      className="text-[10px] flex items-center gap-1 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded-md transition-colors border border-slate-700"
                    >
                      <X size={10} /> Deseleziona
                    </button>
                  </div>
                </div>

                {/* Change Font for Current Slot */}
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                    Cambia Font per ESEMPIO {project.selectedSlotIndex + 1}
                  </label>
                  <select
                    value={selectedSlot.fontId}
                    onChange={(e) =>
                      onUpdateSlot(project.selectedSlotIndex, { fontId: e.target.value })
                    }
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-amber-400 outline-none"
                  >
                    {nameCustomFonts.length > 0 && (
                      <optgroup label="⭐ I Tuoi Font Personalizzati">
                        {nameCustomFonts.map((font) => (
                          <option key={font.id} value={font.id}>
                            ⭐ {font.name} (Tuo Font)
                          </option>
                        ))}
                      </optgroup>
                    )}
                    <optgroup label="Font Calligrafici e Corsivi Inclusi">
                      {SCRIPT_FONTS.map((font) => (
                        <option key={font.id} value={font.id}>
                          {font.name} ({font.category})
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                {/* Sliders for fine-tuning horizontal & vertical offsets */}
                <div className="space-y-2 pt-1 border-t border-slate-800">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 flex items-center gap-1">
                      <Move size={12} /> Spostamento Orizzontale (X)
                    </span>
                    <span className="font-mono text-amber-400">{selectedSlot.offsetX} px</span>
                  </div>
                  <input
                    type="range"
                    min="-80"
                    max="80"
                    step="1"
                    value={selectedSlot.offsetX}
                    onChange={(e) =>
                      onUpdateSlot(project.selectedSlotIndex, {
                        offsetX: parseInt(e.target.value, 10),
                      })
                    }
                    className="w-full accent-amber-400 cursor-pointer"
                  />

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-slate-300 flex items-center gap-1">
                      <Move size={12} className="rotate-90" /> Spostamento Verticale (Y)
                    </span>
                    <span className="font-mono text-amber-400">{selectedSlot.offsetY} px</span>
                  </div>
                  <input
                    type="range"
                    min="-80"
                    max="80"
                    step="1"
                    value={selectedSlot.offsetY}
                    onChange={(e) =>
                      onUpdateSlot(project.selectedSlotIndex, {
                        offsetY: parseInt(e.target.value, 10),
                      })
                    }
                    className="w-full accent-amber-400 cursor-pointer"
                  />

                  {/* Scale slider for this name */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-slate-300 flex items-center gap-1">
                      <Maximize2 size={12} /> Scala Nome
                    </span>
                    <span className="font-mono text-amber-400">
                      {Math.round(selectedSlot.scale * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.35"
                    max="2.0"
                    step="0.05"
                    value={selectedSlot.scale}
                    onChange={(e) =>
                      onUpdateSlot(project.selectedSlotIndex, {
                        scale: parseFloat(e.target.value),
                      })
                    }
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                  <p className="text-[10px] text-amber-400/90 flex items-center gap-1 pt-0.5">
                    <span>💡</span>
                    <span>Puoi anche usare la rotella del mouse sul nome per scalarlo.</span>
                  </p>
                </div>

                {/* Nudge Buttons */}
                <div className="flex items-center justify-center gap-1 pt-1">
                  <button
                    title="Sinistra (-2px)"
                    onClick={() =>
                      onUpdateSlot(project.selectedSlotIndex, {
                        offsetX: selectedSlot.offsetX - 2,
                      })
                    }
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <div className="flex flex-col gap-1">
                    <button
                      title="Alto (-2px)"
                      onClick={() =>
                        onUpdateSlot(project.selectedSlotIndex, {
                          offsetY: selectedSlot.offsetY - 2,
                        })
                      }
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs"
                    >
                      <ChevronUp size={14} />
                    </button>
                    <button
                      title="Basso (+2px)"
                      onClick={() =>
                        onUpdateSlot(project.selectedSlotIndex, {
                          offsetY: selectedSlot.offsetY + 2,
                        })
                      }
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs"
                    >
                      <ChevronDown size={14} />
                    </button>
                  </div>
                  <button
                    title="Destra (+2px)"
                    onClick={() =>
                      onUpdateSlot(project.selectedSlotIndex, {
                        offsetX: selectedSlot.offsetX + 2,
                      })
                    }
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-slate-950/50 border border-slate-800/80 rounded-2xl space-y-1.5 text-center">
                <div className="text-xs font-semibold text-slate-300">
                  Nessun esempio selezionato
                </div>
                <p className="text-[11px] text-slate-400">
                  Clicca su uno degli esempi sulla tavola o nella lista qui sotto per regolare posizione o font.
                </p>
              </div>
            )}

            {/* List of all 8 slots with quick select */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Seleziona o deseleziona font:
                </label>
                {project.selectedSlotIndex >= 0 && (
                  <button
                    onClick={() => onUpdateProject({ selectedSlotIndex: -1 })}
                    className="text-[10px] text-amber-400 hover:text-white font-medium hover:underline"
                  >
                    Deseleziona tutto
                  </button>
                )}
              </div>
              <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
                {project.slots.map((slot, idx) => {
                  const customSlot = customFonts.find((f) => f.id === slot.fontId);
                  const font = customSlot
                    ? { id: customSlot.id, name: customSlot.name, family: customSlot.family }
                    : SCRIPT_FONTS.find((f) => f.id === slot.fontId) || SCRIPT_FONTS[0];
                  const isSelected = project.selectedSlotIndex === idx;

                  return (
                    <div
                      key={idx}
                      onClick={() =>
                        onUpdateProject({ selectedSlotIndex: isSelected ? -1 : idx })
                      }
                      className={`flex items-center justify-between p-2 rounded-xl cursor-pointer border transition-all ${
                        isSelected
                          ? 'border-amber-400 bg-amber-500/10 text-white'
                          : 'border-slate-800 bg-slate-800/40 hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md whitespace-nowrap ${
                            isSelected
                              ? 'bg-amber-400 text-slate-950'
                              : 'bg-slate-700 text-slate-300'
                          }`}
                        >
                          ESEMPIO {idx + 1}
                        </span>
                        <span
                          className="text-base truncate max-w-[130px]"
                          style={{ fontFamily: font.family }}
                        >
                          {project.fullName || 'Anna'}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 truncate max-w-[100px]">
                        {font.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: COLORI & MATERIALI 3D ================= */}
        {activeTab === 'colors' && (
          <div className="space-y-6">
            {/* 1. Big Letter Color & Finish */}
            <div className="space-y-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center justify-between">
                <span>1. Colore Lettera Maiuscola</span>
                <span className="text-[10px] text-slate-400 font-normal">Sfondo grande</span>
              </label>

              {/* Material Presets */}
              <div className="grid grid-cols-2 gap-1.5">
                {LETTER_MATERIALS.map((mat) => (
                  <button
                    key={mat.id}
                    onClick={() =>
                      onUpdateProject({
                        letterColor: mat.color,
                        letterDepthColor: mat.shadowColor,
                      })
                    }
                    className={`flex items-center gap-2 p-1.5 rounded-xl border text-left transition-all ${
                      project.letterColor.toLowerCase() === mat.color.toLowerCase()
                        ? 'border-amber-400 bg-amber-500/15'
                        : 'border-slate-800 hover:border-slate-700 bg-slate-800/40'
                    }`}
                  >
                    <span
                      className="w-5 h-5 rounded-lg border border-white/20 shrink-0 shadow-inner"
                      style={{ backgroundColor: mat.color }}
                    />
                    <span className="text-[11px] font-medium truncate text-slate-200">
                      {mat.name}
                    </span>
                  </button>
                ))}
              </div>

              {/* Custom Color Pickers */}
              <div className="flex items-center gap-3 bg-slate-800/40 p-2.5 rounded-xl border border-slate-800">
                <input
                  type="color"
                  value={project.letterColor}
                  onChange={(e) => onUpdateProject({ letterColor: e.target.value })}
                  className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <div className="flex-1">
                  <div className="text-[11px] font-medium text-slate-300">Colore Personalizzato</div>
                  <input
                    type="text"
                    value={project.letterColor}
                    onChange={(e) => onUpdateProject({ letterColor: e.target.value })}
                    className="text-xs bg-slate-900 border border-slate-700 px-2 py-0.5 rounded text-amber-400 font-mono w-24"
                  />
                </div>
              </div>

              {/* 3D Depth Sliders */}
              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">Spessore 3D Lettera (Estrusione)</span>
                  <span className="font-mono text-amber-400">{project.letterDepth} px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="14"
                  value={project.letterDepth}
                  onChange={(e) =>
                    onUpdateProject({ letterDepth: parseInt(e.target.value, 10) })
                  }
                  className="w-full accent-amber-400 cursor-pointer"
                />
                <div className="grid grid-cols-4 gap-1 pt-0.5">
                  <button
                    onClick={() => onUpdateProject({ letterDepth: 0 })}
                    className={`text-[10px] py-0.5 rounded border transition-all ${
                      project.letterDepth === 0
                        ? 'bg-amber-400 text-slate-950 font-bold border-amber-400'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                    }`}
                  >
                    Piatto 2D
                  </button>
                  <button
                    onClick={() => onUpdateProject({ letterDepth: 3 })}
                    className={`text-[10px] py-0.5 rounded border transition-all ${
                      project.letterDepth === 3
                        ? 'bg-amber-400 text-slate-950 font-bold border-amber-400'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                    }`}
                  >
                    Fine / Foto 1
                  </button>
                  <button
                    onClick={() => onUpdateProject({ letterDepth: 7 })}
                    className={`text-[10px] py-0.5 rounded border transition-all ${
                      project.letterDepth === 7
                        ? 'bg-amber-400 text-slate-950 font-bold border-amber-400'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                    }`}
                  >
                    Rilievo (7px)
                  </button>
                  <button
                    onClick={() => onUpdateProject({ letterDepth: 12 })}
                    className={`text-[10px] py-0.5 rounded border transition-all ${
                      project.letterDepth === 12
                        ? 'bg-amber-400 text-slate-950 font-bold border-amber-400'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                    }`}
                  >
                    Spesso (12px)
                  </button>
                </div>

                <div className="flex justify-between text-xs pt-1">
                  <span className="text-slate-300">Intensità Ombra Portata</span>
                  <span className="font-mono text-amber-400">
                    {project.letterShadowIntensity}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={project.letterShadowIntensity}
                  onChange={(e) =>
                    onUpdateProject({
                      letterShadowIntensity: parseInt(e.target.value, 10),
                    })
                  }
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>
            </div>

            {/* 2. Foreground Name Color */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <label className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center justify-between">
                <span>2. Colore Nome Davanti</span>
                <span className="text-[10px] text-slate-400 font-normal">Corsivo 3D</span>
              </label>

              {/* Name Material Presets */}
              <div className="grid grid-cols-2 gap-1.5">
                {NAME_MATERIALS.map((mat) => (
                  <button
                    key={mat.id}
                    onClick={() =>
                      onUpdateProject({
                        nameColor: mat.color,
                        nameDepthColor: mat.shadowColor,
                      })
                    }
                    className={`flex items-center gap-2 p-1.5 rounded-xl border text-left transition-all ${
                      project.nameColor.toLowerCase() === mat.color.toLowerCase()
                        ? 'border-amber-400 bg-amber-500/15'
                        : 'border-slate-800 hover:border-slate-700 bg-slate-800/40'
                    }`}
                  >
                    <span
                      className="w-5 h-5 rounded-lg border border-white/20 shrink-0 shadow-inner"
                      style={{ backgroundColor: mat.color }}
                    />
                    <span className="text-[11px] font-medium truncate text-slate-200">
                      {mat.name}
                    </span>
                  </button>
                ))}
              </div>

              {/* Custom Color for Name */}
              <div className="flex items-center gap-3 bg-slate-800/40 p-2.5 rounded-xl border border-slate-800">
                <input
                  type="color"
                  value={project.nameColor}
                  onChange={(e) => onUpdateProject({ nameColor: e.target.value })}
                  className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <div className="flex-1">
                  <div className="text-[11px] font-medium text-slate-300">Colore Nome Personalizzato</div>
                  <input
                    type="text"
                    value={project.nameColor}
                    onChange={(e) => onUpdateProject({ nameColor: e.target.value })}
                    className="text-xs bg-slate-900 border border-slate-700 px-2 py-0.5 rounded text-amber-400 font-mono w-24"
                  />
                </div>
              </div>

              {/* Name 3D depth */}
              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">Rilievo 3D Nome</span>
                  <span className="font-mono text-amber-400">{project.nameDepth} px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="8"
                  value={project.nameDepth}
                  onChange={(e) =>
                    onUpdateProject({ nameDepth: parseInt(e.target.value, 10) })
                  }
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>
            </div>

            {/* 3. Background Color */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <label className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center justify-between">
                <span>3. Sfondo Immagine</span>
                <span className="text-[10px] text-slate-400 font-normal">Tavola di lavoro</span>
              </label>

              <div className="grid grid-cols-2 gap-1.5">
                {BACKGROUND_PRESETS.map((bg) => (
                  <button
                    key={bg.id}
                    onClick={() => onUpdateProject({ backgroundColor: bg.color })}
                    className={`flex items-center gap-2 p-1.5 rounded-xl border text-left transition-all ${
                      project.backgroundColor === bg.color
                        ? 'border-amber-400 bg-amber-500/15'
                        : 'border-slate-800 hover:border-slate-700 bg-slate-800/40'
                    }`}
                  >
                    <span
                      className="w-5 h-5 rounded-lg border border-white/20 shrink-0"
                      style={{
                        backgroundColor: bg.color === 'transparent' ? '#333' : bg.color,
                        backgroundImage:
                          bg.color === 'transparent'
                            ? 'repeating-conic-gradient(#555 0% 25%, #333 0% 50%) 50% / 8px 8px'
                            : undefined,
                      }}
                    />
                    <span className="text-[11px] font-medium truncate text-slate-200">
                      {bg.name}
                    </span>
                  </button>
                ))}
              </div>

              {/* Custom background color */}
              <div className="flex items-center gap-3 bg-slate-800/40 p-2.5 rounded-xl border border-slate-800">
                <input
                  type="color"
                  value={
                    project.backgroundColor === 'transparent'
                      ? '#4f5154'
                      : project.backgroundColor
                  }
                  onChange={(e) => onUpdateProject({ backgroundColor: e.target.value })}
                  className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <div className="flex-1">
                  <div className="text-[11px] font-medium text-slate-300">
                    Sfondo Personalizzato
                  </div>
                  <input
                    type="text"
                    value={project.backgroundColor}
                    onChange={(e) =>
                      onUpdateProject({ backgroundColor: e.target.value })
                    }
                    className="text-xs bg-slate-900 border border-slate-700 px-2 py-0.5 rounded text-amber-400 font-mono w-24"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 4: LAYOUT & SPAZIATURA ================= */}
        {activeTab === 'layout' && (
          <div className="space-y-6">
            {/* Grid Layout Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                Disposizione Griglia
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onUpdateProject({ gridLayout: '4x2' })}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    project.gridLayout === '4x2'
                      ? 'border-amber-400 bg-amber-500/15 text-white font-bold'
                      : 'border-slate-800 bg-slate-800/40 hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <div className="text-xs">4 Colonne x 2 Righe</div>
                  <div className="text-[10px] text-amber-400/90 font-normal">
                    (Come Foto Originale)
                  </div>
                </button>
                <button
                  onClick={() => onUpdateProject({ gridLayout: '2x4' })}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    project.gridLayout === '2x4'
                      ? 'border-amber-400 bg-amber-500/15 text-white font-bold'
                      : 'border-slate-800 bg-slate-800/40 hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <div className="text-xs">2 Colonne x 4 Righe</div>
                  <div className="text-[10px] text-slate-400 font-normal">(Verticale / Mobile)</div>
                </button>
              </div>
            </div>

            {/* Spacing Controls (Horizontal and Vertical Gaps) */}
            <div className="space-y-4 pt-2 border-t border-slate-800">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">
                    Distanza Orizzontale tra Lettere
                  </span>
                  <span className="font-mono text-amber-400">{project.gridGapX} px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="140"
                  step="2"
                  value={project.gridGapX}
                  onChange={(e) =>
                    onUpdateProject({ gridGapX: parseInt(e.target.value, 10) })
                  }
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">
                    Distanza Verticale tra Righe
                  </span>
                  <span className="font-mono text-amber-400">{project.gridGapY} px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="140"
                  step="2"
                  value={project.gridGapY}
                  onChange={(e) =>
                    onUpdateProject({ gridGapY: parseInt(e.target.value, 10) })
                  }
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">
                    Margine Esterno Tavola (Padding)
                  </span>
                  <span className="font-mono text-amber-400">{project.padding} px</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="160"
                  step="5"
                  value={project.padding}
                  onChange={(e) =>
                    onUpdateProject({ padding: parseInt(e.target.value, 10) })
                  }
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>
            </div>

            {/* Scale controls */}
            <div className="space-y-4 pt-2 border-t border-slate-800">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">
                    Dimensione Lettera Grande
                  </span>
                  <span className="font-mono text-amber-400">{project.letterSize} px</span>
                </div>
                <input
                  type="range"
                  min="130"
                  max="320"
                  step="5"
                  value={project.letterSize}
                  onChange={(e) =>
                    onUpdateProject({ letterSize: parseInt(e.target.value, 10) })
                  }
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>

              {/* Larghezza / Snellezza Lettera */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">
                    Larghezza / Snellezza Lettera (Scala X)
                  </span>
                  <span className="font-mono text-amber-400">
                    {Math.round((project.letterWidthScale || 1.0) * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.65"
                  max="1.35"
                  step="0.01"
                  value={project.letterWidthScale || 1.0}
                  onChange={(e) =>
                    onUpdateProject({ letterWidthScale: parseFloat(e.target.value) })
                  }
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>

              {/* Spazio tra 2 lettere o 2 numeri */}
              {project.bigLetter.trim().length >= 2 && (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium flex items-center gap-1.5">
                      <MoveHorizontal size={13} className="text-amber-400" /> Spazio tra Lettere / Numeri
                    </span>
                    <span className="font-mono text-amber-400">{project.letterSpacing || 0} px</span>
                  </div>
                  <input
                    type="range"
                    min="-60"
                    max="100"
                    step="1"
                    value={project.letterSpacing || 0}
                    onChange={(e) =>
                      onUpdateProject({ letterSpacing: parseInt(e.target.value, 10) })
                    }
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">
                    Dimensione Base Nome Davanti
                  </span>
                  <span className="font-mono text-amber-400">{project.nameBaseSize} px</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="140"
                  step="2"
                  value={project.nameBaseSize}
                  onChange={(e) =>
                    onUpdateProject({ nameBaseSize: parseInt(e.target.value, 10) })
                  }
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>
            </div>

            {/* Toggle font labels */}
            <div className="pt-2 border-t border-slate-800">
              <label className="flex items-center justify-between p-3 bg-slate-800/40 rounded-xl cursor-pointer hover:bg-slate-800/60 border border-slate-800">
                <span className="text-xs font-medium text-slate-200">
                  Mostra Etichetta con Nome del Font
                </span>
                <input
                  type="checkbox"
                  checked={project.showFontLabels}
                  onChange={(e) =>
                    onUpdateProject({ showFontLabels: e.target.checked })
                  }
                  className="w-4 h-4 rounded accent-amber-400 cursor-pointer"
                />
              </label>
            </div>

            {/* Reset to Default */}
            <div className="pt-2">
              <button
                onClick={onResetToDefaults}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 transition-all"
              >
                <RotateCcw size={14} />
                <span>Ripristina Configurazione Foto Originale</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
