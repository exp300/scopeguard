import React, { useState, useRef } from 'react';
import api from '../api';

export default function ContractUploadModal({ onClose, onUploaded }) {
  const [name, setName] = useState('');
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef();

  function handleFile(f) {
    if (!f) return;
    if (f.type !== 'application/pdf') {
      setError('Only PDF files are accepted');
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setError('File is too large — max 10 MB');
      return;
    }
    setError('');
    setFile(f);
    // Auto-fill name from filename (strip .pdf)
    if (!name) setName(f.name.replace(/\.pdf$/i, '').replace(/[-_]/g, ' '));
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) { setError('Please select a PDF file'); return; }
    if (!name.trim()) { setError('Please enter a contract name'); return; }

    setError('');
    setLoading(true);

    const formData = new FormData();
    formData.append('pdf', file);
    formData.append('name', name.trim());

    try {
      const res = await api.post('/contracts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onUploaded(res.data.contract);
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Upload Contract</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Contract name */}
          <div>
            <label className="label">Project / Contract Name</label>
            <input
              type="text"
              className="input"
              placeholder="e.g. Nike Website Redesign"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              autoFocus
            />
          </div>

          {/* PDF drop zone */}
          <div>
            <label className="label">Contract PDF</label>
            <div
              onClick={() => fileInputRef.current.click()}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                dragOver
                  ? 'border-brand-400 bg-brand-50'
                  : file
                  ? 'border-green-300 bg-green-50'
                  : 'border-gray-200 hover:border-brand-300 hover:bg-brand-50/50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={e => handleFile(e.target.files[0])}
              />
              {file ? (
                <>
                  <p className="text-2xl mb-1">📄</p>
                  <p className="text-sm font-medium text-green-700">{file.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{(file.size / 1024).toFixed(0)} KB</p>
                  <button
                    type="button"
                    onClick={e => { e.stopPropagation(); setFile(null); }}
                    className="text-xs text-red-400 hover:text-red-600 mt-2"
                  >
                    Remove
                  </button>
                </>
              ) : (
                <>
                  <p className="text-2xl mb-2">📎</p>
                  <p className="text-sm text-gray-600">
                    <span className="text-brand-600 font-medium">Click to upload</span> or drag & drop
                  </p>
                  <p className="text-xs text-gray-400 mt-1">PDF only · Max 10 MB</p>
                </>
              )}
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1" disabled={loading}>
              {loading ? 'Uploading & parsing…' : 'Upload Contract'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
