import React from 'react';

export default function StudentDashboard({ groups }) {
  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl font-bold">
            SD
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Sardor Diyorov</h1>
            <p className="text-slate-500 text-sm">O'quvchi • <span className="text-emerald-600 font-medium">Faol</span></p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chap: A'zo bo'lingan guruhlar */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            📖 Mening Guruhlarim
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {groups.map((g) => (
              <div key={g.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-md inline-block">
                  {g.subject}
                </span>
                <h3 className="font-bold text-slate-900 text-lg">{g.title}</h3>
                <p className="text-xs text-slate-500">O'qituvchi: Aliyev Jamshid</p>
                <p className="text-xs text-slate-400">{g.schedule}</p>
              </div>
            ))}
          </div>
        </div>

        {/* O'ng: O'qituvchi tanlash */}
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            🔍 O'qituvchi Qidirish
          </h2>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <input
              type="text"
              placeholder="O'qituvchi ismi yoki fan..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />

            <div className="p-4 border border-slate-200 rounded-xl space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center font-bold text-sm">
                  AJ
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 text-sm">Aliyev Jamshid</h4>
                  <p className="text-xs text-slate-500">Matematika / Oliy Ma'lumotli</p>
                </div>
              </div>
              <button
                onClick={() => alert("So'rov yuborildi! O'qituvchi tasdiqlagach guruhga qo'shilasiz.")}
                className="w-full bg-emerald-600 text-white text-xs py-2 rounded-lg hover:bg-emerald-700 transition font-medium"
              >
                O'qituvchiga So'rov Yuborish
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}