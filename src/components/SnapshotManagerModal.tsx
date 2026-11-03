import React, { useState } from 'react';
import { ProjectSnapshot } from '../utils/indexedDBStorage';
import { ProjectFile, ProjectMetadata } from '../types/latex';
import {
  History,
  X,
  Save,
  RotateCcw,
  Trash2,
  Calendar,
  FileText,
  Check,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  FolderArchive,
  Clock
} from 'lucide-react';

interface SnapshotManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  snapshots: ProjectSnapshot[];
  currentFiles: ProjectFile[];
  currentMetadata: ProjectMetadata;
  onSaveSnapshot: (name: string, description?: string) => Promise<void>;
  onRestoreSnapshot: (snapshot: ProjectSnapshot) => void;
  onDeleteSnapshot: (id: string) => Promise<void>;
}

export const SnapshotManagerModal: React.FC<SnapshotManagerModalProps> = ({
  isOpen,
  onClose,
  snapshots,
  currentFiles,
  currentMetadata,
  onSaveSnapshot,
  onRestoreSnapshot,
  onDeleteSnapshot
}) => {
  const [snapshotName, setSnapshotName] = useState<string>('');
  const [snapshotDesc, setSnapshotDesc] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [expandedSnapshotId, setExpandedSnapshotId] = useState<string | null>(null);
  const [confirmRestoreId, setConfirmRestoreId] = useState<string | null>(null);
  const [restoredNotification, setRestoredNotification] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const name = snapshotName.trim() || `Snapshot (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`;
      await onSaveSnapshot(name, snapshotDesc);
      setSnapshotName('');
      setSnapshotDesc('');
    } catch (err) {
      console.error('Failed to save snapshot:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRestore = (snap: ProjectSnapshot) => {
    onRestoreSnapshot(snap);
    setConfirmRestoreId(null);
    setRestoredNotification(`Successfully restored snapshot "${snap.name}"!`);
    setTimeout(() => {
      setRestoredNotification(null);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Project Snapshots &amp; Local Revert History
              </h2>
              <p className="text-xs text-slate-500">
                Saved snapshots are stored offline in your browser's local IndexedDB storage.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Restored Toast Banner */}
        {restoredNotification && (
          <div className="bg-emerald-50 border-b border-emerald-200 text-emerald-800 px-6 py-2.5 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{restoredNotification}</span>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Create New Snapshot Card */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 shadow-xs">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Save className="w-3.5 h-3.5 text-blue-600" />
              <span>Create New Project Snapshot</span>
            </h3>

            <form onSubmit={handleCreate} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <input
                    type="text"
                    value={snapshotName}
                    onChange={(e) => setSnapshotName(e.target.value)}
                    placeholder={`e.g. Before editing Chapter 4 equations`}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={snapshotDesc}
                    onChange={(e) => setSnapshotDesc(e.target.value)}
                    placeholder="Optional notes or description..."
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-500 font-mono">
                  Saves all {currentFiles.length} files &amp; metadata
                </span>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaving ? 'Saving...' : 'Save Current State to IndexedDB'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Saved Snapshots List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <FolderArchive className="w-4 h-4 text-slate-500" />
                <span>Saved Snapshots ({snapshots.length})</span>
              </h3>
            </div>

            {snapshots.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-300 p-6">
                <Clock className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-60" />
                <p className="text-sm font-semibold text-slate-700">No snapshots saved yet</p>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  Create your first snapshot above to safely checkpoint your LaTeX document and revert anytime.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {snapshots.map((snap) => {
                  const isExpanded = expandedSnapshotId === snap.id;
                  const isConfirming = confirmRestoreId === snap.id;
                  const dateStr = new Date(snap.timestamp).toLocaleString();

                  return (
                    <div
                      key={snap.id}
                      className="border border-slate-200 rounded-xl bg-white hover:border-slate-300 transition-all shadow-xs overflow-hidden"
                    >
                      <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-900">{snap.name}</span>
                            <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200">
                              {snap.fileCount} files
                            </span>
                          </div>

                          {snap.description && (
                            <p className="text-xs text-slate-600 italic">
                              "{snap.description}"
                            </p>
                          )}

                          <div className="flex items-center gap-3 text-[11px] text-slate-400">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {dateStr}
                            </span>
                            <span>•</span>
                            <span className="truncate max-w-xs">
                              {snap.metadata.title}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => setExpandedSnapshotId(isExpanded ? null : snap.id)}
                            className="px-2.5 py-1 text-xs text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1 transition-colors"
                            title="Inspect files in this snapshot"
                          >
                            <span>Files</span>
                            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          </button>

                          {isConfirming ? (
                            <div className="flex items-center gap-1 bg-amber-50 border border-amber-300 rounded-lg p-1 animate-in fade-in">
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 ml-1" />
                              <span className="text-[11px] font-semibold text-amber-800 px-1">Overwrite current?</span>
                              <button
                                onClick={() => handleRestore(snap)}
                                className="px-2 py-0.5 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded transition-colors"
                              >
                                Yes, Restore
                              </button>
                              <button
                                onClick={() => setConfirmRestoreId(null)}
                                className="px-1.5 py-0.5 text-xs text-slate-600 hover:text-slate-900"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setConfirmRestoreId(snap.id)}
                              className="px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                              title="Revert project to this snapshot"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Restore</span>
                            </button>
                          )}

                          <button
                            onClick={() => onDeleteSnapshot(snap.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete this snapshot"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Expanded File List */}
                      {isExpanded && (
                        <div className="bg-slate-50 border-t border-slate-200 p-3 space-y-1.5 text-xs font-mono">
                          <p className="font-sans font-bold text-slate-700 text-[11px] uppercase tracking-wider mb-2">
                            Snapshot File Manifest ({snap.files.length} items):
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-48 overflow-y-auto">
                            {snap.files.map((file, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between bg-white px-2.5 py-1 rounded border border-slate-200"
                              >
                                <span className="text-slate-800 font-medium truncate max-w-[200px]">
                                  {file.name}
                                </span>
                                <span className="text-[10px] text-slate-400">
                                  {file.content.length} chars
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-mono">
            IndexedDB: LaTeXStudioDB • ObjectStore: snapshots
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
