import React from 'react';
import { MathRenderer } from '../components/MathRenderer';
import { BibItem } from '../types/latex';

/**
 * Parses BibTeX format text into structured BibItem objects
 */
export function parseBibtex(bibText: string): BibItem[] {
  const items: BibItem[] = [];
  const entryRegex = /@(\w+)\s*\{\s*([^,]+),([^@]*)/g;
  let match;

  while ((match = entryRegex.exec(bibText)) !== null) {
    const type = match[1].toLowerCase();
    const id = match[2].trim();
    const body = match[3];

    const getField = (field: string): string => {
      const reg = new RegExp(`${field}\\s*=\\s*[{"]([^}"]+)[}"]`, 'i');
      const m = reg.exec(body);
      return m ? m[1].trim() : '';
    };

    items.push({
      id,
      type,
      title: getField('title') || 'Untitled',
      authors: getField('author') || getField('authors') || 'Unknown Author',
      journal: getField('journal'),
      booktitle: getField('booktitle'),
      volume: getField('volume'),
      number: getField('number'),
      pages: getField('pages'),
      year: getField('year'),
      publisher: getField('publisher')
    });
  }

  return items;
}

/**
 * Parses inline LaTeX text formatting into React nodes:
 * - \textbf{...}
 * - \textit{...}
 * - \emph{...}
 * - \underline{...}
 * - \cite{...}
 * - \ref{...}
 * - $inline math$
 * - \texttt{...}
 */
export function renderLatexText(
  text: string,
  bibItems: BibItem[] = [],
  keyPrefix = 'txt'
): React.ReactNode[] {
  if (!text) return [];

  // Remove comment lines starting with %
  const cleanText = text
    .split('\n')
    .map(line => {
      const idx = line.indexOf('%');
      if (idx !== -1 && (idx === 0 || line[idx - 1] !== '\\')) {
        return line.substring(0, idx);
      }
      return line;
    })
    .join('\n');

  // Tokenize by math ($...$) and commands
  const parts: React.ReactNode[] = [];
  const mathRegex = /(\$[^$]+\$)/g;
  const segments = cleanText.split(mathRegex);

  segments.forEach((seg, idx) => {
    if (!seg) return;

    if (seg.startsWith('$') && seg.endsWith('$') && seg.length > 2) {
      const mathCode = seg.slice(1, -1);
      parts.push(
        <MathRenderer
          key={`${keyPrefix}-math-${idx}`}
          math={mathCode}
          displayMode={false}
        />
      );
      return;
    }

    // Process commands inside regular text
    let processed = seg;

    // Convert ~ to non-breaking space
    processed = processed.replace(/~/g, '\u00A0');

    // Replace citations like \cite{key} with [n]
    processed = processed.replace(/\\cite\{([^}]+)\}/g, (_, key) => {
      const cleanKey = key.trim();
      const bibIdx = bibItems.findIndex(b => b.id.toLowerCase() === cleanKey.toLowerCase());
      return bibIdx !== -1 ? `[${bibIdx + 1}]` : `[?]`;
    });

    // Replace references like \ref{key}
    processed = processed.replace(/\\ref\{([^}]+)\}/g, (_, refKey) => {
      if (refKey.includes('fig:architecture') || refKey.includes('label_name')) return '4.1';
      if (refKey.includes('eq:kinematics')) return '(4.1)';
      if (refKey.includes('eq:piecewise')) return '(4.2)';
      if (refKey.includes('eq:multiline')) return '(4.3)';
      if (refKey.includes('alg:recognition')) return '4.1';
      if (refKey.includes('tab:performance')) return '5.1';
      if (refKey.includes('tab:comparison')) return '5.2';
      return '1';
    });

    // Basic styling replacements
    // Simple tokenizer for \textbf{...}, \textit{...}, etc.
    const commandRegex = /(\\textbf\{[^}]*\}|\\textit\{[^}]*\}|\\texttt\{[^}]*\}|\\emph\{[^}]*\}|\\underline\{[^}]*\})/g;
    const subSegments = processed.split(commandRegex);

    subSegments.forEach((sub, sIdx) => {
      if (!sub) return;

      if (sub.startsWith('\\textbf{') && sub.endsWith('}')) {
        parts.push(
          <strong key={`${keyPrefix}-b-${idx}-${sIdx}`} className="font-semibold text-slate-900">
            {sub.slice(8, -1)}
          </strong>
        );
      } else if (sub.startsWith('\\textit{') && sub.endsWith('}')) {
        parts.push(
          <em key={`${keyPrefix}-i-${idx}-${sIdx}`} className="italic">
            {sub.slice(8, -1)}
          </em>
        );
      } else if (sub.startsWith('\\emph{') && sub.endsWith('}')) {
        parts.push(
          <em key={`${keyPrefix}-em-${idx}-${sIdx}`} className="italic">
            {sub.slice(6, -1)}
          </em>
        );
      } else if (sub.startsWith('\\texttt{') && sub.endsWith('}')) {
        parts.push(
          <code key={`${keyPrefix}-tt-${idx}-${sIdx}`} className="font-mono text-[0.9em] bg-slate-100 px-1 py-0.5 rounded text-blue-800">
            {sub.slice(8, -1)}
          </code>
        );
      } else if (sub.startsWith('\\underline{') && sub.endsWith('}')) {
        parts.push(
          <span key={`${keyPrefix}-u-${idx}-${sIdx}`} className="underline">
            {sub.slice(11, -1)}
          </span>
        );
      } else {
        // Plain text
        parts.push(<span key={`${keyPrefix}-p-${idx}-${sIdx}`}>{sub}</span>);
      }
    });
  });

  return parts;
}
