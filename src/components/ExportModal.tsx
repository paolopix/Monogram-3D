import React, { useState } from 'react';
import { toPng, toJpeg, toSvg } from 'html-to-image';
import confetti from 'canvas-confetti';
import { X, Download, Copy, Check, Sparkles, FileImage, Layers } from 'lucide-react';
import { MonogramProjectState } from '../types';
import { SCRIPT_FONTS } from '../fonts';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: MonogramProjectState;
  artboardRef: React.RefObject<HTMLDivElement | null>;
  singleSlotExportIndex: number | null;
  onSetExportState: (isExporting: boolean, hideBadges?: boolean) => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  project,
  artboardRef,
  singleSlotExportIndex,
  onSetExportState,
}) => {
  const [resolution, setResolution] = useState<number>(2); // 1x, 2x, 3x
  const [format, setFormat] = useState<'png' | 'jpeg' | 'svg'>('png');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [includeBadges, setIncludeBadges] = useState<boolean>(true);
  const [exportMode, setExportMode] = useState<'all' | 'single'>(
    singleSlotExportIndex !== null ? 'single' : 'all'
  );
  const [selectedSingleSlot, setSelectedSingleSlot] = useState<number>(
    singleSlotExportIndex !== null ? singleSlotExportIndex : 0
  );

  if (!isOpen) return null;

  const handleExport = async () => {
    if (!artboardRef.current) return;
    setIsExporting(true);
    // Tell App and MonogramBoard to enter pristine export mode (suppressing selection ring and upper controls)
    onSetExportState(true, !includeBadges);

    try {
      // Wait for React to re-render without selection ring or top action bar
      await new Promise((resolve) => setTimeout(resolve, 80));

      let targetElement: HTMLElement = artboardRef.current;

      // If single item export is chosen, target the specific item
      if (exportMode === 'single') {
        const items = artboardRef.current.querySelectorAll('.group');
        if (items[selectedSingleSlot]) {
          targetElement = items[selectedSingleSlot] as HTMLElement;
        }
      }

      const options = {
        pixelRatio: resolution,
        cacheBust: true,
        quality: 0.98,
        filter: (node: Node) => {
          if (node instanceof HTMLElement) {
            if (
              node.getAttribute('data-export-ignore') === 'true' ||
              node.classList.contains('export-ignore')
            ) {
              return false;
            }
            if (!includeBadges && node.getAttribute('data-export-badge') === 'true') {
              return false;
            }
          }
          return true;
        },
        backgroundColor:
          format === 'jpeg'
            ? project.backgroundColor === 'transparent'
              ? '#ffffff'
              : project.backgroundColor
            : undefined,
      };

      let dataUrl = '';
      let extension = 'png';

      if (format === 'png') {
        dataUrl = await toPng(targetElement, options);
        extension = 'png';
      } else if (format === 'jpeg') {
        dataUrl = await toJpeg(targetElement, options);
        extension = 'jpg';
      } else if (format === 'svg') {
        dataUrl = await toSvg(targetElement, options);
        extension = 'svg';
      }

      // Trigger download
      const link = document.createElement('a');
      const filename =
        exportMode === 'all'
          ? `monogramma-${project.bigLetter}-${project.fullName}-8varianti-${resolution}x.${extension}`
          : `monogramma-${project.bigLetter}-${project.fullName}-esempio${selectedSingleSlot + 1}-${resolution}x.${extension}`;
      link.download = filename;
      link.href = dataUrl;
      link.click();

      // Confetti celebration
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.8 },
      });

      onClose();
    } catch (err) {
      console.error('Export error:', err);
      alert('Si è verificato un errore durante l\'esportazione: ' + (err as Error).message);
    } finally {
      setIsExporting(false);
      onSetExportState(false, false);
    }
  };

  const handleCopyToClipboard = async () => {
    if (!artboardRef.current) return;
    setIsExporting(true);
    // Tell App and MonogramBoard to enter pristine export mode
    onSetExportState(true, !includeBadges);

    try {
      // Wait for React to re-render without selection ring or top action bar
      await new Promise((resolve) => setTimeout(resolve, 80));

      const dataUrl = await toPng(artboardRef.current, {
        pixelRatio: 1.5,
        cacheBust: true,
        filter: (node: Node) => {
          if (node instanceof HTMLElement) {
            if (
              node.getAttribute('data-export-ignore') === 'true' ||
              node.classList.contains('export-ignore')
            ) {
              return false;
            }
            if (!includeBadges && node.getAttribute('data-export-badge') === 'true') {
              return false;
            }
          }
          return true;
        },
      });

      // Fetch blob and copy to clipboard
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ]);

      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Clipboard copy error:', err);
      alert('Impossibile copiare negli appunti direttamente dal browser. Usa il pulsante Scarica PNG.');
    } finally {
      setIsExporting(false);
      onSetExportState(false, false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-2">
            <Download className="text-amber-400" size={20} />
            <h3 className="text-base font-bold text-white">Esporta Immagine Finale</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 bg-slate-950/40">
          {/* Mode: All 8 or Single */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              Cosa desideri esportare?
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setExportMode('all')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  exportMode === 'all'
                    ? 'border-amber-400 bg-amber-500/15 text-white font-bold'
                    : 'border-slate-800 bg-slate-800/40 hover:bg-slate-800 text-slate-300'
                }`}
              >
                <div className="text-xs font-bold">Tutte le 8 Varianti</div>
                <div className="text-[10px] text-slate-400 font-normal">
                  Griglia completa come nella foto
                </div>
              </button>

              <button
                onClick={() => setExportMode('single')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  exportMode === 'single'
                    ? 'border-amber-400 bg-amber-500/15 text-white font-bold'
                    : 'border-slate-800 bg-slate-800/40 hover:bg-slate-800 text-slate-300'
                }`}
              >
                <div className="text-xs font-bold">Solo 1 Variante Scelta</div>
                <div className="text-[10px] text-slate-400 font-normal">
                  Singolo monogramma isolato
                </div>
              </button>
            </div>
          </div>

          {/* If Single slot mode, show selector */}
          {exportMode === 'single' && (
            <div className="space-y-1.5 bg-slate-900 p-3 rounded-xl border border-slate-800">
              <label className="text-xs font-medium text-slate-300">
                Seleziona quale variante scaricare:
              </label>
              <select
                value={selectedSingleSlot}
                onChange={(e) => setSelectedSingleSlot(parseInt(e.target.value, 10))}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-xs outline-none"
              >
                {project.slots.map((slot, idx) => {
                  const font =
                    SCRIPT_FONTS.find((f) => f.id === slot.fontId) || SCRIPT_FONTS[0];
                  return (
                    <option key={idx} value={idx}>
                      ESEMPIO {idx + 1} - {font.name}
                    </option>
                  );
                })}
              </select>
            </div>
          )}

          {/* Format selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              Formato File
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setFormat('png')}
                className={`py-2 px-3 rounded-xl border text-center text-xs font-semibold transition-all ${
                  format === 'png'
                    ? 'border-amber-400 bg-amber-500/15 text-white'
                    : 'border-slate-800 bg-slate-800/40 text-slate-300'
                }`}
              >
                PNG (Trasparenza)
              </button>
              <button
                onClick={() => setFormat('jpeg')}
                className={`py-2 px-3 rounded-xl border text-center text-xs font-semibold transition-all ${
                  format === 'jpeg'
                    ? 'border-amber-400 bg-amber-500/15 text-white'
                    : 'border-slate-800 bg-slate-800/40 text-slate-300'
                }`}
              >
                JPEG (Foto)
              </button>
              <button
                onClick={() => setFormat('svg')}
                className={`py-2 px-3 rounded-xl border text-center text-xs font-semibold transition-all ${
                  format === 'svg'
                    ? 'border-amber-400 bg-amber-500/15 text-white'
                    : 'border-slate-800 bg-slate-800/40 text-slate-300'
                }`}
              >
                SVG (Vettoriale)
              </button>
            </div>
          </div>

          {/* Resolution selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              Risoluzione &amp; Qualità
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setResolution(1)}
                className={`py-2 px-3 rounded-xl border text-center text-xs transition-all ${
                  resolution === 1
                    ? 'border-amber-400 bg-amber-500/15 text-white font-bold'
                    : 'border-slate-800 bg-slate-800/40 text-slate-300'
                }`}
              >
                1x Standard
              </button>
              <button
                onClick={() => setResolution(2)}
                className={`py-2 px-3 rounded-xl border text-center text-xs transition-all ${
                  resolution === 2
                    ? 'border-amber-400 bg-amber-500/15 text-white font-bold'
                    : 'border-slate-800 bg-slate-800/40 text-slate-300'
                }`}
              >
                2x HD Retina (Consigliata)
              </button>
              <button
                onClick={() => setResolution(3)}
                className={`py-2 px-3 rounded-xl border text-center text-xs transition-all ${
                  resolution === 3
                    ? 'border-amber-400 bg-amber-500/15 text-white font-bold'
                    : 'border-slate-800 bg-slate-800/40 text-slate-300'
                }`}
              >
                3x Stampa Ultra-HD
              </button>
            </div>
          </div>

          {/* Toggle for ESEMPIO badges in export */}
          <div className="pt-1">
            <label className="flex items-center justify-between p-3 bg-slate-900/90 rounded-xl cursor-pointer hover:bg-slate-800/80 border border-slate-800 transition-colors">
              <div>
                <div className="text-xs font-semibold text-slate-200">
                  Includi cartellini &quot;ESEMPIO 1–8&quot;
                </div>
                <div className="text-[10px] text-slate-400">
                  Deseleziona per salvare i monogrammi puliti senza cartellino
                </div>
              </div>
              <input
                type="checkbox"
                checked={includeBadges}
                onChange={(e) => setIncludeBadges(e.target.checked)}
                className="w-4 h-4 rounded accent-amber-400 cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between gap-3">
          <button
            onClick={handleCopyToClipboard}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 transition-all disabled:opacity-50"
          >
            {copied ? (
              <>
                <Check size={14} className="text-emerald-400" />
                <span className="text-emerald-400 font-semibold">Copiato!</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span>Copia Negli Appunti</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              disabled={isExporting}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-all"
            >
              Annulla
            </button>
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50"
            >
              {isExporting ? (
                <span>Elaborazione...</span>
              ) : (
                <>
                  <Download size={14} />
                  <span>Scarica File</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
