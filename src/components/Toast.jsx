import React, { useEffect } from "react";
import {
  FaCircleCheck,
  FaCircleXmark,
  FaTriangleExclamation,
  FaCircleInfo,
  FaXmark
} from "react-icons/fa6";

export default function Toast({ message, type = "info", onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const typeStyles = {
    success: "bg-emerald-500 text-white border-emerald-600",
    error: "bg-red-500 text-white border-red-600",
    warning: "bg-amber-500 text-white border-amber-600",
    info: "bg-indigo-600 text-white border-indigo-700",
  };

  const icons = {
    success: <FaCircleCheck className="text-base" />,
    error: <FaCircleXmark className="text-base" />,
    warning: <FaTriangleExclamation className="text-base" />,
    info: <FaCircleInfo className="text-base" />,
  };

  return (
    <div className="fixed top-5 right-5 z-[9999] transition-all duration-300">
      <div
        className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border ${typeStyles[type]} text-sm font-semibold`}
      >
        <span>{icons[type]}</span>
        <span>{message}</span>
        <button
          onClick={onClose}
          className="ml-3 text-white/80 hover:text-white font-bold text-sm"
        >
          <FaXmark />
        </button>
      </div>
    </div>
  );
}