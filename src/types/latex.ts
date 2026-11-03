export interface ProjectFile {
  path: string;
  name: string;
  content: string;
  category: 'main' | 'chapter' | 'bibtext' | 'misc' | 'references';
  description?: string;
}

export interface StudentInfo {
  name: string;
  regNumber: string;
  email: string;
}

export interface ProjectMetadata {
  title: string;
  degree: string;
  department: string;
  university: string;
  place: string;
  year: string;
  submissionDate: string;
  supervisorName: string;
  supervisorDesignation: string;
  students: StudentInfo[];
}

export interface BibItem {
  id: string;
  type: string;
  title: string;
  authors: string;
  journal?: string;
  booktitle?: string;
  volume?: string;
  number?: string;
  pages?: string;
  year?: string;
  publisher?: string;
}

export interface TocEntry {
  id: string;
  title: string;
  number?: string;
  level: 'chapter' | 'section' | 'subsection';
  page: number;
}

export interface MathSnippet {
  id: string;
  title: string;
  category: 'kinematics' | 'calculus' | 'cases' | 'matrices' | 'statistics' | 'symbols';
  code: string;
  displayMode: boolean;
  description: string;
}
