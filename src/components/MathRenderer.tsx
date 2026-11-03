import React, { useMemo } from 'react';
import katex from 'katex';

interface MathRendererProps {
  math: string;
  displayMode?: boolean;
  className?: string;
}

export const MathRenderer: React.FC<MathRendererProps> = ({
  math,
  displayMode = false,
  className = ''
}) => {
  const renderedHtml = useMemo(() => {
    // Sanitize TeX macros that are specific to custom packages like mathtools
    let cleanMath = math
      .replace(/\\nonumber/g, '')
      .replace(/\\notag/g, '')
      .replace(/\\floor\*?\{([^}]+)\}/g, '\\lfloor $1 \\rfloor')
      .replace(/\\ceil\*?\{([^}]+)\}/g, '\\lceil $1 \\rceil')
      .replace(/\\mathlarger\{([^}]+)\}/g, '{\\large $1}')
      .replace(/\\RaggedRight/g, '')
      .trim();

    try {
      return katex.renderToString(cleanMath, {
        displayMode,
        throwOnError: false,
        strict: false,
        trust: true,
        output: 'htmlAndMathml'
      });
    } catch (err) {
      console.warn('KaTeX rendering error for math:', cleanMath, err);
      return `<span class="text-amber-800 font-mono text-sm bg-amber-50 px-1 rounded">${cleanMath}</span>`;
    }
  }, [math, displayMode]);

  return (
    <span
      className={`${displayMode ? 'block my-3 text-center overflow-x-auto overflow-y-hidden' : 'inline-block px-0.5'} ${className}`}
      dangerouslySetInnerHTML={{ __html: renderedHtml }}
    />
  );
};
