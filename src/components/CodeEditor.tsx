import React, { useState, useMemo } from 'react';
import { ProjectFile } from '../types/latex';
import { FileCode, Copy, Check, RotateCcw, Sparkles, AlignLeft } from 'lucide-react';
import { countLatexWords } from '../utils/wordCounter';

interface CodeEditorProps {
  files: ProjectFile[];
  activeFilePath: string;
  onSelectFile: (path: string) => void;
  onUpdateFileContent: (path: string, newContent: string) => void;
  onResetToDefault: (path: string) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  files,
  activeFilePath,
  onSelectFile,
  onUpdateFileContent,
  onResetToDefault
}) => {
  const [copied, setCopied] = useState(false);

  const activeFile = files.find(f => f.path === activeFilePath) || files[0];

  const handleCopy = () => {
    if (!activeFile) return;
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lineCount = (activeFile?.content || '').split('\n').length;
  const activeFileWords = useMemo(() => {
    return countLatexWords(activeFile?.content || '').words;
  }, [activeFile?.content]);

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 rounded-lg border border-slate-700 overflow-hidden shadow-lg">
      {/* File Navigation Tabs */}
      <div className="bg-slate-950 border-b border-slate-800 px-3 py-2 flex items-center justify-between overflow-x-auto gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {files.map(file => {
            const isActive = file.path === activeFilePath;
            return (
              <button
                key={file.path}
                onClick={() => onSelectFile(file.path)}
                className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
                title={file.description || file.name}
              >
                <FileCode className="w-3.5 h-3.5 opacity-80" />
                <span>{file.name}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 pl-2 border-l border-slate-800 shrink-0">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Copy LaTeX Code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={() => onResetToDefault(activeFilePath)}
            className="flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-rose-900/40 text-slate-300 hover:text-rose-300 transition-colors"
            title="Reset this file to original template"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Editor Sub-header */}
      <div className="bg-slate-900/90 px-4 py-1.5 text-xs text-slate-400 border-b border-slate-800 flex items-center justify-between font-mono">
        <div className="flex items-center gap-2">
          <span className="text-blue-400 font-semibold">{activeFile?.path}</span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-500">{lineCount} lines</span>
          <span className="text-slate-600">•</span>
          <span className="text-indigo-300 font-medium">{activeFileWords.toLocaleString()} words</span>
        </div>
        {activeFile?.description && (
          <span className="text-slate-400 text-[11px] truncate max-w-md hidden md:inline">
            {activeFile.description}
          </span>
        )}
      </div>

      {/* Code Area with Line Numbers */}
      <div className="flex-1 flex overflow-hidden relative font-mono text-sm">
        {/* Line Numbers Bar */}
        <div className="w-12 bg-slate-950/80 text-slate-600 select-none py-3 text-right pr-3 font-mono text-xs border-r border-slate-800 overflow-hidden shrink-0">
          {Array.from({ length: lineCount }).map((_, i) => (
            <div key={i} className="leading-6">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Textarea Code Input */}
        <textarea
          value={activeFile?.content || ''}
          onChange={(e) => onUpdateFileContent(activeFilePath, e.target.value)}
          spellCheck={false}
          className="flex-1 w-full bg-slate-900 text-slate-100 p-3 leading-6 resize-none focus:outline-hidden font-mono text-xs md:text-sm selection:bg-blue-600/40 overflow-auto whitespace-pre tab-4"
          placeholder="Enter LaTeX code here..."
        />
      </div>

      {/* Quick LaTeX Snippet Helper footer */}
      <div className="bg-slate-950 border-t border-slate-800 px-4 py-2 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Edit code freely — the PDF preview compiles live with KaTeX math and layout</span>
        </div>
        <div className="text-slate-500 font-mono text-[11px]">
          UTF-8 • LaTeX (scrbook)
        </div>
      </div>
    </div>
  );
};
