import React from "react";
import {
  FaGraduationCap,
  FaHouse,
  FaTrophy,
  FaUsers,
  FaSun,
  FaMoon,
  FaRightFromBracket,
  FaArrowRightToBracket
} from "react-icons/fa6";

export default function Navbar({
  currentUser,
  onLogout,
  onOpenAuth,
  activeTab,
  setActiveTab,
  darkMode,
  setDarkMode,
  lang,
  setLang,
  t,
}) {
  return (
    <header
      className={`border-b sticky top-0 z-40 shadow-sm transition-colors duration-200 ${darkMode
          ? "bg-slate-900 border-slate-800 text-white"
          : "bg-white border-slate-200 text-slate-900"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <div
          onClick={() => setActiveTab && setActiveTab("home")}
          className="flex items-center gap-2.5 cursor-pointer select-none"
        >
          <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center text-xl shadow-md">
            <FaGraduationCap />
          </div>
          <span className="text-xl font-black hidden md:inline-block">
            Edu<span className="text-indigo-500">Platform</span>
          </span>
        </div>

        {/* 🧭 Home, Reyting, Guruhlar */}
        <nav
          className={`flex items-center gap-1.5 p-1 rounded-2xl border transition-colors ${darkMode
              ? "bg-slate-800 border-slate-700"
              : "bg-slate-100 border-slate-200"
            }`}
        >
          <button
            type="button"
            onClick={() => setActiveTab("home")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${activeTab === "home"
                ? darkMode
                  ? "bg-slate-700 text-indigo-400 shadow-sm"
                  : "bg-white text-indigo-600 shadow-sm"
                : darkMode
                  ? "text-slate-400 hover:text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
          >
            <FaHouse />
            <span>{t.home}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("rating")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${activeTab === "rating"
                ? darkMode
                  ? "bg-slate-700 text-indigo-400 shadow-sm"
                  : "bg-white text-indigo-600 shadow-sm"
                : darkMode
                  ? "text-slate-400 hover:text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
          >
            <FaTrophy className="text-amber-400" />
            <span>{t.rating}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("groups")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${activeTab === "groups"
                ? darkMode
                  ? "bg-slate-700 text-indigo-400 shadow-sm"
                  : "bg-white text-indigo-600 shadow-sm"
                : darkMode
                  ? "text-slate-400 hover:text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
          >
            <FaUsers className="text-indigo-400" />
            <span>{t.groups}</span>
          </button>
        </nav>

        {/* 🌐 Tillar (Segmentli tugmalar) */}
        <div
          className={`flex items-center gap-1 p-1 rounded-2xl border transition-colors ${darkMode
              ? "bg-slate-800 border-slate-700"
              : "bg-slate-100 border-slate-200"
            }`}
        >
          {["uz", "ru", "en"].map((language) => (
            <button
              key={language}
              type="button"
              onClick={() => setLang(language)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all ${lang === language
                  ? darkMode
                    ? "bg-slate-700 text-indigo-400 shadow-sm"
                    : "bg-white text-indigo-600 shadow-sm"
                  : darkMode
                    ? "text-slate-400 hover:text-white"
                    : "text-slate-600 hover:text-slate-900"
                }`}
            >
              {language}
            </button>
          ))}
        </div>

        {/* Dark Mode & Profil/Kirish */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-xl text-sm border transition-colors ${darkMode
                ? "bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700"
                : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
              }`}
            title={darkMode ? "Kunduzgi rejim" : "Tungi rejim"}
          >
            {darkMode ? <FaSun className="text-amber-400" /> : <FaMoon className="text-slate-700" />}
          </button>

          {currentUser ? (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold hidden lg:inline-block">
                {currentUser.name}
              </span>
              <button
                type="button"
                onClick={onLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl text-xs font-bold transition"
              >
                <FaRightFromBracket />
                <span className="hidden sm:inline">{t.logout}</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
            >
              <FaArrowRightToBracket />
              <span>{t.login}</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
}