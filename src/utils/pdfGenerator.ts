import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';

export interface PdfGenerationProgress {
  currentPage: number;
  totalPages: number;
  percentage: number;
  status: string;
}

/**
 * Converts any modern color formats (oklch, lab, etc.) in cloned nodes into standard sRGB fallback
 */
function sanitizeColorsForCanvas(element: HTMLElement) {
  // If an element has oklch in computed background or color, normalize it
  try {
    const allElements = element.querySelectorAll<HTMLElement>('*');
    allElements.forEach((el) => {
      // Check inline styles
      if (el.style.color && el.style.color.includes('oklch')) {
        el.style.color = '#0f172a';
      }
      if (el.style.backgroundColor && el.style.backgroundColor.includes('oklch')) {
        el.style.backgroundColor = '#ffffff';
      }
      if (el.style.borderColor && el.style.borderColor.includes('oklch')) {
        el.style.borderColor = '#cbd5e1';
      }
    });
  } catch (e) {
    console.warn('Color sanitization warning:', e);
  }
}

/**
 * Renders all .latex-page elements into a clean downloadable PDF file.
 */
export async function generateAndDownloadPdf(
  containerElement: HTMLElement,
  fileName = 'Student_Project_Report_Autumn_2026.pdf',
  onProgress?: (progress: PdfGenerationProgress) => void
): Promise<void> {
  const pages = containerElement.querySelectorAll<HTMLElement>('.latex-page');
  const totalPages = pages.length;

  if (totalPages === 0) {
    throw new Error('No document pages found to export.');
  }

  // A4 dimensions in mm: 210 x 297
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true
  });

  onProgress?.({
    currentPage: 0,
    totalPages,
    percentage: 5,
    status: 'Initializing PDF document...'
  });

  for (let i = 0; i < totalPages; i++) {
    const pageEl = pages[i];

    onProgress?.({
      currentPage: i + 1,
      totalPages,
      percentage: Math.round(5 + ((i + 0.5) / totalPages) * 85),
      status: `Rendering page ${i + 1} of ${totalPages}...`
    });

    // Capture the page with html2canvas-pro at high resolution (scale: 2 for crisp 300 DPI text & math)
    const canvas = await html2canvas(pageEl, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      windowWidth: pageEl.scrollWidth || 794, // Standard 210mm at 96 DPI
      windowHeight: pageEl.scrollHeight || 1123,
      onclone: (clonedDoc) => {
        // Force clean hex/rgb colors on the cloned page
        const clonedPage = clonedDoc.querySelectorAll<HTMLElement>('.latex-page')[i];
        if (clonedPage) {
          clonedPage.style.transform = 'none';
          clonedPage.style.boxShadow = 'none';
          clonedPage.style.margin = '0';
          clonedPage.style.border = 'none';
          clonedPage.style.backgroundColor = '#ffffff';
          clonedPage.style.color = '#0f172a';
          sanitizeColorsForCanvas(clonedPage);
        }
      }
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);

    if (i > 0) {
      pdf.addPage('a4', 'portrait');
    }

    // 210mm width x 297mm height
    pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
  }

  onProgress?.({
    currentPage: totalPages,
    totalPages,
    percentage: 95,
    status: 'Finalizing PDF file and packaging...'
  });

  // Save the PDF which triggers browser download
  pdf.save(fileName);

  onProgress?.({
    currentPage: totalPages,
    totalPages,
    percentage: 100,
    status: 'Download completed successfully!'
  });
}
