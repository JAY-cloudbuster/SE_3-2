import { useState } from 'react';
import { Upload, CheckCircle } from 'lucide-react';

export default function VerificationForm() {
  const [files, setFiles] = useState({ idProof: null, farmPhoto: null });
  const [submitted, setSubmitted] = useState(false);

  const handleUpload = (e) => {
    // Story 7.1: File validation for ID proof and farm photos [cite: 301]
    const { name, files: uploadedFiles } = e.target;
    setFiles(prev => ({ ...prev, [name]: uploadedFiles[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // API call to store files securely and flag for admin review [cite: 302]
    setSubmitted(true);
  };

  if (submitted) return (
    <div className="glass-card p-10 text-center space-y-4 animate-pulse">
      <CheckCircle className="mx-auto text-emerald-500" size={48} />
      <h3 className="text-xl font-bold text-slate-800">Documents Under Review</h3>
      <p className="text-sm text-slate-500">We are verifying your farm details. A badge will appear soon! [cite: 303]</p>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="glass-card p-6 space-y-6">
      <h2 className="text-xl font-black text-emerald-900">Get Verified Badge</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="border-2 border-dashed border-emerald-100 rounded-xl p-6 text-center cursor-pointer hover:bg-emerald-50 transition-colors">
          <Upload className="mx-auto text-emerald-400 mb-2" />
          <span className="text-xs font-bold text-slate-600">Upload ID Proof</span>
          <input type="file" name="idProof" hidden onChange={handleUpload} />
        </label>
        <label className="border-2 border-dashed border-emerald-100 rounded-xl p-6 text-center cursor-pointer hover:bg-emerald-50 transition-colors">
          <Upload className="mx-auto text-emerald-400 mb-2" />
          <span className="text-xs font-bold text-slate-600">Upload Farm Photo</span>
          <input type="file" name="farmPhoto" hidden onChange={handleUpload} />
        </label>
      </div>
      <button className="btn-primary w-full shadow-emerald-200">Submit for Approval [cite: 300]</button>
    </form>
  );
}