import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import TeacherDashboard from "./components/TeacherDashboard";
import StudentDashboard from "./components/StudentDashboard";
import CreateGroupModal from "./components/CreateGroupModal";
import AuthModal from "./components/AuthModal";
import Toast from "./components/Toast";
import RatingPage from "./components/RatingPage";
import GroupsPage from "./components/GroupsPage";
import { translations } from "./translations";

// React Icons
import {
  FaGraduationCap,
  FaUsers,
  FaTrophy,
  FaComments,
  FaPlus,
  FaRightToBracket,
  FaTriangleExclamation,
  FaClock,
  FaXmark,
  FaBookOpen,
} from "react-icons/fa6";

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem("currentUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [lang, setLang] = useState(() => {
    return localStorage.getItem("lang") || "uz";
  });
  const t = translations[lang] || translations.uz;

  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("darkMode");
    return savedTheme ? JSON.parse(savedTheme) : false;
  });

  const [activeTab, setActiveTab] = useState("home");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // ⚠️ Vaqt to'qnashuvi yuz berganda chiqadigan Modal State'i
  const [conflictModalData, setConflictModalData] = useState(null);

  const showNotification = (message, type = "info") => {
    setToast({ message, type });
  };

  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const savedUsers = localStorage.getItem("registeredUsers");
    return savedUsers ? JSON.parse(savedUsers) : [];
  });

  const [groups, setGroups] = useState(() => {
    const savedGroups = localStorage.getItem("groups");
    return savedGroups ? JSON.parse(savedGroups) : [];
  });

  const realStudents = registeredUsers.filter((u) => u.role === "student");

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  useEffect(() => {
    localStorage.setItem("groups", JSON.stringify(groups));
  }, [groups]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [currentUser]);

  const handleAuth = (userData, isLoginView) => {
    if (isLoginView) {
      setCurrentUser(userData);
      setIsAuthModalOpen(false);
    } else {
      const emailExists = registeredUsers.some(
        (u) => u.email.toLowerCase() === userData.email.toLowerCase()
      );
      if (emailExists) {
        return showNotification("Bu Gmail manzil allaqachon ro'yxatdan o'tgan!", "warning");
      }

      const newUser = {
        id: Date.now(),
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: userData.role,
        score: 0,
      };

      setRegisteredUsers((prev) => [...prev, newUser]);
      setCurrentUser(newUser);
      setIsAuthModalOpen(false);
      showNotification("Muvaffaqiyatli ro'yxatdan o'tdingiz!", "success");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab("home");
    showNotification("Tizimdan chiqdingiz", "info");
  };

  const handleDeleteAccount = (userEmail) => {
    setRegisteredUsers((prevUsers) =>
      prevUsers.filter((u) => u.email.toLowerCase() !== userEmail.toLowerCase())
    );

    setGroups((prevGroups) =>
      prevGroups
        .filter((g) => g.teacherEmail?.toLowerCase() !== userEmail.toLowerCase())
        .map((g) => ({
          ...g,
          students: (g.students || []).filter(
            (st) => st.email?.toLowerCase() !== userEmail.toLowerCase()
          ),
        }))
    );

    setCurrentUser(null);
    setActiveTab("home");
    showNotification("Akkauntingiz butunlay o'chirildi!", "info");
  };

  const handleOpenCreateGroup = () => {
    if (!currentUser) {
      showNotification("Guruh yaratish uchun avval tizimga kiring!", "warning");
      setIsAuthModalOpen(true);
      return;
    }
    if (currentUser.role !== "teacher") {
      showNotification("Faqat o'qituvchilar guruh yarata oladi!", "warning");
      return;
    }
    setIsModalOpen(true);
  };

  const handleCreateGroup = (newGroup) => {
    const groupWithTeacher = {
      ...newGroup,
      id: Date.now(),
      students: [],
      teacherEmail: currentUser.email,
    };

    setGroups((prev) => [...prev, groupWithTeacher]);
    setIsModalOpen(false);
    showNotification(`"${newGroup.title}" guruhi yaratildi!`, "success");
  };

  const handleDeleteGroup = (groupId, groupTitle) => {
    setGroups((prev) => prev.filter((g) => g.id !== groupId));
    showNotification(`"${groupTitle}" guruhi o'chirildi!`, "info");
  };

  const handleRemoveStudentFromGroup = (groupId, studentId, studentName) => {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id === groupId) {
          return {
            ...g,
            students: g.students.filter((s) => s.id !== studentId),
          };
        }
        return g;
      })
    );
    showNotification(`${studentName} guruhdan chiqarildi!`, "info");
  };

  // 🕒 VAQTLARNI TEKSHIRISH FUNKSIYALARI
  // Vaqt satrini (masalan: "16:00 - 18:00") daqiqalarga aylantirish
  const parseSchedule = (scheduleStr) => {
    if (!scheduleStr) return null;
    const timeMatch = scheduleStr.match(/(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})/);
    if (!timeMatch) return null;

    const toMinutes = (str) => {
      const [h, m] = str.split(":").map(Number);
      return h * 60 + m;
    };

    const start = toMinutes(timeMatch[1]);
    const end = toMinutes(timeMatch[2]);

    const days = [
      "dushanba",
      "seshanba",
      "chorshanba",
      "payshanba",
      "juma",
      "shanba",
      "yakshanba",
    ].filter((day) => scheduleStr.toLowerCase().includes(day));

    return { start, end, days };
  };

  // Ikki jadval o'rtasida vaqt to'qnashuvi borligini tekshirish
  const checkConflict = (sched1Str, sched2Str) => {
    const s1 = parseSchedule(sched1Str);
    const s2 = parseSchedule(sched2Str);

    if (!s1 || !s2) return false;

    // Kunlar mos tushadimi? (Agar ikkalasida ham kunlar bo'lsa yoki umumiy bo'lsa)
    const hasCommonDay =
      s1.days.length === 0 ||
      s2.days.length === 0 ||
      s1.days.some((d) => s2.days.includes(d));

    if (!hasCommonDay) return false;

    // Vaqt oralig'i kesishadimi? (start1 < end2 && start2 < end1)
    const timeOverlaps = s1.start < s2.end && s2.start < s1.end;
    return timeOverlaps;
  };

  // 👥 O'QUVCHINI GURUHGA QO'SHISH (Vaqt kolliziyasini tekshirish bilan)
  const handleAddStudentToGroup = (student, targetGroupTitle) => {
    if (!currentUser) {
      showNotification("Amalni bajarish uchun tizimga kiring!", "warning");
      setIsAuthModalOpen(true);
      return;
    }

    if (!targetGroupTitle) return;

    const targetGroup = groups.find((g) => g.title === targetGroupTitle);
    if (!targetGroup) return;

    // 1. Allaqachon shu guruhda bormi?
    const alreadyInGroup = targetGroup.students?.some((s) => s.email === student.email);
    if (alreadyInGroup) {
      return showNotification(`${student.name} allaqachon ushbu guruhda bor!`, "warning");
    }

    // 2. O'quvchi qatnashayotgan BARCHA boshqa guruhlarni tekshiramiz
    const studentEnrolledGroups = groups.filter((g) =>
      g.students?.some((s) => s.email === student.email)
    );

    // Vaqt to'qnashgan guruhni aniqlash
    const conflictingGroup = studentEnrolledGroups.find((enrolledGroup) =>
      checkConflict(targetGroup.schedule, enrolledGroup.schedule)
    );

    // ⛔ Agar to'qnashuv bo'lsa, CHIROYLI MODALNI ochamiz!
    if (conflictingGroup) {
      setConflictModalData({
        studentName: student.name,
        targetGroupTitle: targetGroup.title,
        targetSchedule: targetGroup.schedule,
        conflictingGroupTitle: conflictingGroup.title,
        conflictingSchedule: conflictingGroup.schedule,
        conflictingTeacher: conflictingGroup.teacherEmail,
      });
      return;
    }

    // 3. Agar to'qnashuv bo'lmasa, guruhga qo'shamiz
    setGroups((prevGroups) =>
      prevGroups.map((g) => {
        if (g.id === targetGroup.id) {
          return {
            ...g,
            students: [
              ...(g.students || []),
              {
                id: student.id || Date.now(),
                name: student.name,
                email: student.email,
              },
            ],
          };
        }
        return g;
      })
    );

    showNotification(`${student.name} "${targetGroup.title}" guruhiga qo'shildi!`, "success");
  };

  return (
    <div
      className={`min-h-screen font-sans relative transition-colors duration-200 ${darkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-800"
        }`}
    >
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Navbar */}
      <Navbar
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        lang={lang}
        setLang={setLang}
        t={t}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 1. HOME */}
        {activeTab === "home" && (
          currentUser ? (
            currentUser.role === "teacher" ? (
              <TeacherDashboard
                currentUser={currentUser}
                groups={groups}
                availableStudents={realStudents}
                onOpenModal={handleOpenCreateGroup}
                onAddStudent={handleAddStudentToGroup}
                onDeleteGroup={handleDeleteGroup}
                onRemoveStudentFromGroup={handleRemoveStudentFromGroup}
                onDeleteAccount={handleDeleteAccount}
                t={t}
              />
            ) : (
              <StudentDashboard
                currentUser={currentUser}
                groups={groups}
                onDeleteAccount={handleDeleteAccount}
                t={t}
              />
            )
          ) : (
            <div className="space-y-8">
              <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-3 max-w-xl">
                  <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                    Bilimlar Olamiga Xush Kelibsiz!
                  </h1>
                  <p className="text-indigo-100 text-sm sm:text-base leading-relaxed">
                    Platformamiz orqali fanlarni o'rganing, o'z guruhlaringizda dars o'ting va Telegram uslubidagi guruh chatlarida muloqot qiling.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-3">
                    <button
                      onClick={handleOpenCreateGroup}
                      className="bg-white text-indigo-600 hover:bg-slate-100 px-6 py-3 rounded-2xl font-bold text-sm shadow-md transition flex items-center gap-2"
                    >
                      <FaPlus /> <span>{t.createGroup}</span>
                    </button>
                    <button
                      onClick={() => setIsAuthModalOpen(true)}
                      className="bg-indigo-700/60 hover:bg-indigo-700 border border-white/20 text-white px-6 py-3 rounded-2xl font-bold text-sm transition flex items-center gap-2"
                    >
                      <FaRightToBracket /> <span>{t.login} / {t.register}</span>
                    </button>
                  </div>
                </div>
                <div className="text-7xl sm:text-8xl text-indigo-200/80 select-none">
                  <FaGraduationCap />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xl shadow-sm">
                    <FaUsers />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg">{t.groups}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    O'quv guruhlari va dars jadvallarini boshqaring.
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-500 dark:text-amber-400 flex items-center justify-center text-xl shadow-sm">
                    <FaTrophy />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg">{t.rating}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Bilimdon o'quvchilar va eng faol ishtirokchilar reytingi.
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xl shadow-sm">
                    <FaComments />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg">Telegram Chat</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Guruh a'zolari bilan video, rasm va xabarlar almashing.
                  </p>
                </div>
              </div>
            </div>
          )
        )}

        {/* 2. REYTING */}
        {activeTab === "rating" && (
          <RatingPage registeredUsers={registeredUsers} t={t} />
        )}

        {/* 3. GURUHLAR VA TELEGRAM CHAT */}
        {activeTab === "groups" && (
          <GroupsPage
            groups={groups}
            currentUser={currentUser}
            t={t}
            onOpenAuth={() => setIsAuthModalOpen(true)}
          />
        )}
      </main>

      {/* ⚠️ 4. VAQT TO'QNASHUVI CHIROYLI MODAL OYNASI */}
      {conflictModalData && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 relative space-y-6">

            <button
              onClick={() => setConflictModalData(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-white p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <FaXmark className="text-lg" />
            </button>

            {/* Doiraviy ogohlantirish belgisi */}
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-amber-100 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 rounded-3xl flex items-center justify-center text-3xl mx-auto shadow-inner">
                <FaTriangleExclamation />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Dars Vaqti To'qnashuvi!
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                <strong className="text-slate-800 dark:text-slate-200">{conflictModalData.studentName}</strong> bu vaqt oralig'ida boshqa guruh darsiga yozilgan!
              </p>
            </div>

            {/* To'qnashuv tafsilotlari kartochkalari */}
            <div className="space-y-3">
              {/* Siz qo'shmoqchi bo'lgan guruh */}
              <div className="p-4 bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 rounded-2xl space-y-1">
                <span className="text-[10px] font-bold tracking-wider uppercase text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                  <FaBookOpen /> Siz qo'shmoqchi bo'lgan guruh:
                </span>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {conflictModalData.targetGroupTitle}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1.5 pt-0.5">
                  <FaClock className="text-indigo-500" />
                  <span>{conflictModalData.targetSchedule}</span>
                </p>
              </div>

              {/* To'qnashayotgan mavjud guruh */}
              <div className="p-4 bg-rose-50/70 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/60 rounded-2xl space-y-1">
                <span className="text-[10px] font-bold tracking-wider uppercase text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                  <FaClock /> Band qilingan dars vaqti:
                </span>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {conflictModalData.conflictingGroupTitle}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1.5 pt-0.5">
                  <FaClock className="text-rose-500" />
                  <span>{conflictModalData.conflictingSchedule}</span>
                </p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500">
                  O'qituvchi pochtasi: {conflictModalData.conflictingTeacher}
                </p>
              </div>
            </div>

            {/* Yopish tugmasi */}
            <button
              onClick={() => setConflictModalData(null)}
              className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 font-bold py-3.5 rounded-2xl text-sm shadow-md transition"
            >
              Tushundim, boshqa vaqtni tanlayman
            </button>

          </div>
        </div>
      )}

      {/* Auth Modal */}
      {isAuthModalOpen && (
        <AuthModal
          onLogin={handleAuth}
          onClose={() => setIsAuthModalOpen(false)}
          registeredUsers={registeredUsers}
          showNotification={showNotification}
          t={t}
        />
      )}

      {/* Create Group Modal */}
      {isModalOpen && (
        <CreateGroupModal
          onClose={() => setIsModalOpen(false)}
          onCreate={handleCreateGroup}
          showNotification={showNotification}
          t={t}
        />
      )}
    </div>
  );
}