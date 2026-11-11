import React, { useState, useRef } from 'react';
import { parseLatexZip, ParsedZipResult } from '../utils/zipParser';
import { ProjectFile, ProjectMetadata } from '../types/latex';
import {
  UploadCloud,
  FileArchive,
  FileCode,
  X,
  Check,
  Loader2,
  AlertCircle,
  FileText,
  Sparkles,
  ArrowRight,
  Plus
} from 'lucide-react';

interface UploadProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportZipResult: (result: ParsedZipResult) => void;
  onImportCode: (fileName: string, code: string, isMaster: boolean) => void;
  activeFileName: string;
}

const SAMPLE_MATH_PAPER = `\\documentclass[a4paper,12pt]{article}
\\usepackage{amsmath,amssymb,graphicx}

\\title{Mathematical Modeling of Touchless Gesture Kinematics}
\\author{Research Group in Applied Computing}
\\date{\\today}

\\begin{document}
\\maketitle

\\begin{abstract}
This paper presents the mathematical formulation for trajectory estimation under kinematic constraints and Gaussian spatial filters.
\\end{abstract}

\\section{Kinematic Trajectory Formulation}
The position vector $\\mathbf{r}(t)$ under constant acceleration $\\mathbf{a}$ satisfies:
\\begin{equation}
\\mathbf{r}(t) = \\mathbf{r}_0 + \\mathbf{v}_0 t + \\frac{1}{2} \\mathbf{a} t^2
\\end{equation}

The energy dissipation is governed by the line integral:
\\begin{equation}
E = \\int_{C} \\mathbf{F} \\cdot d\\mathbf{r} = \\int_{t_0}^{t_1} m \\mathbf{a}(t) \\cdot \\mathbf{v}(t) \\, dt
\\end{equation}

\\section{Piecewise Filtering}
\\[
f(x) = \\begin{cases}
  x^2, & x \\ge 0 \\\\
  -x,  & x < 0
\\end{cases}
\\]

\\end{document}`;

export const UploadProjectModal: React.FC<UploadProjectModalProps> = ({
  isOpen,
  onClose,
  onImportZipResult,
  onImportCode,
  activeFileName
}) => {
  const [activeTab, setActiveTab] = useState<'zip' | 'code'>('zip');

  // ZIP Tab State
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [isParsingZip, setIsParsingZip] = useState<boolean>(false);
  const [parsedZip, setParsedZip] = useState<ParsedZipResult | null>(null);
  const [zipError, setZipError] = useState<string | null>(null);

  // Code Tab State
  const [pastedCode, setPastedCode] = useState<string>('');
  const [targetFileName, setTargetFileName] = useState<string>('custom-document.tex');
  const [isMasterDoc, setIsMasterDoc] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const texFileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle ZIP selection
  const handleZipSelected = async (file: File) => {
    setZipFile(file);
    setZipError(null);
    setIsParsingZip(true);
    try {
      const result = await parseLatexZip(file);
      if (result.files.length === 0 && Object.keys(result.imageMap).length === 0) {
        throw new Error('No .tex or .bib files were found inside this zip archive.');
      }
      setParsedZip(result);
    } catch (err) {
      console.error('ZIP extraction failed:', err);
      const errMsg = err instanceof Error ? err.message : 'Failed to extract ZIP archive';
      setZipError(errMsg);
      setParsedZip(null);
    } finally {
      setIsParsingZip(false);
    }
  };

  const handleApplyZip = () => {
    if (!parsedZip) return;
    onImportZipResult(parsedZip);
    onClose();
  };

  // Handle single .tex file upload
  const handleTexFileSelected = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = (e.target?.result as string) || '';
      setPastedCode(text);
      setTargetFileName(file.name);
      if (text.includes('\\documentclass') && text.includes('\\begin{document}')) {
        setIsMasterDoc(true);
      }
    };
    reader.readAsText(file);
  };

  const handleApplyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pastedCode.trim()) return;
    onImportCode(targetFileName.trim() || 'imported-code.tex', pastedCode, isMasterDoc);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Upload LaTeX Project / Source Code
              </h2>
              <p className="text-xs text-slate-500">
                Upload a LaTeX .zip template or paste custom TeX code to instantly compile into a clean PDF.
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

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-100 px-6 pt-2 gap-2">
          <button
            onClick={() => setActiveTab('zip')}
            className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'zip'
                ? 'bg-white text-blue-700 border-t-2 border-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileArchive className="w-3.5 h-3.5" />
            <span>Upload LaTeX .ZIP Archive</span>
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'code'
                ? 'bg-white text-blue-700 border-t-2 border-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Paste / Upload .TEX Code</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* TAB 1: ZIP UPLOAD */}
          {activeTab === 'zip' && (
            <div className="space-y-5">
              {/* Dropzone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files?.[0]) {
                    handleZipSelected(e.dataTransfer.files[0]);
                  }
                }}
                className="border-2 border-dashed border-blue-300 hover:border-blue-500 rounded-xl p-8 text-center bg-blue-50/40 hover:bg-blue-50/70 transition-all cursor-pointer space-y-3"
              >
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto text-blue-600 shadow-sm border border-blue-100">
                  {isParsingZip ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <FileArchive className="w-6 h-6" />
                  )}
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-800">
                    {zipFile ? zipFile.name : 'Click to select or drop LaTeX .zip archive here'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Extracts all .tex chapters, .bib bibliographies, and figure images (.png, .jpg)
                  </p>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".zip"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleZipSelected(e.target.files[0]);
                    }
                  }}
                />
              </div>

              {/* Error Alert */}
              {zipError && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{zipError}</span>
                </div>
              )}

              {/* Parsed Summary Card */}
              {parsedZip && (
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Extracted Project Manifest
                    </span>
                    <span className="text-[11px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold">
                      {parsedZip.files.length} TeX files • {Object.keys(parsedZip.imageMap).length} images
                    </span>
                  </div>

                  <div className="max-h-36 overflow-y-auto space-y-1.5 font-mono text-xs">
                    {parsedZip.files.map((file, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between bg-white px-3 py-1.5 rounded border border-slate-200"
                      >
                        <span className="text-slate-800 truncate">{file.path}</span>
                        <span className="text-[10px] text-slate-500 uppercase">{file.category}</span>
                      </div>
                    ))}
                  </div>

                  {parsedZip.metadata.title && (
                    <p className="text-xs text-slate-700 italic border-t pt-2">
                      Detected Title: <strong className="font-semibold text-slate-900">{parsedZip.metadata.title}</strong>
                    </p>
                  )}

                  <button
                    onClick={handleApplyZip}
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-md shadow-emerald-900/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Load Extracted Project &amp; Compile to PDF</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CODE PASTE OR .TEX UPLOAD */}
          {activeTab === 'code' && (
            <form onSubmit={handleApplyCode} className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Target File Name:
                  </label>
                  <input
                    type="text"
                    value={targetFileName}
                    onChange={(e) => setTargetFileName(e.target.value)}
                    className="border border-slate-300 rounded px-2 py-1 text-xs font-mono w-48"
                    placeholder="my-document.tex"
                    required
                  />
                </div>

                {/* Upload single .tex button */}
                <div>
                  <button
                    type="button"
                    onClick={() => texFileInputRef.current?.click()}
                    className="text-xs text-blue-600 hover:text-blue-800 font-semibold underline flex items-center gap-1 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Upload .tex file</span>
                  </button>
                  <input
                    ref={texFileInputRef}
                    type="file"
                    accept=".tex,.bib,.txt"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleTexFileSelected(e.target.files[0]);
                      }
                    }}
                  />
                </div>
              </div>

              {/* Textarea */}
              <div className="relative">
                <textarea
                  value={pastedCode}
                  onChange={(e) => setPastedCode(e.target.value)}
                  placeholder="Paste complete LaTeX code here (\documentclass, \begin{document}, equations, etc.)..."
                  className="w-full h-56 font-mono text-xs bg-slate-900 text-amber-100 p-3 rounded-lg border border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500 resize-none selection:bg-blue-600/50 code-editor-scroll overflow-x-auto whitespace-pre"
                  required
                />

                {/* Sample Template Quick Loader */}
                <button
                  type="button"
                  onClick={() => {
                    setPastedCode(SAMPLE_MATH_PAPER);
                    setTargetFileName('Kinematic_Paper.tex');
                    setIsMasterDoc(true);
                  }}
                  className="absolute bottom-3 right-3 text-[11px] bg-slate-800 hover:bg-slate-700 text-amber-300 px-2.5 py-1 rounded border border-slate-600 flex items-center gap-1 cursor-pointer shadow-sm"
                >
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Insert Sample Math Paper</span>
                </button>
              </div>

              {/* Master Document Switch */}
              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isMasterDoc}
                  onChange={(e) => setIsMasterDoc(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Set as current Master Document (triggers full recompile into PDF view)</span>
              </label>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow-md shadow-blue-900/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Compile Code &amp; Update PDF Document</span>
                <Check className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-between items-center text-xs text-slate-500">
          <span>Supported: .zip archives, .tex files, .bib bibliographies, .png / .jpg images</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
