import React, { useState, useRef, useEffect } from 'react';
import { MonogramProjectState, SlotConfig, CustomFont } from './types';
import {
  DEFAULT_8_FONTS,
  SCRIPT_FONTS,
  BIG_LETTER_FONTS,
} from './fonts';
import { initAllCustomFonts } from './fontManager';
import { Header } from './components/Header';
import { ControlPanel } from './components/ControlPanel';
import { MonogramBoard } from './components/MonogramBoard';
import { ExportModal } from './components/ExportModal';
import { CompareModal } from './components/CompareModal';
import { ProjectsModal } from './components/ProjectsModal';
import { AddFontModal } from './components/AddFontModal';
import { Sliders, Eye, Sparkles, Move } from 'lucide-react';

const INITIAL_PROJECT_STATE: MonogramProjectState = {
  bigLetter: 'A',
  fullName: 'Anna',
  bigLetterFontId: 'cinzel',
  slots: DEFAULT_8_FONTS.map((fontId, index) => {
    const font = SCRIPT_FONTS.find((f) => f.id === fontId);
    return {
      fontId,
      offsetX: 0,
      offsetY: font?.defaultYOffset ?? 12,
      scale: 1,
    };
  }),
  letterColor: '#c89f76',
  letterDepth: 7,
  letterDepthColor: '#5a3d22',
  letterShadowIntensity: 80,
  nameColor: '#f5f3e5',
  nameDepth: 2,
  nameDepthColor: '#9c9883',
  nameShadowIntensity: 85,
  backgroundColor: '#4f5154',
  gridGapX: 52,
  gridGapY: 58,
  padding: 64,
  letterSize: 210,
  letterSpacing: 0,
  nameBaseSize: 88,
  gridLayout: '4x2',
  showFontLabels: false,
  selectedSlotIndex: -1,
};

export default function App() {
  const [project, setProject] = useState<MonogramProjectState>(() => {
    // Load from localStorage if available
    try {
      const saved = localStorage.getItem('monogram_studio_state');
      if (saved) {
        return { ...INITIAL_PROJECT_STATE, ...JSON.parse(saved) };
      }
    } catch {
      // fallback to initial
    }
    return INITIAL_PROJECT_STATE;
  });

  const [zoom, setZoom] = useState<number>(0.9);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [isCompareOpen, setIsCompareOpen] = useState<boolean>(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState<boolean>(false);
  const [isAddFontOpen, setIsAddFontOpen] = useState<boolean>(false);
  const [addFontInitialTarget, setAddFontInitialTarget] = useState<'letter' | 'name' | 'both'>('both');
  const [customFonts, setCustomFonts] = useState<CustomFont[]>(() => initAllCustomFonts());
  const [singleSlotExport, setSingleSlotExport] = useState<number | null>(null);
  const [showMobilePanel, setShowMobilePanel] = useState<boolean>(false);
  const [isExportingSnapshot, setIsExportingSnapshot] = useState<boolean>(false);
  const [hideBadgesInSnapshot, setHideBadgesInSnapshot] = useState<boolean>(false);

  const artboardRef = useRef<HTMLDivElement | null>(null);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('monogram_studio_state', JSON.stringify(project));
    } catch {
      // ignore
    }
  }, [project]);

  const handleUpdateProject = (updates: Partial<MonogramProjectState>) => {
    setProject((prev) => ({ ...prev, ...updates }));
  };

  const handleUpdateSlot = (index: number, updates: Partial<SlotConfig>) => {
    setProject((prev) => {
      const newSlots = [...prev.slots];
      newSlots[index] = { ...newSlots[index], ...updates };
      return { ...prev, slots: newSlots };
    });
  };

  const handleResetToDefaults = () => {
    setProject(INITIAL_PROJECT_STATE);
  };

  const handleShuffleFonts = () => {
    // Pick 8 unique random fonts from the list
    const shuffled = [...SCRIPT_FONTS].sort(() => 0.5 - Math.random());
    const picked = shuffled.slice(0, 8);

    setProject((prev) => ({
      ...prev,
      slots: picked.map((font, idx) => ({
        fontId: font.id,
        offsetX: prev.slots[idx]?.offsetX ?? 0,
        offsetY: font.defaultYOffset ?? 12,
        scale: prev.slots[idx]?.scale ?? 1,
      })),
    }));
  };

  const handleApplyPresetPack = (fonts: string[]) => {
    setProject((prev) => ({
      ...prev,
      slots: fonts.slice(0, 8).map((fontId, idx) => {
        const font = SCRIPT_FONTS.find((f) => f.id === fontId);
        return {
          fontId,
          offsetX: prev.slots[idx]?.offsetX ?? 0,
          offsetY: font?.defaultYOffset ?? 12,
          scale: prev.slots[idx]?.scale ?? 1,
        };
      }),
    }));
  };

  // Listen for Escape key to deselect
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleUpdateProject({ selectedSlotIndex: -1 });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleExportSingle = (index: number) => {
    setSingleSlotExport(index);
    handleUpdateProject({ selectedSlotIndex: -1 });
    setIsExportOpen(true);
  };

  const handleOpenGeneralExport = () => {
    setSingleSlotExport(null);
    handleUpdateProject({ selectedSlotIndex: -1 });
    setIsExportOpen(true);
  };

  const handleOpenAddFont = (target: 'letter' | 'name' | 'both' = 'both') => {
    setAddFontInitialTarget(target);
    setIsAddFontOpen(true);
  };

  const handleApplyFontToLetter = (fontId: string) => {
    handleUpdateProject({ bigLetterFontId: fontId });
  };

  const handleApplyFontToSlot = (fontId: string, slotIndex = 0) => {
    const targetIdx = slotIndex >= 0 ? slotIndex : (project.selectedSlotIndex >= 0 ? project.selectedSlotIndex : 0);
    handleUpdateSlot(targetIdx, { fontId });
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Top Header */}
      <Header
        project={project}
        zoom={zoom}
        onZoomChange={setZoom}
        onOpenExport={handleOpenGeneralExport}
        onOpenCompare={() => setIsCompareOpen(true)}
        onOpenProjects={() => setIsProjectsOpen(true)}
        onOpenAddFont={() => handleOpenAddFont('both')}
        onShuffleFonts={handleShuffleFonts}
        onDeselect={() => handleUpdateProject({ selectedSlotIndex: -1 })}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar Control Panel (Desktop & Tablet) */}
        <div
          className={`fixed lg:static inset-y-16 left-0 z-40 w-full sm:w-96 transition-transform duration-300 ${
            showMobilePanel ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <ControlPanel
            project={project}
            customFonts={customFonts}
            onOpenAddFont={handleOpenAddFont}
            onUpdateProject={handleUpdateProject}
            onUpdateSlot={handleUpdateSlot}
            onResetToDefaults={handleResetToDefaults}
            onShuffleFonts={handleShuffleFonts}
            onApplyPresetPack={handleApplyPresetPack}
            onOpenProjects={() => setIsProjectsOpen(true)}
          />
        </div>

        {/* Mobile Backdrop when sidebar is open */}
        {showMobilePanel && (
          <div
            onClick={() => setShowMobilePanel(false)}
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-xs lg:hidden"
          />
        )}

        {/* Canvas & Artboard Area */}
        <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden relative">
          {/* Subtle instruction tip banner */}
          <div className="bg-slate-900/90 border-b border-slate-800/80 px-4 py-2 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>
                <strong>Suggerimento:</strong> Clicca e{' '}
                <span className="text-amber-400 font-semibold">trascina il nome</span> per spostarlo, e{' '}
                <span className="text-amber-400 font-semibold">ruota la rotella del mouse</span> per scalarlo in tempo reale!
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-3 text-[11px]">
              <span className="bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                Lettera: <strong className="text-white">{project.bigLetter}</strong>
              </span>
              <span className="bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                Nome: <strong className="text-white">{project.fullName}</strong>
              </span>
            </div>
          </div>

          {/* Interactive Zoomable Board Viewport */}
          <div
            className="flex-1 overflow-auto flex items-center justify-center p-4 sm:p-8 cursor-default"
            onClick={() => handleUpdateProject({ selectedSlotIndex: -1 })}
          >
            <div
              className="transition-transform duration-100 ease-out origin-center"
              style={{
                transform: `scale(${zoom})`,
              }}
            >
              <MonogramBoard
                ref={artboardRef}
                project={project}
                customFonts={customFonts}
                isExporting={isExportingSnapshot}
                hideBadgesOnExport={hideBadgesInSnapshot}
                onSelectSlot={(idx) => handleUpdateProject({ selectedSlotIndex: idx })}
                onUpdateSlot={handleUpdateSlot}
                onExportSingle={handleExportSingle}
              />
            </div>
          </div>

          {/* Floating Mobile Toggle Button */}
          <button
            onClick={() => setShowMobilePanel(!showMobilePanel)}
            className="lg:hidden absolute bottom-5 right-5 z-40 flex items-center gap-2 px-4 py-3 bg-amber-500 text-slate-950 font-bold rounded-full shadow-2xl active:scale-95 transition-all"
          >
            <Sliders size={18} />
            <span>{showMobilePanel ? 'Chiudi Controlli' : 'Personalizza'}</span>
          </button>
        </div>
      </div>

      {/* Export High-Res Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        project={project}
        artboardRef={artboardRef}
        singleSlotExportIndex={singleSlotExport}
        onSetExportState={(exporting, hideBadges) => {
          setIsExportingSnapshot(exporting);
          setHideBadgesInSnapshot(!!hideBadges);
          if (exporting) {
            handleUpdateProject({ selectedSlotIndex: -1 });
          }
        }}
      />

      {/* Compare with Original Uploaded Photo Modal */}
      <CompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
      />

      {/* Projects Save & Load Modal */}
      <ProjectsModal
        isOpen={isProjectsOpen}
        onClose={() => setIsProjectsOpen(false)}
        currentProject={project}
        onLoadProject={(loadedProj) => {
          setProject(loadedProj);
        }}
      />

      {/* Add & Upload Custom Fonts Modal */}
      <AddFontModal
        isOpen={isAddFontOpen}
        onClose={() => setIsAddFontOpen(false)}
        customFonts={customFonts}
        onCustomFontsChange={setCustomFonts}
        initialTarget={addFontInitialTarget}
        onApplyFontToLetter={handleApplyFontToLetter}
        onApplyFontToSlot={handleApplyFontToSlot}
        selectedSlotIndex={project.selectedSlotIndex >= 0 ? project.selectedSlotIndex : 0}
        previewLetter={project.bigLetter.charAt(0) || 'A'}
        previewName={project.fullName || 'Anna'}
      />
    </div>
  );
}
