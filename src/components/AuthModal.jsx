import React, { useState } from "react";

export default function AuthModal({ onLogin, showNotification }) {
  const [isLoginView, setIsLoginView] = useState(true);
  const [role, setRole] = useState("teacher");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isLoginView) {
      if (!emailOrPhone.trim() || !password.trim()) {
        return showNotification("Email/telefon va parolni kiriting!", "warning");
      }

      const user = {
        email: emailOrPhone.trim(),
        phone: emailOrPhone.trim(),
        password: password.trim(),
        role: role,
      };

      onLogin(user, true);
    } else {
      if (!name.trim() || !phone.trim() || !email.trim() || !password.trim()) {
        return showNotification("Barcha maydonlarni to'ldiring!", "warning");
      }

      // Telefon raqam tekshiruvi
      const phoneDigits = phone.replace(/\D/g, "");
      if (phoneDigits.length < 7) {
        return showNotification("To'g'ri telefon raqam kiriting (masalan: +998 90 123 45 67)!", "warning");
      }

      // Email tekshiruvi
      if (!email.includes("@") || !email.includes(".")) {
        return showNotification("To'g'ri email manzil kiriting!", "warning");
      }

      const user = {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        password: password.trim(),
        role: role,
      };

      onLogin(user, false);
    }
  };

  // Demo hisob bilan to'ldirish (Qulaylik uchun)
  const fillDemoAccount = (demoRole) => {
    setRole(demoRole);
    if (demoRole === "teacher") {
      setEmailOrPhone("teacher@mail.ru");
      setPassword("123");
    } else {
      setEmailOrPhone("+998 99 765 43 21");
      setPassword("123");
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 transition-all duration-300">
        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white w-14 h-14 rounded-2xl font-bold text-2xl flex items-center justify-center mx-auto shadow-lg shadow-indigo-200">
            🎓
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            {isLoginView ? "Xush kelibsiz!" : "Ro'yxatdan o'tish"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {isLoginView
              ? "Platformaga kirish uchun ma'lumotlaringizni kiriting"
              : "Yangi hisob yaratish uchun barcha maydonlarni to'ldiring"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Rol tanlash */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Siz kimsiz?
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl">
              <button
                type="button"
                onClick={() => setRole("teacher")}
                className={`py-2 px-3 text-xs font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 ${role === "teacher"
                    ? "bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200/50"
                    : "text-slate-500 hover:text-slate-700"
                  }`}
              >
                <span>👨‍🏫</span> O'qituvchi
              </button>
              <button
                type="button"
                onClick={() => setRole("student")}
                className={`py-2 px-3 text-xs font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 ${role === "student"
                    ? "bg-white text-emerald-600 shadow-sm ring-1 ring-slate-200/50"
                    : "text-slate-500 hover:text-slate-700"
                  }`}
              >
                <span>👨‍🎓</span> O'quvchi
              </button>
            </div>
          </div>

          {/* FAQAT RO'YXATDAN O'TISH MAYDONLARI */}
          {!isLoginView ? (
            <>
              {/* To'liq ism */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  👤 To'liq ismingiz
                </label>
                <input
                  type="text"
                  placeholder="Masalan: Ali Valiyev"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-slate-50/50 focus:bg-white transition"
                  required
                />
              </div>

              {/* Telefon raqami */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  📱 Telefon raqamingiz
                </label>
                <input
                  type="tel"
                  placeholder="+998 90 123 45 67"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-slate-50/50 focus:bg-white transition font-mono text-xs"
                  required
                />
              </div>

              {/* Email manzili */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  ✉️ Email manzilingiz
                </label>
                <input
                  type="email"
                  placeholder="example@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-slate-50/50 focus:bg-white transition"
                  required
                />
              </div>
            </>
          ) : (
            /* KIRISH UCHUN EMAIL YOKI TELEFON */
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                ✉️ / 📱 Email yoki Telefon raqam
              </label>
              <input
                type="text"
                placeholder="example@gmail.com yoki +998..."
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-slate-50/50 focus:bg-white transition"
                required
              />
            </div>
          )}

          {/* Parol maydoni */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-slate-600">
                🔒 Parol
              </label>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-slate-50/50 focus:bg-white transition pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-sm p-1"
                title={showPassword ? "Parolni yashirish" : "Parolni ko'rsatish"}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Submit tugmasi */}
          <button
            type="submit"
            className={`w-full text-white py-3 rounded-xl font-bold text-sm shadow-md transition duration-200 active:scale-[0.99] mt-2 ${role === "teacher"
                ? "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200"
                : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200"
              }`}
          >
            {isLoginView ? "Tizimga kirish" : "Ro'yxatdan o'tish"}
          </button>
        </form>

        {/* Demo hisoblar tezkor tugmalari (Kirishda) */}
        {isLoginView && (
          <div className="mt-4 pt-3 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-400 mb-2">Tezkor sinab ko'rish uchun:</p>
            <div className="flex gap-2 justify-center">
              <button
                type="button"
                onClick={() => fillDemoAccount("teacher")}
                className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-lg font-medium transition"
              >
                👨‍🏫 O'qituvchi (Email: teacher@mail.ru)
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount("student")}
                className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-lg font-medium transition"
              >
                👨‍🎓 O'quvchi (Tel: +998 99...)
              </button>
            </div>
          </div>
        )}

        {/* Ko'rinishni almashtirish */}
        <div className="text-center mt-4 pt-3 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            {isLoginView ? "Akkountingiz yo'qmi?" : "Akkountingiz bormi?"}{" "}
            <button
              type="button"
              onClick={() => setIsLoginView(!isLoginView)}
              className="font-bold text-indigo-600 hover:underline ml-1"
            >
              {isLoginView ? "Ro'yxatdan o'ting" : "Kiring"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}