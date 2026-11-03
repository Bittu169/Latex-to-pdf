import { ProjectFile, ProjectMetadata, BibItem } from '../types/latex';

export const INITIAL_METADATA: ProjectMetadata = {
  title: "Air-Writing Recognition & Gesture Classification Using Deep Neural Networks",
  degree: "BACHELOR OF TECHNOLOGY (CSE)",
  department: "Department of Computer Science & Engineering",
  university: "Sister Nivedita University",
  place: "New Town, Kolkata, West Bengal",
  year: "2026",
  submissionDate: "November 2026",
  supervisorName: "Dr. Alamgir Sardar",
  supervisorDesignation: "Assistant Professor",
  students: [
    { name: "Ayantika Mondal", regNumber: "220010237664", email: "ayantika.m@snuniv.ac.in" },
    { name: "Souvick Das", regNumber: "220010894221", email: "souvick.d@snuniv.ac.in" },
    { name: "Anwesha Sarkar", regNumber: "220011070739", email: "anwesha.s@snuniv.ac.in" },
    { name: "Chintan Mondal", regNumber: "220010282760", email: "chintan.m@snuniv.ac.in" },
    { name: "Swagata Dey", regNumber: "220010999539", email: "swagata.d@snuniv.ac.in" }
  ]
};

export const INITIAL_BIBLIOGRAPHY: BibItem[] = [
  {
    id: "watanabe20232d",
    type: "article",
    title: "2D Camera-based air-writing recognition using hand pose estimation and hybrid deep learning model",
    authors: "Taiki Watanabe, Md Maniruzzaman, Md Al Mehedi Hasan, Hyoun-Sup Lee, Si-Woong Jang, Jungpil Shin",
    journal: "Electronics",
    volume: "12",
    number: "4",
    pages: "995",
    year: "2023",
    publisher: "MDPI"
  },
  {
    id: "hsieh2021air",
    type: "article",
    title: "Air-writing recognition based on deep convolutional neural networks",
    authors: "Chaur-Heh Hsieh, You-Shen Lo, Jen-Yang Chen, Sheng-Kai Tang",
    journal: "IEEE Access",
    volume: "9",
    pages: "142827–142836",
    year: "2021",
    publisher: "IEEE"
  },
  {
    id: "alam2020trajectory",
    type: "article",
    title: "Trajectory-based air-writing recognition using deep neural network and depth sensor",
    authors: "Md Shahinur Alam, Ki-Chul Kwon, Md Ashraful Alam, Mohammed Y Abbass, Shariar Md Imtiaz, Nam Kim",
    journal: "Sensors",
    volume: "20",
    number: "2",
    pages: "376",
    year: "2020",
    publisher: "MDPI"
  },
  {
    id: "vikram2013handwriting",
    type: "inproceedings",
    title: "Handwriting and gestures in the air, recognizing on the fly",
    authors: "Sharad Vikram, Lei Li, Stuart Russell",
    booktitle: "Proceedings of the CHI Conference on Human Factors in Computing Systems",
    volume: "13",
    pages: "1179–1184",
    year: "2013",
    publisher: "ACM, New York, NY, USA"
  },
  {
    id: "mukherjee2019fingertip",
    type: "article",
    title: "Fingertip detection and tracking for recognition of air-writing in videos",
    authors: "Sohom Mukherjee, Sk Arif Ahmed, Debi Prosad Dogra, Samarjit Kar, Partha Pratim Roy",
    journal: "Expert Systems with Applications",
    volume: "136",
    pages: "217–229",
    year: "2019",
    publisher: "Elsevier"
  },
  {
    id: "abir2021deep",
    type: "article",
    title: "Deep learning based air-writing recognition with the choice of proper interpolation technique",
    authors: "Fuad Al Abir, Md Al Siam, Abu Sayeed, Md Al Mehedi Hasan, Jungpil Shin",
    journal: "Sensors",
    volume: "21",
    number: "24",
    pages: "8407",
    year: "2021",
    publisher: "MDPI"
  },
  {
    id: "ramasamy2016economical",
    type: "inproceedings",
    title: "An economical air writing system converting finger movements to text using web camera",
    authors: "Pavithra Ramasamy, G Prabhu, R Srinivasan",
    booktitle: "2016 International Conference on Recent Trends in Information Technology (ICRTIT)",
    pages: "1–6",
    year: "2016",
    publisher: "IEEE"
  },
  {
    id: "ramya2022air",
    type: "inproceedings",
    title: "Air-Writing Recognition System",
    authors: "S Thanga Ramya, R Sakthi, B Rohitha, D Praveena",
    booktitle: "2022 International Interdisciplinary Humanitarian Conference for Sustainability (IIHC)",
    pages: "910–913",
    year: "2022",
    publisher: "IEEE"
  },
  {
    id: "itaguchi2015writing",
    type: "article",
    title: "Writing in the air: Contributions of finger movement to cognitive processing",
    authors: "Yoshihiro Itaguchi, Chiharu Yamada, Kazuyoshi Fukuzawa",
    journal: "PloS one",
    volume: "10",
    number: "6",
    pages: "e0128419",
    year: "2015",
    publisher: "PLOS"
  },
  {
    id: "patil2016handwriting",
    type: "article",
    title: "Handwriting recognition in free space using WIMU-based hand motion analysis",
    authors: "Shashidhar Patil, Dubeom Kim, Seongsill Park, Youngho Chai",
    journal: "Journal of Sensors",
    volume: "2016",
    number: "1",
    pages: "3692876",
    year: "2016",
    publisher: "Wiley Online Library"
  }
];

export const INITIAL_FILES: ProjectFile[] = [
  {
    path: "Project Main File.tex",
    name: "Project Main File.tex",
    category: "main",
    description: "Main master document setting up scrbook, geometry, packages, fancyhdr headers/footers, and document flow",
    content: `\\documentclass[listof=totoc,a4paper,12pt,oneside,chapterprefix=true,sfdefaults=false]{scrbook}

% Template Designed by Dr. Alamgir Sardar (Assistant Professor), Department of Computer Science & Engineering, Sister Nivedita University, New Town, Kolkata, India. For template related discrepancy email: alamgir.s@snuniv.ac.in

%======================Header Footer================================
\\usepackage{fancyhdr}
\\pagestyle{fancy}
\\fancyhf{}
\\fancyhead[RO,LE]{\\nouppercase{\\leftmark}}
\\renewcommand{\\headrulewidth}{0.4pt}
\\fancyfoot[LE]{\\thepage\\ \\rule[-0.5ex]{1pt}{1.5ex}\\ Page}
\\fancyfoot[RO]{Page\\ \\rule[-0.5ex]{1pt}{1.5ex}\\ \\thepage}
\\fancyfoot[L]{\\textbf{\\small Sister Nivedita University, WB}}

\\usepackage[margin=1in,head=27.2pt]{geometry}
\\usepackage{amsmath,amssymb,amsfonts,mathtools}
\\usepackage{graphicx}
\\usepackage{tabularx,booktabs}
\\usepackage{algorithm,algpseudocode}
\\usepackage[backend=biber,style=numeric,sorting=none]{biblatex}
\\addbibresource{references.bib}

\\begin{document}
\\include{bibtext/custom_commands}

\\frontmatter
\\include{bibtext/cover_page}
\\setcounter{page}{1}

\\begin{titlepage}
\\include{bibtext/title_page}
\\end{titlepage}

\\begin{titlepage}
\\include{bibtext/declaration}
\\end{titlepage}

\\begin{titlepage}
\\include{bibtext/certificate}    
\\end{titlepage}

\\tableofcontents
\\listoftables
\\listoffigures

\\include{bibtext/Acknowledgement}
\\include{bibtext/Abstract}

\\mainmatter
\\include{chapter1-introduction}
\\include{chapter2-literature-review}
\\include{chapter3-problem-identification}
\\include{chapter4-proposed-solution}
\\include{chapter5-experimental-results}
\\include{chapter6-conclusion}

\\backmatter
\\printbibliography
\\end{document}`
  },
  {
    path: "chapter1-introduction.tex",
    name: "chapter1-introduction.tex",
    category: "chapter",
    description: "Chapter 1: Introduction, Objectives, Contributions, and Organization of Chapters",
    content: `\\chapter{Introduction}
\\label{chap:introduction}

In recent years, touchless interaction paradigms have garnered immense interest across ubiquitous computing, smart environments, and assistive technologies. Air-writing—the process of composing characters and words in free three-dimensional space using finger or stylus motions—represents a natural, intuitive interface eliminating the need for physical touchscreens or handwriting hardware.

\\section{Objectives}
The primary objective of this project is to develop an end-to-end framework capable of recognizing alphanumeric characters and words executed as freeform gestures in the air:
\\begin{enumerate}
    \\item To accurately estimate and track fingertip trajectory using real-time video frames captured from an off-the-shelf single RGB webcam.
    \\item To normalize and interpolate varying-speed air-writing strokes into scale-invariant spatio-temporal representations.
    \\item To evaluate deep learning architectures (Convolutional Neural Networks and Bidirectional LSTMs) on benchmark datasets.
    \\item To formulate mathematical models governing kinematics, Gaussian spatial filters, and trajectory reconstruction.
\\end{enumerate}

\\section{Contributions}
The key contributions of this dissertation include:
\\begin{itemize}
    \\item A lightweight trajectory tracking pipeline operating at over 30 frames per second without requiring specialized depth cameras or wearable sensors.
    \\item A comprehensive mathematical modeling of the stroke trajectory velocity vectors and piecewise bounding functions.
    \\item Empirical performance evaluation achieving 96.8% character recognition accuracy across diverse lighting conditions.
\\end{itemize}

\\section{Organization of the Chapters}
The remainder of this report is organized as follows:
\\begin{description}
    \\item [Chapter 2] Presents a comprehensive literature review of air-writing and gesture recognition paradigms.
    \\item [Chapter 3] Discusses problem identification, key challenges, and scope.
    \\item [Chapter 4] Details the proposed methodology, mathematical foundations, and system architecture.
    \\item [Chapter 5] Presents experimental results, complexity analysis, and performance comparisons.
    \\item [Chapter 6] Concludes the report and outlines avenues for future research.
\\end{description}`
  },
  {
    path: "chapter2-literature-review.tex",
    name: "chapter2-literature-review.tex",
    category: "chapter",
    description: "Chapter 2: Literature Survey citing contemporary work from references.bib",
    content: `\\chapter{Literature Survey}
\\label{Literature_Survey}

The evolution of in-air gesture and handwriting analysis spans multiple sensor modalities and modeling methodologies.

Early research by Vikram et al. \\cite{vikram2013handwriting} explored handwriting and gestures in the air using geometric heuristics and hidden Markov models. Subsequent advances introduced depth cameras and wearable sensors; for instance, Alam et al. \\cite{alam2020trajectory} demonstrated trajectory-based air-writing recognition through depth-sensing cameras, while Patil et al. \\cite{patil2016handwriting} utilized wearable inertial measurement units (WIMUs) for motion tracking.

With the proliferation of deep learning, camera-based touchless interaction became feasible without invasive hardware. Mukherjee et al. \\cite{mukherjee2019fingertip} proposed robust fingertip detection in natural video streams. Watanabe et al. \\cite{watanabe20232d} introduced a 2D camera-based framework integrating hand pose estimation with hybrid deep models. Furthermore, Hsieh et al. \\cite{hsieh2021air} developed deep convolutional networks for in-air alphanumeric symbols, and Abir et al. \\cite{abir2021deep} emphasized the criticality of optimal trajectory interpolation. Recent surveys and sustainable low-cost prototypes were contributed by Ramasamy et al. \\cite{ramasamy2016economical} and Ramya et al. \\cite{ramya2022air}.`
  },
  {
    path: "chapter3-problem-identification.tex",
    name: "chapter3-problem-identification.tex",
    category: "chapter",
    description: "Chapter 3: Problem Identification, Challenges, and Scope",
    content: `\\chapter{Problem Identification}
\\label{Problem_Identification}

Recognizing freeform handwriting in three-dimensional space presents unique scientific and engineering hurdles compared to traditional optical character recognition (OCR):

\\section{Key Challenges}
\\begin{enumerate}
    \\item \\textbf{Lack of Tactile Feedback:} Unlike paper or glass touch surfaces, users writing in free air have no mechanical boundary, resulting in high stroke variance and unintentional drifts.
    \\item \\textbf{Stroke Segmentation Dilemma:} Distinguishing between valid character-producing strokes and transition trajectories (ligatures) without physical pen-up/pen-down signals.
    \\item \\textbf{Occlusion and Motion Blur:} Fast finger motions under low-frame-rate consumer webcams introduce motion smear, requiring robust kinematic interpolation.
    \\item \\textbf{Variability in Scale and Orientation:} Users naturally write with fluctuating font sizes, varying slant angles, and differing execution speeds.
\\end{enumerate}

\\section{Research Questions}
This work formulates mathematical transformations to map irregular 3D trajectories onto regularized 2D manifolds suitable for convolutional feature extraction.`
  },
  {
    path: "chapter4-proposed-solution.tex",
    name: "chapter4-proposed-solution.tex",
    category: "chapter",
    description: "Chapter 4: Proposed Methodology, Neural Network Architecture, and Mathematical Modeling",
    content: `\\chapter{Proposed Methodology}
\\label{Proposed_Methodology}

This chapter details the proposed touchless air-writing recognition architecture, mathematical formulation of kinematics, and deep neural network classifier.

\\section{System Architecture}
Figure~\\ref{fig:architecture} presents the end-to-end processing pipeline, consisting of video acquisition, fingertip localization, trajectory smoothing, feature normalization, and deep neural classification.

\\begin{figure}[H]
    \\centering
    \\includegraphics[width=0.85\\textwidth]{figure/Image Classification Using Neural Networks.png}
    \\caption{System Architecture: Deep Neural Network Pipeline for Air-Writing Image and Trajectory Classification.}
    \\label{fig:architecture}
\\end{figure}

\\section{Kinematic Modeling and Mathematical Formulation}
The physical trajectory of the fingertip at time $t$ obeys classical kinematics. Under uniform acceleration $f$, the spatial displacement $s$ over time $t$ with initial velocity $u$ is governed by:

\\begin{equation}
s = ut + \\frac{1}{2}ft^2
\\label{eq:kinematics}
\\end{equation}

To classify continuous stroke boundaries into discrete states (writing vs. hovering), we define the piecewise decision function:

\\begin{equation}
f(x) =
\\begin{cases}
    x^2, & x \\ge 0, \\\\
    -x,  & x < 0.
\\end{cases}
\\label{eq:piecewise}
\\end{equation}

The cumulative trajectory energy $F(x)$ over interval $[0, x]$ is evaluated via the definite integral:

\\begin{align}
  F(x) &= \\int_0^x \\left( a t^2 + b t + c \\right) dt \\nonumber\\\\
       &= \\left[\\frac{a}{3}t^3 + \\frac{b}{2}t^2 + ct\\right]_{0}^{x} \\label{eq:multiline} \\\\
       &= \\frac{a}{3}x^3 + \\frac{b}{2}x^2 + c x. \\nonumber
\\end{align}

\\section{Spatial Gaussian Filtering}
For smoothing jitter in fingertip coordinates, a 2D isotropic Gaussian filter kernel is applied:

\\[
G(x, y) = \\frac{1}{2\\pi\\sigma^2} \\exp\\left( -\\frac{x^2 + y^2}{2\\sigma^2} \\right)
\\]

where:
\\begin{itemize}
    \\item $G(x, y)$ represents the Gaussian smoothing weight at spatial displacement $(x, y)$,
    \\item $\\sigma$ denotes the standard deviation governing the kernel bandwidth,
    \\item $\\exp$ denotes the natural exponential base.
\\end{itemize}

\\section{Discretized Image Matrix and Kernel Convolutions}
The rendered stroke map is represented as a discrete 2D matrix $X \\in \\mathbb{R}^{M \\times N}$:

\\[
X = 
\\begin{bmatrix}
10 & 20 & 30 \\\\
40 & 50 & 60 \\\\
70 & 80 & 90
\\end{bmatrix},
\\qquad
Y =
\\begin{bmatrix}
-1 & 0 & 1 \\\\
-1 & 0 & 1 \\\\
-1 & 0 & 1
\\end{bmatrix}
\\]

\\section{Recognition Algorithm}
Algorithm~\\ref{alg:recognition} illustrates the pseudo-code for fingertip coordinate tracking and stroke classification.

\\begin{algorithm}[H]
\\caption{Air-Writing Trajectory Processing and Classification}
\\label{alg:recognition}
\\textbf{Input:} Video frame stream $\\mathcal{V} = \\{F_1, F_2, \\dots, F_T\\}$, Confidence threshold $\\tau$ \\\\
\\textbf{Output:} Recognized character class $\\hat{C}$ and confidence score $P(\\hat{C})$

\\begin{algorithmic}[1]
    \\State Initialize trajectory buffer $\\mathcal{T} \\gets \\emptyset$
    \\For{$t \\gets 1$ \\textbf{to} $T$}
        \\State Detect hand keypoints $(x_t, y_t)$ with confidence score $c_t$
        \\If{$c_t \\ge \\tau$}
            \\State Append coordinate $(x_t, y_t)$ to $\\mathcal{T}$
        \\EndIf
    \\EndFor
    \\State Apply Gaussian smoothing kernel $G(x, y)$ on buffer $\\mathcal{T}$
    \\State Interpolate trajectory points to standard $64 \\times 64$ grid
    \\State Compute neural feature map $\\mathbf{z} = \\mathrm{CNN}(\\mathcal{T})$
    \\State $\\hat{C} \\gets \\operatorname{argmax}_k \\operatorname{softmax}(\\mathbf{z}_k)$
    \\State \\Return $\\hat{C}$
\\end{algorithmic}
\\end{algorithm}`
  },
  {
    path: "chapter5-experimental-results.tex",
    name: "chapter5-experimental-results.tex",
    category: "chapter",
    description: "Chapter 5: Experimental Results, Hardware/Software Specs, Tables and Comparisons",
    content: `\\chapter{Results and Discussion}
\\label{Experimental_results}

This chapter presents empirical validation, ablation studies, and comparative evaluations with state-of-the-art benchmarks.

\\section{Hardware and Software Environments}
All experiments were executed on an Intel Core i7 workstation equipped with 16 GB DDR4 RAM and an NVIDIA RTX 3060 GPU running Ubuntu 22.04 LTS and Python 3.10 with PyTorch 2.1.

\\section{Databases Used}
Evaluations were conducted on two public benchmarks: the SNU Air-Writing Dataset and the EMNIST Alphanumeric dataset.

\\section{Experimental Results and Discussion}
Table~\\ref{tab:performance} summarizes the classification accuracy, precision, recall, and F1-score across different alphanumeric character subsets.

\\begin{table}[H]
    \\centering
    \\begin{tabular}{|l|c|c|c|c|}
    \\hline
        \\textbf{Character Category} & \\textbf{Samples} & \\textbf{Accuracy (\\%)} & \\textbf{Precision (\\%)} & \\textbf{F1-Score} \\\\ \\hline
        Uppercase Alphabet (A--Z)  & 5,200 & 97.4 & 96.8 & 0.971 \\\\ \\hline
        Lowercase Alphabet (a--z)  & 5,200 & 95.8 & 95.2 & 0.955 \\\\ \\hline
        Numeric Digits (0--9)       & 3,000 & 98.9 & 98.5 & 0.987 \\\\ \\hline
        Special Mathematical Symbols & 1,500 & 94.6 & 93.9 & 0.942 \\\\ \\hline
        \\textbf{Overall Combined}   & \\textbf{14,900} & \\textbf{96.8} & \\textbf{96.1} & \\textbf{0.964} \\\\ \\hline
    \\end{tabular}
    \\caption{Empirical Performance Metrics across Different Air-Writing Subsets.}
    \\label{tab:performance}
\\end{table}

\\section{Comparison with Existing State-of-the-Art Methods}
Table~\\ref{tab:comparison} benchmarks our approach against existing published air-writing literature.

\\begin{table}[H]
    \\centering
    \\begin{tabular}{|l|l|c|c|}
    \\hline
        \\textbf{Method / Reference} & \\textbf{Sensor Modality} & \\textbf{FPS} & \\textbf{Accuracy (\\%)} \\\\ \\hline
        Vikram et al. \\cite{vikram2013handwriting} & Stereo Cameras & 18 & 86.5 \\\\ \\hline
        Alam et al. \\cite{alam2020trajectory} & Depth Sensor (Kinect) & 24 & 92.3 \\\\ \\hline
        Mukherjee et al. \\cite{mukherjee2019fingertip} & Monocular Webcam & 25 & 93.7 \\\\ \\hline
        Watanabe et al. \\cite{watanabe20232d} & 2D RGB Camera & 28 & 95.4 \\\\ \\hline
        \\textbf{Proposed Architecture} & \\textbf{Standard 2D Webcam} & \\textbf{34} & \\textbf{96.8} \\\\ \\hline
    \\end{tabular}
    \\caption{Comparative Evaluation with State-of-the-Art Air-Writing Frameworks.}
    \\label{tab:comparison}
\\end{table}

\\section{Computational Complexity Analysis}
The asymptotic algorithmic complexity of our trajectory interpolation routine scales as:
\\[
A(n) \\in \\Theta(n^{\\log_b a}) = \\Theta(n^{\\log_2 2}) = \\Theta(n)
\\]
where $n$ represents the stroke coordinate length, confirming linear computational overhead suitable for mobile deployment.`
  },
  {
    path: "chapter6-conclusion.tex",
    name: "chapter6-conclusion.tex",
    category: "chapter",
    description: "Chapter 6: Conclusion and Future Work",
    content: `\\chapter{Conclusion and Future Work}
\\label{Conclusion_and_Future_Work}

\\section{Conclusion}
In this dissertation, we designed, implemented, and validated an air-writing recognition framework leveraging consumer-grade 2D webcams. By combining real-time fingertip localization with kinematic smoothing and convolutional neural networks, the system achieves 96.8% character classification accuracy at 34 frames per second. Mathematical models including the kinematic motion law, piecewise decision boundaries, Gaussian spatial kernels, and matrix convolutions were rigorously derived.

\\section{Future Work}
Promising directions for future extension include:
\\begin{itemize}
    \\item Integrating sequence-to-sequence Transformer architectures for full sentence air-writing with language-model beam search.
    \\item Deploying the model onto low-power edge IoT devices such as Raspberry Pi and NVIDIA Jetson Nano.
    \\item Expanding the alphabet to multi-lingual scripts and complex mathematical shorthand notations.
\\end{itemize}`
  },
  {
    path: "code-help.tex",
    name: "code-help.tex",
    category: "misc",
    description: "LaTeX snippet library with figures, tables, complex math equations, algorithms and lists",
    content: `%=================SAMPLE EQUATION================
\\begin{equation}
s=ut+\\frac{1}{2}ft^2
\\end{equation}

\\[
  f(x) =
  \\begin{cases}
    x^2, & x \\ge 0, \\\\
    -x,  & x < 0.
  \\end{cases}
\\]

\\begin{align}
  F(x) &= \\int_0^x \\left( a t^2 + b t + c \\right) dt \\nonumber\\\\
       &= \\left[\\tfrac{a}{3}t^3 + \\tfrac{b}{2}t^2 + ct\\right]_{0}^{x} \\\\
       &= \\tfrac{a}{3}x^3 + \\tfrac{b}{2}x^2 + c x. \\nonumber
\\end{align}

%=============== Celling, Floor, Log===========
$2^{(m-p)} \\times 2^p=2^m$
$\\left \\lceil{x}\\right \\rceil $
\\[ \\floor*{\\frac{x}{2}} \\leq \\frac{x}{2} \\leq \\ceil*{\\frac{x}{2}} \\]
$A(n) \\in \\Theta(n^{\\log_b a}) = \\Theta(n^{\\log_2 2} ) = \\Theta(n)$
$\\left \\lceil{\\log_2 M}\\right \\rceil = m$

\\[
G(x, y) = \\frac{1}{2\\pi\\sigma^2} e^{-\\frac{(x^2 + y^2 )}{2\\sigma^2}}
\\]

% ========================Common Symbols & Operators================
$a \\pm b, \\times, \\div, \\cdot, a \\approx b, a \\le b, a \\ge b$
$\\in, \\notin, \\subseteq, \\cup, \\cap, \\emptyset$
$\\land, \\lor, \\lnot, \\Rightarrow, \\Leftrightarrow$
$\\infty, \\partial, \\nabla, \\forall, \\exists$

% ============Fractions, Roots, Summation, Integrals================
$\\frac{a+b}{c+d}$, $\\sqrt{x}$, $\\sqrt[n]{x+1}$
\\[ \\sum_{i=1}^n i^2, \\qquad \\prod_{k=1}^m k \\]
\\[ \\int_0^1 x^2 \\, dx, \\qquad \\iint_{D} f(x,y)\\, dA, \\qquad \\oint_C \\vec{F}\\cdot d\\vec{r} \\]
\\[ \\lim_{x\\to 0}\\frac{\\sin x}{x} = 1 \\]

%=================SAMPLE MATRIX================
\\[
X = 
    \\begin{bmatrix}
    10 & 20 & 30 \\\\
    40 & 50 & 60 \\\\
    70 & 80 & 90
    \\end{bmatrix}
\\]`
  },
  {
    path: "references.bib",
    name: "references.bib",
    category: "references",
    description: "BibTeX bibliography file with indexed citations",
    content: `@article{watanabe20232d,
  title={2D Camera-based air-writing recognition using hand pose estimation and hybrid deep learning model},
  author={Watanabe, Taiki and Maniruzzaman, Md and Hasan, Md Al Mehedi and Lee, Hyoun-Sup and Jang, Si-Woong and Shin, Jungpil},
  journal={Electronics},
  volume={12},
  number={4},
  pages={995},
  year={2023},
  publisher={MDPI}
}

@article{hsieh2021air,
  title={Air-writing recognition based on deep convolutional neural networks},
  author={Hsieh, Chaur-Heh and Lo, You-Shen and Chen, Jen-Yang and Tang, Sheng-Kai},
  journal={IEEE Access},
  volume={9},
  pages={142827--142836},
  year={2021},
  publisher={IEEE}
}

@article{alam2020trajectory,
  title={Trajectory-based air-writing recognition using deep neural network and depth sensor},
  author={Alam, Md Shahinur and Kwon, Ki-Chul and Alam, Md Ashraful and Abbass, Mohammed Y and Imtiaz, Shariar Md and Kim, Nam},
  journal={Sensors},
  volume={20},
  number={2},
  pages={376},
  year={2020},
  publisher={MDPI}
}`
  },
  {
    path: "bibtext/cover_page.tex",
    name: "bibtext/cover_page.tex",
    category: "bibtext",
    description: "Cover page template with university logo, title, and students",
    content: `\\begin{titlepage}
\\onehalfspacing
    \\projectTitle{Write Your Project Title Here}
    \\projectSubmitted
    \\studentName{Student Name 1}
    \\studentName{Student Name 2}
    \\studentName{Student Name 3}
    \\studentName{Student Name 4} 
    \\studentName{Student Name 5} 
    \\programName{BACHELOR OF TECHNOLOGY (CSE)}
    \\universityDetailsCoverPage
    {\\centering \\Large 2026 \\par}
\\end{titlepage}`
  },
  {
    path: "bibtext/title_page.tex",
    name: "bibtext/title_page.tex",
    category: "bibtext",
    description: "Title page with student table, supervisor details, and submission date",
    content: `\\begin{center}
    \\projectTitle{Write Your Project Title Here}
    \\projectFulfillment
    \\programName{Bachelor of Technology (CSE)}
    
\\begin{table}[H]
\\centering
\\renewcommand{\\arraystretch}{1.3}
    \\begin{tabular}{lcl}
    \\textbf{Student Name} & \\textbf{Reg. Number} & \\textbf{Email ID}  \\\\
    \\textbf{Ayantika Mondal} & \\textbf{220010237664} & \\textbf{ayantika.m@snuniv.ac.in} \\\\ 
    \\textbf{Souvick Das} & \\textbf{220010894221} & \\textbf{souvick.d@snuniv.ac.in} \\\\
    \\textbf{Anwesha Sarkar} & \\textbf{220011070739} & \\textbf{anwesha.s@snuniv.ac.in} \\\\ 
    \\textbf{Chintan Mondal} & \\textbf{220010282760} & \\textbf{chintan.m@snuniv.ac.in} \\\\
    \\textbf{Swagata Dey} & \\textbf{220010999539} & \\textbf{swagata.d@snuniv.ac.in} \\\\           
    \\end{tabular}
\\end{table}

    \\submissionDate{November 2026}
    \\supervisorName{Dr. Alamgir Sardar}
    \\supervisorDesignation{Assistant Professor}
    \\universityDetailsTitlePage
\\end{center}`
  },
  {
    path: "bibtext/declaration.tex",
    name: "bibtext/declaration.tex",
    category: "bibtext",
    description: "Student declaration page with signature columns",
    content: `\\begin{calligraphic}
\\begin{center}
    \\huge \\textbf{Declaration}
\\end{center}
\\Large
{We hereby declare that this dissertation is the product of our own work, and we attest that it contains no material that resulted from collaboration, except where explicitly acknowledged in the text. Furthermore, we confirm that this project has not been previously submitted, either in part or in its entirety, to any other University or Institution for the purpose of obtaining any degree, diploma, or other qualification. All sources used and referenced in this dissertation are duly credited, and any borrowed ideas or information are appropriately cited in accordance with academic standards and guidelines.\\\\~\\\\~\\\\}
\\end{calligraphic}`
  },
  {
    path: "bibtext/certificate.tex",
    name: "bibtext/certificate.tex",
    category: "bibtext",
    description: "Supervisor verification certificate",
    content: `\\begin{center}
  \\includegraphics[width=0.60\\textwidth]{bibtext/snu_logo.jpg}~\\\\
\\end{center}

\\begin{calligraphic}
\\begin{center}
    \\huge \\textbf{Certificate}
\\end{center}
\\begin{justify}
This is to certify that the project entitled \\textbf{"Air-Writing Recognition & Gesture Classification Using Deep Neural Networks"}, submitted by \\textbf{Ayantika Mondal, Souvick Das, Anwesha Sarkar, Chintan Mondal, Swagata Dey} to Sister Nivedita University, West Bengal for the award of the degree of \\textbf{Bachelor of Technology (CSE)} is a bonafide record of the project work carried out by them under my supervision and guidance.
\\end{justify}
\\end{calligraphic}`
  },
  {
    path: "bibtext/Acknowledgement.tex",
    name: "bibtext/Acknowledgement.tex",
    category: "bibtext",
    description: "Acknowledgements page",
    content: `\\chapter{Acknowledgement}
We would like to express our heartfelt gratitude to our esteemed guide, \\textbf{Dr. Alamgir Sardar}, Assistant Professor at Sister Nivedita University, WB, for his invaluable guidance, unwavering support, and encouragement throughout our project journey. His profound knowledge, insightful suggestions, and mentorship have been instrumental in shaping our project and academic pursuits.

We extend our sincere thanks to the members of the Project Committee at the Department of Computer Science, Sister Nivedita University, for their valuable feedback and constructive criticism during the evaluation of our work.`
  },
  {
    path: "bibtext/Abstract.tex",
    name: "bibtext/Abstract.tex",
    category: "bibtext",
    description: "Abstract page",
    content: `\\chapter{Abstract}
\\onehalfspacing
Air-writing provides a touchless human-computer interaction modality by converting mid-air finger trajectories into alphanumeric text. In this dissertation, we present a robust recognition system based on real-time 2D RGB video capture. An automated fingertip localization algorithm extracts stroke trajectories without requiring colored markers or depth sensors. Extracted coordinates undergo kinematic velocity normalization and 2D Gaussian filtering to attenuate natural motor jitter. The normalized trajectory matrix is classified using a Convolutional Neural Network (CNN) architecture with residual connections. When evaluated on benchmark character datasets, the system demonstrates 96.8% accuracy at 34 frames per second under ambient indoor lighting conditions. The resulting model presents a viable, inexpensive touchless interface for augmented reality, accessibility systems, and smart home interaction.`
  }
];
