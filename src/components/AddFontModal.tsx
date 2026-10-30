import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  Sparkles,
  Type,
  Trash2,
  Check,
  AlertCircle,
  FolderOpen,
  FileText,
  Search,
  CheckCircle2,
} from 'lucide-react';
import { CustomFont } from '../types';
import { saveCustomFont, deleteCustomFont, registerCustomFontInDOM } from '../fontManager';
import confetti from 'canvas-confetti';

interface AddFontModalProps {
  isOpen: boolean;
  onClose: () => void;
  customFonts: CustomFont[];
  onCustomFontsChange: (updatedFonts: CustomFont[]) => void;
  initialTarget?: 'letter' | 'name' | 'both';
  onApplyFontToLetter?: (fontId: string) => void;
  onApplyFontToSlot?: (fontId: string, slotIndex?: number) => void;
  selectedSlotIndex?: number;
  previewLetter?: string;
  previewName?: string;
}

export const AddFontModal: React.FC<AddFontModalProps> = ({
  isOpen,
  onClose,
  customFonts,
  onCustomFontsChange,
  initialTarget = 'both',
  onApplyFontToLetter,
  onApplyFontToSlot,
  selectedSlotIndex = 0,
  previewLetter = 'A',
  previewName = 'Anna',
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'google' | 'list'>('upload');
  const [targetType, setTargetType] = useState<'letter' | 'name' | 'both'>(initialTarget);
  const [fontDisplayName, setFontDisplayName] = useState<string>('');
  const [googleFontInput, setGoogleFontInput] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const [uploadedFile, setUploadedFile] = useState<{
    file: File;
    dataUrl: string;
    tempFamily: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3500);
  };

  // Handle local font file selection
  const handleFileSelect = (file: File) => {
    const validExts = ['.ttf', '.otf', '.woff', '.woff2'];
    const lowerName = file.name.toLowerCase();
    const isValid = validExts.some((ext) => lowerName.endsWith(ext));

    if (!isValid) {
      showNotification('Seleziona un file font valido (.ttf, .otf, .woff o .woff2)', 'error');
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      showNotification('Il file font è troppo grande (massimo 4MB)', 'error');
      return;
    }

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const cleanName = file.name
        .replace(/\.[^/.]+$/, '')
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());

      const tempId = 'temp_preview_' + Date.now();

      // Register temporary FontFace for preview
      if ('fonts' in document) {
        const fontFace = new FontFace(tempId, `url(${dataUrl})`);
        fontFace.load().then((loaded) => {
          document.fonts.add(loaded);
        }).catch(console.warn);
      }

      setUploadedFile({
        file,
        dataUrl,
        tempFamily: tempId,
      });
      setFontDisplayName(cleanName);
      setIsProcessing(false);
    };

    reader.onerror = () => {
      setIsProcessing(false);
      showNotification('Errore nella lettura del file font', 'error');
    };

    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleSaveUploadedFont = () => {
    if (!uploadedFile) {
      showNotification('Seleziona prima un file font dal tuo computer', 'error');
      return;
    }

    const nameToSave = fontDisplayName.trim() || uploadedFile.file.name.replace(/\.[^/.]+$/, '');
    const uniqueId = 'font_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);

    const newFont: CustomFont = {
      id: uniqueId,
      name: nameToSave,
      family: `'${uniqueId}', cursive, serif, sans-serif`,
      target: targetType,
      sourceType: 'file',
      dataUrl: uploadedFile.dataUrl,
      fileName: uploadedFile.file.name,
      createdAt: new Date().toISOString(),
    };

    try {
      const updated = saveCustomFont(newFont);
      onCustomFontsChange(updated);
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
      showNotification(`Font "${nameToSave}" aggiunto con successo!`, 'success');

      // Auto apply to current target
      if ((targetType === 'letter' || targetType === 'both') && onApplyFontToLetter) {
        onApplyFontToLetter(uniqueId);
      }
      if ((targetType === 'name' || targetType === 'both') && onApplyFontToSlot) {
        onApplyFontToSlot(uniqueId, selectedSlotIndex);
      }

      setUploadedFile(null);
      setFontDisplayName('');
      setActiveTab('list');
    } catch (err) {
      showNotification((err as Error).message, 'error');
    }
  };

  const handleAddGoogleFont = () => {
    const trimmed = googleFontInput.trim();
    if (!trimmed) {
      showNotification('Inserisci il nome di un font Google (es. Ephesis, MonteCarlo, Cinzel Decorative)', 'error');
      return;
    }

    const uniqueId = 'gfont_' + Date.now();
    const newFont: CustomFont = {
      id: uniqueId,
      name: trimmed,
      family: `'${trimmed}', cursive, serif, sans-serif`,
      target: targetType,
      sourceType: 'google',
      googleFontName: trimmed,
      createdAt: new Date().toISOString(),
    };

    try {
      const updated = saveCustomFont(newFont);
      onCustomFontsChange(updated);
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
      showNotification(`Google Font "${trimmed}" aggiunto e caricato!`, 'success');

      if ((targetType === 'letter' || targetType === 'both') && onApplyFontToLetter) {
        onApplyFontToLetter(uniqueId);
      }
      if ((targetType === 'name' || targetType === 'both') && onApplyFontToSlot) {
        onApplyFontToSlot(uniqueId, selectedSlotIndex);
      }

      setGoogleFontInput('');
      setActiveTab('list');
    } catch (err) {
      showNotification((err as Error).message, 'error');
    }
  };

  const handleDeleteFont = (id: string, name: string) => {
    if (!confirm(`Sei sicuro di voler rimuovere il font "${name}"?`)) return;
    const updated = deleteCustomFont(id);
    onCustomFontsChange(updated);
    showNotification(`Font "${name}" rimosso`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-2">
            <Sparkles className="text-amber-400" size={20} />
            <h3 className="text-base font-bold text-white">Aggiungi i Tuoi Font Personali</h3>
            <span className="text-xs text-amber-400/90 font-medium">
              (per la Lettera o per il Nome)
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-6 gap-3">
          <button
            onClick={() => setActiveTab('upload')}
            className={`py-3 px-2 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'upload'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Upload size={14} />
            <span>Carica File Font (.ttf / .otf / .woff)</span>
          </button>

          <button
            onClick={() => setActiveTab('google')}
            className={`py-3 px-2 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'google'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Search size={14} />
            <span>Aggiungi da Google Fonts</span>
          </button>

          <button
            onClick={() => setActiveTab('list')}
            className={`py-3 px-2 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'list'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Type size={14} />
            <span>I Miei Font Aggiunti ({customFonts.length})</span>
          </button>
        </div>

        {/* Notification Toast */}
        {message && (
          <div
            className={`mx-6 mt-4 p-2.5 rounded-xl text-xs flex items-center gap-2 ${
              message.type === 'success'
                ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-300'
                : 'bg-red-950/80 border border-red-500/50 text-red-300'
            }`}
          >
            {message.type === 'success' ? <Check size={14} /> : <AlertCircle size={14} />}
            <span>{message.text}</span>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Destination Selector: Where to use the font? */}
          {activeTab !== 'list' && (
            <div className="p-3.5 bg-slate-950/70 border border-amber-500/30 rounded-xl space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-amber-300 block">
                Dove desideri utilizzare questo font?
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setTargetType('letter')}
                  className={`p-2.5 rounded-xl border text-center text-xs font-semibold transition-all ${
                    targetType === 'letter'
                      ? 'border-amber-400 bg-amber-500/20 text-white shadow-xs'
                      : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="font-bold">Lettera Iniziale</div>
                  <div className="text-[10px] text-slate-400 font-normal">Sfondo grande</div>
                </button>

                <button
                  type="button"
                  onClick={() => setTargetType('name')}
                  className={`p-2.5 rounded-xl border text-center text-xs font-semibold transition-all ${
                    targetType === 'name'
                      ? 'border-amber-400 bg-amber-500/20 text-white shadow-xs'
                      : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="font-bold">Nome Davanti</div>
                  <div className="text-[10px] text-slate-400 font-normal">Corsivo 3D</div>
                </button>

                <button
                  type="button"
                  onClick={() => setTargetType('both')}
                  className={`p-2.5 rounded-xl border text-center text-xs font-semibold transition-all ${
                    targetType === 'both'
                      ? 'border-amber-400 bg-amber-500/20 text-white shadow-xs'
                      : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="font-bold">Entrambi</div>
                  <div className="text-[10px] text-slate-400 font-normal">Sia Lettera che Nome</div>
                </button>
              </div>
            </div>
          )}

          {/* TAB 1: Upload font file */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              {/* Dropzone */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-700 hover:border-amber-400 rounded-2xl p-8 text-center cursor-pointer transition-colors bg-slate-950/40 hover:bg-slate-950/60 flex flex-col items-center justify-center space-y-3"
              >
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Upload size={24} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    Trascina qui il file del font, oppure{' '}
                    <span className="text-amber-400 underline">sfoglia dal PC</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Supporta formati <strong>.TTF</strong>, <strong>.OTF</strong>, <strong>.WOFF</strong> e <strong>.WOFF2</strong>
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".ttf,.otf,.woff,.woff2"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFileSelect(f);
                  }}
                  className="hidden"
                />
              </div>

              {/* Uploaded File Inspector & Live Preview */}
              {uploadedFile && (
                <div className="p-4 bg-slate-950/80 border border-emerald-500/40 rounded-2xl space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-400" />
                      <span className="text-xs font-bold text-white">File pronto per il salvataggio:</span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {Math.round(uploadedFile.file.size / 1024)} KB
                    </span>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400 uppercase font-semibold">
                      Nome Visualizzato del Font:
                    </label>
                    <input
                      type="text"
                      value={fontDisplayName}
                      onChange={(e) => setFontDisplayName(e.target.value)}
                      placeholder="Nome del font"
                      className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-amber-400 outline-none"
                    />
                  </div>

                  {/* Live Render Preview with this font */}
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-center space-y-1">
                    <div className="text-[10px] uppercase font-semibold text-slate-400">
                      Anteprima dal vivo:
                    </div>
                    <div
                      className="text-3xl text-amber-300 py-1"
                      style={{ fontFamily: `'${uploadedFile.tempFamily}', sans-serif` }}
                    >
                      {targetType === 'letter' ? previewLetter : previewName}
                    </div>
                  </div>

                  <button
                    onClick={handleSaveUploadedFont}
                    className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Check size={14} />
                    <span>Salva ed Usa questo Font nel Progetto</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Google Font input */}
          {activeTab === 'google' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                  Inserisci il Nome esatto da Google Fonts:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={googleFontInput}
                    onChange={(e) => setGoogleFontInput(e.target.value)}
                    placeholder="Es. Ephesis, MonteCarlo, Cinzel Decorative, Allura..."
                    className="flex-1 bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-amber-400 outline-none"
                  />
                  <button
                    onClick={handleAddGoogleFont}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 whitespace-nowrap"
                  >
                    Aggiungi Font
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">
                  Puoi scegliere tra migliaia di font gratuiti da{' '}
                  <a
                    href="https://fonts.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-amber-400 underline"
                  >
                    fonts.google.com
                  </a>{' '}
                  e digitare il nome qui. Verrà scaricato ed aggiunto automaticamente!
                </p>
              </div>

              {/* Quick suggestions */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-400 uppercase">
                  Font Consigliati pronti da aggiungere con un click:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { name: 'Cinzel Decorative', desc: 'Serif Regale con svolazzi' },
                    { name: 'MonteCarlo', desc: 'Corsivo floreale prezioso' },
                    { name: 'Ephesis', desc: 'Calligrafia morbida ad inchiostro' },
                    { name: 'Monsieur La Doulaise', desc: 'Corsivo principesco fitto' },
                    { name: 'Playfair Display SC', desc: 'Maiuscole romane antiche' },
                    { name: 'Alex Brush', desc: 'Tratto a pennino fine' },
                  ].map((sug, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setGoogleFontInput(sug.name);
                      }}
                      className="p-2 bg-slate-800/40 hover:bg-slate-800 border border-slate-800 hover:border-amber-400/50 rounded-xl text-left transition-all group"
                    >
                      <div className="text-xs font-bold text-slate-200 group-hover:text-amber-300">
                        {sug.name}
                      </div>
                      <div className="text-[10px] text-slate-400">{sug.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: List of currently added custom fonts */}
          {activeTab === 'list' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  I Tuoi Font Personali Attivi ({customFonts.length})
                </label>
                <button
                  onClick={() => setActiveTab('upload')}
                  className="text-xs text-amber-400 hover:text-white font-semibold flex items-center gap-1"
                >
                  <Upload size={13} />
                  <span>+ Aggiungi un altro font</span>
                </button>
              </div>

              {customFonts.length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-xs border border-dashed border-slate-800 rounded-2xl">
                  Non hai ancora aggiunto font personali. Clicca sulla scheda in alto per caricare un file .ttf/.otf o un Google Font!
                </div>
              ) : (
                <div className="space-y-2">
                  {customFonts.map((font) => (
                    <div
                      key={font.id}
                      className="p-3 bg-slate-800/40 hover:bg-slate-800/70 border border-slate-800 hover:border-slate-700 rounded-2xl flex items-center justify-between gap-3 group transition-all"
                    >
                      {/* Left details & live preview */}
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div
                          className="w-12 h-12 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-xl font-bold text-amber-300 shrink-0"
                          style={{ fontFamily: font.family }}
                        >
                          {previewLetter}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-slate-200 truncate group-hover:text-amber-300">
                              {font.name}
                            </h4>
                            <span className="px-2 py-0.5 text-[10px] font-semibold bg-amber-400/10 text-amber-300 border border-amber-400/20 rounded-md">
                              {font.target === 'letter'
                                ? 'Lettera Sfondo'
                                : font.target === 'name'
                                ? 'Nome Davanti'
                                : 'Lettera & Nome'}
                            </span>
                          </div>
                          <div
                            className="text-base text-slate-300 truncate mt-0.5"
                            style={{ fontFamily: font.family }}
                          >
                            {previewName}
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        {(font.target === 'letter' || font.target === 'both') &&
                          onApplyFontToLetter && (
                            <button
                              onClick={() => {
                                onApplyFontToLetter(font.id);
                                showNotification(`Applicato alla Lettera Iniziale!`, 'success');
                                setTimeout(() => onClose(), 400);
                              }}
                              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700"
                              title="Usa per la lettera grande di sfondo"
                            >
                              Usa per Lettera
                            </button>
                          )}

                        {(font.target === 'name' || font.target === 'both') &&
                          onApplyFontToSlot && (
                            <button
                              onClick={() => {
                                onApplyFontToSlot(font.id, selectedSlotIndex);
                                showNotification(`Applicato a Esempio ${selectedSlotIndex + 1}!`, 'success');
                                setTimeout(() => onClose(), 400);
                              }}
                              className="px-2.5 py-1.5 bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 text-xs font-bold rounded-lg border border-amber-500/30 transition-colors"
                              title={`Usa per il nome su Esempio ${selectedSlotIndex + 1}`}
                            >
                              Usa per Esempio {selectedSlotIndex + 1}
                            </button>
                          )}

                        <button
                          onClick={() => handleDeleteFont(font.id, font.name)}
                          className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Elimina questo font"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-all"
          >
            Chiudi
          </button>
        </div>
      </div>
    </div>
  );
};
