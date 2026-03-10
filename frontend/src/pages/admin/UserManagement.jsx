import React, { useState, useEffect, useCallback } from 'react';
import { UserPlus, Users, Sprout, ShoppingCart, ToggleLeft, ToggleRight, Mail, Phone, User, Search, RefreshCw } from 'lucide-react';
import { T } from '../../context/TranslationContext';
import { adminService } from '../../services/adminService';
import toast from 'react-hot-toast';

export default function UserManagement() {
  const [roleFilter, setRoleFilter] = useState('FARMER');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', role: 'FARMER' });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminService.getAllUsers();
      setUsers(res.data?.users || []);
    } catch {
      toast.error('Failed to load users.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const filtered = users.filter(u => {
    if (u.role !== roleFilter) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q) || u.phone?.includes(q);
  });

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await adminService.createUser(form);
      toast.success(`${form.role} account created! Activation email sent.`);
      setForm({ name: '', email: '', phone: '', role: roleFilter });
      setShowCreateForm(false);
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create user.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <header className="flex justify-between items-center bg-slate-900 p-8 rounded-3xl text-white shadow-2xl">
        <div>
          <h1 className="text-3xl font-black"><T>User Management</T></h1>
          <p className="text-slate-400 text-sm"><T>Create and manage platform users</T></p>
        </div>
        <Users size={48} className="text-emerald-400 opacity-50" />
      </header>

      {/* Role Toggle */}
      <div className="flex items-center gap-4">
        <div className="flex bg-slate-100 p-1.5 rounded-2xl">
          <button
            onClick={() => setRoleFilter('FARMER')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              roleFilter === 'FARMER' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-400'
            }`}
          >
            <Sprout size={16} /> <T>Farmers</T>
          </button>
          <button
            onClick={() => setRoleFilter('BUYER')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              roleFilter === 'BUYER' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-400'
            }`}
          >
            <ShoppingCart size={16} /> <T>Buyers</T>
          </button>
        </div>

        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            className="input-field pl-10 w-full max-w-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button onClick={() => { setForm({ ...form, role: roleFilter }); setShowCreateForm(true); }} className="btn-primary flex items-center gap-2 bg-gradient-to-br from-emerald-600 to-emerald-700">
          <UserPlus size={16} /> <T>Create User</T>
        </button>
        <button onClick={fetchUsers} className="p-2.5 rounded-xl border border-slate-200 text-slate-400 hover:text-emerald-600 hover:border-emerald-200 transition-all">
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Create User Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={() => setShowCreateForm(false)}>
          <div className="glass-card p-8 w-full max-w-md animate-slide-up" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
              <UserPlus size={20} className="text-emerald-600" />
              <T>Create New User</T>
            </h3>
            <form className="space-y-4" onSubmit={handleCreate}>
              <div>
                <label className="label-text"><T>Full Name</T></label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input required className="input-field pl-10" placeholder="Enter full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="label-text"><T>Email</T></label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input required type="email" className="input-field pl-10" placeholder="email@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="label-text"><T>Phone Number</T></label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input required type="tel" className="input-field pl-10" placeholder="10-digit phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="label-text"><T>Role</T></label>
                <div className="flex gap-3">
                  {['FARMER', 'BUYER'].map(r => (
                    <button key={r} type="button" onClick={() => setForm({ ...form, role: r })}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${
                        form.role === r ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 text-slate-400'
                      }`}
                    >
                      {r === 'FARMER' ? <Sprout size={14} className="inline mr-1.5" /> : <ShoppingCart size={14} className="inline mr-1.5" />}
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowCreateForm(false)} className="flex-1 py-2.5 rounded-xl text-sm font-bold border border-slate-200 text-slate-500 hover:bg-slate-50">
                  <T>Cancel</T>
                </button>
                <button type="submit" disabled={creating} className="flex-1 btn-primary bg-gradient-to-br from-emerald-600 to-emerald-700">
                  {creating ? 'Creating...' : <T>Create & Send Email</T>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User List */}
      <div className="glass-card overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="p-4 text-xs font-black uppercase text-slate-400"><T>Name</T></th>
              <th className="p-4 text-xs font-black uppercase text-slate-400"><T>Email</T></th>
              <th className="p-4 text-xs font-black uppercase text-slate-400"><T>Phone</T></th>
              <th className="p-4 text-xs font-black uppercase text-slate-400 text-center"><T>Status</T></th>
              <th className="p-4 text-xs font-black uppercase text-slate-400 text-center"><T>Verified</T></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan={5} className="p-8 text-center text-slate-400 font-bold">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-slate-400 font-bold">No {roleFilter.toLowerCase()}s found</td></tr>
            ) : (
              filtered.map(u => (
                <tr key={u._id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-bold text-slate-700">{u.name}</td>
                  <td className="p-4 text-sm text-slate-500">{u.email}</td>
                  <td className="p-4 text-sm text-slate-500">{u.phone || '—'}</td>
                  <td className="p-4 text-center">
                    {u.isActive ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-700">
                        <ToggleRight size={12} /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-100 text-amber-700">
                        <ToggleLeft size={12} /> Pending
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    {u.isVerified ? (
                      <span className="text-[10px] font-black text-emerald-600">Verified</span>
                    ) : (
                      <span className="text-[10px] font-black text-slate-400">—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
