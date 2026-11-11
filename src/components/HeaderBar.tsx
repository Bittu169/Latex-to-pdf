import React from 'react';
import {
  Printer,
  FileText,
  Columns,
  Code2,
  Sparkles,
  Sliders,
  ZoomIn,
  ZoomOut,
  Download,
  GraduationCap,
  Loader2,
  FileDown,
  History,
  UploadCloud,
  AlignLeft,
  FileType,
  Copy,
  FilePlus
} from 'lucide-react';

export type ViewMode = 'pdf' | 'split' | 'code';

interface HeaderBarProps {
  viewMode: ViewMode;
  onChangeViewMode: (mode: ViewMode) => void;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  onOpenEquationGallery: () => void;
  onOpenSettings: () => void;
  onOpenSnapshots: () => void;
  onOpenUploadModal: () => void;
  onOpenWordCount: () => void;
  totalWordCount: number;
  snapshotCount: number;
  onDownloadPdf: () => void;
  onDownloadWord: () => void;
  onPrintPdf: () => void;
  onExportCode: () => void;
  onCopyAllCode?: () => void;
  onLoadTemplate?: () => void;
  onNewBlankDoc?: () => void;
  hasFiles?: boolean;
  isGeneratingPdf: boolean;
  isGeneratingWord: boolean;
  pdfProgressText?: string;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  viewMode,
  onChangeViewMode,
  zoom,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onOpenEquationGallery,
  onOpenSettings,
  onOpenSnapshots,
  onOpenUploadModal,
  onOpenWordCount,
  totalWordCount,
  snapshotCount,
  onDownloadPdf,
  onDownloadWord,
  onPrintPdf,
  onExportCode,
  onCopyAllCode,
  onLoadTemplate,
  onNewBlankDoc,
  hasFiles,
  isGeneratingPdf,
  isGeneratingWord,
  pdfProgressText
}) => {
  return (
    <header className="no-print bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 px-4 py-2.5 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* App Title & University Badge */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-sm md:text-base tracking-tight text-white">
                LaTeX Thesis to PDF Studio
              </h1>
              {hasFiles ? (
                <span className="text-[10px] uppercase font-bold tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded-full">
                  Autumn 2026
                </span>
              ) : (
                <span className="text-[10px] uppercase font-bold tracking-wider bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded-full">
                  Blank Document
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              {hasFiles
                ? 'Sister Nivedita University • scrbook Academic Dissertation'
                : 'Clean Workspace • Upload a project or start with a blank LaTeX file'}
            </p>
          </div>
        </div>

        {/* View Mode Switcher + Word Count Badge */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => onChangeViewMode('pdf')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                viewMode === 'pdf'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Clean PDF Document View"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">PDF Document</span>
            </button>

            <button
              onClick={() => onChangeViewMode('split')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                viewMode === 'split'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Split Code & PDF Preview"
            >
              <Columns className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Split View</span>
            </button>

            <button
              onClick={() => onChangeViewMode('code')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                viewMode === 'code'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Full LaTeX Code Editor"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">LaTeX Code</span>
            </button>
          </div>

          {/* Interactive Total Word Count Badge */}
          <button
            onClick={onOpenWordCount}
            className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-indigo-300 transition-colors border border-slate-800 cursor-pointer font-mono"
            title="Total prose word count across all .tex files. Click for file-by-file breakdown."
          >
            <AlignLeft className="w-3.5 h-3.5 text-indigo-400" />
            <span>{totalWordCount.toLocaleString()} words</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Zoom Controls (only shown when viewing PDF) */}
          {viewMode !== 'code' && (
            <div className="hidden lg:flex items-center bg-slate-950 border border-slate-800 rounded-lg px-1 py-0.5 text-xs text-slate-300">
              <button
                onClick={onZoomOut}
                className="p-1 hover:text-white hover:bg-slate-800 rounded transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onZoomReset}
                className="px-2 py-0.5 font-mono text-[11px] text-slate-300 hover:text-white"
                title="Reset Zoom"
              >
                {Math.round(zoom * 100)}%
              </button>
              <button
                onClick={onZoomIn}
                className="p-1 hover:text-white hover:bg-slate-800 rounded transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* New Blank Document */}
          {onNewBlankDoc && (
            <button
              onClick={onNewBlankDoc}
              className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700/60 cursor-pointer"
              title="Create a new blank document (main.tex)"
            >
              <FilePlus className="w-3.5 h-3.5 text-slate-300" />
              <span className="hidden sm:inline">New Blank</span>
            </button>
          )}

          {/* Load Sample Template */}
          {onLoadTemplate && (
            <button
              onClick={onLoadTemplate}
              className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700/60 cursor-pointer"
              title="Load the Sister Nivedita University Thesis Template"
            >
              <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Load Template</span>
            </button>
          )}

          {/* Upload LaTeX ZIP or Code */}
          <button
            onClick={onOpenUploadModal}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-blue-600/40 hover:bg-blue-600/60 text-blue-100 transition-colors border border-blue-500/40 cursor-pointer"
            title="Upload LaTeX .zip archive or paste raw TeX code"
          >
            <UploadCloud className="w-3.5 h-3.5 text-blue-300" />
            <span className="font-semibold">Upload ZIP / Code</span>
          </button>

          {/* Formula Gallery */}
          <button
            onClick={onOpenEquationGallery}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700/60"
            title="Formula & Snippet Cheat-Sheet"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Math Sandbox</span>
          </button>

          {/* Metadata Quick Edit */}
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700/60"
            title="Edit Project Title & Students"
          >
            <Sliders className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden md:inline">Project Details</span>
          </button>

          {/* Local IndexedDB Snapshots */}
          <button
            onClick={onOpenSnapshots}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700/60 relative"
            title="Local IndexedDB Project Snapshots & Revert History"
          >
            <History className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Snapshots</span>
            {snapshotCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-indigo-600 text-white">
                {snapshotCount}
              </span>
            )}
          </button>

          {/* Export Code */}
          <button
            onClick={onExportCode}
            className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700/60"
            title="Download LaTeX Source"
          >
            <FileDown className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden xl:inline">Source (.tex)</span>
          </button>

          {/* Quick Copy All LaTeX Code Button */}
          {onCopyAllCode && (
            <button
              onClick={onCopyAllCode}
              className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-indigo-900/50 text-slate-200 hover:text-indigo-200 transition-colors border border-slate-700/60 cursor-pointer"
              title="Copy the complete combined LaTeX code of all files to clipboard"
            >
              <Copy className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden xl:inline">Copy All LaTeX</span>
            </button>
          )}

          {/* Browser Print Dialog Button */}
          <button
            onClick={onPrintPdf}
            className="hidden sm:flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700"
            title="Open browser print dialog (requires popups/print permissions)"
          >
            <Printer className="w-3.5 h-3.5 text-slate-400" />
            <span>Print</span>
          </button>

          {/* DOWNLOAD WORD (.DOCX) FILE */}
          <button
            onClick={onDownloadWord}
            disabled={isGeneratingWord}
            className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-600 text-white shadow-md shadow-blue-950/40 transition-all cursor-pointer disabled:opacity-60"
            title="Download formatted Microsoft Word (.docx) document equivalent of this LaTeX report"
          >
            {isGeneratingWord ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Creating Word...</span>
              </>
            ) : (
              <>
                <FileType className="w-3.5 h-3.5 text-blue-200" />
                <span>Word (.docx)</span>
              </>
            )}
          </button>

          {/* PRIMARY ACTION: DIRECT PDF FILE DOWNLOAD */}
          <button
            onClick={onDownloadPdf}
            disabled={isGeneratingPdf}
            className="flex items-center gap-2 text-xs font-bold px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-900/40 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-wait"
            title="Compile and download exact A4 PDF document file directly to your computer"
          >
            {isGeneratingPdf ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>{pdfProgressText || 'Building PDF...'}</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-white" />
                <span>Download PDF</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
