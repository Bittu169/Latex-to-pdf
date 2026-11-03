import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  Header,
  Footer,
  PageNumber
} from 'docx';
import { ProjectMetadata, BibItem } from '../types/latex';

/**
 * Creates standard cell borders for Word tables
 */
const tableCellBorders = {
  top: { style: BorderStyle.SINGLE, size: 1, color: '94A3B8' },
  bottom: { style: BorderStyle.SINGLE, size: 1, color: '94A3B8' },
  left: { style: BorderStyle.SINGLE, size: 1, color: '94A3B8' },
  right: { style: BorderStyle.SINGLE, size: 1, color: '94A3B8' }
};

/**
 * Generates and downloads a formatted Microsoft Word (.docx) equivalent of the LaTeX project report.
 */
export async function generateAndDownloadWordDoc(
  metadata: ProjectMetadata,
  bibliography: BibItem[],
  fileName = 'Student_Project_Report_Autumn_2026.docx'
): Promise<void> {
  const doc = new Document({
    creator: metadata.students.map(s => s.name).join(', '),
    title: metadata.title,
    description: `Academic Thesis Report - ${metadata.university}`,
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch = 1440 DXA
              right: 1440,
              bottom: 1440,
              left: 1440
            }
          }
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: 'Sister Nivedita University, WB  |  Academic Thesis',
                    size: 18,
                    color: '64748B',
                    italics: true
                  })
                ]
              })
            ]
          })
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: `${metadata.university}  •  Page `,
                    size: 18,
                    color: '64748B'
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    size: 18,
                    color: '64748B'
                  })
                ]
              })
            ]
          })
        },
        children: [
          // ==========================================
          // COVER PAGE
          // ==========================================
          new Paragraph({
            text: metadata.title.toUpperCase(),
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { before: 400, after: 300 }
          }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 200 },
            children: [
              new TextRun({
                text: 'Project Submitted By',
                italics: true,
                size: 24,
                color: '334155'
              })
            ]
          }),

          ...metadata.students.map(student => (
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { before: 60, after: 60 },
              children: [
                new TextRun({
                  text: student.name,
                  bold: true,
                  size: 24,
                  color: '0F172A'
                })
              ]
            })
          )),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 300, after: 150 },
            children: [
              new TextRun({
                text: metadata.degree,
                bold: true,
                size: 24,
                color: '1E3A8A'
              })
            ]
          }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 40 },
            children: [
              new TextRun({
                text: metadata.department,
                bold: true,
                size: 22
              })
            ]
          }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 40, after: 40 },
            children: [
              new TextRun({
                text: metadata.university.toUpperCase(),
                bold: true,
                size: 22
              })
            ]
          }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 40, after: 150 },
            children: [
              new TextRun({
                text: metadata.place,
                size: 20
              })
            ]
          }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 400 },
            children: [
              new TextRun({
                text: `Academic Year: ${metadata.year}`,
                bold: true,
                size: 22
              })
            ],
            pageBreakBefore: false
          }),

          // Page Break to Title Page
          new Paragraph({
            pageBreakBefore: true,
            text: metadata.title.toUpperCase(),
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 150 }
          }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 50, after: 150 },
            children: [
              new TextRun({
                text: 'Project Submitted in Partial Fulfilment of the Requirements for Award of the Degree of',
                italics: true,
                size: 20
              })
            ]
          }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 50, after: 200 },
            children: [
              new TextRun({
                text: metadata.degree,
                bold: true,
                size: 22
              })
            ]
          }),

          // Student roster table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    borders: tableCellBorders,
                    children: [new Paragraph({ children: [new TextRun({ text: 'Student Name', bold: true })] })]
                  }),
                  new TableCell({
                    borders: tableCellBorders,
                    children: [new Paragraph({ children: [new TextRun({ text: 'Reg. Number', bold: true })] })]
                  }),
                  new TableCell({
                    borders: tableCellBorders,
                    children: [new Paragraph({ children: [new TextRun({ text: 'Email ID', bold: true })] })]
                  })
                ]
              }),
              ...metadata.students.map(s => (
                new TableRow({
                  children: [
                    new TableCell({
                      borders: tableCellBorders,
                      children: [new Paragraph({ text: s.name })]
                    }),
                    new TableCell({
                      borders: tableCellBorders,
                      children: [new Paragraph({ text: s.regNumber })]
                    }),
                    new TableCell({
                      borders: tableCellBorders,
                      children: [new Paragraph({ text: s.email })]
                    })
                  ]
                })
              ))
            ]
          }),

          new Paragraph({
            spacing: { before: 250, after: 50 },
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: 'Submission Date: ', bold: true }),
              new TextRun({ text: metadata.submissionDate })
            ]
          }),

          new Paragraph({
            spacing: { before: 150, after: 40 },
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: 'Under the supervision of', italics: true })
            ]
          }),
          new Paragraph({
            spacing: { before: 40, after: 40 },
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: metadata.supervisorName, bold: true, size: 24 })
            ]
          }),
          new Paragraph({
            spacing: { before: 40, after: 40 },
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: metadata.supervisorDesignation, italics: true })
            ]
          }),
          new Paragraph({
            spacing: { before: 40, after: 40 },
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: `${metadata.department}, ${metadata.university}` })
            ]
          }),

          // ==========================================
          // DECLARATION & CERTIFICATE
          // ==========================================
          new Paragraph({
            pageBreakBefore: true,
            text: 'Declaration',
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 200 }
          }),

          new Paragraph({
            spacing: { before: 100, after: 200 },
            alignment: AlignmentType.JUSTIFIED,
            children: [
              new TextRun({
                text: 'We hereby declare that this dissertation is the product of our own work, and we attest that it contains no material that resulted from collaboration, except where explicitly acknowledged in the text. Furthermore, we confirm that this project has not been previously submitted, either in part or in its entirety, to any other University or Institution for the purpose of obtaining any degree, diploma, or other qualification. All sources used and referenced in this dissertation are duly credited, and any borrowed ideas or information are appropriately cited in accordance with academic standards and guidelines.'
              })
            ]
          }),

          new Paragraph({
            spacing: { before: 200, after: 50 },
            children: [
              new TextRun({ text: `Date: ${metadata.submissionDate}\nPlace: ${metadata.place}`, bold: true })
            ]
          }),

          ...metadata.students.map(s => (
            new Paragraph({
              spacing: { before: 100, after: 20 },
              alignment: AlignmentType.RIGHT,
              children: [
                new TextRun({ text: `__________________________\n${s.name} (Reg. No: ${s.regNumber})`, bold: true })
              ]
            })
          )),

          new Paragraph({
            pageBreakBefore: true,
            text: 'Certificate',
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 200 }
          }),

          new Paragraph({
            spacing: { before: 100, after: 300 },
            alignment: AlignmentType.JUSTIFIED,
            children: [
              new TextRun({
                text: `This is to certify that the project entitled "${metadata.title}", submitted by ${metadata.students.map(s => s.name).join(', ')} to ${metadata.university} for the award of the degree of ${metadata.degree} is a bonafide record of the project work carried out by them under my supervision and guidance. The content of the project, in full or parts have not been submitted to any other institute or university for the award of any degree or diploma.`
              })
            ]
          }),

          new Paragraph({
            spacing: { before: 300, after: 50 },
            alignment: AlignmentType.RIGHT,
            children: [
              new TextRun({
                text: `__________________________\n(${metadata.supervisorName})\n${metadata.supervisorDesignation}\n${metadata.department}\n${metadata.university}`,
                bold: true
              })
            ]
          }),

          // ==========================================
          // ACKNOWLEDGEMENT & ABSTRACT
          // ==========================================
          new Paragraph({
            pageBreakBefore: true,
            text: 'Acknowledgement',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 150 }
          }),

          new Paragraph({
            spacing: { before: 100, after: 150 },
            alignment: AlignmentType.JUSTIFIED,
            children: [
              new TextRun({
                text: `We would like to express our heartfelt gratitude to our esteemed guide, ${metadata.supervisorName}, ${metadata.supervisorDesignation} at ${metadata.university}, for his invaluable guidance, unwavering support, and encouragement throughout our project journey. His profound knowledge, insightful suggestions, and mentorship have been instrumental in shaping our project and academic pursuits.`
              })
            ]
          }),

          new Paragraph({
            spacing: { before: 100, after: 250 },
            alignment: AlignmentType.JUSTIFIED,
            children: [
              new TextRun({
                text: `We extend our sincere thanks to the members of the Project Committee at ${metadata.department}, ${metadata.university}, for their valuable feedback and constructive criticism during the evaluation of our work.`
              })
            ]
          }),

          new Paragraph({
            text: 'Abstract',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 150 }
          }),

          new Paragraph({
            spacing: { before: 100, after: 150 },
            alignment: AlignmentType.JUSTIFIED,
            children: [
              new TextRun({
                text: 'Air-writing provides an intuitive touchless human-computer interaction modality by converting mid-air finger trajectories into alphanumeric text. In this dissertation, we present a robust recognition system based on real-time 2D RGB video capture. An automated fingertip localization algorithm extracts stroke trajectories without requiring colored markers or depth sensors. Extracted coordinates undergo kinematic velocity normalization and 2D Gaussian filtering to attenuate natural motor jitter. The normalized trajectory matrix is classified using a Convolutional Neural Network (CNN) architecture with residual connections. When evaluated on benchmark character datasets, the system demonstrates 96.8% accuracy at 34 frames per second under ambient indoor lighting conditions.'
              })
            ]
          }),

          // ==========================================
          // CHAPTER 1: INTRODUCTION
          // ==========================================
          new Paragraph({
            pageBreakBefore: true,
            text: 'Chapter 1: Introduction',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 150 }
          }),

          new Paragraph({
            spacing: { before: 100, after: 150 },
            alignment: AlignmentType.JUSTIFIED,
            children: [
              new TextRun({
                text: 'In recent years, touchless interaction paradigms have garnered immense interest across ubiquitous computing, smart environments, and assistive technologies. Air-writing—the process of composing characters and words in free three-dimensional space using finger or stylus motions—represents a natural, intuitive interface eliminating the need for physical touchscreens or handwriting hardware.'
              })
            ]
          }),

          new Paragraph({
            text: '1.1 Objectives',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 150, after: 100 }
          }),

          new Paragraph({
            text: '1. To accurately estimate and track fingertip trajectory using real-time video frames captured from an off-the-shelf single RGB webcam.',
            bullet: { level: 0 },
            spacing: { before: 50, after: 50 }
          }),
          new Paragraph({
            text: '2. To normalize and interpolate varying-speed air-writing strokes into scale-invariant spatio-temporal representations.',
            bullet: { level: 0 },
            spacing: { before: 50, after: 50 }
          }),
          new Paragraph({
            text: '3. To evaluate deep learning architectures (Convolutional Neural Networks and Bidirectional LSTMs) on benchmark datasets.',
            bullet: { level: 0 },
            spacing: { before: 50, after: 50 }
          }),
          new Paragraph({
            text: '4. To formulate mathematical models governing kinematics, Gaussian spatial filters, and trajectory reconstruction.',
            bullet: { level: 0 },
            spacing: { before: 50, after: 150 }
          }),

          new Paragraph({
            text: '1.2 Contributions',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 150, after: 100 }
          }),
          new Paragraph({
            text: '• A lightweight trajectory tracking pipeline operating at over 30 frames per second without specialized depth cameras.',
            bullet: { level: 0 },
            spacing: { before: 50, after: 50 }
          }),
          new Paragraph({
            text: '• Comprehensive mathematical modeling of stroke trajectory velocity vectors and piecewise bounding functions.',
            bullet: { level: 0 },
            spacing: { before: 50, after: 50 }
          }),
          new Paragraph({
            text: '• Empirical performance evaluation achieving 96.8% character recognition accuracy across diverse lighting conditions.',
            bullet: { level: 0 },
            spacing: { before: 50, after: 150 }
          }),

          // ==========================================
          // CHAPTER 2 & 3: LITERATURE REVIEW & PROBLEMS
          // ==========================================
          new Paragraph({
            pageBreakBefore: true,
            text: 'Chapter 2: Literature Survey',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 150 }
          }),

          new Paragraph({
            spacing: { before: 100, after: 150 },
            alignment: AlignmentType.JUSTIFIED,
            children: [
              new TextRun({
                text: 'The evolution of in-air gesture and handwriting analysis spans multiple sensor modalities and modeling methodologies. Early research by Vikram et al. [4] explored handwriting and gestures in the air using geometric heuristics. Subsequent advances introduced depth cameras (Alam et al. [3]) and wearable sensors (Patil et al. [10]). Camera-based touchless interaction without invasive hardware was investigated by Mukherjee et al. [5] and Watanabe et al. [1]. Furthermore, Hsieh et al. [2] developed deep convolutional networks for alphanumeric symbols, while Abir et al. [6] emphasized the criticality of optimal trajectory interpolation.'
              })
            ]
          }),

          new Paragraph({
            text: 'Chapter 3: Problem Identification',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 150 }
          }),

          new Paragraph({
            spacing: { before: 100, after: 150 },
            alignment: AlignmentType.JUSTIFIED,
            children: [
              new TextRun({
                text: 'Recognizing freeform handwriting in three-dimensional space presents unique scientific and engineering hurdles compared to traditional optical character recognition (OCR):\n1. Lack of Tactile Feedback: Without paper or glass resistance, users write in free air with high stroke variance.\n2. Stroke Segmentation Dilemma: Distinguishing active writing strokes from transitional navigation motions.\n3. Variable Speed and Tremor: Fluctuating speeds require continuous kinematic smoothing.'
              })
            ]
          }),

          // ==========================================
          // CHAPTER 4: METHODOLOGY & EQUATIONS
          // ==========================================
          new Paragraph({
            pageBreakBefore: true,
            text: 'Chapter 4: Proposed Methodology',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 150 }
          }),

          new Paragraph({
            text: '4.1 System Architecture',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 150, after: 100 }
          }),

          new Paragraph({
            spacing: { before: 50, after: 150 },
            children: [
              new TextRun({
                text: 'Figure 4.1 describes the end-to-end processing pipeline, consisting of video acquisition, fingertip localization, trajectory smoothing, feature normalization, and deep neural classification.'
              })
            ]
          }),

          new Paragraph({
            text: '4.2 Kinematic Modeling and Mathematical Formulation',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 150, after: 100 }
          }),

          new Paragraph({
            spacing: { before: 50, after: 50 },
            children: [
              new TextRun({
                text: 'Under uniform acceleration f, the spatial displacement s over time t with initial velocity u satisfies:'
              })
            ]
          }),

          // Kinematic Equation in Word Callout
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 100 },
            children: [
              new TextRun({
                text: 's = u·t + ½·f·t²       (4.1)',
                bold: true,
                size: 22,
                color: '1E3A8A'
              })
            ]
          }),

          new Paragraph({
            spacing: { before: 50, after: 50 },
            children: [
              new TextRun({
                text: 'Piecewise Decision Function for stroke boundaries:'
              })
            ]
          }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 100 },
            children: [
              new TextRun({
                text: 'f(x) = {  x²,  x ≥ 0;\n         -x,  x < 0        (4.2)',
                bold: true,
                size: 22,
                color: '1E3A8A'
              })
            ]
          }),

          new Paragraph({
            spacing: { before: 50, after: 50 },
            children: [
              new TextRun({
                text: 'Definite integral of trajectory energy:'
              })
            ]
          }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 150 },
            children: [
              new TextRun({
                text: 'F(x) = ∫₀ˣ (at² + bt + c) dt = [ (a/3)t³ + (b/2)t² + ct ]₀ˣ = (a/3)x³ + (b/2)x² + cx       (4.3)',
                bold: true,
                size: 22,
                color: '1E3A8A'
              })
            ]
          }),

          new Paragraph({
            text: '4.3 Spatial Gaussian Filtering & Matrix Convolutions',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 150, after: 100 }
          }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 100 },
            children: [
              new TextRun({
                text: 'G(x, y) = [ 1 / (2πσ²) ] · exp[ -(x² + y²) / (2σ²) ]',
                bold: true,
                size: 22,
                color: '1E3A8A'
              })
            ]
          }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 150 },
            children: [
              new TextRun({
                text: 'X = [ [10, 20, 30], [40, 50, 60], [70, 80, 90] ],    Y = [ [-1, 0, 1], [-1, 0, 1], [-1, 0, 1] ]',
                bold: true,
                size: 20
              })
            ]
          }),

          new Paragraph({
            text: '4.4 Recognition Algorithm (Algorithm 4.1)',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 150, after: 100 }
          }),

          new Paragraph({
            spacing: { before: 50, after: 150 },
            children: [
              new TextRun({
                text: 'Input: Video frame stream V = {F₁, F₂, ..., F_T}, Confidence threshold τ\nOutput: Recognized character class Ĉ and confidence score P(Ĉ)\n1: Initialize trajectory buffer T ← ∅\n2: for t ← 1 to T do\n3:     Detect hand keypoints (x_t, y_t) with confidence score c_t\n4:     if c_t ≥ τ then\n5:         Append coordinate (x_t, y_t) to trajectory buffer T\n6:     end if\n7: end for\n8: Apply 2D Gaussian smoothing kernel G(x, y) on buffer T\n9: Interpolate trajectory points to standardized 64 × 64 grid\n10: Compute neural feature representation z = CNN(T)\n11: Ĉ ← argmax_k softmax(z_k)\n12: return Ĉ, P(Ĉ)',
                size: 19,
                font: 'Courier New'
              })
            ]
          }),

          // ==========================================
          // CHAPTER 5: RESULTS AND DISCUSSION
          // ==========================================
          new Paragraph({
            pageBreakBefore: true,
            text: 'Chapter 5: Results and Discussion',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 150 }
          }),

          new Paragraph({
            text: '5.1 Empirical Performance Metrics',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 150, after: 100 }
          }),

          new Paragraph({
            spacing: { before: 50, after: 100 },
            children: [
              new TextRun({ text: 'Table 5.1: Empirical Performance Metrics across Different Air-Writing Subsets.', bold: true, italics: true })
            ]
          }),

          // Table 5.1 Performance Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ borders: tableCellBorders, children: [new Paragraph({ children: [new TextRun({ text: 'Character Category', bold: true })] })] }),
                  new TableCell({ borders: tableCellBorders, children: [new Paragraph({ children: [new TextRun({ text: 'Samples', bold: true })] })] }),
                  new TableCell({ borders: tableCellBorders, children: [new Paragraph({ children: [new TextRun({ text: 'Accuracy (%)', bold: true })] })] }),
                  new TableCell({ borders: tableCellBorders, children: [new Paragraph({ children: [new TextRun({ text: 'Precision (%)', bold: true })] })] }),
                  new TableCell({ borders: tableCellBorders, children: [new Paragraph({ children: [new TextRun({ text: 'F1-Score', bold: true })] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ borders: tableCellBorders, children: [new Paragraph({ text: 'Uppercase Alphabet (A–Z)' })] }),
                  new TableCell({ borders: tableCellBorders, children: [new Paragraph({ text: '5,200' })] }),
                  new TableCell({ borders: tableCellBorders, children: [new Paragraph({ text: '97.4' })] }),
                  new TableCell({ borders: tableCellBorders, children: [new Paragraph({ text: '96.8' })] }),
                  new TableCell({ borders: tableCellBorders, children: [new Paragraph({ text: '0.971' })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ borders: tableCellBorders, children: [new Paragraph({ text: 'Lowercase Alphabet (a–z)' })] }),
                  new TableCell({ borders: tableCellBorders, children: [new Paragraph({ text: '5,200' })] }),
                  new TableCell({ borders: tableCellBorders, children: [new Paragraph({ text: '95.8' })] }),
                  new TableCell({ borders: tableCellBorders, children: [new Paragraph({ text: '95.2' })] }),
                  new TableCell({ borders: tableCellBorders, children: [new Paragraph({ text: '0.955' })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ borders: tableCellBorders, children: [new Paragraph({ text: 'Numeric Digits (0–9)' })] }),
                  new TableCell({ borders: tableCellBorders, children: [new Paragraph({ text: '3,000' })] }),
                  new TableCell({ borders: tableCellBorders, children: [new Paragraph({ text: '98.9' })] }),
                  new TableCell({ borders: tableCellBorders, children: [new Paragraph({ text: '98.5' })] }),
                  new TableCell({ borders: tableCellBorders, children: [new Paragraph({ text: '0.987' })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ borders: tableCellBorders, children: [new Paragraph({ text: 'Special Symbols (+, -, *, /)' })] }),
                  new TableCell({ borders: tableCellBorders, children: [new Paragraph({ text: '1,500' })] }),
                  new TableCell({ borders: tableCellBorders, children: [new Paragraph({ text: '94.6' })] }),
                  new TableCell({ borders: tableCellBorders, children: [new Paragraph({ text: '93.9' })] }),
                  new TableCell({ borders: tableCellBorders, children: [new Paragraph({ text: '0.942' })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ borders: tableCellBorders, children: [new Paragraph({ children: [new TextRun({ text: 'Overall Combined', bold: true })] })] }),
                  new TableCell({ borders: tableCellBorders, children: [new Paragraph({ children: [new TextRun({ text: '14,900', bold: true })] })] }),
                  new TableCell({ borders: tableCellBorders, children: [new Paragraph({ children: [new TextRun({ text: '96.8%', bold: true, color: '1E3A8A' })] })] }),
                  new TableCell({ borders: tableCellBorders, children: [new Paragraph({ children: [new TextRun({ text: '96.1%', bold: true })] })] }),
                  new TableCell({ borders: tableCellBorders, children: [new Paragraph({ children: [new TextRun({ text: '0.964', bold: true })] })] })
                ]
              })
            ]
          }),

          new Paragraph({
            text: '5.2 State-of-the-Art Benchmark Comparison',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 }
          }),

          new Paragraph({
            spacing: { before: 50, after: 100 },
            children: [
              new TextRun({ text: 'Table 5.2: Comparative Evaluation with State-of-the-Art Air-Writing Frameworks.', bold: true, italics: true })
            ]
          }),

          // Table 5.2 Benchmarks
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ borders: tableCellBorders, children: [new Paragraph({ children: [new TextRun({ text: 'Method / Reference', bold: true })] })] }),
                  new TableCell({ borders: tableCellBorders, children: [new Paragraph({ children: [new TextRun({ text: 'Sensor Modality', bold: true })] })] }),
                  new TableCell({ borders: tableCellBorders, children: [new Paragraph({ children: [new TextRun({ text: 'FPS', bold: true })] })] }),
                  new TableCell({ borders: tableCellBorders, children: [new Paragraph({ children: [new TextRun({ text: 'Accuracy (%)', bold: true })] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ borders: tableCellBorders, children: [new Paragraph({ text: 'Vikram et al. [4]' })] }),
                  new TableCell({ borders: tableCellBorders, children: [new Paragraph({ text: 'Stereo Cameras' })] }),
                  new TableCell({ borders: tableCellBorders, children: [new Paragraph({ text: '18' })] }),
                  new TableCell({ borders: tableCellBorders, children: [new Paragraph({ text: '86.5' })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ borders: tableCellBorders, children: [new Paragraph({ text: 'Alam et al. [3]' })] }),
                  new TableCell({ borders: tableCellBorders, children: [new Paragraph({ text: 'Depth Sensor (Kinect)' })] }),
                  new TableCell({ borders: tableCellBorders, children: [new Paragraph({ text: '24' })] }),
                  new TableCell({ borders: tableCellBorders, children: [new Paragraph({ text: '92.3' })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ borders: tableCellBorders, children: [new Paragraph({ text: 'Mukherjee et al. [5]' })] }),
                  new TableCell({ borders: tableCellBorders, children: [new Paragraph({ text: 'Monocular Webcam' })] }),
                  new TableCell({ borders: tableCellBorders, children: [new Paragraph({ text: '25' })] }),
                  new TableCell({ borders: tableCellBorders, children: [new Paragraph({ text: '93.7' })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ borders: tableCellBorders, children: [new Paragraph({ text: 'Watanabe et al. [1]' })] }),
                  new TableCell({ borders: tableCellBorders, children: [new Paragraph({ text: '2D RGB Camera' })] }),
                  new TableCell({ borders: tableCellBorders, children: [new Paragraph({ text: '28' })] }),
                  new TableCell({ borders: tableCellBorders, children: [new Paragraph({ text: '95.4' })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ borders: tableCellBorders, children: [new Paragraph({ children: [new TextRun({ text: 'Proposed Architecture', bold: true, color: '1E3A8A' })] })] }),
                  new TableCell({ borders: tableCellBorders, children: [new Paragraph({ children: [new TextRun({ text: 'Standard 2D Webcam', bold: true })] })] }),
                  new TableCell({ borders: tableCellBorders, children: [new Paragraph({ children: [new TextRun({ text: '34', bold: true })] })] }),
                  new TableCell({ borders: tableCellBorders, children: [new Paragraph({ children: [new TextRun({ text: '96.8%', bold: true, color: '1E3A8A' })] })] })
                ]
              })
            ]
          }),

          new Paragraph({
            text: '5.3 Computational Complexity Analysis',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 }
          }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 150 },
            children: [
              new TextRun({
                text: 'A(n) ∈ Θ(n^(log_b a)) = Θ(n^(log_2 2)) = Θ(n)',
                bold: true,
                size: 22,
                color: '1E3A8A'
              })
            ]
          }),

          // ==========================================
          // CHAPTER 6: CONCLUSION & BIBLIOGRAPHY
          // ==========================================
          new Paragraph({
            pageBreakBefore: true,
            text: 'Chapter 6: Conclusion and Future Work',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 150 }
          }),

          new Paragraph({
            spacing: { before: 100, after: 150 },
            alignment: AlignmentType.JUSTIFIED,
            children: [
              new TextRun({
                text: 'In this dissertation, we designed, implemented, and validated an air-writing recognition framework leveraging consumer-grade 2D webcams. By combining real-time fingertip localization with kinematic smoothing and convolutional neural networks, the system achieves 96.8% character classification accuracy at 34 frames per second.'
              })
            ]
          }),

          new Paragraph({
            text: 'Bibliography',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 250, after: 150 }
          }),

          ...bibliography.map((item, idx) => (
            new Paragraph({
              spacing: { before: 80, after: 80 },
              children: [
                new TextRun({ text: `[${idx + 1}] `, bold: true, color: '1E3A8A' }),
                new TextRun({ text: `${item.authors}. `, bold: true }),
                new TextRun({ text: `"${item.title}." `, italics: true }),
                new TextRun({ text: `${item.journal || item.booktitle || ''}` }),
                item.volume ? new TextRun({ text: `, vol. ${item.volume}` }) : new TextRun({ text: '' }),
                item.number ? new TextRun({ text: `, no. ${item.number}` }) : new TextRun({ text: '' }),
                item.pages ? new TextRun({ text: `, pp. ${item.pages}` }) : new TextRun({ text: '' }),
                item.year ? new TextRun({ text: `, ${item.year}` }) : new TextRun({ text: '' }),
                item.publisher ? new TextRun({ text: `. ${item.publisher}` }) : new TextRun({ text: '' })
              ]
            })
          ))
        ]
      }
    ]
  });

  // Convert to Blob and trigger browser download
  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
