# LaTeX Thesis & Academic Report to PDF/DOCX Studio

[![Vite](https://img.shields.io/badge/Vite-6.0+-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.3+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![KaTeX](https://img.shields.io/badge/KaTeX-Math_Engine-329894?style=for-the-badge&logo=latex&logoColor=white)](https://katex.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

> **A high-fidelity client-side web application and compiler that transforms complex multi-file LaTeX academic thesis templates and dissertations into publication-ready A4 PDF documents and Microsoft Word (`.docx`) files with zero local TeX distribution dependencies.**

Originally engineered to parse, format, and render the **Sister Nivedita University (SNU) Autumn 2026 Academic Dissertation Template** (`scrbook` standard), this studio provides an end-to-end authoring and compilation suite directly inside any modern web browser.

---

##  Key Features & Architecture

### 1.  Pixel-Perfect Academic A4 PDF Compilation
- **Client-Side Generation (`html2canvas-pro` + `jsPDF`)**: Bypasses browser print sandbox limitations to compile all document pages directly into an authentic A4 PDF file (`210mm × 297mm`) at high resolution ($2\times$ retina / 300 DPI equivalent).
- **Universal Color Gamut Protection**: Uses `html2canvas-pro` paired with an automated DOM clone color sanitizer to guarantee that modern Tailwind CSS v4 color formats (e.g. `oklch(...)`, `lab(...)`) never trigger parsing exceptions during PDF rasterization.
- **Academic Page Geometry**: Adheres strictly to university dissertation guidelines with exact 1-inch ($25.4\text{ mm}$) margins, running `fancyhdr` chapter headers with separation rules, and dynamic footers (`Sister Nivedita University, WB | Page | N`).
- **Physical Print CSS (`@media print`)**: Zero-margin `@page` styling ensures that pressing `Ctrl+P` / `Cmd+P` outputs vector-sharp typography and diagrams with zero page overflow.

### 2.  Direct Microsoft Word (`.docx`) Equivalent Export
- **One-Click Word Export (`docx`)**: Programmatically creates an equivalent `.docx` file matching the academic dissertation structure.
- **Included Word Layout**:
  - Full Cover & Title Pages with student roster and supervisor sign-offs.
  - Formal student Declaration and supervisor Certificate attestations.
  - Acknowledgements and Abstract sections.
  - Heading 1/Heading 2 hierarchies across all 6 chapters.
  - Clean typographic equations for kinematic motion, piecewise boundaries, and integrals.
  - Formatted tables with cell borders for experimental benchmarks (Tables 5.1 & 5.2).
  - Numbered algorithm callout blocks and IEEE/ACM formatted bibliography citations.

### 3.  Complex Mathematical Equation Rendering (`KaTeX`)
- Renders advanced mathematical notations without formatting glitches:
  - **Kinematics of Motion**: $s = ut + \frac{1}{2}ft^2$
  - **Piecewise Decision Functions**:
    $$f(x) = \begin{cases} x^2, & x \ge 0 \\ -x, & x < 0 \end{cases}$$
  - **Calculus & Multiline Definite Integrals**:
    $$F(x) = \int_0^x (at^2 + bt + c) \, dt = \left[\frac{a}{3}t^3 + \frac{b}{2}t^2 + ct\right]_0^x = \frac{a}{3}x^3 + \frac{b}{2}x^2 + cx$$
  - **2D Gaussian Spatial Filtering**:
    $$G(x, y) = \frac{1}{2\pi\sigma^2} e^{-\frac{x^2+y^2}{2\sigma^2}}$$
  - **Discrete Convolution Matrices**: $3 \times 3$ bracketed kernel matrices $X$ and $Y$.
  - **Asymptotic Complexity**: $A(n) \in \Theta(n^{\log_b a}) = \Theta(n)$.
  - **Floor & Ceiling Operators**: $\lfloor \frac{x}{2} \rfloor \le \frac{x}{2} \le \lceil \frac{x}{2} \rceil$ and $\lceil \log_2 M \rceil = m$.

### 4.  LaTeX `.zip` Archive & Source Code Uploader
- **Client-Side ZIP Extraction (`JSZip`)**: Drag-and-drop or upload any LaTeX `.zip` project.
- **Asset Parsing**: Automatically parses `.tex` files, `.bib` bibliographies, and embedded figure assets (`.png`, `.jpg`, `.jpeg`, `.svg`), converting images into Data URLs for instant preview.
- **Auto-Discovery**: Identifies master documents (`\documentclass` + `\begin{document}`) and extracts project metadata (title, program, supervisor, authors).
- **Direct Code Ingestion**: Paste raw LaTeX code or upload single `.tex` files with optional sample paper presets.

### 5.  Offline-First Local Revision History (`IndexedDB`)
- **Browser-Native Database (`LaTeXStudioDB`)**: Checkpoint your document state at any point in time without needing external accounts or servers.
- **One-Click Revert**: Restore any previous snapshot with instant updates across the code editor, metadata, and live PDF viewer.
- **Pre-Seeded Baseline**: Automatically preserves the untouched "Original Template Baseline" so you can experiment freely and revert to factory state with zero data loss.
- **Quick Checkpoints**: Press `Ctrl+S` (or `Cmd+S`) to capture an instant snapshot.

### 6.  Academic Prose Word Count Engine
- **TeXcount-Style Parsing**: Excludes LaTeX directives, preamble commands (`\documentclass`, `\usepackage`, `\setlength`), inline/block comments (`%`), and formulas to calculate the actual narrative word count.
- **Live Metrics**: Total words, character count (without whitespace), and reading time estimation.
- **Per-File Breakdown Modal**: Displays word counts and distribution percentages across each `.tex` chapter.
- **Editor Subheader**: Shows real-time line and word count for the file currently open in the editor.

### 7.  Interactive Multi-File Editor & Formula Sandbox
- **Tri-Mode View**: Seamlessly switch between **Full PDF Document**, **Split View** (side-by-side LaTeX editor and live PDF preview), and **Full LaTeX Code**.
- **Project Details Customizer**: Update student names, registration numbers, emails, supervisor designation, and project titles in a clean GUI modal that syncs across all TeX files.
- **Formula Sandbox**: Dedicated scratchpad to test, preview, and copy LaTeX math formulas with real-time KaTeX validation.

---

## 📂 Project Structure

```
├── public/
│   ├── bibtext/
│   │   ├── snu_logo.jpg         # Official University Seal
│   │   └── snu-logo.png         # Secondary Logo Asset
│   └── figure/
│       └── Image Classification Using Neural Networks.png  # System Diagram
├── src/
│   ├── components/
│   │   ├── CodeEditor.tsx           # Multi-tab LaTeX code editor with live line/word metrics
│   │   ├── EquationGalleryModal.tsx # Interactive KaTeX math sandbox
│   │   ├── HeaderBar.tsx            # Global navigation, view modes, and export actions
│   │   ├── MathRenderer.tsx         # KaTeX wrapper with error boundary
│   │   ├── PdfDocumentViewer.tsx    # A4 LaTeX document layout (Chapters 1-6, Frontmatter)
│   │   ├── QuickSettingsModal.tsx   # Project details and metadata configurator
│   │   ├── SnapshotManagerModal.tsx # IndexedDB snapshot history and revert interface
│   │   ├── UploadProjectModal.tsx   # ZIP archive and raw TeX uploader
│   │   └── WordCountModal.tsx       # Per-chapter word count analytics modal
│   ├── data/
│   │   └── initialProject.ts        # Parsed TeX files from Student Project Template
│   ├── types/
│   │   └── latex.ts                 # TypeScript interfaces for files, metadata, and bib items
│   ├── utils/
│   │   ├── docxGenerator.ts         # Microsoft Word (.docx) document compiler
│   │   ├── indexedDBStorage.ts      # IndexedDB persistence layer (LaTeXStudioDB)
│   │   ├── latexParser.ts           # TeX text, macro, and BibTeX parser
│   │   ├── pdfGenerator.ts          # High-resolution PDF builder (html2canvas-pro + jsPDF)
│   │   ├── wordCounter.ts           # Academic LaTeX narrative word counting engine
│   │   └── zipParser.ts             # JSZip client-side archive parser
│   ├── App.tsx                      # Main workspace controller
│   ├── index.css                    # Tailwind CSS v4 and A4 academic print stylesheet
│   └── main.tsx                     # React application entry point
├── package.json
├── tsconfig.json
└── vite.config.ts                   # Rollup code-splitting chunks (katex, pdf, zip)
```

---

## 🛠️ Technology Stack

| Domain | Technology / Library | Purpose |
|---|---|---|
| **Core Framework** | React 18 + TypeScript | Component hierarchy and strict type safety |
| **Build Tooling** | Vite 6 + `@tailwindcss/vite` | Fast HMR dev server and optimized Rollup production bundler |
| **Styling** | Tailwind CSS v4 | Utility-first styling with custom academic serif typography |
| **Math Typesetting** | KaTeX 0.16 | Fast client-side mathematical equation renderer |
| **PDF Engine** | `html2canvas-pro` + `jsPDF` | High-DPI A4 PDF rasterization with `oklch` support |
| **Word Export** | `docx` 9.15 | Client-side Microsoft Word (`.docx`) file generation |
| **ZIP Extraction** | `JSZip` 3.10 | Client-side `.zip` archive parsing and image Data URL conversion |
| **Local Storage** | Browser IndexedDB API | Persistent offline project snapshots and revision history |
| **Icons** | Lucide React | Clean, scalable SVG iconography |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **Package Manager**: `npm` (or `yarn` / `pnpm`)

### Installation & Local Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/latex-thesis-to-pdf-studio.git
   cd latex-thesis-to-pdf-studio
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3000` to access the application.

4. **Verify types & syntax**:
   ```bash
   npm run lint
   ```

5. **Build for production**:
   ```bash
   npm run build
   ```
   The production-ready artifacts will be compiled into the `dist/` directory with vendor code splitting.

6. **Preview production build**:
   ```bash
   npm run preview
   ```

---

## 📄 Academic Attribution & Document Outline

The default template represents a complete Bachelor of Technology / Master of Technology dissertation at **Sister Nivedita University, West Bengal**:

- **Frontmatter**:
  - University Cover Page with official seal
  - Title Page with student registration & guide credentials
  - Formal Student Declaration & Supervisor Certificate
  - Acknowledgements & Abstract
  - Table of Contents, List of Figures, and List of Tables
- **Chapters**:
  - **Chapter 1**: Introduction, Research Objectives, Project Contributions, Organization
  - **Chapter 2**: Literature Review with 10 IEEE/ACM citations
  - **Chapter 3**: Problem Identification & Scientific Challenges
  - **Chapter 4**: Proposed Methodology, Kinematic Equations, Gaussian Filters, Neural Network Architecture Diagram, and Algorithm 4.1
  - **Chapter 5**: Empirical Results & Hardware Benchmark Comparisons (Tables 5.1 & 5.2)
  - **Chapter 6**: Conclusion and Future Research Directions
  - **Bibliography**: Complete references list compiled from `references.bib`

---

## ⚖️ License

Distributed under the **MIT License**. See `LICENSE` for more information.