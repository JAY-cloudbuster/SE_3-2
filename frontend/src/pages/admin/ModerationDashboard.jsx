/**
 * @fileoverview Moderation Dashboard Page for AgriSahayak Admin Panel
 * 
 * Admin command center for system oversight and user trust management.
 * Tabbed interface with three sections:
 * - Verifications: Review farmer ID proofs and approve/reject badges
 * - Disputes: View active trade dispute threads (placeholder)
 * - Reports: (placeholder tab)
 * 
 * @component ModerationDashboard
 * @see Epic 7, Story 7.5 - Admin Moderation Dashboard
 * @see VerificationForm - Farmer-facing form that submits documents for review
 */
import { useState } from 'react';
import { ShieldCheck, AlertTriangle, Scale } from 'lucide-react';

export default function ModerationDashboard() {
  const [activeTab, setActiveTab] = useState('verifications');

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <header className="flex justify-between items-center bg-slate-900 p-8 rounded-3xl text-white shadow-2xl">
        <div>
          <h1 className="text-3xl font-black">Moderation Command Center</h1>
          <p className="text-slate-400 text-sm">System oversight and user trust management [cite: 330]</p>
        </div>
        <ShieldCheck size={48} className="text-emerald-400 opacity-50" />
      </header>

      {/* Admin Tabbed Interface  */}
      <div className="flex gap-4 p-1 bg-slate-100 rounded-2xl w-fit">
        {['verifications', 'disputes', 'reports'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-xl text-sm font-bold capitalize transition-all ${activeTab === tab ? 'bg-white shadow-md text-slate-900' : 'text-slate-500'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {activeTab === 'verifications' && (
          <div className="glass-card overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="p-4 text-xs font-black uppercase text-slate-400">Farmer Name</th>
                  <th className="p-4 text-xs font-black uppercase text-slate-400">Documents</th>
                  <th className="p-4 text-xs font-black uppercase text-slate-400 text-right">Actions [cite: 307]</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[1, 2].map(i => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-bold text-slate-700">Farmer {i}</td>
                    <td className="p-4 text-emerald-600 underline text-sm cursor-pointer">Preview ID_Proof.jpg [cite: 306]</td>
                    <td className="p-4 text-right space-x-2">
                      <button className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold hover:bg-emerald-200">Approve</button>
                      <button className="px-3 py-1 bg-rose-100 text-rose-700 rounded-lg text-xs font-bold hover:bg-rose-200">Reject [cite: 307]</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'disputes' && (
          <div className="flex flex-col items-center justify-center h-64 glass-card text-slate-400">
            <Scale size={48} className="mb-4 opacity-20" />
            <p className="font-bold">No active dispute threads [cite: 327]</p>
          </div>
        )}
      </div>
    </div>
  );
}