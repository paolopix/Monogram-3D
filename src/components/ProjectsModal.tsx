import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Save,
  FolderOpen,
  Download,
  Upload,
  Trash2,
  Edit2,
  Check,
  Clock,
  Sparkles,
  FileJson,
  FolderArchive,
  Copy,
  AlertCircle,
} from 'lucide-react';
import { MonogramProjectState, SavedProject } from '../types';
import confetti from 'canvas-confetti';

interface ProjectsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProject: MonogramProjectState;
  onLoadProject: (project: MonogramProjectState) => void;
}

const STORAGE_KEY = 'monogram_saved_projects_list';

export const ProjectsModal: React.FC<ProjectsModalProps> = ({
  isOpen,
  onClose,
  currentProject,
  onLoadProject,
}) => {
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [newProjectName, setNewProjectName] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'saved' | 'import-export'>('saved');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load saved projects from localStorage on open
  useEffect(() => {
    if (isOpen) {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          setProjects(JSON.parse(raw));
        } else {
          // Initialize with default demo project if empty
          const initialDemo: SavedProject = {
            id: 'demo-anna',
            name: 'Monogramma Classico - Anna',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            data: currentProject,
          };
          setProjects([initialDemo]);
          localStorage.setItem(STORAGE_KEY, JSON.stringify([initialDemo]));
        }
      } catch (err) {
        console.error('Error loading saved projects:', err);
      }

      // Default name for saving current state
      setNewProjectName(
        `Monogramma ${currentProject.bigLetter || 'A'} - ${currentProject.fullName || 'Nome'}`
      );
    }
  }, [isOpen, currentProject]);

  if (!isOpen) return null;

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleSaveCurrent = () => {
    const trimmed = newProjectName.trim();
    if (!trimmed) {
      showNotification('Inserisci un nome per il progetto', 'error');
      return;
    }

    const newProject: SavedProject = {
      id: 'proj_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      name: trimmed,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      data: JSON.parse(JSON.stringify(currentProject)),
    };

    const updated = [newProject, ...projects];
    setProjects(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 } });
      showNotification(`Progetto "${trimmed}" salvato con successo!`, 'success');
    } catch (err) {
      console.error(err);
      showNotification('Errore durante il salvataggio in locale', 'error');
    }
  };

  const handleLoad = (saved: SavedProject) => {
    onLoadProject(saved.data);
    showNotification(`Progetto "${saved.name}" caricato!`, 'success');
    setTimeout(() => onClose(), 400);
  };

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Sei sicuro di voler eliminare il progetto "${name}"?`)) return;
    const filtered = projects.filter((p) => p.id !== id);
    setProjects(filtered);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    showNotification(`Progetto eliminato`, 'success');
  };

  const handleStartRename = (project: SavedProject) => {
    setEditingId(project.id);
    setEditingName(project.name);
  };

  const handleSaveRename = (id: string) => {
    if (!editingName.trim()) return;
    const updated = projects.map((p) =>
      p.id === id ? { ...p, name: editingName.trim(), updatedAt: new Date().toISOString() } : p
    );
    setProjects(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setEditingId(null);
    showNotification('Nome aggiornato', 'success');
  };

  // Download project as .json file
  const handleExportJson = (projectToExport: SavedProject) => {
    const jsonStr = JSON.stringify(projectToExport, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectToExport.name.replace(/[^a-zA-Z0-9_-]/g, '_')}.monogram.json`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('File di progetto scaricato (.json)', 'success');
  };

  // Export current workspace directly as .json file
  const handleExportCurrentJson = () => {
    const tempProj: SavedProject = {
      id: 'export_' + Date.now(),
      name: newProjectName.trim() || `Monogramma ${currentProject.bigLetter}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      data: currentProject,
    };
    handleExportJson(tempProj);
  };

  // Import from a .json file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        let projectData: MonogramProjectState;
        let projectName = file.name.replace('.monogram.json', '').replace('.json', '');

        if (parsed.data && parsed.data.bigLetter) {
          projectData = parsed.data;
          projectName = parsed.name || projectName;
        } else if (parsed.bigLetter && parsed.slots) {
          projectData = parsed;
        } else {
          throw new Error('Formato file non valido per MonogramStudio');
        }

        // Save imported project to list
        const newImported: SavedProject = {
          id: 'imported_' + Date.now(),
          name: projectName,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          data: projectData,
        };

        const updated = [newImported, ...projects];
        setProjects(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

        // Load into current workspace immediately
        onLoadProject(projectData);
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
        showNotification(`Progetto "${projectName}" importato e caricato!`, 'success');
        setTimeout(() => onClose(), 600);
      } catch (err) {
        console.error('Import error:', err);
        showNotification('File non valido o danneggiato: ' + (err as Error).message, 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-2">
            <FolderOpen className="text-amber-400" size={20} />
            <h3 className="text-base font-bold text-white">Gestione Progetti</h3>
            <span className="text-xs text-slate-400">
              (Salva e riprendi le tue modifiche in qualsiasi momento)
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-6 gap-3">
          <button
            onClick={() => setActiveTab('saved')}
            className={`py-3 px-2 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'saved'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FolderOpen size={14} />
            <span>I Miei Progetti Salvati ({projects.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('import-export')}
            className={`py-3 px-2 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'import-export'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileJson size={14} />
            <span>Salva su PC / Importa File</span>
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

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {activeTab === 'saved' && (
            <div className="space-y-6">
              {/* Save Current Project Box */}
              <div className="p-4 bg-slate-950/70 border border-amber-500/40 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                    <Save size={14} /> Salva il Progetto Corrente
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Lettera: <strong className="text-white">{currentProject.bigLetter}</strong> | Nome:{' '}
                    <strong className="text-white">{currentProject.fullName}</strong>
                  </span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    placeholder="Es. Ordine Anna - Legno Betulla, Matrimonio Marco e Chiara..."
                    className="flex-1 bg-slate-800/90 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-amber-400 outline-none"
                  />
                  <button
                    onClick={handleSaveCurrent}
                    className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 whitespace-nowrap"
                  >
                    <Save size={14} />
                    <span>Salva Ora</span>
                  </button>
                </div>
              </div>

              {/* Saved Projects List */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                  Progetti Archiviati in Memoria
                </label>

                {projects.length === 0 ? (
                  <div className="text-center py-8 text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl">
                    Nessun progetto salvato finora. Salva il tuo primo progetto usando il riquadro sopra!
                  </div>
                ) : (
                  <div className="space-y-2">
                    {projects.map((proj) => {
                      const isEditing = editingId === proj.id;
                      const formattedDate = new Date(proj.updatedAt || proj.createdAt).toLocaleString(
                        'it-IT',
                        {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        }
                      );

                      return (
                        <div
                          key={proj.id}
                          className="flex items-center justify-between p-3.5 bg-slate-800/40 hover:bg-slate-800/70 border border-slate-800 hover:border-slate-700 rounded-2xl transition-all group"
                        >
                          {/* Left Badge & Name */}
                          <div className="flex items-center gap-3 flex-1 min-w-0 pr-3">
                            {/* Visual mini-avatar */}
                            <div
                              className="w-11 h-11 rounded-xl flex items-center justify-center font-black text-sm shrink-0 border border-white/10 shadow-inner"
                              style={{
                                backgroundColor: proj.data.letterColor || '#c89f76',
                                color: '#fff',
                              }}
                            >
                              {proj.data.bigLetter || 'A'}
                            </div>

                            <div className="flex-1 min-w-0">
                              {isEditing ? (
                                <div className="flex items-center gap-1">
                                  <input
                                    type="text"
                                    value={editingName}
                                    onChange={(e) => setEditingName(e.target.value)}
                                    className="bg-slate-900 border border-amber-400 text-white rounded px-2 py-1 text-xs outline-none flex-1"
                                    autoFocus
                                  />
                                  <button
                                    onClick={() => handleSaveRename(proj.id)}
                                    className="p-1 text-emerald-400 hover:bg-slate-700 rounded"
                                  >
                                    <Check size={14} />
                                  </button>
                                  <button
                                    onClick={() => setEditingId(null)}
                                    className="p-1 text-slate-400 hover:bg-slate-700 rounded"
                                  >
                                    <X size={14} />
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <h4 className="text-xs font-bold text-slate-200 truncate group-hover:text-amber-300 transition-colors">
                                    {proj.name}
                                  </h4>
                                  <button
                                    onClick={() => handleStartRename(proj)}
                                    className="text-slate-500 hover:text-slate-300 p-0.5"
                                    title="Rinomina"
                                  >
                                    <Edit2 size={11} />
                                  </button>
                                </div>
                              )}

                              <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-0.5">
                                <span className="flex items-center gap-1">
                                  <Clock size={10} /> {formattedDate}
                                </span>
                                <span>•</span>
                                <span>
                                  Lettera: <strong>{proj.data.bigLetter}</strong>
                                </span>
                                <span>•</span>
                                <span>
                                  Nome: <strong>{proj.data.fullName}</strong>
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => handleLoad(proj)}
                              className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 font-bold text-xs rounded-xl border border-amber-500/40 transition-all flex items-center gap-1"
                              title="Carica questo progetto nella tavola per modificarlo"
                            >
                              <FolderOpen size={13} />
                              <span>Carica</span>
                            </button>

                            <button
                              onClick={() => handleExportJson(proj)}
                              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-700 rounded-lg transition-colors"
                              title="Scarica file di backup (.json)"
                            >
                              <Download size={14} />
                            </button>

                            <button
                              onClick={() => handleDelete(proj.id, proj.name)}
                              className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                              title="Elimina progetto"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'import-export' && (
            <div className="space-y-6">
              {/* Export Current Project to Computer File */}
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                    <Download className="text-amber-400" size={15} />
                    Scarica File Progetto su Computer
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Salva un file <code className="text-amber-300">.monogram.json</code> sul tuo PC con
                    tutte le lettere, font, posizioni X/Y, colori e spaziature esatte.
                  </p>
                </div>
                <button
                  onClick={handleExportCurrentJson}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl border border-slate-700 shadow-md transition-all whitespace-nowrap flex items-center gap-1.5"
                >
                  <Download size={14} />
                  <span>Scarica File (.json)</span>
                </button>
              </div>

              {/* Import Project from File */}
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                    <Upload className="text-amber-400" size={15} />
                    Carica Progetto da File del PC
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Seleziona un file di progetto salvato in precedenza per riaprirlo immediatamente.
                  </p>
                </div>
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json,.monogram.json"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all whitespace-nowrap flex items-center gap-1.5"
                  >
                    <Upload size={14} />
                    <span>Scegli File (.json)</span>
                  </button>
                </div>
              </div>

              {/* Source Code Archive Download (.zip) */}
              <div className="p-4 bg-gradient-to-r from-amber-500/10 via-slate-800/40 to-slate-800/40 border border-amber-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <FolderArchive className="text-amber-400" size={16} />
                    <h5 className="text-xs font-bold text-white">
                      Scarica Codice Sorgente Completo (.ZIP)
                    </h5>
                    <span className="px-1.5 py-0.5 text-[9px] uppercase font-bold tracking-wider bg-amber-400/20 text-amber-300 rounded border border-amber-400/30">
                      Tutto il Progetto
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Include tutti i file React, TypeScript, Tailwind, script di avvio e README. Pronto da estrarre ed eseguire in locale con <code className="text-amber-300 font-mono">npm install && npm run dev</code>.
                  </p>
                </div>
                <a
                  href="/monogram-studio-source.zip"
                  download="monogram-studio-source.zip"
                  className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all whitespace-nowrap flex items-center justify-center gap-2"
                >
                  <Download size={14} />
                  <span>Scarica ZIP</span>
                </a>
              </div>

              {/* Pre-made Templates / Presets to start with */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                  Oppure carica un modello iniziale di esempio:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      onLoadProject({
                        ...currentProject,
                        bigLetter: 'A',
                        fullName: 'Anna',
                        letterColor: '#c89f76',
                        nameColor: '#f5f3e5',
                        letterSpacing: 0,
                      });
                      showNotification('Caricato modello classico Anna (Legno)', 'success');
                      setTimeout(() => onClose(), 400);
                    }}
                    className="p-3 bg-slate-800/40 hover:bg-slate-800 border border-slate-800 hover:border-amber-400/50 rounded-xl text-left transition-all group"
                  >
                    <div className="text-xs font-bold text-slate-200 group-hover:text-amber-300">
                      Legno Betulla &quot;Anna&quot;
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Fedele alla foto di riferimento
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      onLoadProject({
                        ...currentProject,
                        bigLetter: 'MG',
                        fullName: 'Marco & Giulia',
                        letterColor: '#cfa74b',
                        nameColor: '#ffffff',
                        letterSpacing: -12,
                      });
                      showNotification('Caricato modello matrimonio MG (Oro)', 'success');
                      setTimeout(() => onClose(), 400);
                    }}
                    className="p-3 bg-slate-800/40 hover:bg-slate-800 border border-slate-800 hover:border-amber-400/50 rounded-xl text-left transition-all group"
                  >
                    <div className="text-xs font-bold text-slate-200 group-hover:text-amber-300">
                      Matrimonio &quot;MG&quot;
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Doppia lettera intrecciata in oro
                    </div>
                  </button>
                </div>
              </div>
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
