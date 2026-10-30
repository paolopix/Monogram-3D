import React from 'react';
import {
  Download,
  Image as ImageIcon,
  Shuffle,
  ZoomIn,
  ZoomOut,
  Maximize,
  Sparkles,
  Layers,
  X,
  FolderOpen,
  FolderArchive,
  Type,
} from 'lucide-react';
import { MonogramProjectState } from '../types';

interface HeaderProps {
  project: MonogramProjectState;
  zoom: number;
  onZoomChange: (newZoom: number) => void;
  onOpenExport: () => void;
  onOpenCompare: () => void;
  onOpenProjects: () => void;
  onOpenAddFont?: () => void;
  onShuffleFonts: () => void;
  onDeselect: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  project,
  zoom,
  onZoomChange,
  onOpenExport,
  onOpenCompare,
  onOpenProjects,
  onOpenAddFont,
  onShuffleFonts,
  onDeselect,
}) => {
  return (
    <header className="h-16 bg-slate-950 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between z-30 shrink-0">
      {/* Brand & Title */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-950 font-black text-xl">
          {project.bigLetter.charAt(0) || 'A'}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-extrabold text-white tracking-tight">
              MonogramStudio <span className="text-amber-400">3D</span>
            </h1>
            <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-md">
              8 Font a Confronto
            </span>
          </div>
          <p className="text-xs text-slate-400 hidden md:block">
            Lettera &quot;{project.bigLetter}&quot; + Nome &quot;{project.fullName}&quot; in rilievo 3D
          </p>
        </div>
      </div>

      {/* Middle Controls (Zoom & Quick Tools) */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Deselect button if an item is selected */}
        {project.selectedSlotIndex >= 0 && (
          <button
            onClick={onDeselect}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-400/15 hover:bg-amber-400/25 border border-amber-400/50 text-amber-300 text-xs font-bold rounded-xl transition-all animate-in fade-in"
            title="Deseleziona la lettera attiva (o premi tasto ESC)"
          >
            <X size={14} className="text-amber-400" />
            <span className="hidden sm:inline">Deseleziona Esempio {project.selectedSlotIndex + 1}</span>
            <span className="sm:hidden">Deseleziona</span>
          </button>
        )}

        {/* Zoom controls */}
        <div className="hidden lg:flex items-center bg-slate-900 border border-slate-800 rounded-xl px-1.5 py-1">
          <button
            onClick={() => onZoomChange(Math.max(0.4, zoom - 0.1))}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
            title="Riduci Zoom"
          >
            <ZoomOut size={15} />
          </button>
          <span className="text-[11px] font-mono text-slate-300 w-12 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => onZoomChange(Math.min(1.8, zoom + 0.1))}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
            title="Aumenta Zoom"
          >
            <ZoomIn size={15} />
          </button>
          <button
            onClick={() => onZoomChange(1.0)}
            className="p-1 text-slate-400 hover:text-amber-300 rounded hover:bg-slate-800 ml-0.5"
            title="Reimposta Zoom 100%"
          >
            <Maximize size={13} />
          </button>
        </div>

        {/* Quick Shuffle */}
        <button
          onClick={onShuffleFonts}
          className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-medium rounded-xl transition-all"
          title="Mischia 8 font diversi"
        >
          <Shuffle size={14} className="text-amber-400" />
          <span className="hidden md:inline">Mischia 8 Font</span>
        </button>

        {/* Custom Font Upload Button */}
        {onOpenAddFont && (
          <button
            onClick={onOpenAddFont}
            className="flex items-center gap-1.5 px-3 py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 hover:border-amber-400 text-amber-300 text-xs font-bold rounded-xl transition-all shadow-xs"
            title="Aggiungi o carica i tuoi font personalizzati (.ttf/.otf/Google)"
          >
            <Type size={14} className="text-amber-400" />
            <span className="hidden sm:inline">+ Font Tuoi</span>
          </button>
        )}

        {/* Projects / Save & Load */}
        <button
          onClick={onOpenProjects}
          className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-medium rounded-xl transition-all"
          title="Gestione progetti salvati, salvataggio su file e ripristino"
        >
          <FolderOpen size={14} className="text-amber-400" />
          <span className="hidden sm:inline">Progetti</span>
        </button>

        {/* Download Source Code ZIP */}
        <a
          href="/monogram-studio-source.zip"
          download="monogram-studio-source.zip"
          className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-medium rounded-xl transition-all"
          title="Scarica archivio ZIP con tutti i file sorgente dell'applicazione"
        >
          <FolderArchive size={14} className="text-amber-400" />
          <span className="hidden sm:inline">Sorgenti ZIP</span>
        </a>

        {/* Compare with Original Photo */}
        <button
          onClick={onOpenCompare}
          className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-medium rounded-xl transition-all"
          title="Visualizza foto originale d'esempio"
        >
          <ImageIcon size={14} className="text-amber-400" />
          <span className="hidden sm:inline">Foto Riferimento</span>
        </button>

        {/* Export Button (Primary CTA) */}
        <button
          onClick={onOpenExport}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-extrabold rounded-xl shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
        >
          <Download size={15} />
          <span>Esporta Immagine</span>
        </button>
      </div>
    </header>
  );
};
