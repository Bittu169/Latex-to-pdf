import React, { useState } from 'react';
import { MathRenderer } from './MathRenderer';
import { X, Copy, Check, Sparkles, Terminal } from 'lucide-react';

interface EquationGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertEquation?: (latex: string) => void;
}

interface ExampleEquation {
  title: string;
  category: string;
  latex: string;
  description: string;
}

const EQUATION_EXAMPLES: ExampleEquation[] = [
  {
    title: "Kinematic Equation of Motion",
    category: "Kinematics",
    latex: "s = ut + \\frac{1}{2}ft^2",
    description: "Sample from code-help.tex (line 128) for displacement under uniform acceleration."
  },
  {
    title: "Piecewise Decision Boundary Function",
    category: "Functions",
    latex: "f(x) = \\begin{cases} x^2, & x \\ge 0, \\\\ -x, & x < 0. \\end{cases}",
    description: "Piecewise cases function used for stroke boundary classification."
  },
  {
    title: "Multiline Definite Integral with Bounds",
    category: "Calculus",
    latex: "\\begin{aligned} F(x) &= \\int_0^x (at^2 + bt + c) \\, dt \\\\ &= \\left[\\frac{a}{3}t^3 + \\frac{b}{2}t^2 + ct\\right]_{0}^{x} \\\\ &= \\frac{a}{3}x^3 + \\frac{b}{2}x^2 + cx \\end{aligned}",
    description: "Aligned multiline calculus derivation from code-help.tex (line 155)."
  },
  {
    title: "2D Gaussian Smoothing Kernel",
    category: "Spatial Filtering",
    latex: "G(x, y) = \\frac{1}{2\\pi\\sigma^2} e^{-\\frac{(x^2 + y^2)}{2\\sigma^2}}",
    description: "2D Gaussian kernel used for fingertip motion smoothing."
  },
  {
    title: "Asymptotic Complexity (Big Theta)",
    category: "Algorithms",
    latex: "A(n) \\in \\Theta(n^{\\log_b a}) = \\Theta(n^{\\log_2 2}) = \\Theta(n)",
    description: "Computational complexity analysis using Master Theorem."
  },
  {
    title: "Ceiling and Floor Bounds",
    category: "Arithmetic",
    latex: "\\left\\lfloor \\frac{x}{2} \\right\\rfloor \\le \\frac{x}{2} \\le \\left\\lceil \\frac{x}{2} \\right\\rceil, \\quad \\left\\lceil \\log_2 M \\right\\rceil = m",
    description: "Floor, ceiling, and logarithmic bounding conditions."
  },
  {
    title: "3x3 Convolution & Weight Matrices",
    category: "Linear Algebra",
    latex: "X = \\begin{bmatrix} 10 & 20 & 30 \\\\ 40 & 50 & 60 \\\\ 70 & 80 & 90 \\end{bmatrix}, \\quad Y = \\begin{bmatrix} -1 & 0 & 1 \\\\ -1 & 0 & 1 \\\\ -1 & 0 & 1 \\end{bmatrix}",
    description: "Matrix definitions from code-help.tex (lines 264-280)."
  },
  {
    title: "Summation, Products, and Surface Integrals",
    category: "Calculus",
    latex: "\\sum_{i=1}^n i^2, \\quad \\prod_{k=1}^m k, \\quad \\iint_D f(x,y) \\, dA, \\quad \\oint_C \\vec{F} \\cdot d\\vec{r}",
    description: "Series sums, products, and vector line integrals."
  },
  {
    title: "Trigonometric Limit",
    category: "Limits",
    latex: "\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1",
    description: "Standard fundamental limit identity."
  },
  {
    title: "Logic, Sets, and Quantifiers",
    category: "Discrete Math",
    latex: "a \\pm b, \\times, \\div, \\cdot, \\approx, \\le, \\ge, \\quad \\in, \\notin, \\subseteq, \\cup, \\cap, \\emptyset, \\quad \\land, \\lor, \\lnot, \\Rightarrow, \\Leftrightarrow, \\quad \\forall, \\exists, \\infty, \\nabla",
    description: "Mathematical symbols from code-help.tex (lines 211-220)."
  }
];

export const EquationGalleryModal: React.FC<EquationGalleryModalProps> = ({
  isOpen,
  onClose
}) => {
  const [customEquation, setCustomEquation] = useState<string>("\\int_{-\\infty}^{\\infty} e^{-x^2} \\, dx = \\sqrt{\\pi}");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (latex: string, id: string) => {
    navigator.clipboard.writeText(latex);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Mathematical Equation Gallery &amp; KaTeX Sandbox
              </h2>
              <p className="text-xs text-slate-500">
                Explore all mathematical equations from the template and test custom LaTeX equations with instant rendering.
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
          {/* Live KaTeX Sandbox */}
          <div className="bg-slate-900 text-white rounded-xl p-4 border border-slate-800 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                <Terminal className="w-4 h-4" />
                <span>Interactive Live Equation Tester</span>
              </div>
              <button
                onClick={() => handleCopy(customEquation, 'sandbox')}
                className="text-xs flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200"
              >
                {copiedId === 'sandbox' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === 'sandbox' ? 'Copied' : 'Copy LaTeX'}</span>
              </button>
            </div>

            <textarea
              value={customEquation}
              onChange={(e) => setCustomEquation(e.target.value)}
              placeholder="Type LaTeX math (e.g. \frac{a}{b}, \sum_{i=1}^n x_i, etc.)..."
              className="w-full bg-slate-950 font-mono text-sm text-amber-200 p-3 rounded-lg border border-slate-800 focus:outline-hidden focus:border-blue-500 mb-3 resize-none h-20"
            />

            {/* Rendered Preview Card */}
            <div className="bg-white text-slate-900 p-4 rounded-lg border border-slate-300 min-h-[64px] flex items-center justify-center">
              <MathRenderer math={customEquation} displayMode={true} />
            </div>
          </div>

          {/* Preset Template Equations List */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
              Equations Extracted from Template (code-help.tex)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {EQUATION_EXAMPLES.map((item, idx) => (
                <div
                  key={idx}
                  className="border border-slate-200 rounded-lg p-4 bg-slate-50/50 hover:bg-white hover:border-blue-300 transition-all shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-slate-800">{item.title}</span>
                      <span className="text-[10px] uppercase font-semibold tracking-wide bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                        {item.category}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 mb-3 font-serif">
                      {item.description}
                    </p>

                    <div className="bg-white p-3 rounded border border-slate-200 text-center overflow-x-auto min-h-[56px] flex items-center justify-center">
                      <MathRenderer math={item.latex} displayMode={true} />
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between">
                    <code className="text-[11px] font-mono text-slate-600 truncate max-w-[200px]">
                      {item.latex}
                    </code>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setCustomEquation(item.latex)}
                        className="text-xs text-blue-600 hover:text-blue-800 hover:underline px-2 py-1"
                      >
                        Try in Sandbox
                      </button>
                      <button
                        onClick={() => handleCopy(item.latex, `eq-${idx}`)}
                        className="text-xs flex items-center gap-1 px-2 py-1 rounded bg-slate-200 hover:bg-slate-300 text-slate-700"
                        title="Copy LaTeX"
                      >
                        {copiedId === `eq-${idx}` ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        <span>{copiedId === `eq-${idx}` ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
