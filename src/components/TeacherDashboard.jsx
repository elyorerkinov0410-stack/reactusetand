import React, { useState } from "react";
import {
  FaPlus,
  FaTrashCan,
  FaXmark,
  FaUserGraduate,
  FaUsers,
  FaChalkboardUser,
  FaCalendarDays,
  FaEnvelope,
  FaUserXmark,
  FaTriangleExclamation
} from "react-icons/fa6";

export default function TeacherDashboard({
  currentUser,
  groups,
  availableStudents,
  onOpenModal,
  onAddStudent,
  onDeleteGroup,
  onRemoveStudentFromGroup,
  onDeleteAccount,
  t,
}) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const myGroups = groups.filter(
    (g) => g.teacherEmail === currentUser.email
  );

  const confirmDeleteAccount = () => {
    setIsDeleteModalOpen(false);
    onDeleteAccount(currentUser.email);
  };

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-sm">
            {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : <FaChalkboardUser />}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {currentUser?.name || t?.teacher || "O'qituvchi"}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm flex items-center gap-2 mt-0.5">
              <span className="flex items-center gap-1.5">
                <FaEnvelope className="text-xs" /> {currentUser?.email}
              </span>
              •
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">Faol profil</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={onOpenModal}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-sm transition"
          >
            <FaPlus />
            <span>{t?.createGroup || "Yangi Guruh Yaratish"}</span>
          </button>

          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="bg-red-500/10 hover:bg-red-600 hover:text-white text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/40 px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition duration-150"
            title="Akkauntni butunlay o'chirish"
          >
            <FaUserXmark className="text-base" />
            <span className="hidden sm:inline">Akkauntni o'chirish</span>
          </button>
        </div>
      </div>

      {/* Guruhlar va O'quvchilar paneli */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Guruhlar ro'yxati */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FaUsers className="text-indigo-600 dark:text-indigo-400" />
            <span>{t?.myGroups || "Sizning guruhlaringiz"} ({myGroups.length})</span>
          </h2>

          {myGroups.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 text-center text-slate-400 text-sm">
              {t?.noGroups || "Sizda hali guruhlar yo'q. Yangi guruh yarating!"}
            </div>
          ) : (
            myGroups.map((group) => (
              <div
                key={group.id}
                className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-lg">{group.title}</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5 flex items-center gap-1.5">
                      <span>{group.subject}</span> • <FaCalendarDays className="text-slate-400" /> <span>{group.schedule}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                      <FaUserGraduate className="text-[10px]" /> {group.students?.length || 0} {t?.studentsCount || "o'quvchi"}
                    </span>
                    <button
                      onClick={() => onDeleteGroup(group.id, group.title)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition text-sm"
                      title="Guruhni o'chirish"
                    >
                      <FaTrashCan />
                    </button>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                    {t?.studentsTitle || "O'quvchilar:"}
                  </p>
                  {!group.students || group.students.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">
                      {t?.noStudentsInGroup || "Guruhda hozircha o'quvchilar yo'q"}
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {group.students.map((st) => (
                        <div
                          key={st.id || st.email}
                          className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/60 px-3 py-2 rounded-xl text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <FaUserGraduate className="text-slate-400" />
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{st.name}</span>
                            <span className="text-slate-400 text-[11px]">({st.email})</span>
                          </div>
                          <button
                            onClick={() => onRemoveStudentFromGroup(group.id, st.id, st.name)}
                            className="text-slate-400 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-950/50 p-1 rounded-md transition font-bold"
                            title="Guruhdan chiqarish"
                          >
                            <FaXmark />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* O'quvchilarni biriktirish */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 h-fit">
          <div className="flex items-center justify-between">
            <h2 className="text-md font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FaUserGraduate className="text-indigo-600 dark:text-indigo-400" />
              <span>{t?.attachStudents || "O'quvchilarni biriktirish"}</span>
            </h2>
            <span className="text-xs font-bold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-full">
              {availableStudents.length}
            </span>
          </div>

          <div className="space-y-3">
            {availableStudents.length === 0 ? (
              <p className="text-xs text-slate-400 italic text-center py-6">
                Platformada hali ro'yxatdan o'tgan o'quvchilar yo'q.
              </p>
            ) : (
              availableStudents.map((student) => (
                <div
                  key={student.id || student.email}
                  className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col gap-2.5"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-indigo-500 text-white flex items-center justify-center font-bold text-xs shrink-0">
                      {student.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{student.name}</p>
                      <p className="text-[11px] text-slate-400 truncate flex items-center gap-1">
                        <FaEnvelope className="text-[9px]" /> {student.email}
                      </p>
                    </div>
                  </div>

                  {myGroups.length > 0 ? (
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          onAddStudent(student, e.target.value);
                          e.target.value = "";
                        }
                      }}
                      className="w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                    >
                      <option value="">{t?.addToGroup || "Guruhga qo'shish..."}</option>
                      {myGroups.map((g) => (
                        <option key={g.id} value={g.title}>
                          {g.title} ({g.schedule})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-[11px] text-slate-400 italic">Avval guruh yarating</p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Akkauntni o'chirish modali */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-100 text-center space-y-5 relative">

            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <FaXmark className="text-base" />
            </button>

            <div className="w-16 h-16 bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center text-3xl mx-auto shadow-inner">
              <FaTriangleExclamation />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Akkauntni o'chirmoqchimisiz?
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
                Ushbu amalni ortga qaytarib bo'lmaydi. Barcha guruhlaringiz va chat yozishmalaringiz butunlay yo'q qilinadi.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="w-full py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-sm transition"
              >
                Bekor qilish
              </button>
              <button
                type="button"
                onClick={confirmDeleteAccount}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-red-600/30 transition flex items-center justify-center gap-2"
              >
                <FaTrashCan className="text-xs" />
                <span>Ha, o'chirilsin</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}