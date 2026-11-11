import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  INITIAL_FILES,
  INITIAL_METADATA,
  INITIAL_BIBLIOGRAPHY,
  BLANK_METADATA,
  BLANK_MAIN_TEX
} from './data/initialProject';
import { ProjectFile, ProjectMetadata } from './types/latex';
import { parseBibtex } from './utils/latexParser';
import { PdfDocumentViewer } from './components/PdfDocumentViewer';
import { CodeEditor, buildCombinedCode } from './components/CodeEditor';
import { HeaderBar, ViewMode } from './components/HeaderBar';
import { EquationGalleryModal } from './components/EquationGalleryModal';
import { QuickSettingsModal } from './components/QuickSettingsModal';
import { SnapshotManagerModal } from './components/SnapshotManagerModal';
import { UploadProjectModal } from './components/UploadProjectModal';
import { WordCountModal } from './components/WordCountModal';
import { generateAndDownloadPdf, PdfGenerationProgress } from './utils/pdfGenerator';
import { generateAndDownloadWordDoc } from './utils/docxGenerator';
import { ParsedZipResult } from './utils/zipParser';
import { calculateProjectWordCount } from './utils/wordCounter';
import {
  saveSnapshot,
  getAllSnapshots,
  deleteSnapshot,
  ProjectSnapshot
} from './utils/indexedDBStorage';
import {
  Download,
  Printer,
  Sparkles,
  CheckCircle2,
  Loader2,
  AlertCircle,
  History,
  Check,
  UploadCloud,
  AlignLeft,
  GraduationCap,
  FilePlus
} from 'lucide-react';

export const App: React.FC = () => {
  // Start with clean blank workspace when opening for the first time
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [activeFilePath, setActiveFilePath] = useState<string>('');
  const [metadata, setMetadata] = useState<ProjectMetadata>(BLANK_METADATA);
  const [viewMode, setViewMode] = useState<ViewMode>('pdf');
  const [zoom, setZoom] = useState<number>(1.0);
  const [isEquationModalOpen, setIsEquationModalOpen] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
  const [isSnapshotModalOpen, setIsSnapshotModalOpen] = useState<boolean>(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [isWordCountModalOpen, setIsWordCountModalOpen] = useState<boolean>(false);

  // IndexedDB Snapshots State
  const [snapshots, setSnapshots] = useState<ProjectSnapshot[]>([]);
  const [toastNotification, setToastNotification] = useState<string | null>(null);

  // PDF & Word Generation State
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [isGeneratingWord, setIsGeneratingWord] = useState<boolean>(false);
  const [pdfProgress, setPdfProgress] = useState<PdfGenerationProgress | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const pdfContainerRef = useRef<HTMLDivElement>(null);

  // Load snapshots from IndexedDB on initial mount
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const loaded = await getAllSnapshots();
        if (!isMounted) return;

        if (loaded.length === 0) {
          // Create initial baseline snapshot so users can always revert to pristine template
          const initialSnap = await saveSnapshot(
            'Original Template Baseline (Autumn 2026)',
            INITIAL_FILES,
            INITIAL_METADATA,
            'Original extracted template files and settings'
          );
          if (isMounted) {
            setSnapshots([initialSnap]);
          }
        } else {
          setSnapshots(loaded);
        }
      } catch (err) {
        console.warn('Could not initialize IndexedDB snapshots:', err);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  // Show transient toast
  const showToast = (message: string) => {
    setToastNotification(message);
    setTimeout(() => {
      setToastNotification(null);
    }, 2500);
  };

  // Snapshot handlers
  const handleSaveSnapshot = async (name: string, description?: string) => {
    const snap = await saveSnapshot(name, files, metadata, description);
    setSnapshots(prev => [snap, ...prev]);
    showToast(`Snapshot "${snap.name}" saved to IndexedDB`);
  };

  const handleRestoreSnapshot = (snapshot: ProjectSnapshot) => {
    setFiles(snapshot.files);
    setMetadata(snapshot.metadata);
    showToast(`Reverted project to snapshot: "${snapshot.name}"`);
  };

  const handleDeleteSnapshot = async (id: string) => {
    await deleteSnapshot(id);
    setSnapshots(prev => prev.filter(s => s.id !== id));
    showToast('Snapshot deleted from IndexedDB');
  };

  // Quick save snapshot button
  const handleQuickSaveSnapshot = async () => {
    const defaultName = `Snapshot ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    await handleSaveSnapshot(defaultName, 'Manual quick snapshot');
  };

  // Handle uploaded LaTeX ZIP
  const handleImportZipResult = async (result: ParsedZipResult) => {
    setFiles(result.files);
    if (result.mainFilePath) {
      setActiveFilePath(result.mainFilePath);
    }
    if (result.metadata) {
      setMetadata(prev => ({
        ...prev,
        ...result.metadata
      }));
    }

    // Save a snapshot of the newly imported ZIP
    try {
      const snap = await saveSnapshot(
        `Imported ZIP Project (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`,
        result.files,
        { ...metadata, ...result.metadata },
        `Extracted ${result.files.length} files from uploaded archive`
      );
      setSnapshots(prev => [snap, ...prev]);
    } catch (err) {
      console.warn('Could not save snapshot of imported zip:', err);
    }

    // Switch to PDF view
    setViewMode('pdf');
    showToast(`Imported ${result.files.length} files from ZIP. Compiling PDF...`);
  };

  // Handle pasted / uploaded code
  const handleImportCode = async (fileName: string, code: string, isMaster: boolean) => {
    const existingIdx = files.findIndex(f => f.name.toLowerCase() === fileName.toLowerCase() || f.path.toLowerCase() === fileName.toLowerCase());
    let updatedFiles: ProjectFile[];

    if (existingIdx !== -1) {
      updatedFiles = files.map((f, i) => i === existingIdx ? { ...f, content: code } : f);
    } else {
      const newFile: ProjectFile = {
        path: fileName,
        name: fileName,
        content: code,
        category: isMaster ? 'main' : 'chapter',
        description: 'Custom imported LaTeX code'
      };
      updatedFiles = [...files, newFile];
    }

    setFiles(updatedFiles);
    setActiveFilePath(fileName);

    if (isMaster) {
      setViewMode('pdf');
    }

    try {
      const snap = await saveSnapshot(
        `Code Import: ${fileName}`,
        updatedFiles,
        metadata,
        `Updated or added ${fileName}`
      );
      setSnapshots(prev => [snap, ...prev]);
    } catch (e) {
      console.warn(e);
    }

    showToast(`Compiled ${fileName} and refreshed PDF view`);
  };

  // Extract bibliography whenever references.bib is updated
  const bibliography = useMemo(() => {
    const bibFile = files.find(f => f.path === 'references.bib');
    if (bibFile && bibFile.content.trim()) {
      const parsed = parseBibtex(bibFile.content);
      if (parsed.length > 0) return parsed;
    }
    return files.length === 0 ? [] : INITIAL_BIBLIOGRAPHY;
  }, [files]);

  // Calculate total word count summary across all .tex files
  const wordCountSummary = useMemo(() => {
    return calculateProjectWordCount(files);
  }, [files]);

  // Handle zoom
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 1.6));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.6));
  const handleZoomReset = () => setZoom(1.0);

  // Update file content
  const handleUpdateFileContent = (path: string, newContent: string) => {
    setFiles(prev =>
      prev.map(f => (f.path === path ? { ...f, content: newContent } : f))
    );
  };

  // Reset a file to its default template
  const handleResetToDefault = (path: string) => {
    const original = INITIAL_FILES.find(f => f.path === path);
    if (original) {
      handleUpdateFileContent(path, original.content);
    }
  };

  // Create a new blank LaTeX file (main.tex)
  const handleCreateBlankFile = () => {
    const newFile: ProjectFile = {
      path: 'main.tex',
      name: 'main.tex',
      content: BLANK_MAIN_TEX,
      category: 'main',
      description: 'Blank LaTeX Document'
    };
    setFiles([newFile]);
    setActiveFilePath('main.tex');
    setMetadata({
      ...BLANK_METADATA,
      title: 'Untitled Document'
    });
    showToast('Created blank main.tex document');
  };

  // Load the full Sister Nivedita University thesis template
  const handleLoadTemplate = () => {
    setFiles(INITIAL_FILES);
    setActiveFilePath('Project Main File.tex');
    setMetadata(INITIAL_METADATA);
    showToast('Loaded Sister Nivedita University Thesis Template');
  };

  // Reset workspace to clean blank page
  const handleResetToBlank = () => {
    setFiles([]);
    setActiveFilePath('');
    setMetadata(BLANK_METADATA);
    showToast('Switched to clean blank page');
  };

  // Update metadata and synchronize with relevant TeX files
  const handleSaveMetadata = (newMetadata: ProjectMetadata) => {
    setMetadata(newMetadata);

    setFiles(prev =>
      prev.map(f => {
        if (f.path === 'bibtext/cover_page.tex') {
          return {
            ...f,
            content: `\\begin{titlepage}
\\onehalfspacing
    \\projectTitle{${newMetadata.title}}
    \\projectSubmitted
${newMetadata.students.map(s => `    \\studentName{${s.name}}`).join('\n')}
    \\programName{${newMetadata.degree}}
    \\universityDetailsCoverPage
    {\\centering \\Large ${newMetadata.year} \\par}
\\end{titlepage}`
          };
        }
        return f;
      })
    );
  };

  // DIRECT PDF GENERATION & FILE DOWNLOAD (.pdf)
  const handleDownloadPdf = async () => {
    if (isGeneratingPdf) return;

    setPdfError(null);
    const previousZoom = zoom;
    const previousViewMode = viewMode;

    try {
      setIsGeneratingPdf(true);
      setPdfProgress({
        currentPage: 0,
        totalPages: 12,
        percentage: 2,
        status: 'Preparing academic document pages...'
      });

      // If in code mode, temporarily switch to pdf view so DOM elements exist
      if (viewMode === 'code') {
        setViewMode('pdf');
      }

      // Temporarily set zoom to 1.0 for unscaled pixel-perfect capture
      setZoom(1.0);

      // Allow DOM to settle
      await new Promise(r => setTimeout(r, 200));

      const container = document.getElementById('pdf-document-container');
      if (!container) {
        throw new Error('PDF document container could not be found.');
      }

      const sanitizedTitle = (metadata.title || 'Student_Project_Report')
        .replace(/[^a-zA-Z0-9_-]/g, '_')
        .substring(0, 30);
      const fileName = `${sanitizedTitle}_Autumn_2026.pdf`;

      await generateAndDownloadPdf(container, fileName, (progress) => {
        setPdfProgress(progress);
      });

      // Keep success message briefly
      await new Promise(r => setTimeout(r, 1200));
    } catch (err: unknown) {
      console.error('PDF generation failed:', err);
      const errMsg = err instanceof Error ? err.message : 'Unknown error generating PDF';
      setPdfError(errMsg);
    } finally {
      setIsGeneratingPdf(false);
      setPdfProgress(null);
      setZoom(previousZoom);
      if (previousViewMode === 'code') {
        setViewMode(previousViewMode);
      }
    }
  };

  // Browser Print Dialog (as secondary fallback)
  const handlePrintPdf = () => {
    try {
      if (viewMode === 'code') {
        setViewMode('pdf');
        setTimeout(() => {
          window.print();
        }, 300);
      } else {
        window.print();
      }
    } catch (err) {
      console.warn('window.print() not available in iframe sandbox, falling back to direct download:', err);
      handleDownloadPdf();
    }
  };

  // DIRECT WORD (.DOCX) FILE DOWNLOAD
  const handleDownloadWord = async () => {
    if (isGeneratingWord) return;
    if (files.length === 0) {
      showToast('Document is blank. Please create or upload a LaTeX file first.');
      return;
    }
    try {
      setIsGeneratingWord(true);
      const sanitizedTitle = (metadata.title || 'Student_Project_Report')
        .replace(/[^a-zA-Z0-9_-]/g, '_')
        .substring(0, 30);
      const fileName = `${sanitizedTitle}_Autumn_2026.docx`;
      await generateAndDownloadWordDoc(metadata, bibliography, fileName);
      showToast(`Downloaded Word file: ${fileName}`);
    } catch (err) {
      console.error('Word generation failed:', err);
      showToast('Failed to generate Word document');
    } finally {
      setIsGeneratingWord(false);
    }
  };

  // Download active file
  const handleExportCode = () => {
    if (files.length === 0) {
      showToast('No files to export. Create or upload a file first.');
      return;
    }
    const activeFile = files.find(f => f.path === activeFilePath) || files[0];
    const blob = new Blob([activeFile.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = activeFile.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Copy all project LaTeX code directly to clipboard
  const handleCopyAllCode = () => {
    if (files.length === 0) {
      showToast('No code to copy. Project is blank.');
      return;
    }
    const combined = buildCombinedCode(files);
    navigator.clipboard.writeText(combined);
    showToast(`Copied entire LaTeX project code (${files.length} files) to clipboard!`);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        handleDownloadPdf();
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleQuickSaveSnapshot();
      }
      if (e.key === 'Escape') {
        setIsEquationModalOpen(false);
        setIsSettingsModalOpen(false);
        setIsSnapshotModalOpen(false);
        setIsUploadModalOpen(false);
        setIsWordCountModalOpen(false);
        setPdfError(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, zoom, files, metadata]);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col selection:bg-blue-200">
      {/* Top Navigation */}
      <HeaderBar
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
        zoom={zoom}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onZoomReset={handleZoomReset}
        onOpenEquationGallery={() => setIsEquationModalOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onOpenSnapshots={() => setIsSnapshotModalOpen(true)}
        onOpenUploadModal={() => setIsUploadModalOpen(true)}
        onOpenWordCount={() => setIsWordCountModalOpen(true)}
        totalWordCount={wordCountSummary.totalWords}
        snapshotCount={snapshots.length}
        onDownloadPdf={handleDownloadPdf}
        onDownloadWord={handleDownloadWord}
        onPrintPdf={handlePrintPdf}
        onExportCode={handleExportCode}
        onCopyAllCode={handleCopyAllCode}
        onLoadTemplate={handleLoadTemplate}
        onNewBlankDoc={files.length > 0 ? handleResetToBlank : handleCreateBlankFile}
        hasFiles={files.length > 0}
        isGeneratingPdf={isGeneratingPdf}
        isGeneratingWord={isGeneratingWord}
        pdfProgressText={pdfProgress ? `Page ${pdfProgress.currentPage}/${pdfProgress.totalPages}` : undefined}
      />

      {/* Non-print Info Banner */}
      <div className="no-print bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 text-white px-4 py-2 text-xs border-b border-blue-950 flex flex-wrap items-center justify-between gap-2 shadow-xs">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          {files.length > 0 ? (
            <span>
              <strong>{metadata.title || 'Active LaTeX Document'}:</strong> Live KaTeX math preview, word count scanner, and PDF / Word export.
            </span>
          ) : (
            <span>
              <strong>Blank LaTeX Page:</strong> No file provided yet. Upload your LaTeX .zip archive, paste code, or start typing.
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 text-slate-300">
          {files.length === 0 && (
            <button
              onClick={handleLoadTemplate}
              className="text-amber-300 hover:text-amber-200 flex items-center gap-1 cursor-pointer font-semibold underline underline-offset-2"
              title="Load the Sister Nivedita University Thesis Template"
            >
              <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
              <span>Load Sample Template</span>
            </button>
          )}
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="text-amber-300 hover:text-amber-200 flex items-center gap-1 cursor-pointer font-semibold underline underline-offset-2"
            title="Upload LaTeX .zip archive or paste code"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Upload ZIP / Code</span>
          </button>
          <span className="text-slate-600">•</span>
          <button
            onClick={() => setIsWordCountModalOpen(true)}
            className="text-indigo-300 hover:text-indigo-200 flex items-center gap-1 cursor-pointer font-medium font-mono"
            title="Scan prose word count across all .tex files"
          >
            <AlignLeft className="w-3.5 h-3.5 text-indigo-400" />
            <span>{wordCountSummary.totalWords.toLocaleString()} words</span>
          </button>
          <span className="text-slate-600">•</span>
          <button
            onClick={() => setIsSnapshotModalOpen(true)}
            className="text-indigo-300 hover:text-indigo-200 flex items-center gap-1 cursor-pointer font-medium"
            title="Open local snapshots manager"
          >
            <History className="w-3.5 h-3.5" />
            <span>Snapshots ({snapshots.length})</span>
          </button>
          <span className="text-slate-600">•</span>
          <button
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="text-emerald-300 hover:text-emerald-200 font-bold underline underline-offset-2 flex items-center gap-1 cursor-pointer disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .PDF</span>
          </button>
          <span className="text-slate-600">•</span>
          <button
            onClick={handleDownloadWord}
            disabled={isGeneratingWord}
            className="text-blue-300 hover:text-blue-200 font-bold underline underline-offset-2 flex items-center gap-1 cursor-pointer disabled:opacity-50"
            title="Download Word (.docx) document"
          >
            <span>Download .DOCX</span>
          </button>
          <span className="text-slate-600">•</span>
          <button
            onClick={handlePrintPdf}
            className="text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer"
          >
            <Printer className="w-3 h-3 text-slate-400" />
            <span>Print Dialog</span>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toastNotification && (
        <div className="no-print fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-xl border border-slate-700 flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-bottom-2 duration-200">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastNotification}</span>
        </div>
      )}

      {/* Error alert if any */}
      {pdfError && (
        <div className="no-print bg-rose-50 border-b border-rose-200 px-4 py-2 text-xs text-rose-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span><strong>PDF Export Error:</strong> {pdfError}</span>
          </div>
          <button
            onClick={() => setPdfError(null)}
            className="text-rose-600 hover:text-rose-900 font-bold px-2 py-0.5 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Workspace Area */}
      <main className="flex-1 flex overflow-hidden">
        {/* Full PDF Mode */}
        {viewMode === 'pdf' && (
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 flex justify-center">
            <PdfDocumentViewer
              ref={pdfContainerRef}
              files={files}
              metadata={metadata}
              bibliography={bibliography}
              zoom={zoom}
              onUploadClick={() => setIsUploadModalOpen(true)}
              onCreateBlank={handleCreateBlankFile}
              onLoadTemplate={handleLoadTemplate}
            />
          </div>
        )}

        {/* Split Mode: Code on Left, PDF on Right */}
        {viewMode === 'split' && (
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden p-3 gap-3">
            {/* Left Column: Code Editor */}
            <div className="lg:w-1/2 h-[45vh] lg:h-auto flex flex-col">
              <CodeEditor
                files={files}
                activeFilePath={activeFilePath}
                onSelectFile={setActiveFilePath}
                onUpdateFileContent={handleUpdateFileContent}
                onResetToDefault={handleResetToDefault}
                onUpdateAllFiles={setFiles}
                onCreateBlankFile={handleCreateBlankFile}
                onUploadClick={() => setIsUploadModalOpen(true)}
                onLoadTemplate={handleLoadTemplate}
              />
            </div>

            {/* Right Column: Live PDF Document */}
            <div className="lg:w-1/2 h-[55vh] lg:h-auto overflow-y-auto bg-slate-200/80 rounded-lg p-4 border border-slate-300 shadow-inner flex justify-center">
              <PdfDocumentViewer
                ref={pdfContainerRef}
                files={files}
                metadata={metadata}
                bibliography={bibliography}
                zoom={Math.min(zoom, 0.85)}
                onUploadClick={() => setIsUploadModalOpen(true)}
                onCreateBlank={handleCreateBlankFile}
                onLoadTemplate={handleLoadTemplate}
              />
            </div>
          </div>
        )}

        {/* Full Code Mode */}
        {viewMode === 'code' && (
          <div className="flex-1 p-3 flex flex-col">
            <CodeEditor
              files={files}
              activeFilePath={activeFilePath}
              onSelectFile={setActiveFilePath}
              onUpdateFileContent={handleUpdateFileContent}
              onResetToDefault={handleResetToDefault}
              onUpdateAllFiles={setFiles}
              onCreateBlankFile={handleCreateBlankFile}
              onUploadClick={() => setIsUploadModalOpen(true)}
              onLoadTemplate={handleLoadTemplate}
            />
          </div>
        )}
      </main>

      {/* PDF Generation Progress Modal */}
      {isGeneratingPdf && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 p-6 max-w-md w-full text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
              <Loader2 className="w-7 h-7 animate-spin" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">
                Generating Clean A4 PDF Document
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {pdfProgress?.status || 'Processing LaTeX layout and KaTeX mathematics...'}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-emerald-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${pdfProgress?.percentage || 10}%` }}
              ></div>
            </div>

            <div className="flex justify-between text-xs text-slate-500 font-mono">
              <span>Page {pdfProgress?.currentPage || 0} of {pdfProgress?.totalPages || 12}</span>
              <span>{pdfProgress?.percentage || 0}%</span>
            </div>

            <p className="text-[11px] text-slate-400 font-serif italic">
              Your browser will automatically download the compiled .pdf file upon completion.
            </p>
          </div>
        </div>
      )}

      {/* Upload ZIP / Code Modal Window */}
      <UploadProjectModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onImportZipResult={handleImportZipResult}
        onImportCode={handleImportCode}
        activeFileName={activeFilePath}
      />

      {/* Interactive Equation Sandbox Modal */}
      <EquationGalleryModal
        isOpen={isEquationModalOpen}
        onClose={() => setIsEquationModalOpen(false)}
      />

      {/* Project Metadata Quick Edit Modal */}
      <QuickSettingsModal
        isOpen={isSettingsModalOpen}
        metadata={metadata}
        onClose={() => setIsSettingsModalOpen(false)}
        onSave={handleSaveMetadata}
      />

      {/* IndexedDB Snapshot Manager Modal */}
      <SnapshotManagerModal
        isOpen={isSnapshotModalOpen}
        onClose={() => setIsSnapshotModalOpen(false)}
        snapshots={snapshots}
        currentFiles={files}
        currentMetadata={metadata}
        onSaveSnapshot={handleSaveSnapshot}
        onRestoreSnapshot={handleRestoreSnapshot}
        onDeleteSnapshot={handleDeleteSnapshot}
      />

      {/* Word Count Breakdown Modal */}
      <WordCountModal
        isOpen={isWordCountModalOpen}
        onClose={() => setIsWordCountModalOpen(false)}
        summary={wordCountSummary}
        onSelectFile={(path) => {
          setActiveFilePath(path);
          setViewMode('split');
        }}
      />
    </div>
  );
};

export default App;
