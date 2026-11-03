import { ProjectFile } from '../types/latex';

export interface FileWordCount {
  path: string;
  name: string;
  words: number;
  characters: number;
}

export interface ProjectWordCountSummary {
  totalWords: number;
  totalCharacters: number;
  readingTimeMinutes: number;
  fileCount: number;
  perFile: FileWordCount[];
}

/**
 * Strips LaTeX syntax, macros, and comments to accurately count narrative words.
 * Modeled after academic tools like TeXcount.
 */
export function countLatexWords(texContent: string): { words: number; characters: number } {
  if (!texContent || !texContent.trim()) {
    return { words: 0, characters: 0 };
  }

  // 1. Remove comments (from unescaped % to end of line)
  const lines = texContent.split('\n');
  const uncommentedLines = lines.map(line => {
    let inEscaped = false;
    for (let i = 0; i < line.length; i++) {
      if (line[i] === '\\') {
        inEscaped = !inEscaped;
      } else if (line[i] === '%' && !inEscaped) {
        return line.substring(0, i);
      } else {
        inEscaped = false;
      }
    }
    return line;
  });
  let cleanText = uncommentedLines.join('\n');

  // 2. Remove non-content structural preamble commands
  cleanText = cleanText
    .replace(/\\documentclass(\[[^\]]*\])?\{[^}]*\}/g, ' ')
    .replace(/\\usepackage(\[[^\]]*\])?\{[^}]*\}/g, ' ')
    .replace(/\\addbibresource\{[^}]*\}/g, ' ')
    .replace(/\\geometry\{[^}]*\}/g, ' ')
    .replace(/\\graphicspath\{[^}]*\}/g, ' ')
    .replace(/\\setlength\{[^}]*\}\{[^}]*\}/g, ' ')
    .replace(/\\renewcommand\{[^}]*\}\{[^}]*\}/g, ' ')
    .replace(/\\newcommand\{[^}]*\}\[[^\]]*\]\{[^}]*\}/g, ' ')
    .replace(/\\newcommand\{[^}]*\}\{[^}]*\}/g, ' ')
    .replace(/\\hypersetup\{[^}]*\}/g, ' ')
    .replace(/\\pagestyle\{[^}]*\}/g, ' ')
    .replace(/\\fancy[a-z]*(\[[^\]]*\])?\{[^}]*\}/g, ' ')
    .replace(/\\label\{[^}]*\}/g, ' ')
    .replace(/\\ref\{[^}]*\}/g, ' ')
    .replace(/\\cite\{[^}]*\}/g, ' ');

  // 3. Remove block math environments (they are formulas, not prose words)
  cleanText = cleanText
    .replace(/\\\[[\s\S]*?\\\]/g, ' ')
    .replace(/\\begin\{equation\*?\}[\s\S]*?\\end\{equation\*?\}/g, ' ')
    .replace(/\\begin\{align\*?\}[\s\S]*?\\end\{align\*?\}/g, ' ')
    .replace(/\\begin\{cases\*?\}[\s\S]*?\\end\{cases\*?\}/g, ' ')
    .replace(/\\begin\{matrix\}[\s\S]*?\\end\{matrix\}/g, ' ')
    .replace(/\\begin\{bmatrix\}[\s\S]*?\\end\{bmatrix\}/g, ' ')
    .replace(/\$\$[\s\S]*?\$\$/g, ' ')
    .replace(/\$[^$]*?\$/g, ' ');

  // 4. Extract content from text formatting macros like \textbf{text}, \chapter{text}, etc.
  // Repeatedly unwrap nested single-argument macros
  let prevText = '';
  while (cleanText !== prevText) {
    prevText = cleanText;
    cleanText = cleanText.replace(/\\[a-zA-Z]+\*?\{([^{}]*)\}/g, '$1 ');
  }

  // 5. Remove remaining control sequences without arguments (e.g., \item, \maketitle, \noindent, \par)
  cleanText = cleanText.replace(/\\[a-zA-Z]+/g, ' ');

  // 6. Replace non-breaking spaces and symbols
  cleanText = cleanText.replace(/~/g, ' ');

  // 7. Tokenize words matching alphabetical or alphanumeric word tokens
  const wordMatches = cleanText.match(/[\p{L}\p{N}'’\-_]+/gu) || [];
  const words = wordMatches.filter(w => w.length > 0 && !/^[-_]+$/.test(w));

  return {
    words: words.length,
    characters: cleanText.replace(/\s+/g, '').length
  };
}

/**
 * Computes complete word count metrics across all .tex files in the project.
 */
export function calculateProjectWordCount(files: ProjectFile[]): ProjectWordCountSummary {
  const texFiles = files.filter(f => f.path.toLowerCase().endsWith('.tex'));
  let totalWords = 0;
  let totalCharacters = 0;
  const perFile: FileWordCount[] = [];

  for (const file of texFiles) {
    const { words, characters } = countLatexWords(file.content);
    totalWords += words;
    totalCharacters += characters;
    perFile.push({
      path: file.path,
      name: file.name,
      words,
      characters
    });
  }

  // Average reading speed: 200 words per minute
  const readingTimeMinutes = Math.max(1, Math.ceil(totalWords / 200));

  return {
    totalWords,
    totalCharacters,
    readingTimeMinutes,
    fileCount: texFiles.length,
    perFile
  };
}
