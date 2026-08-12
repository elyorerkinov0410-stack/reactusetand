import React, { useState } from 'react';

export default function CreateGroupModal({ onClose, onCreate }) {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [schedule, setSchedule] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !subject || !schedule) return alert("Barcha maydonlarni to'ldiring!");
    onCreate({ title, subject, schedule });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-900">Yangi Guruh Yaratish</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Guruh Nomi</label>
            <input
              type="text"
              placeholder="Masalan: Fizika Intensive 2026"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Fan / Yo'nalish</label>
            <input
              type="text"
              placeholder="Masalan: Fizika"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Dars Vaqtlari</label>
            <input
              type="text"
              placeholder="Masalan: Seshanba, Payshanba (14:00)"
              value={schedule}
              onChange={(e) => setSchedule(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 bg-slate-100 text-slate-600 py-2.5 rounded-xl font-medium text-sm hover:bg-slate-200 transition"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="w-1/2 bg-indigo-600 text-white py-2.5 rounded-xl font-medium text-sm hover:bg-indigo-700 transition"
            >
              Saqlash
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}