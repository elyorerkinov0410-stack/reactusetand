import React, { useState } from "react";
import {
  FaUserGraduate,
  FaBookOpen,
  FaCalendarDays,
  FaUsers,
  FaChalkboardUser,
  FaEnvelope,
  FaUserXmark,
  FaTriangleExclamation,
  FaTrashCan,
  FaXmark,
} from "react-icons/fa6";

export default function StudentDashboard({ currentUser, groups = [], onDeleteAccount, t }) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const myGroups = groups.filter((g) =>
    g.students?.some((st) => st.email === currentUser.email)
  );

  const confirmDeleteAccount = () => {
    setIsDeleteModalOpen(false);
    onDeleteAccount(currentUser.email);
  };

  return (
    <div className="space-y-8 transition-colors duration-200">
      {/* Profil Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-colors duration-200">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center text-3xl font-bold shadow-sm transition-colors duration-200">
            {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : <FaUserGraduate />}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white transition-colors duration-200">
              {currentUser?.name || "O'quvchi"}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm flex items-center gap-2 mt-0.5 transition-colors duration-200">
              <span className="flex items-center gap-1.5">
                <FaEnvelope className="text-xs" /> {currentUser?.email}
              </span>
              •
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                Faol O'quvchi
              </span>
            </p>
          </div>
        </div>

        {/* Guruhlar soni & Akkauntni o'chirish */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-center transition-colors duration-200">
            <span className="block text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              Guruhlarim soni
            </span>
            <span className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400">
              {myGroups.length} ta
            </span>
          </div>

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

      {/* Guruhlar bo'limi */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 transition-colors duration-200">
            <FaBookOpen className="text-indigo-600 dark:text-indigo-400" />
            <span>Mening dars guruhlarim ({myGroups.length})</span>
          </h2>
        </div>

        {myGroups.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 text-center space-y-3 transition-colors duration-200">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center mx-auto text-2xl transition-colors duration-200">
              <FaUsers />
            </div>
            <h3 className="text-base font-bold text-slate-700 dark:text-slate-300 transition-colors duration-200">
              Siz hali hech qaysi guruhga qo'shilmagansiz
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              O'qituvchingiz profilingizdagi Gmail manzilingiz orqali sizni tegishli guruhga biriktirishi mumkin.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {myGroups.map((group) => (
              <div
                key={group.id}
                className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:shadow-md transition-colors duration-200 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-100 dark:border-indigo-900/60 px-3 py-1 rounded-xl transition-colors duration-200">
                      {group.subject}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1 transition-colors duration-200">
                      <FaUsers className="text-slate-400" /> {group.students?.length || 0} o'quvchi
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-snug transition-colors duration-200">
                    {group.title}
                  </h3>

                  <div className="space-y-2 text-xs pt-1">
                    <p className="text-slate-600 dark:text-slate-300 flex items-center gap-2 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 transition-colors duration-200">
                      <FaCalendarDays className="text-indigo-500 shrink-0" />
                      <span>{group.schedule}</span>
                    </p>
                    <p className="text-slate-600 dark:text-slate-300 flex items-center gap-2 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 truncate transition-colors duration-200">
                      <FaChalkboardUser className="text-emerald-500 shrink-0" />
                      <span className="truncate">O'qituvchi: <strong>{group.teacherEmail}</strong></span>
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs transition-colors duration-200">
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    ● Faol dars
                  </span>
                  <span className="text-slate-400">
                    Siz a'zosiz
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ⚠️ O'QUVCHI UCHUN AKKAUNTNI O'CHIRISH MODALI */}
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
                Akkauntingizni o'chirmoqchimisiz?
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
                Ushbu amalni ortga qaytarib bo'lmaydi. Barcha guruhlardan chiqib ketasiz va reytingdagi natijalaringiz butunlay o'chiriladi.
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