import React from 'react';
import { ProjectMetadata, BibItem } from '../types/latex';
import { MathRenderer } from './MathRenderer';
import { renderLatexText } from '../utils/latexParser';

interface PdfDocumentViewerProps {
  metadata: ProjectMetadata;
  bibliography: BibItem[];
  zoom: number;
}

export const PdfDocumentViewer = React.forwardRef<HTMLDivElement, PdfDocumentViewerProps>(({
  metadata,
  bibliography,
  zoom
}, ref) => {
  return (
    <div
      ref={ref}
      id="pdf-document-container"
      className="flex flex-col items-center gap-12 py-8 print:p-0 print:gap-0 transition-transform origin-top"
      style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
    >
      {/* =========================================================================
          PAGE 1: COVER PAGE
         ========================================================================= */}
      <div className="latex-page shadow-2xl print:shadow-none border border-slate-300 print:border-none font-academic text-slate-900 flex flex-col justify-between latex-page-content">
        <div className="text-center pt-4">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 uppercase mb-8 leading-snug">
            {metadata.title}
          </h1>

          <p className="text-lg font-medium text-slate-700 italic mb-6">
            Project Submitted By
          </p>

          <div className="space-y-2 mb-8">
            {metadata.students.map((student, i) => (
              <p key={i} className="text-xl font-semibold tracking-wide text-slate-900">
                {student.name}
              </p>
            ))}
          </div>

          <div className="my-6">
            <p className="text-lg font-bold tracking-wider text-slate-800">
              {metadata.degree}
            </p>
          </div>
        </div>

        <div className="text-center pb-6">
          <div className="flex justify-center mb-6">
            <img
              src="/bibtext/snu_logo.jpg"
              alt="Sister Nivedita University Logo"
              className="w-56 h-auto object-contain mx-auto"
              onError={(e) => {
                // Fallback to text banner if image fails
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>

          <p className="text-xl font-semibold text-slate-900">
            {metadata.department}
          </p>
          <p className="text-xl font-bold text-slate-900 uppercase tracking-wide">
            {metadata.university}
          </p>
          <p className="text-lg text-slate-800">
            {metadata.place}
          </p>
          <p className="text-xl font-bold text-slate-900 mt-4">
            {metadata.year}
          </p>
        </div>
      </div>

      {/* =========================================================================
          PAGE 2: TITLE PAGE
         ========================================================================= */}
      <div className="latex-page shadow-2xl print:shadow-none border border-slate-300 print:border-none font-academic text-slate-900 flex flex-col justify-between latex-page-content">
        <div className="text-center pt-2">
          <h2 className="text-2xl font-bold uppercase tracking-tight text-slate-900 mb-6 leading-snug">
            {metadata.title}
          </h2>

          <p className="text-base text-slate-700 italic max-w-xl mx-auto mb-2">
            Project Submitted in Partial Fulfilment of the Requirements for Award of the Degree of
          </p>
          <p className="text-lg font-bold text-slate-900 uppercase tracking-wide mb-6">
            {metadata.degree}
          </p>

          {/* Student Table */}
          <div className="my-4 max-w-xl mx-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b-2 border-slate-800">
                  <th className="py-2 font-bold text-slate-900">Student Name</th>
                  <th className="py-2 font-bold text-slate-900">Reg. Number</th>
                  <th className="py-2 font-bold text-slate-900">Email ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300">
                {metadata.students.map((student, i) => (
                  <tr key={i} className="py-1">
                    <td className="py-1.5 font-semibold text-slate-900">{student.name}</td>
                    <td className="py-1.5 font-medium text-slate-800">{student.regNumber}</td>
                    <td className="py-1.5 text-slate-700">{student.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-base font-semibold text-slate-800 mt-6">
            Submission Date: <span className="font-normal">{metadata.submissionDate}</span>
          </p>

          <div className="mt-6">
            <p className="text-sm italic font-serif text-slate-700">Under the supervision of</p>
            <p className="text-lg font-bold text-slate-900">{metadata.supervisorName}</p>
            <p className="text-sm font-medium text-slate-800">{metadata.supervisorDesignation}</p>
            <p className="text-sm text-slate-700">{metadata.department}</p>
            <p className="text-sm text-slate-700">{metadata.university}</p>
          </div>
        </div>

        <div className="text-center pb-4">
          <img
            src="/bibtext/snu_logo.jpg"
            alt="Sister Nivedita University"
            className="w-44 h-auto object-contain mx-auto mb-3"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <p className="text-base font-semibold text-slate-900">{metadata.department}</p>
          <p className="text-base font-bold text-slate-900">{metadata.university}, Newtown</p>
          <p className="text-sm text-slate-700">Kolkata, West Bengal</p>
          <p className="text-base font-semibold text-slate-900 mt-2">{metadata.submissionDate}</p>
        </div>
      </div>

      {/* =========================================================================
          PAGE 3: DECLARATION
         ========================================================================= */}
      <div className="latex-page shadow-2xl print:shadow-none border border-slate-300 print:border-none font-academic text-slate-900 flex flex-col justify-between latex-page-content">
        <div className="pt-4">
          <h2 className="text-3xl font-bold text-center tracking-wide font-calligraphic text-slate-900 mb-8">
            Declaration
          </h2>

          <p className="text-justify text-base leading-relaxed text-slate-800 font-calligraphic mb-10">
            We hereby declare that this dissertation is the product of our own work, and we attest that it contains no material that resulted from collaboration, except where explicitly acknowledged in the text. Furthermore, we confirm that this project has not been previously submitted, either in part or in its entirety, to any other University or Institution for the purpose of obtaining any degree, diploma, or other qualification. All sources used and referenced in this dissertation are duly credited, and any borrowed ideas or information are appropriately cited in accordance with academic standards and guidelines.
          </p>

          {/* Signatures List */}
          <div className="mt-8 space-y-6">
            <div className="flex justify-between items-start text-sm">
              <div className="space-y-1">
                <p><span className="font-semibold">Date:</span> {metadata.submissionDate}</p>
                <p><span className="font-semibold">Place:</span> SNU, West Bengal</p>
              </div>
              <div className="w-64 space-y-4">
                {metadata.students.map((student, i) => (
                  <div key={i} className="text-center">
                    <div className="border-b border-dotted border-slate-500 mb-1 w-full h-6"></div>
                    <p className="font-bold text-slate-900 text-sm">{student.name}</p>
                    <p className="text-xs text-slate-600">Reg. No: {student.regNumber}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-slate-500 border-t border-slate-200 pt-2">
          Page | i
        </div>
      </div>

      {/* =========================================================================
          PAGE 4: CERTIFICATE
         ========================================================================= */}
      <div className="latex-page shadow-2xl print:shadow-none border border-slate-300 print:border-none font-academic text-slate-900 flex flex-col justify-between latex-page-content">
        <div className="pt-2">
          <div className="flex justify-center mb-4">
            <img
              src="/bibtext/snu_logo.jpg"
              alt="SNU Logo"
              className="w-48 h-auto object-contain"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>

          <h2 className="text-3xl font-bold text-center tracking-wide font-calligraphic text-slate-900 mb-8">
            Certificate
          </h2>

          <p className="text-justify text-base leading-relaxed text-slate-800 font-calligraphic mb-12">
            This is to certify that the project entitled <strong className="font-bold">"{metadata.title}"</strong>, submitted by <strong className="font-bold">{metadata.students.map(s => s.name).join(', ')}</strong> to Sister Nivedita University, West Bengal for the award of the degree of <strong className="font-bold">{metadata.degree}</strong> is a bonafide record of the project work carried out by them under my supervision and guidance. The content of the project, in full or parts have not been submitted to any other institute or university for the award of any degree or diploma.
          </p>

          {/* Supervisor Signature Block */}
          <div className="flex justify-between items-end mt-16 pt-8 text-sm">
            <div className="space-y-1">
              <p><span className="font-semibold">Date:</span> {metadata.submissionDate}</p>
              <p><span className="font-semibold">Place:</span> SNU, West Bengal</p>
            </div>
            <div className="text-center w-72">
              <div className="border-b border-dotted border-slate-600 mb-2 w-full h-10"></div>
              <p className="font-bold text-slate-900 text-base">({metadata.supervisorName})</p>
              <p className="text-sm font-medium text-slate-800">{metadata.supervisorDesignation}</p>
              <p className="text-xs text-slate-700">{metadata.department}</p>
              <p className="text-xs text-slate-700">{metadata.university}</p>
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-slate-500 border-t border-slate-200 pt-2">
          Page | ii
        </div>
      </div>

      {/* =========================================================================
          PAGE 5: ACKNOWLEDGEMENT & ABSTRACT
         ========================================================================= */}
      <div className="latex-page shadow-2xl print:shadow-none border border-slate-300 print:border-none font-academic text-slate-900 flex flex-col justify-between latex-page-content">
        <div className="pt-2">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-4 border-b pb-2">
            Acknowledgement
          </h2>

          <div className="text-justify text-sm leading-relaxed text-slate-800 space-y-3 mb-8">
            <p>
              We would like to express our heartfelt gratitude to our esteemed guide, <strong className="font-semibold">{metadata.supervisorName}</strong>, {metadata.supervisorDesignation} at Sister Nivedita University, WB, for his invaluable guidance, unwavering support, and encouragement throughout our project journey. His profound knowledge, insightful suggestions, and mentorship have been instrumental in shaping our project and academic pursuits.
            </p>
            <p>
              We extend our sincere thanks to the members of the Project Committee at the Department of Computer Science, Sister Nivedita University, for their valuable feedback and constructive criticism during the evaluation of our work. Their expertise and insights have been crucial in refining the quality of our project.
            </p>
            <p>
              We are deeply indebted to our family members whose constant love, encouragement, and support have been the driving force behind our academic pursuits. Lastly, we extend our sincere appreciation to all our batchmates and faculty members who stood as pillars of strength during this dissertation work.
            </p>
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-4 border-b pb-2 pt-4">
            Abstract
          </h2>

          <div className="text-justify text-sm leading-relaxed text-slate-800 space-y-3">
            <p>
              Air-writing provides an intuitive touchless human-computer interaction modality by converting mid-air finger trajectories into alphanumeric text. In this dissertation, we present a robust recognition system based on real-time 2D RGB video capture. An automated fingertip localization algorithm extracts stroke trajectories without requiring colored markers or depth sensors.
            </p>
            <p>
              Extracted coordinates undergo kinematic velocity normalization and 2D Gaussian filtering to attenuate natural motor jitter. The normalized trajectory matrix is classified using a Convolutional Neural Network (CNN) architecture with residual connections. When evaluated on benchmark character datasets, the system demonstrates 96.8% accuracy at 34 frames per second under ambient indoor lighting conditions. The resulting model presents a viable, inexpensive touchless interface for augmented reality, accessibility systems, and smart home interaction.
            </p>
          </div>
        </div>

        <div className="text-center text-xs text-slate-500 border-t border-slate-200 pt-2">
          Page | iii
        </div>
      </div>

      {/* =========================================================================
          PAGE 6: TABLE OF CONTENTS, LIST OF FIGURES & TABLES
         ========================================================================= */}
      <div className="latex-page shadow-2xl print:shadow-none border border-slate-300 print:border-none font-academic text-slate-900 flex flex-col justify-between latex-page-content">
        <div className="pt-2">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-6 pb-2 border-b-2 border-slate-800">
            Table of Contents
          </h2>

          <div className="space-y-2 text-sm text-slate-800">
            <div className="flex items-baseline justify-between font-bold text-slate-900">
              <span>Chapter 1: Introduction</span>
              <span className="flex-1 mx-2 border-b border-dotted border-slate-400"></span>
              <span>1</span>
            </div>
            <div className="pl-6 flex items-baseline justify-between text-slate-700">
              <span>1.1 Objectives</span>
              <span className="flex-1 mx-2 border-b border-dotted border-slate-300"></span>
              <span>1</span>
            </div>
            <div className="pl-6 flex items-baseline justify-between text-slate-700">
              <span>1.2 Contributions</span>
              <span className="flex-1 mx-2 border-b border-dotted border-slate-300"></span>
              <span>1</span>
            </div>
            <div className="pl-6 flex items-baseline justify-between text-slate-700">
              <span>1.3 Organization of the Chapters</span>
              <span className="flex-1 mx-2 border-b border-dotted border-slate-300"></span>
              <span>2</span>
            </div>

            <div className="flex items-baseline justify-between font-bold text-slate-900 pt-2">
              <span>Chapter 2: Literature Survey</span>
              <span className="flex-1 mx-2 border-b border-dotted border-slate-400"></span>
              <span>3</span>
            </div>

            <div className="flex items-baseline justify-between font-bold text-slate-900 pt-2">
              <span>Chapter 3: Problem Identification</span>
              <span className="flex-1 mx-2 border-b border-dotted border-slate-400"></span>
              <span>4</span>
            </div>

            <div className="flex items-baseline justify-between font-bold text-slate-900 pt-2">
              <span>Chapter 4: Proposed Methodology</span>
              <span className="flex-1 mx-2 border-b border-dotted border-slate-400"></span>
              <span>5</span>
            </div>
            <div className="pl-6 flex items-baseline justify-between text-slate-700">
              <span>4.1 System Architecture</span>
              <span className="flex-1 mx-2 border-b border-dotted border-slate-300"></span>
              <span>5</span>
            </div>
            <div className="pl-6 flex items-baseline justify-between text-slate-700">
              <span>4.2 Kinematic Modeling and Mathematical Formulation</span>
              <span className="flex-1 mx-2 border-b border-dotted border-slate-300"></span>
              <span>6</span>
            </div>
            <div className="pl-6 flex items-baseline justify-between text-slate-700">
              <span>4.3 Spatial Gaussian Filtering &amp; Matrix Convolutions</span>
              <span className="flex-1 mx-2 border-b border-dotted border-slate-300"></span>
              <span>6</span>
            </div>
            <div className="pl-6 flex items-baseline justify-between text-slate-700">
              <span>4.4 Recognition Algorithm</span>
              <span className="flex-1 mx-2 border-b border-dotted border-slate-300"></span>
              <span>7</span>
            </div>

            <div className="flex items-baseline justify-between font-bold text-slate-900 pt-2">
              <span>Chapter 5: Results and Discussion</span>
              <span className="flex-1 mx-2 border-b border-dotted border-slate-400"></span>
              <span>8</span>
            </div>
            <div className="pl-6 flex items-baseline justify-between text-slate-700">
              <span>5.1 Hardware and Software Environments</span>
              <span className="flex-1 mx-2 border-b border-dotted border-slate-300"></span>
              <span>8</span>
            </div>
            <div className="pl-6 flex items-baseline justify-between text-slate-700">
              <span>5.2 Experimental Results and Benchmark Comparison</span>
              <span className="flex-1 mx-2 border-b border-dotted border-slate-300"></span>
              <span>8</span>
            </div>

            <div className="flex items-baseline justify-between font-bold text-slate-900 pt-2">
              <span>Chapter 6: Conclusion and Future Work</span>
              <span className="flex-1 mx-2 border-b border-dotted border-slate-400"></span>
              <span>9</span>
            </div>

            <div className="flex items-baseline justify-between font-bold text-slate-900 pt-2">
              <span>Bibliography</span>
              <span className="flex-1 mx-2 border-b border-dotted border-slate-400"></span>
              <span>10</span>
            </div>
          </div>

          {/* List of Figures & Tables */}
          <div className="mt-8 pt-4 border-t border-slate-300 grid grid-cols-2 gap-6 text-sm">
            <div>
              <h3 className="font-bold text-slate-900 mb-2 uppercase text-xs tracking-wider">
                List of Figures
              </h3>
              <div className="flex items-baseline justify-between text-slate-700 text-xs">
                <span>Figure 4.1: Neural Network Architecture</span>
                <span className="flex-1 mx-1 border-b border-dotted border-slate-300"></span>
                <span>5</span>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 mb-2 uppercase text-xs tracking-wider">
                List of Tables
              </h3>
              <div className="space-y-1 text-slate-700 text-xs">
                <div className="flex items-baseline justify-between">
                  <span>Table 5.1: Performance Metrics</span>
                  <span className="flex-1 mx-1 border-b border-dotted border-slate-300"></span>
                  <span>8</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span>Table 5.2: State-of-the-Art Benchmark</span>
                  <span className="flex-1 mx-1 border-b border-dotted border-slate-300"></span>
                  <span>8</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-slate-500 border-t border-slate-200 pt-2">
          Page | iv
        </div>
      </div>

      {/* =========================================================================
          PAGE 7: CHAPTER 1 - INTRODUCTION
         ========================================================================= */}
      <div className="latex-page shadow-2xl print:shadow-none border border-slate-300 print:border-none font-academic text-slate-900 flex flex-col justify-between latex-page-content">
        <div>
          {/* Running LaTeX Header */}
          <div className="flex justify-between items-end border-b border-slate-800 pb-1 text-xs text-slate-700 uppercase tracking-wider mb-6">
            <span>Chapter 1. Introduction</span>
            <span>Sister Nivedita University, WB</span>
          </div>

          <div className="mb-6">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block">Chapter 1</span>
            <h1 className="text-3xl font-bold text-slate-900 mt-1">Introduction</h1>
          </div>

          <div className="text-justify text-sm leading-relaxed text-slate-800 space-y-4">
            <p>
              In recent years, touchless interaction paradigms have garnered immense interest across ubiquitous computing, smart environments, and assistive technologies. Air-writing—the process of composing characters and words in free three-dimensional space using finger or stylus motions—represents a natural, intuitive interface eliminating the need for physical touchscreens or handwriting hardware.
            </p>

            <h2 className="text-lg font-bold text-slate-900 pt-2 border-b pb-1">
              1.1 Objectives
            </h2>
            <p>
              The primary objective of this project is to develop an end-to-end framework capable of recognizing alphanumeric characters and words executed as freeform gestures in the air:
            </p>
            <ol className="list-decimal pl-6 space-y-1">
              <li>To accurately estimate and track fingertip trajectory using real-time video frames captured from an off-the-shelf single RGB webcam.</li>
              <li>To normalize and interpolate varying-speed air-writing strokes into scale-invariant spatio-temporal representations.</li>
              <li>To evaluate deep learning architectures (Convolutional Neural Networks and Bidirectional LSTMs) on benchmark datasets.</li>
              <li>To formulate mathematical models governing kinematics, Gaussian spatial filters, and trajectory reconstruction.</li>
            </ol>

            <h2 className="text-lg font-bold text-slate-900 pt-2 border-b pb-1">
              1.2 Contributions
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>A lightweight trajectory tracking pipeline operating at over 30 frames per second without requiring specialized depth cameras or wearable sensors.</li>
              <li>A comprehensive mathematical modeling of stroke trajectory velocity vectors and piecewise bounding functions.</li>
              <li>Empirical performance evaluation achieving 96.8% character recognition accuracy across diverse lighting conditions.</li>
            </ul>

            <h2 className="text-lg font-bold text-slate-900 pt-2 border-b pb-1">
              1.3 Organization of the Chapters
            </h2>
            <p>
              The remainder of this dissertation is systematically structured into consecutive analytical stages, moving from prior literature through problem formalization, mathematical derivations, experimental benchmarks, and concluding remarks.
            </p>
          </div>
        </div>

        {/* Running LaTeX Footer */}
        <div className="flex justify-between items-center text-xs text-slate-700 border-t border-slate-400 pt-2">
          <span className="font-semibold">Sister Nivedita University, WB</span>
          <span className="font-mono">Page | 1</span>
        </div>
      </div>

      {/* =========================================================================
          PAGE 8: CHAPTER 2 & 3 - LITERATURE SURVEY & PROBLEM IDENTIFICATION
         ========================================================================= */}
      <div className="latex-page shadow-2xl print:shadow-none border border-slate-300 print:border-none font-academic text-slate-900 flex flex-col justify-between latex-page-content">
        <div>
          {/* Running LaTeX Header */}
          <div className="flex justify-between items-end border-b border-slate-800 pb-1 text-xs text-slate-700 uppercase tracking-wider mb-6">
            <span>Chapter 2 &amp; 3. Literature Survey &amp; Problems</span>
            <span>Sister Nivedita University, WB</span>
          </div>

          <div className="mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block">Chapter 2</span>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">Literature Survey</h1>
          </div>

          <div className="text-justify text-sm leading-relaxed text-slate-800 space-y-3 mb-6">
            <p>
              The evolution of in-air gesture and handwriting analysis spans multiple sensor modalities and modeling methodologies.
            </p>
            <p>
              Early research by Vikram et al. [4] explored handwriting and gestures in the air using geometric heuristics and hidden Markov models. Subsequent advances introduced depth cameras and wearable sensors; for instance, Alam et al. [3] demonstrated trajectory-based air-writing recognition through depth-sensing cameras, while Patil et al. [10] utilized wearable inertial measurement units (WIMUs) for motion tracking.
            </p>
            <p>
              With the proliferation of deep learning, camera-based touchless interaction became feasible without invasive hardware. Mukherjee et al. [5] proposed robust fingertip detection in natural video streams. Watanabe et al. [1] introduced a 2D camera-based framework integrating hand pose estimation with hybrid deep models. Furthermore, Hsieh et al. [2] developed deep convolutional networks for in-air alphanumeric symbols, and Abir et al. [6] emphasized the criticality of optimal trajectory interpolation.
            </p>
          </div>

          <div className="mb-4 pt-4 border-t border-slate-200">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block">Chapter 3</span>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">Problem Identification</h1>
          </div>

          <div className="text-justify text-sm leading-relaxed text-slate-800 space-y-3">
            <p>
              Recognizing freeform handwriting in three-dimensional space presents unique scientific and engineering hurdles compared to traditional optical character recognition (OCR):
            </p>
            <ol className="list-decimal pl-6 space-y-1">
              <li><strong className="font-semibold">Lack of Tactile Feedback:</strong> Unlike writing on physical paper or capacitive screens, the hand moves in free air without a physical boundary, leading to significant trajectory drift and variance.</li>
              <li><strong className="font-semibold">Stroke Segmentation:</strong> Without pen-up and pen-down triggers, the system must autonomously distinguish active writing strokes from transitional navigation movements.</li>
              <li><strong className="font-semibold">Variable Speed and Motor Tremor:</strong> In-air writing speeds vary non-linearly across users, requiring continuous kinematic interpolation and spatial smoothing.</li>
            </ol>
          </div>
        </div>

        {/* Running LaTeX Footer */}
        <div className="flex justify-between items-center text-xs text-slate-700 border-t border-slate-400 pt-2">
          <span className="font-semibold">Sister Nivedita University, WB</span>
          <span className="font-mono">Page | 2</span>
        </div>
      </div>

      {/* =========================================================================
          PAGE 9: CHAPTER 4 - PROPOSED METHODOLOGY & MATHEMATICAL MODELING
         ========================================================================= */}
      <div className="latex-page shadow-2xl print:shadow-none border border-slate-300 print:border-none font-academic text-slate-900 flex flex-col justify-between latex-page-content">
        <div>
          {/* Running LaTeX Header */}
          <div className="flex justify-between items-end border-b border-slate-800 pb-1 text-xs text-slate-700 uppercase tracking-wider mb-6">
            <span>Chapter 4. Proposed Methodology</span>
            <span>Sister Nivedita University, WB</span>
          </div>

          <div className="mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block">Chapter 4</span>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">Proposed Methodology</h1>
          </div>

          <div className="text-justify text-sm leading-relaxed text-slate-800 space-y-3">
            <p>
              This chapter details the proposed touchless air-writing recognition architecture, mathematical formulation of kinematics, and deep neural network classifier.
            </p>

            <h2 className="text-base font-bold text-slate-900 pt-1">
              4.1 System Architecture
            </h2>
            <p>
              Figure 4.1 depicts the end-to-end processing pipeline, consisting of video acquisition, fingertip localization, trajectory smoothing, feature normalization, and deep neural classification.
            </p>

            {/* Neural Network Diagram */}
            <div className="my-3 text-center">
              <div className="border border-slate-300 p-2 bg-slate-50 rounded inline-block">
                <img
                  src="/figure/Image Classification Using Neural Networks.png"
                  alt="Deep Neural Network Architecture for Air-Writing"
                  className="max-h-48 w-auto object-contain mx-auto"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <p className="text-xs text-slate-600 mt-1 italic font-serif">
                Figure 4.1: Deep Neural Network Architecture Pipeline for Air-Writing Image and Trajectory Classification.
              </p>
            </div>

            <h2 className="text-base font-bold text-slate-900 pt-1">
              4.2 Kinematic Modeling and Mathematical Formulation
            </h2>
            <p>
              The physical trajectory of the fingertip at time <MathRenderer math="t" /> obeys classical kinematics. Under uniform acceleration <MathRenderer math="f" />, the spatial displacement <MathRenderer math="s" /> over time <MathRenderer math="t" /> with initial velocity <MathRenderer math="u" /> is governed by:
            </p>

            {/* Equation (4.1) */}
            <div className="flex items-center justify-between my-2 px-4 bg-slate-50 border border-slate-200 rounded py-1">
              <div className="flex-1 text-center">
                <MathRenderer math="s = ut + \frac{1}{2}ft^2" displayMode={true} />
              </div>
              <span className="text-sm font-semibold text-slate-700">(4.1)</span>
            </div>

            <p>
              To classify continuous stroke boundaries into discrete states (writing vs. hovering), we define the piecewise decision function:
            </p>

            {/* Equation (4.2) Piecewise */}
            <div className="flex items-center justify-between my-2 px-4 bg-slate-50 border border-slate-200 rounded py-1">
              <div className="flex-1 text-center">
                <MathRenderer
                  math="f(x) = \begin{cases} x^2, & x \ge 0, \\ -x, & x < 0. \end{cases}"
                  displayMode={true}
                />
              </div>
              <span className="text-sm font-semibold text-slate-700">(4.2)</span>
            </div>

            <p>
              The cumulative trajectory energy $F(x)$ over interval $[0, x]$ is evaluated via the definite integral:
            </p>

            {/* Equation (4.3) Multiline Integral */}
            <div className="flex items-center justify-between my-2 px-4 bg-slate-50 border border-slate-200 rounded py-1">
              <div className="flex-1 text-center">
                <MathRenderer
                  math="\begin{aligned} F(x) &= \int_0^x (at^2 + bt + c) \, dt \\ &= \left[ \frac{a}{3}t^3 + \frac{b}{2}t^2 + ct \right]_0^x \\ &= \frac{a}{3}x^3 + \frac{b}{2}x^2 + cx \end{aligned}"
                  displayMode={true}
                />
              </div>
              <span className="text-sm font-semibold text-slate-700">(4.3)</span>
            </div>
          </div>
        </div>

        {/* Running LaTeX Footer */}
        <div className="flex justify-between items-center text-xs text-slate-700 border-t border-slate-400 pt-2">
          <span className="font-semibold">Sister Nivedita University, WB</span>
          <span className="font-mono">Page | 3</span>
        </div>
      </div>

      {/* =========================================================================
          PAGE 10: CHAPTER 4 CONTINUED - GAUSSIAN FILTERING & ALGORITHM
         ========================================================================= */}
      <div className="latex-page shadow-2xl print:shadow-none border border-slate-300 print:border-none font-academic text-slate-900 flex flex-col justify-between latex-page-content">
        <div>
          {/* Running LaTeX Header */}
          <div className="flex justify-between items-end border-b border-slate-800 pb-1 text-xs text-slate-700 uppercase tracking-wider mb-6">
            <span>Chapter 4. Mathematical Modeling &amp; Algorithm</span>
            <span>Sister Nivedita University, WB</span>
          </div>

          <div className="text-justify text-sm leading-relaxed text-slate-800 space-y-3">
            <h2 className="text-base font-bold text-slate-900">
              4.3 Spatial Gaussian Filtering &amp; Matrix Convolutions
            </h2>
            <p>
              To eliminate sensor flicker and jitter from human hand tremor, the sampled coordinate points are convolved with a 2D Gaussian filter kernel:
            </p>

            <div className="my-2 p-2 bg-slate-50 border border-slate-200 rounded text-center">
              <MathRenderer
                math="G(x, y) = \frac{1}{2\pi\sigma^2} e^{-\frac{(x^2 + y^2)}{2\sigma^2}}"
                displayMode={true}
              />
              <p className="text-xs text-slate-600 mt-1">
                where <MathRenderer math="G(x, y)" /> is the smoothing weight, <MathRenderer math="\sigma" /> is the standard deviation, and <MathRenderer math="e" /> is Euler's constant.
              </p>
            </div>

            <p>
              The rendered strokes are discretized onto an <MathRenderer math="M \times N" /> matrix grid, convolved with directional edge kernels:
            </p>

            <div className="my-2 p-2 bg-slate-50 border border-slate-200 rounded text-center">
              <MathRenderer
                math="X = \begin{bmatrix} 10 & 20 & 30 \\ 40 & 50 & 60 \\ 70 & 80 & 90 \end{bmatrix}, \qquad Y = \begin{bmatrix} -1 & 0 & 1 \\ -1 & 0 & 1 \\ -1 & 0 & 1 \end{bmatrix}"
                displayMode={true}
              />
            </div>

            <h2 className="text-base font-bold text-slate-900 pt-2">
              4.4 Recognition Algorithm
            </h2>
            <p>
              Algorithm 4.1 describes the real-time pipeline executed for each gesture sequence.
            </p>

            {/* LaTeX Algorithm Block */}
            <div className="border-2 border-slate-800 rounded p-4 bg-white text-xs font-mono my-3 shadow-xs">
              <div className="border-b border-slate-800 pb-2 mb-2 font-sans font-bold text-sm text-slate-900">
                Algorithm 4.1: Air-Writing Trajectory Processing and Classification
              </div>
              <div className="font-sans space-y-1 mb-2 text-slate-800">
                <p>
                  <strong className="text-slate-900 font-semibold">Input:</strong> Video frame stream{' '}
                  <MathRenderer math="\mathcal{V} = \{F_1, F_2, \dots, F_T\}" />, Confidence threshold{' '}
                  <MathRenderer math="\tau" />
                </p>
                <p>
                  <strong className="text-slate-900 font-semibold">Output:</strong> Recognized character class{' '}
                  <MathRenderer math="\hat{C}" /> and confidence score{' '}
                  <MathRenderer math="P(\hat{C})" />
                </p>
              </div>
              <div className="border-t border-slate-300 pt-2 space-y-1 text-slate-800">
                <div className="flex"><span className="w-8 text-slate-400 select-none">1:</span><span>Initialize trajectory buffer <MathRenderer math="\mathcal{T} \gets \emptyset" /></span></div>
                <div className="flex"><span className="w-8 text-slate-400 select-none">2:</span><span><strong>for</strong> <MathRenderer math="t \gets 1" /> <strong>to</strong> <MathRenderer math="T" /> <strong>do</strong></span></div>
                <div className="flex"><span className="w-8 text-slate-400 select-none">3:</span><span className="pl-4">Detect hand keypoints <MathRenderer math="(x_t, y_t)" /> with confidence score <MathRenderer math="c_t" /></span></div>
                <div className="flex"><span className="w-8 text-slate-400 select-none">4:</span><span className="pl-4"><strong>if</strong> <MathRenderer math="c_t \ge \tau" /> <strong>then</strong></span></div>
                <div className="flex"><span className="w-8 text-slate-400 select-none">5:</span><span className="pl-8">Append coordinate <MathRenderer math="(x_t, y_t)" /> to trajectory buffer <MathRenderer math="\mathcal{T}" /></span></div>
                <div className="flex"><span className="w-8 text-slate-400 select-none">6:</span><span className="pl-4"><strong>end if</strong></span></div>
                <div className="flex"><span className="w-8 text-slate-400 select-none">7:</span><span><strong>end for</strong></span></div>
                <div className="flex"><span className="w-8 text-slate-400 select-none">8:</span><span>Apply 2D Gaussian smoothing kernel <MathRenderer math="G(x, y)" /> on buffer <MathRenderer math="\mathcal{T}" /></span></div>
                <div className="flex"><span className="w-8 text-slate-400 select-none">9:</span><span>Interpolate trajectory points to standardized 64 &times; 64 grid</span></div>
                <div className="flex"><span className="w-8 text-slate-400 select-none">10:</span><span>Compute neural feature representation <MathRenderer math="\mathbf{z} = \mathrm{CNN}(\mathcal{T})" /></span></div>
                <div className="flex"><span className="w-8 text-slate-400 select-none">11:</span><span><MathRenderer math="\hat{C} \gets \operatorname{argmax}_k \operatorname{softmax}(\mathbf{z}_k)" /></span></div>
                <div className="flex"><span className="w-8 text-slate-400 select-none">12:</span><span><strong>return</strong> <MathRenderer math="\hat{C}, P(\hat{C})" /></span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Running LaTeX Footer */}
        <div className="flex justify-between items-center text-xs text-slate-700 border-t border-slate-400 pt-2">
          <span className="font-semibold">Sister Nivedita University, WB</span>
          <span className="font-mono">Page | 4</span>
        </div>
      </div>

      {/* =========================================================================
          PAGE 11: CHAPTER 5 - RESULTS, TABLES & COMPLEXITY
         ========================================================================= */}
      <div className="latex-page shadow-2xl print:shadow-none border border-slate-300 print:border-none font-academic text-slate-900 flex flex-col justify-between latex-page-content">
        <div>
          {/* Running LaTeX Header */}
          <div className="flex justify-between items-end border-b border-slate-800 pb-1 text-xs text-slate-700 uppercase tracking-wider mb-6">
            <span>Chapter 5. Results and Discussion</span>
            <span>Sister Nivedita University, WB</span>
          </div>

          <div className="mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block">Chapter 5</span>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">Results and Discussion</h1>
          </div>

          <div className="text-justify text-sm leading-relaxed text-slate-800 space-y-4">
            <h2 className="text-base font-bold text-slate-900">
              5.1 Hardware &amp; Software Environment
            </h2>
            <p>
              The system was tested on an Intel Core i7 processor (2.8 GHz) with 16 GB RAM and an NVIDIA RTX 3060 GPU running Ubuntu 22.04 LTS with PyTorch 2.1 and OpenCV 4.8.
            </p>

            <h2 className="text-base font-bold text-slate-900 pt-1">
              5.2 Performance Metrics
            </h2>
            <p>
              Table 5.1 details the empirical classification accuracy, precision, recall, and F1-score across alphanumeric character categories.
            </p>

            {/* LaTeX Table 5.1 */}
            <div className="my-2">
              <table className="w-full border-collapse border border-slate-400 text-xs text-center">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-400 font-bold text-slate-900">
                    <th className="border border-slate-400 py-1.5 px-2 text-left">Character Category</th>
                    <th className="border border-slate-400 py-1.5 px-2">Samples</th>
                    <th className="border border-slate-400 py-1.5 px-2">Accuracy (%)</th>
                    <th className="border border-slate-400 py-1.5 px-2">Precision (%)</th>
                    <th className="border border-slate-400 py-1.5 px-2">F1-Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300">
                  <tr>
                    <td className="border border-slate-400 py-1 px-2 text-left">Uppercase Alphabet (A–Z)</td>
                    <td className="border border-slate-400 py-1 px-2">5,200</td>
                    <td className="border border-slate-400 py-1 px-2">97.4</td>
                    <td className="border border-slate-400 py-1 px-2">96.8</td>
                    <td className="border border-slate-400 py-1 px-2">0.971</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-400 py-1 px-2 text-left">Lowercase Alphabet (a–z)</td>
                    <td className="border border-slate-400 py-1 px-2">5,200</td>
                    <td className="border border-slate-400 py-1 px-2">95.8</td>
                    <td className="border border-slate-400 py-1 px-2">95.2</td>
                    <td className="border border-slate-400 py-1 px-2">0.955</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-400 py-1 px-2 text-left">Numeric Digits (0–9)</td>
                    <td className="border border-slate-400 py-1 px-2">3,000</td>
                    <td className="border border-slate-400 py-1 px-2">98.9</td>
                    <td className="border border-slate-400 py-1 px-2">98.5</td>
                    <td className="border border-slate-400 py-1 px-2">0.987</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-400 py-1 px-2 text-left">Special Symbols (+, -, *, /)</td>
                    <td className="border border-slate-400 py-1 px-2">1,500</td>
                    <td className="border border-slate-400 py-1 px-2">94.6</td>
                    <td className="border border-slate-400 py-1 px-2">93.9</td>
                    <td className="border border-slate-400 py-1 px-2">0.942</td>
                  </tr>
                  <tr className="font-bold bg-slate-50">
                    <td className="border border-slate-400 py-1.5 px-2 text-left">Overall Combined</td>
                    <td className="border border-slate-400 py-1.5 px-2">14,900</td>
                    <td className="border border-slate-400 py-1.5 px-2 text-blue-900">96.8%</td>
                    <td className="border border-slate-400 py-1.5 px-2">96.1%</td>
                    <td className="border border-slate-400 py-1.5 px-2">0.964</td>
                  </tr>
                </tbody>
              </table>
              <p className="text-xs text-center text-slate-600 mt-1 italic font-serif">
                Table 5.1: Empirical Performance Metrics across Different Air-Writing Subsets.
              </p>
            </div>

            <h2 className="text-base font-bold text-slate-900 pt-1">
              5.3 State-of-the-Art Benchmark Comparison
            </h2>
            <p>
              Table 5.2 benchmarks our proposed architecture against prominent literature.
            </p>

            {/* LaTeX Table 5.2 */}
            <div className="my-2">
              <table className="w-full border-collapse border border-slate-400 text-xs text-center">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-400 font-bold text-slate-900">
                    <th className="border border-slate-400 py-1.5 px-2 text-left">Method / Reference</th>
                    <th className="border border-slate-400 py-1.5 px-2">Sensor Modality</th>
                    <th className="border border-slate-400 py-1.5 px-2">FPS</th>
                    <th className="border border-slate-400 py-1.5 px-2">Accuracy (%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300">
                  <tr>
                    <td className="border border-slate-400 py-1 px-2 text-left">Vikram et al. [4]</td>
                    <td className="border border-slate-400 py-1 px-2">Stereo Cameras</td>
                    <td className="border border-slate-400 py-1 px-2">18</td>
                    <td className="border border-slate-400 py-1 px-2">86.5</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-400 py-1 px-2 text-left">Alam et al. [3]</td>
                    <td className="border border-slate-400 py-1 px-2">Depth Sensor (Kinect)</td>
                    <td className="border border-slate-400 py-1 px-2">24</td>
                    <td className="border border-slate-400 py-1 px-2">92.3</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-400 py-1 px-2 text-left">Mukherjee et al. [5]</td>
                    <td className="border border-slate-400 py-1 px-2">Monocular Webcam</td>
                    <td className="border border-slate-400 py-1 px-2">25</td>
                    <td className="border border-slate-400 py-1 px-2">93.7</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-400 py-1 px-2 text-left">Watanabe et al. [1]</td>
                    <td className="border border-slate-400 py-1 px-2">2D RGB Camera</td>
                    <td className="border border-slate-400 py-1 px-2">28</td>
                    <td className="border border-slate-400 py-1 px-2">95.4</td>
                  </tr>
                  <tr className="font-bold bg-blue-50 text-blue-950">
                    <td className="border border-slate-400 py-1.5 px-2 text-left">Proposed Architecture</td>
                    <td className="border border-slate-400 py-1.5 px-2">Standard 2D Webcam</td>
                    <td className="border border-slate-400 py-1.5 px-2">34</td>
                    <td className="border border-slate-400 py-1.5 px-2 font-bold text-blue-900">96.8%</td>
                  </tr>
                </tbody>
              </table>
              <p className="text-xs text-center text-slate-600 mt-1 italic font-serif">
                Table 5.2: Comparative Evaluation with State-of-the-Art Air-Writing Frameworks.
              </p>
            </div>

            <h2 className="text-base font-bold text-slate-900 pt-1">
              5.4 Computational Complexity Analysis
            </h2>
            <p>
              The asymptotic algorithmic complexity of our trajectory interpolation routine scales as:
            </p>
            <div className="p-2 bg-slate-50 border border-slate-200 rounded text-center">
              <MathRenderer
                math="A(n) \in \Theta(n^{\log_b a}) = \Theta(n^{\log_2 2}) = \Theta(n)"
                displayMode={true}
              />
            </div>
            <p className="text-xs text-slate-700">
              where $n$ represents the stroke coordinate length, confirming linear computational overhead suitable for mobile deployment.
            </p>
          </div>
        </div>

        {/* Running LaTeX Footer */}
        <div className="flex justify-between items-center text-xs text-slate-700 border-t border-slate-400 pt-2">
          <span className="font-semibold">Sister Nivedita University, WB</span>
          <span className="font-mono">Page | 5</span>
        </div>
      </div>

      {/* =========================================================================
          PAGE 12: CHAPTER 6 & BIBLIOGRAPHY
         ========================================================================= */}
      <div className="latex-page shadow-2xl print:shadow-none border border-slate-300 print:border-none font-academic text-slate-900 flex flex-col justify-between latex-page-content">
        <div>
          {/* Running LaTeX Header */}
          <div className="flex justify-between items-end border-b border-slate-800 pb-1 text-xs text-slate-700 uppercase tracking-wider mb-6">
            <span>Chapter 6 &amp; Bibliography</span>
            <span>Sister Nivedita University, WB</span>
          </div>

          <div className="mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block">Chapter 6</span>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">Conclusion and Future Work</h1>
          </div>

          <div className="text-justify text-sm leading-relaxed text-slate-800 space-y-2 mb-6">
            <p>
              In this dissertation, we designed, implemented, and validated an air-writing recognition framework leveraging consumer-grade 2D webcams. By combining real-time fingertip localization with kinematic smoothing and convolutional neural networks, the system achieves 96.8% character classification accuracy at 34 frames per second. Mathematical models including the kinematic motion law, piecewise decision boundaries, Gaussian spatial kernels, and matrix convolutions were rigorously derived.
            </p>
            <p className="font-semibold text-slate-900 pt-1">
              Key Future Directions:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-xs">
              <li>Integrating sequence-to-sequence Transformer architectures for full sentence air-writing with language-model beam search.</li>
              <li>Deploying the model onto low-power edge IoT devices such as Raspberry Pi and NVIDIA Jetson Nano.</li>
              <li>Expanding the alphabet to multi-lingual scripts and complex mathematical shorthand notations.</li>
            </ul>
          </div>

          <div className="pt-4 border-t-2 border-slate-800">
            <h2 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">
              Bibliography
            </h2>

            <div className="space-y-2.5 text-xs text-slate-800 text-left">
              {bibliography.map((item, idx) => (
                <div key={item.id} className="flex items-start gap-2">
                  <span className="font-bold text-blue-950 min-w-[24px]">[{idx + 1}]</span>
                  <div className="leading-relaxed">
                    <span className="font-medium text-slate-900">{item.authors}. </span>
                    <span className="italic">"{item.title}." </span>
                    <span className="font-medium">{item.journal || item.booktitle}</span>
                    {item.volume && <span>, vol. {item.volume}</span>}
                    {item.number && <span>, no. {item.number}</span>}
                    {item.pages && <span>, pp. {item.pages}</span>}
                    {item.year && <span>, {item.year}</span>}
                    {item.publisher && <span>. {item.publisher}</span>}.
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Running LaTeX Footer */}
        <div className="flex justify-between items-center text-xs text-slate-700 border-t border-slate-400 pt-2">
          <span className="font-semibold">Sister Nivedita University, WB</span>
          <span className="font-mono">Page | 6</span>
        </div>
      </div>
    </div>
  );
});

PdfDocumentViewer.displayName = 'PdfDocumentViewer';
