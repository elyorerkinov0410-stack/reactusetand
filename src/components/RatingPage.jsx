import React from "react";
import { FaTrophy, FaMedal, FaUserGraduate } from "react-icons/fa6";

export default function RatingPage({ registeredUsers, t }) {
    // Faqat ro'yxatdan o'tgan haqiqiy o'quvchilar
    const realStudents = registeredUsers
        .filter((u) => u.role === "student")
        .map((s, idx) => ({
            ...s,
            rank: idx + 1,
        }));

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-amber-500 to-indigo-600 rounded-3xl p-8 text-white shadow-lg flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <FaTrophy className="text-yellow-300" />
                        <span>{t?.studentRating || "O'quvchilar Reytingi"}</span>
                    </h1>
                    <p className="text-amber-100 text-sm mt-1">
                        {t?.studentRatingDesc || "Eng faol va yuqori natija ko'rsatayotgan bilimdonlar"}
                    </p>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            <th className="py-4 px-6">{t?.rank || "O'rin"}</th>
                            <th className="py-4 px-6">{t?.student || "O'quvchi"}</th>
                            <th className="py-4 px-6">{t?.gmailAddress || "Gmail"}</th>
                            <th className="py-4 px-6 text-right">{t?.score || "Ball"}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm font-medium">
                        {realStudents.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="text-center py-12 text-slate-400 text-sm">
                                    Hozircha tizimda ro'yxatdan o'tgan o'quvchilar yo'q
                                </td>
                            </tr>
                        ) : (
                            realStudents.map((student, idx) => (
                                <tr key={student.id || idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                                    <td className="py-4 px-6 flex items-center gap-2">
                                        {idx === 0 && <FaMedal className="text-yellow-400 text-lg" />}
                                        {idx === 1 && <FaMedal className="text-slate-400 text-lg" />}
                                        {idx === 2 && <FaMedal className="text-amber-700 text-lg" />}
                                        {idx > 2 && <span className="font-bold text-slate-500 ml-1.5">{student.rank}</span>}
                                    </td>
                                    <td className="py-4 px-6 font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                        <FaUserGraduate className="text-slate-400" />
                                        <span>{student.name}</span>
                                    </td>
                                    <td className="py-4 px-6 text-slate-500 dark:text-slate-400 text-xs">
                                        {student.email}
                                    </td>
                                    <td className="py-4 px-6 text-right font-bold text-indigo-600 dark:text-indigo-400">
                                        {student.score || 0} {t?.score || "ball"}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}