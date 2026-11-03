import JSZip from 'jszip';
import { ProjectFile, ProjectMetadata } from '../types/latex';

export interface ParsedZipResult {
  files: ProjectFile[];
  metadata: Partial<ProjectMetadata>;
  mainFilePath: string;
  imageMap: Record<string, string>; // relative path -> data URL
  fileCount: number;
}

/**
 * Parses an uploaded .zip file containing LaTeX code and assets.
 */
export async function parseLatexZip(zipFile: File): Promise<ParsedZipResult> {
  const zip = await JSZip.loadAsync(zipFile);
  const files: ProjectFile[] = [];
  const imageMap: Record<string, string> = {};
  let mainFilePath = '';
  const metadata: Partial<ProjectMetadata> = {};

  const fileEntries = Object.keys(zip.files).filter(path => !zip.files[path].dir && !path.startsWith('__MACOSX/'));

  for (const relativePath of fileEntries) {
    const entry = zip.files[relativePath];
    const lowerPath = relativePath.toLowerCase();

    // Check if image
    if (lowerPath.endsWith('.png') || lowerPath.endsWith('.jpg') || lowerPath.endsWith('.jpeg') || lowerPath.endsWith('.svg')) {
      const base64Data = await entry.async('base64');
      let mime = 'image/png';
      if (lowerPath.endsWith('.jpg') || lowerPath.endsWith('.jpeg')) mime = 'image/jpeg';
      if (lowerPath.endsWith('.svg')) mime = 'image/svg+xml';
      
      const dataUrl = `data:${mime};base64,${base64Data}`;
      imageMap[relativePath] = dataUrl;
      // Also store clean filename
      const cleanName = relativePath.split('/').pop() || relativePath;
      imageMap[cleanName] = dataUrl;
      continue;
    }

    // Check if text/latex/bib file
    if (lowerPath.endsWith('.tex') || lowerPath.endsWith('.bib') || lowerPath.endsWith('.txt') || lowerPath.endsWith('.cls') || lowerPath.endsWith('.sty')) {
      const content = await entry.async('string');
      const cleanName = relativePath.split('/').pop() || relativePath;

      let category: ProjectFile['category'] = 'misc';
      if (lowerPath.endsWith('.bib')) category = 'references';
      else if (lowerPath.includes('chapter')) category = 'chapter';
      else if (lowerPath.includes('bibtext')) category = 'bibtext';

      // Detect master file
      if (
        content.includes('\\documentclass') &&
        content.includes('\\begin{document}')
      ) {
        category = 'main';
        if (!mainFilePath) {
          mainFilePath = relativePath;
        }
      }

      files.push({
        path: relativePath,
        name: cleanName,
        content,
        category,
        description: `Extracted from ${zipFile.name}`
      });

      // Attempt to extract title/metadata if found
      const titleMatch = /\\projectTitle\{([^}]+)\}/i.exec(content) || /\\title\{([^}]+)\}/i.exec(content);
      if (titleMatch && !metadata.title) {
        metadata.title = titleMatch[1].replace(/\\capitalisewords\{([^}]+)\}/, '$1').trim();
      }

      const degreeMatch = /\\programName\{([^}]+)\}/i.exec(content);
      if (degreeMatch && !metadata.degree) {
        metadata.degree = degreeMatch[1].trim();
      }

      const supervisorMatch = /\\supervisorName\{([^}]+)\}/i.exec(content);
      if (supervisorMatch && !metadata.supervisorName) {
        metadata.supervisorName = supervisorMatch[1].trim();
      }
    }
  }

  // Fallback main file if none tagged
  if (!mainFilePath && files.length > 0) {
    const texFiles = files.filter(f => f.path.endsWith('.tex'));
    mainFilePath = texFiles[0]?.path || files[0].path;
  }

  return {
    files,
    metadata,
    mainFilePath,
    imageMap,
    fileCount: files.length + Object.keys(imageMap).length
  };
}
