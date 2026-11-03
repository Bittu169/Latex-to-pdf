import React, { useState } from 'react';
import { ProjectMetadata } from '../types/latex';
import { X, UserPlus, Trash2, Check, Sliders } from 'lucide-react';

interface QuickSettingsModalProps {
  isOpen: boolean;
  metadata: ProjectMetadata;
  onClose: () => void;
  onSave: (newMetadata: ProjectMetadata) => void;
}

export const QuickSettingsModal: React.FC<QuickSettingsModalProps> = ({
  isOpen,
  metadata,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<ProjectMetadata>(metadata);

  if (!isOpen) return null;

  const handleStudentChange = (index: number, field: string, value: string) => {
    const updated = [...formData.students];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, students: updated });
  };

  const handleAddStudent = () => {
    if (formData.students.length >= 6) return;
    setFormData({
      ...formData,
      students: [
        ...formData.students,
        {
          name: `Student Name ${formData.students.length + 1}`,
          regNumber: `22001000000${formData.students.length + 1}`,
          email: `student${formData.students.length + 1}@snuniv.ac.in`
        }
      ]
    });
  };

  const handleRemoveStudent = (index: number) => {
    if (formData.students.length <= 1) return;
    const updated = formData.students.filter((_, i) => i !== index);
    setFormData({ ...formData, students: updated });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-blue-600" />
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Project Metadata &amp; Student Info
              </h2>
              <p className="text-xs text-slate-500">
                Update thesis title, supervisor, and student details. Updates reflect across Cover, Title, Declaration, Certificate, and PDF.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Project Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Project Title
            </label>
            <textarea
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              rows={2}
              className="w-full text-sm font-medium border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              required
            />
          </div>

          {/* Degree & Year */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Degree / Program
              </label>
              <input
                type="text"
                value={formData.degree}
                onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                className="w-full text-sm border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Submission Date / Month
              </label>
              <input
                type="text"
                value={formData.submissionDate}
                onChange={(e) => setFormData({ ...formData, submissionDate: e.target.value })}
                className="w-full text-sm border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                required
              />
            </div>
          </div>

          {/* Supervisor Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Supervisor Name
              </label>
              <input
                type="text"
                value={formData.supervisorName}
                onChange={(e) => setFormData({ ...formData, supervisorName: e.target.value })}
                className="w-full text-sm border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Supervisor Designation
              </label>
              <input
                type="text"
                value={formData.supervisorDesignation}
                onChange={(e) => setFormData({ ...formData, supervisorDesignation: e.target.value })}
                className="w-full text-sm border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                required
              />
            </div>
          </div>

          {/* Department & University */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Department
              </label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full text-sm border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                University &amp; Campus
              </label>
              <input
                type="text"
                value={formData.university}
                onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                className="w-full text-sm border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                required
              />
            </div>
          </div>

          {/* Students Group Members */}
          <div className="pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Group Members ({formData.students.length})
              </label>
              <button
                type="button"
                onClick={handleAddStudent}
                disabled={formData.students.length >= 6}
                className="text-xs flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-800 disabled:opacity-40"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Add Member</span>
              </button>
            </div>

            <div className="space-y-3">
              {formData.students.map((student, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-1 md:grid-cols-12 gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200 items-center text-xs"
                >
                  <div className="md:col-span-4">
                    <input
                      type="text"
                      placeholder="Student Full Name"
                      value={student.name}
                      onChange={(e) => handleStudentChange(idx, 'name', e.target.value)}
                      className="w-full border border-slate-300 rounded p-1.5 bg-white font-medium"
                      required
                    />
                  </div>
                  <div className="md:col-span-4">
                    <input
                      type="text"
                      placeholder="Registration Number"
                      value={student.regNumber}
                      onChange={(e) => handleStudentChange(idx, 'regNumber', e.target.value)}
                      className="w-full border border-slate-300 rounded p-1.5 bg-white"
                      required
                    />
                  </div>
                  <div className="md:col-span-3">
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={student.email}
                      onChange={(e) => handleStudentChange(idx, 'email', e.target.value)}
                      className="w-full border border-slate-300 rounded p-1.5 bg-white"
                      required
                    />
                  </div>
                  <div className="md:col-span-1 text-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveStudent(idx)}
                      disabled={formData.students.length <= 1}
                      className="p-1 text-slate-400 hover:text-rose-600 disabled:opacity-20"
                      title="Remove Member"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>Apply Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
