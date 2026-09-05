import React, { useState } from "react";
import {
  FaGraduationCap,
  FaChalkboardUser,
  FaUserGraduate,
  FaEnvelope,
  FaUser,
  FaLock,
  FaXmark,
  FaRightToBracket
} from "react-icons/fa6";

export default function AuthModal({ onLogin, onClose, registeredUsers, showNotification, t }) {
  const [isLoginView, setIsLoginView] = useState(true);
  const [role, setRole] = useState("teacher");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 🔑 TIZIMGA KIRISH (To'g'ridan-to'g'ri Gmail va Parol orqali)
  const handleDirectLogin = (e) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      return showNotification(
        "Iltimos, Gmail manzilingiz va parolingizni kiriting!",
        "warning"
      );
    }

    // 1. Shu rol va Gmail bo'yicha foydalanuvchini qidiramiz
    const cleanEmail = email.trim().toLowerCase();
    const foundUser = registeredUsers.find(
      (u) => u.email.toLowerCase() === cleanEmail && u.role === role
    );

    if (!foundUser) {
      return showNotification(
        "Bunday Gmail manziliga ega foydalanuvchi topilmadi! Rol yoki Gmailni tekshiring.",
        "error"
      );
    }

    // 2. Parolni tekshirish
    if (foundUser.password !== password) {
      return showNotification(
        "❌ Parol noto'g'ri! Iltimos, qaytadan urinib ko'ring.",
        "error"
      );
    }

    // 3. Muvaffaqiyatli kirish
    showNotification(`Xush kelibsiz, ${foundUser.name}!`, "success");
    onLogin(foundUser, true);
  };

  // 📝 RO'YXATDAN O'TISH
  const handleRegister = (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password) {
      return showNotification("Barcha maydonlarni to'ldiring!", "warning");
    }

    if (password.length < 4) {
      return showNotification("Parol kamida 4 ta belgidan iborat bo'lishi kerak!", "warning");
    }

    const cleanEmail = email.trim().toLowerCase();
    const alreadyExists = registeredUsers.some(
      (u) => u.email.toLowerCase() === cleanEmail
    );

    if (alreadyExists) {
      return showNotification("Bu Gmail manzil allaqachon ro'yxatdan o'tgan! Kirish bo'limiga o'ting.", "warning");
    }

    const newUser = {
      id: Date.now(),
      name: name.trim(),
      email: cleanEmail,
      password,
      role,
    };

    onLogin(newUser, false);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-8 shadow-2xl border border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-100 relative max-h-[90vh] overflow-y-auto">

        {/* Yopish tugmasi */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-white p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <FaXmark className="text-base" />
          </button>
        )}

        {/* Modal Sarlavhasi */}
        <div className="text-center space-y-2 mb-6">
          <div className="bg-indigo-600 text-white w-12 h-12 rounded-2xl text-2xl flex items-center justify-center mx-auto shadow-md">
            <FaGraduationCap />
          </div>
          <h2 className="text-2xl font-bold">
            {isLoginView ? (t?.login || "Tizimga Kirish") : (t?.register || "Ro'yxatdan o'tish")}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {isLoginView
              ? "Avval ro'yxatdan o'tgan Gmail va parolingizni kiriting"
              : (t?.registerDesc || "Platformadan foydalanish uchun ma'lumotlaringizni kiriting")}
          </p>
        </div>

        {/* 1. TIZIMGA KIRISH FORMASI */}
        {isLoginView ? (
          <form onSubmit={handleDirectLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                {t?.whoAreYou || "Siz kimsiz?"}
              </label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                <button
                  type="button"
                  onClick={() => setRole("teacher")}
                  className={`py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition ${role === "teacher"
                      ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm"
                      : "text-slate-500"
                    }`}
                >
                  <FaChalkboardUser /> {t?.teacher || "O'qituvchi"}
                </button>
                <button
                  type="button"
                  onClick={() => setRole("student")}
                  className={`py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition ${role === "student"
                      ? "bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-300 shadow-sm"
                      : "text-slate-500"
                    }`}
                >
                  <FaUserGraduate /> {t?.student || "O'quvchi"}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1.5">
                <FaEnvelope className="text-slate-400 text-xs" /> {t?.gmailAddress || "Gmail manzilingiz"}
              </label>
              <input
                type="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1.5">
                <FaLock className="text-slate-400 text-xs" /> {t?.password || "Parol"}
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
            >
              <FaRightToBracket />
              <span>{t?.login || "Kirish"}</span>
            </button>
          </form>
        ) : (
          /* 2. RO'YXATDAN O'TISH FORMASI */
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                {t?.whoAreYou || "Siz kimsiz?"}
              </label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                <button
                  type="button"
                  onClick={() => setRole("teacher")}
                  className={`py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition ${role === "teacher"
                      ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm"
                      : "text-slate-500"
                    }`}
                >
                  <FaChalkboardUser /> {t?.teacher || "O'qituvchi"}
                </button>
                <button
                  type="button"
                  onClick={() => setRole("student")}
                  className={`py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition ${role === "student"
                      ? "bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-300 shadow-sm"
                      : "text-slate-500"
                    }`}
                >
                  <FaUserGraduate /> {t?.student || "O'quvchi"}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1.5">
                <FaUser className="text-slate-400 text-xs" /> {t?.fullName || "To'liq ismingiz"}
              </label>
              <input
                type="text"
                placeholder="Masalan: Ali Valiyev"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1.5">
                <FaEnvelope className="text-slate-400 text-xs" /> {t?.gmailAddress || "Gmail manzilingiz"}
              </label>
              <input
                type="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1.5">
                <FaLock className="text-slate-400 text-xs" /> {t?.password || "Parol yarating"}
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold text-sm shadow-md transition"
            >
              {t?.register || "Ro'yxatdan o'tish"}
            </button>
          </form>
        )}

        {/* Kirish / Ro'yxatdan o'tishga o'tkazgich */}
        <div className="text-center mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isLoginView ? (t?.noAccount || "Akkountingiz yo'qmi?") : (t?.haveAccount || "Akkountingiz bormi?")}{" "}
            <button
              type="button"
              onClick={() => {
                setIsLoginView(!isLoginView);
                setEmail("");
                setPassword("");
                setName("");
              }}
              className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline ml-1"
            >
              {isLoginView ? (t?.register || "Ro'yxatdan o'ting") : (t?.login || "Kiring")}
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}