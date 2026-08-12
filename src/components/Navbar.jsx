import React from "react";

export default function Navbar({ currentUser, onLogout, onOpenSignUp }) {
  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="bg-indigo-600 text-white p-2 rounded-xl font-bold text-xl flex items-center justify-center w-10 h-10">
              🎓
            </div>
            <span className="font-bold text-xl text-slate-900 tracking-tight">
              EduPlatform
            </span>
          </div>

          {/* O'ng tomon: Profil va Sign Up tugmasi */}
          <div className="flex items-center gap-4">
            {currentUser ? (
              /* Foydalanuvchi profil ma'lumotlari */
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white shadow-sm ${
                    currentUser.role === "teacher"
                      ? "bg-indigo-600"
                      : "bg-emerald-600"
                  }`}
                >
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-bold text-slate-800 leading-none">
                    {currentUser.name}
                  </p>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                    {currentUser.role === "teacher" ? "O'qituvchi" : "O'quvchi"}
                  </span>
                </div>
              </div>
            ) : (
              /* Tizimga kirilmagan holatdagi tekst */
              <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg hidden sm:inline-block">
                Tizimga kirilmagan
              </span>
            )}

            {/* ESKI TUGMALAR O'RNIGA QO'SHILGAN "SIGN UP" TUGMASI */}
            <button
              onClick={currentUser ? onLogout : onOpenSignUp}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-4 py-2.5 rounded-xl font-bold shadow-md transition-all duration-200 active:scale-95 flex items-center gap-1.5"
            >
              <span>{currentUser ? "Sign Out" : "Sign Up"}</span>
              <span className="text-sm">✨</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
