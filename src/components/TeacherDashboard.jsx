import React, { useState } from "react";

export default function TeacherDashboard({
  groups,
  availableStudents,
  onOpenModal,
  onAddStudent,
}) {
  const [selectedGroups, setSelectedGroups] = useState({});

  const handleSelectChange = (studentId, groupTitle) => {
    setSelectedGroups({ ...selectedGroups, [studentId]: groupTitle });
  };

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl font-bold">
            AJ
          </div>
          <div>
            <h1 class="text-2xl font-bold text-slate-900">Aliyev Jamshid</h1>
            <p className="text-slate-500 text-sm">
              Matematika o'qituvchisi •{" "}
              <span className="text-emerald-600 font-medium">Aktiv profil</span>
            </p>
          </div>
        </div>
        <button
          onClick={onOpenModal}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 shadow-sm transition"
        >
          <span>+</span> Yangi Guruh Yaratish
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chap tomon: Guruhlar */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            📂 Mening Guruhlarim ({groups.length})
          </h2>

          {groups.map((group) => (
            <div
              key={group.id}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-md">
                    {group.subject}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 mt-1">
                    {group.title}
                  </h3>
                  <p className="text-sm text-slate-500">{group.schedule}</p>
                </div>
                <span className="text-xs bg-emerald-100 text-emerald-800 font-medium px-2.5 py-1 rounded-full">
                  {group.students.length} ta o'quvchi
                </span>
              </div>

              <hr className="border-slate-100" />

              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Guruh a'zolari:
                </p>
                {group.students.length === 0 ? (
                  <p className="text-sm text-slate-400 italic">
                    Hozircha o'quvchilar yo'q
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {group.students.map((st) => (
                      <div
                        key={st.id}
                        className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                            {st.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-800">
                              {st.name}
                            </p>
                            <p className="text-xs text-slate-500">{st.email}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* O'ng tomon: O'quvchi Qo'shish */}
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            👤 O'quvchi Tanlash
          </h2>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <input
              type="text"
              placeholder="O'quvchi ismi..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <div className="space-y-3">
              {availableStudents.map((student) => (
                <div
                  key={student.id}
                  className="p-3.5 border border-slate-200 rounded-xl space-y-2 hover:border-indigo-300 transition"
                >
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-slate-800 text-sm">
                      {student.name}
                    </h4>
                    <span className="text-xs text-slate-400">
                      {student.tag}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{student.subject}</p>

                  <div className="flex gap-2 pt-1">
                    <select
                      onChange={(e) =>
                        handleSelectChange(student.id, e.target.value)
                      }
                      className="w-full text-xs border border-slate-200 rounded-lg p-2 focus:outline-none"
                    >
                      <option value="">Guruh tanlang...</option>
                      {groups.map((g) => (
                        <option key={g.id} value={g.title}>
                          {g.title}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() =>
                        onAddStudent(student, selectedGroups[student.id])
                      }
                      className="bg-indigo-600 text-white text-xs px-3 py-2 rounded-lg hover:bg-indigo-700 transition font-medium whitespace-nowrap"
                    >
                      Qo'shish
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
