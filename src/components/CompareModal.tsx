import React, { useState } from 'react';
import { X, SplitSquareVertical, Eye, Image as ImageIcon } from 'lucide-react';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({ isOpen, onClose }) => {
  const [opacity, setOpacity] = useState(100);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-2">
            <ImageIcon className="text-amber-400" size={20} />
            <h3 className="text-base font-bold text-white">
              Immagine di Riferimento Originale
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center bg-slate-950/50">
          <div className="relative border border-slate-800 rounded-xl overflow-hidden shadow-2xl bg-[#4f5154]">
            <img
              src="/assets/aistudio/image_5e40b7b6.png"
              alt="Monogrammi di Riferimento Originale"
              className="max-h-[60vh] object-contain transition-opacity"
              style={{ opacity: opacity / 100 }}
            />
          </div>

          <div className="mt-4 w-full max-w-md flex items-center gap-3 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 whitespace-nowrap">Opacità foto:</span>
            <input
              type="range"
              min="20"
              max="100"
              value={opacity}
              onChange={(e) => setOpacity(parseInt(e.target.value, 10))}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <span className="text-xs font-mono text-amber-400 w-10 text-right">{opacity}%</span>
          </div>

          <div className="mt-3 text-center text-xs text-slate-400 max-w-lg">
            Questa è la foto originale caricata: 8 combinazioni con la lettera &quot;A&quot; in legno 3D e il nome &quot;Anna&quot; in corsivo lucido sovrapposto su sfondo grigio studio.
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all"
          >
            Chiudi Confronto
          </button>
        </div>
      </div>
    </div>
  );
};
