import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ProjectFile } from '../types/latex';
import {
  FileCode,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  BookOpen,
  WrapText,
  MousePointer,
  CornerDownRight,
  Layers,
  FileStack,
  FilePlus,
  UploadCloud,
  GraduationCap
} from 'lucide-react';
import { countLatexWords } from '../utils/wordCounter';

interface CodeEditorProps {
  files: ProjectFile[];
  activeFilePath: string;
  onSelectFile: (path: string) => void;
  onUpdateFileContent: (path: string, newContent: string) => void;
  onResetToDefault: (path: string) => void;
  onUpdateAllFiles?: (updatedFiles: ProjectFile[]) => void;
  onCreateBlankFile?: () => void;
  onUploadClick?: () => void;
  onLoadTemplate?: () => void;
}

/**
 * Builds a single continuous LaTeX document containing all project files
 * separated by clear, recognizable delimiter banners.
 */
export const buildCombinedCode = (fileList: ProjectFile[]): string => {
  const sorted = [...fileList].sort((a, b) => {
    if (a.path === 'main.tex') return -1;
    if (b.path === 'main.tex') return 1;
    return a.path.localeCompare(b.path);
  });

  return sorted
    .map((file, idx) => {
      const banner = `% %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% [FILE ${idx + 1}/${sorted.length}]: ${file.path}
% DESCRIPTION: ${file.description || file.name}
% %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%`;
      return `${banner}\n\n${file.content}`;
    })
    .join('\n\n\n');
};

/**
 * Parses combined code back into individual file updates if edited in All-in-One mode
 */
const parseCombinedCodeToFiles = (allText: string, existingFiles: ProjectFile[]): ProjectFile[] => {
  const bannerRegex = /% %+\s*\n%\s*\[FILE \d+\/\d+\]:\s*([^\n\r]+)(?:\n% DESCRIPTION:[^\n\r]*)?\s*\n% %+/g;
  const matches = [...allText.matchAll(bannerRegex)];

  if (matches.length === 0) {
    return existingFiles;
  }

  const updatedFiles = [...existingFiles];
  for (let i = 0; i < matches.length; i++) {
    const filePath = matches[i][1].trim();
    const startIndex = matches[i].index! + matches[i][0].length;
    const endIndex = i + 1 < matches.length ? matches[i + 1].index! : allText.length;
    const fileContent = allText.slice(startIndex, endIndex).replace(/^\n+/, '').replace(/\n+$/, '');

    const existingIndex = updatedFiles.findIndex(f => f.path === filePath || f.path.endsWith(filePath));
    if (existingIndex !== -1) {
      updatedFiles[existingIndex] = {
        ...updatedFiles[existingIndex],
        content: fileContent
      };
    }
  }
  return updatedFiles;
};

export const CodeEditor: React.FC<CodeEditorProps> = ({
  files,
  activeFilePath,
  onSelectFile,
  onUpdateFileContent,
  onResetToDefault,
  onUpdateAllFiles,
  onCreateBlankFile,
  onUploadClick,
  onLoadTemplate
}) => {
  // 'single' = by individual file tab, 'all' = entire code in one continuous page
  const [viewMode, setViewMode] = useState<'single' | 'all'>('single');
  const [wordWrap, setWordWrap] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedFile, setCopiedFile] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  // If no files are provided, render a clean blank editor screen
  if (files.length === 0) {
    return (
      <div className="flex flex-col h-full bg-slate-900 text-slate-100 rounded-lg border border-slate-700 overflow-hidden shadow-lg min-w-0">
        <div className="bg-slate-950 border-b border-slate-800 px-3 py-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <FileCode className="w-4 h-4 text-slate-500" />
            <span>No files open</span>
          </div>

          <div className="flex items-center gap-2">
            {onCreateBlankFile && (
              <button
                onClick={onCreateBlankFile}
                className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors cursor-pointer"
                title="Create a new blank main.tex file"
              >
                <FilePlus className="w-3.5 h-3.5" />
                <span>+ New File</span>
              </button>
            )}
            {onUploadClick && (
              <button
                onClick={onUploadClick}
                className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Upload LaTeX .zip archive"
              >
                <UploadCloud className="w-3.5 h-3.5 text-blue-400" />
                <span>Upload ZIP</span>
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400 shadow-inner">
            <FileCode className="w-8 h-8 text-slate-500 stroke-[1.5]" />
          </div>

          <div className="max-w-sm space-y-1">
            <h3 className="text-base font-bold text-slate-200">
              No LaTeX Files Provided
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Create a new blank document to start typing LaTeX code, or upload an existing project archive (.zip) or TeX file.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {onCreateBlankFile && (
              <button
                onClick={onCreateBlankFile}
                className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <FilePlus className="w-4 h-4" />
                <span>Create Blank main.tex</span>
              </button>
            )}

            {onUploadClick && (
              <button
                onClick={onUploadClick}
                className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <UploadCloud className="w-4 h-4 text-blue-400" />
                <span>Upload ZIP / Code</span>
              </button>
            )}

            {onLoadTemplate && (
              <button
                onClick={onLoadTemplate}
                className="px-3.5 py-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-medium border border-slate-700/60 flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <GraduationCap className="w-4 h-4 text-slate-400" />
                <span>Load Sample Template</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const activeFile = files.find(f => f.path === activeFilePath) || files[0];

  // Combined code for All-in-One page mode
  const combinedCode = useMemo(() => {
    return buildCombinedCode(files);
  }, [files]);

  // Synchronize line numbers vertical scrolling with textarea
  const handleScroll = () => {
    if (lineNumbersRef.current && textareaRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  // Show inline notification
  const triggerNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // Copy Entire Project LaTeX Code (all files concatenated)
  const handleCopyAllCode = () => {
    const fullCode = buildCombinedCode(files);
    navigator.clipboard.writeText(fullCode);
    setCopiedAll(true);
    triggerNotification(`Copied entire LaTeX project code (${files.length} files, ${fullCode.split('\n').length} lines) to clipboard!`);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  // Copy Only Current Active File
  const handleCopyCurrentFile = () => {
    if (!activeFile) return;
    navigator.clipboard.writeText(activeFile.content);
    setCopiedFile(true);
    triggerNotification(`Copied ${activeFile.name} to clipboard!`);
    setTimeout(() => setCopiedFile(false), 2500);
  };

  // Select All text in the active editor for quick inspection or copy
  const handleSelectAll = () => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
      triggerNotification('All text selected in editor (press Ctrl+C / Cmd+C to copy)');
    }
  };

  // Jump to specific file section in All-in-One mode
  const handleJumpToFile = (filePath: string) => {
    if (!textareaRef.current) return;
    const content = textareaRef.current.value;
    const searchHeader = `[FILE `;
    const targetMatch = content.indexOf(`: ${filePath}`);
    
    if (targetMatch !== -1) {
      const bannerStart = content.lastIndexOf('% %%%%%', targetMatch);
      const pos = bannerStart !== -1 ? bannerStart : targetMatch;
      
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(pos, pos + filePath.length + 30);
      
      const lineNum = content.substring(0, pos).split('\n').length;
      const lineHeight = 24; // 24px per line in leading-6
      textareaRef.current.scrollTop = Math.max(0, (lineNum - 2) * lineHeight);
      if (lineNumbersRef.current) {
        lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
      }
      triggerNotification(`Scrolled to: ${filePath}`);
    }
  };

  // Handle text edits in All-in-One mode
  const handleAllCodeChange = (newVal: string) => {
    const updated = parseCombinedCodeToFiles(newVal, files);
    if (onUpdateAllFiles) {
      onUpdateAllFiles(updated);
    } else {
      updated.forEach(f => {
        const original = files.find(orig => orig.path === f.path);
        if (original && original.content !== f.content) {
          onUpdateFileContent(f.path, f.content);
        }
      });
    }
  };

  // Compute lines and stats
  const currentContent = viewMode === 'all' ? combinedCode : (activeFile?.content || '');
  const lineCount = currentContent.split('\n').length;

  const wordStats = useMemo(() => {
    if (viewMode === 'all') {
      let total = 0;
      files.forEach(f => {
        total += countLatexWords(f.content).words;
      });
      return total;
    }
    return countLatexWords(activeFile?.content || '').words;
  }, [viewMode, files, activeFile?.content]);

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 rounded-lg border border-slate-700 overflow-hidden shadow-lg min-w-0">
      {/* Primary Navigation & Control Bar */}
      <div className="bg-slate-950 border-b border-slate-800 px-3 py-2 flex flex-wrap items-center justify-between gap-2 shrink-0">
        {/* Left: View Mode Toggle & File Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto min-w-0 max-w-full py-0.5">
          {/* Main Option Switcher: "All in One Page" vs "By File" */}
          <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-800 shrink-0">
            <button
              onClick={() => setViewMode('all')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'all'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="See entire LaTeX project code in one continuous single page"
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-200" />
              <span>All in One Page</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-indigo-950/80 border border-indigo-400/40 text-indigo-300 font-mono">
                {files.length}
              </span>
            </button>

            <button
              onClick={() => setViewMode('single')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'single'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Browse individual files via tabs"
            >
              <FileCode className="w-3.5 h-3.5 text-blue-200" />
              <span>By File</span>
            </button>
          </div>

          {/* Individual File Tabs (shown in Single File mode) */}
          {viewMode === 'single' && (
            <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 min-w-0">
              {files.map(file => {
                const isActive = file.path === activeFilePath;
                return (
                  <button
                    key={file.path}
                    onClick={() => onSelectFile(file.path)}
                    className={`px-2.5 py-1.5 rounded-md text-xs font-mono font-medium whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                    }`}
                    title={file.description || file.name}
                  >
                    <FileCode className="w-3.5 h-3.5 opacity-80" />
                    <span>{file.name}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Action Buttons (Copy All Code, Copy File, Select All, Wrap Toggle, Reset) */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Prominent "COPY ALL CODE" Button */}
          <button
            onClick={handleCopyAllCode}
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-950/40 transition-all cursor-pointer"
            title="Copy the entire LaTeX code of all project files to clipboard"
          >
            {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Layers className="w-3.5 h-3.5 text-indigo-200" />}
            <span>{copiedAll ? 'All Code Copied!' : 'Copy All Code'}</span>
          </button>

          {/* In Single File view: Copy File button */}
          {viewMode === 'single' && (
            <button
              onClick={handleCopyCurrentFile}
              className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Copy active file's code"
            >
              {copiedFile ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedFile ? 'Copied' : 'Copy File'}</span>
            </button>
          )}

          {/* Select All (for manual selection & copying) */}
          <button
            onClick={handleSelectAll}
            className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Select all text in this editor (you can also manually highlight any specific part)"
          >
            <MousePointer className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Select All</span>
          </button>

          {/* Word Wrap Toggle (Toggle Soft Wrap vs Wide Horizontal Scroll) */}
          <button
            onClick={() => setWordWrap(!wordWrap)}
            className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-md transition-colors border cursor-pointer ${
              wordWrap
                ? 'bg-blue-950/60 border-blue-500/50 text-blue-300'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
            }`}
            title={
              wordWrap
                ? 'Word Wrap is ON (Soft Wrap). Click for horizontal scrolling.'
                : 'Word Wrap is OFF (Horizontal Scroll). Click to soft-wrap long lines.'
            }
          >
            <WrapText className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{wordWrap ? 'Wrap: ON' : 'Wrap: OFF'}</span>
          </button>

          {/* Reset button (in Single File mode) */}
          {viewMode === 'single' && (
            <button
              onClick={() => onResetToDefault(activeFilePath)}
              className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-md bg-slate-800 hover:bg-rose-900/40 text-slate-300 hover:text-rose-300 transition-colors cursor-pointer"
              title="Reset this file to original template"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Quick Jump Bar (shown when viewing All in One Page) */}
      {viewMode === 'all' && (
        <div className="bg-slate-950/90 px-3 py-1.5 border-b border-slate-800 flex items-center gap-2 overflow-x-auto text-xs shrink-0">
          <span className="text-slate-400 shrink-0 font-medium flex items-center gap-1 text-[11px]">
            <CornerDownRight className="w-3.5 h-3.5 text-indigo-400" />
            Jump to file:
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
            {files.map(file => (
              <button
                key={file.path}
                onClick={() => handleJumpToFile(file.path)}
                className="px-2 py-0.5 rounded bg-slate-800/90 hover:bg-indigo-900/50 text-slate-300 hover:text-indigo-200 text-[11px] font-mono whitespace-nowrap border border-slate-700/60 transition-colors cursor-pointer"
                title={`Jump to ${file.path} section`}
              >
                {file.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Editor Sub-header with statistics & transient notifications */}
      <div className="bg-slate-900/90 px-4 py-1.5 text-xs text-slate-400 border-b border-slate-800 flex items-center justify-between font-mono shrink-0">
        <div className="flex items-center gap-2 flex-wrap">
          {viewMode === 'all' ? (
            <span className="text-indigo-300 font-semibold flex items-center gap-1">
              <FileStack className="w-3.5 h-3.5 text-indigo-400" />
              All Files Combined ({files.length} files)
            </span>
          ) : (
            <span className="text-blue-400 font-semibold">{activeFile?.path}</span>
          )}
          <span className="text-slate-600">•</span>
          <span className="text-slate-400">{lineCount.toLocaleString()} lines</span>
          <span className="text-slate-600">•</span>
          <span className="text-emerald-400 font-medium">{wordStats.toLocaleString()} words</span>
          {!wordWrap && (
            <>
              <span className="text-slate-600">•</span>
              <span className="text-slate-500 text-[11px] hidden sm:inline">
                Horizontal scroll enabled (drag or scroll right freely)
              </span>
            </>
          )}
        </div>

        {toastMessage ? (
          <span className="text-emerald-400 font-medium text-[11px] animate-pulse">
            ✓ {toastMessage}
          </span>
        ) : (
          <span className="text-slate-500 text-[11px] truncate max-w-md hidden lg:inline">
            {viewMode === 'all'
              ? 'Viewing entire project code on 1 page • Click "Copy All Code" or select any part manually'
              : activeFile?.description || 'Editable LaTeX document'}
          </span>
        )}
      </div>

      {/* Code Area with Line Numbers & Unrestricted Smooth Horizontal Scroll */}
      <div className="flex-1 flex min-w-0 overflow-hidden relative font-mono text-sm">
        {/* Line Numbers Bar (synchronized on scroll) */}
        <div
          ref={lineNumbersRef}
          className={`${
            lineCount > 999 ? 'w-16' : 'w-12'
          } bg-slate-950/90 text-slate-500 select-none py-3 text-right pr-3 font-mono text-xs border-r border-slate-800 overflow-hidden shrink-0`}
        >
          {Array.from({ length: lineCount }).map((_, i) => (
            <div key={i} className="leading-6">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Textarea Code Input with visible custom scrollbars and smooth selection */}
        <textarea
          ref={textareaRef}
          value={currentContent}
          onChange={(e) => {
            if (viewMode === 'all') {
              handleAllCodeChange(e.target.value);
            } else {
              onUpdateFileContent(activeFilePath, e.target.value);
            }
          }}
          onScroll={handleScroll}
          spellCheck={false}
          className={`flex-1 min-w-0 w-full bg-slate-900 text-slate-100 p-3 leading-6 resize-none focus:outline-hidden font-mono text-xs md:text-sm selection:bg-blue-600 selection:text-white tab-4 overflow-x-auto overflow-y-auto code-editor-scroll ${
            wordWrap ? 'whitespace-pre-wrap break-words' : 'whitespace-pre'
          }`}
          placeholder={viewMode === 'all' ? 'All project LaTeX code...' : 'Enter LaTeX code here...'}
        />
      </div>

      {/* Editor Status Footer */}
      <div className="bg-slate-950 border-t border-slate-800 px-4 py-2 flex items-center justify-between text-xs text-slate-400 shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">
            {viewMode === 'all'
              ? 'Complete multi-file LaTeX source code. Select any specific part to copy or click "Copy All Code".'
              : 'Live editable LaTeX. Changes compile in real-time to the PDF document view.'}
          </span>
          <span className="sm:hidden">
            {viewMode === 'all' ? 'Entire Project Code View' : 'Single File View'}
          </span>
        </div>
        <div className="text-slate-500 font-mono text-[11px] flex items-center gap-2">
          <span>{wordWrap ? 'Wrap: Soft' : 'Scroll: Free Horizontal'}</span>
          <span>•</span>
          <span>UTF-8 LaTeX</span>
        </div>
      </div>
    </div>
  );
};
