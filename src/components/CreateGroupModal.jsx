import React, { useState } from "react";
import { FaXmark, FaCalendarDays, FaClock, FaPlus } from "react-icons/fa6";

export default function CreateGroupModal({ onClose, onCreate, showNotification }) {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");

  const [selectedDays, setSelectedDays] = useState([]);
  const [startTime, setStartTime] = useState("14:00");
  const [endTime, setEndTime] = useState("16:00");

  const timeOptions = [
    "08:00", "09:00", "10:00", "11:00", "12:00", "13:00",
    "14:00", "15:00", "16:00", "17:00", "18:00", "19:00",
    "20:00", "21:00"
  ];

  const daysOfWeek = [
    { key: "Du", name: "Dushanba" },
    { key: "Se", name: "Seshanba" },
    { key: "Chor", name: "Chorshanba" },
    { key: "Pay", name: "Payshanba" },
    { key: "Juma", name: "Juma" },
    { key: "Shan", name: "Shanba" },
    { key: "Yak", name: "Yakshanba" },
  ];

  const toggleDay = (dayName) => {
    if (selectedDays.includes(dayName)) {
      setSelectedDays(selectedDays.filter((d) => d !== dayName));
    } else {
      setSelectedDays([...selectedDays, dayName]);
    }
  };

  const setPresetDays = (preset) => {
    if (preset === "odd") {
      setSelectedDays(["Dushanba", "Chorshanba", "Juma"]);
    } else if (preset === "even") {
      setSelectedDays(["Seshanba", "Payshanba", "Shanba"]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !subject) {
      return showNotification("Guruh nomi va fanni kiriting!", "warning");
    }

    if (selectedDays.length === 0) {
      return showNotification("Kamida 1 ta dars kunini tanlang!", "warning");
    }

    const schedule = `${selectedDays.join(", ")} (${startTime} - ${endTime})`;
    onCreate({ title, subject, schedule });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-100 dark:border-slate-800 max-h-[90vh] overflow-y-auto text-slate-800 dark:text-slate-100">
        <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <FaPlus className="text-indigo-600 text-base" />
            <span>Yangi Guruh Yaratish</span>
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-base w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <FaXmark />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Guruh Nomi
            </label>
            <input
              type="text"
              placeholder="Masalan: Fizika Intensive 2026"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Fan / Yo'nalish
            </label>
            <input
              type="text"
              placeholder="Masalan: Fizika"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <FaCalendarDays className="text-indigo-500" /> Dars Kunlari
              </label>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setPresetDays("odd")}
                  className="text-[11px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-md font-medium transition"
                >
                  Toq kunlar
                </button>
                <button
                  type="button"
                  onClick={() => setPresetDays("even")}
                  className="text-[11px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-md font-medium transition"
                >
                  Juft kunlar
                </button>
              </div>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
              {daysOfWeek.map((day) => {
                const isSelected = selectedDays.includes(day.name);
                return (
                  <button
                    key={day.key}
                    type="button"
                    onClick={() => toggleDay(day.name)}
                    className={`py-2 px-1 text-xs font-semibold rounded-xl border transition-all ${isSelected
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                        : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100"
                      }`}
                  >
                    {day.key}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <FaClock className="text-indigo-500" /> Dars Vaqti
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="block text-[11px] text-slate-500 mb-1">Boshlanish</span>
                <select
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
                >
                  {timeOptions.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <span className="block text-[11px] text-slate-500 mb-1">Tugash</span>
                <select
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
                >
                  {timeOptions.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {selectedDays.length > 0 && (
            <div className="p-3 bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 rounded-xl text-xs text-indigo-900 dark:text-indigo-300 font-medium flex items-center gap-2">
              <FaCalendarDays />
              <span>Jadval: <strong>{selectedDays.join(", ")} ({startTime} - {endTime})</strong></span>
            </div>
          )}

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 py-2.5 rounded-xl font-semibold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="w-1/2 bg-indigo-600 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-indigo-700 shadow-md transition"
            >
              Guruhni Yaratish
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}