import React from 'react';
import { ProjectWordCountSummary } from '../utils/wordCounter';
import {
  AlignLeft,
  X,
  Clock,
  FileText,
  Hash,
  BarChart2,
  BookOpen
} from 'lucide-react';

interface WordCountModalProps {
  isOpen: boolean;
  onClose: () => void;
  summary: ProjectWordCountSummary;
  onSelectFile?: (path: string) => void;
}

export const WordCountModal: React.FC<WordCountModalProps> = ({
  isOpen,
  onClose,
  summary,
  onSelectFile
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700">
              <AlignLeft className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                LaTeX Project Word Count
              </h2>
              <p className="text-xs text-slate-500">
                Scans prose content across all .tex files (excluding comments, LaTeX commands, and equations).
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

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-indigo-50/70 border border-indigo-200 rounded-xl p-3.5 text-center">
              <p className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
                <AlignLeft className="w-3.5 h-3.5" />
                <span>Total Words</span>
              </p>
              <p className="text-2xl font-black text-indigo-950 font-mono">
                {summary.totalWords.toLocaleString()}
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-center">
              <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
                <Hash className="w-3.5 h-3.5 text-slate-500" />
                <span>Characters</span>
              </p>
              <p className="text-2xl font-black text-slate-900 font-mono">
                {summary.totalCharacters.toLocaleString()}
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-center">
              <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>Reading Time</span>
              </p>
              <p className="text-2xl font-black text-slate-900 font-mono">
                ~{summary.readingTimeMinutes} min
              </p>
            </div>
          </div>

          {/* Breakdown per File */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <BarChart2 className="w-3.5 h-3.5 text-slate-500" />
                <span>Word Count Breakdown by File ({summary.fileCount} .tex files)</span>
              </h3>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
              {summary.perFile.map((item, idx) => {
                const percentage = summary.totalWords > 0
                  ? Math.round((item.words / summary.totalWords) * 100)
                  : 0;

                return (
                  <div
                    key={idx}
                    onClick={() => {
                      onSelectFile?.(item.path);
                      onClose();
                    }}
                    className="p-3 bg-white hover:bg-slate-50 transition-colors flex items-center justify-between gap-3 cursor-pointer group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors truncate">
                          {item.name}
                        </span>
                        <span className="text-xs font-mono font-bold text-indigo-900 shrink-0">
                          {item.words.toLocaleString()} words ({percentage}%)
                        </span>
                      </div>

                      {/* Mini Progress Bar */}
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-indigo-600 h-1.5 rounded-full"
                          style={{ width: `${Math.max(percentage, 2)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500 font-mono">
          <span>Formula: \b[\w'-]+\b (ignoring TeX commands &amp; comments)</span>
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
