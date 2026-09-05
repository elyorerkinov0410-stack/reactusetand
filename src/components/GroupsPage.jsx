import React, { useState, useRef, useEffect } from "react";
import {
    FaUsers,
    FaMagnifyingGlass,
    FaPaperPlane,
    FaPaperclip,
    FaImage,
    FaVideo,
    FaUserGraduate,
    FaCalendarDays,
    FaBookOpen,
    FaXmark,
    FaCircleInfo,
    FaLock,
} from "react-icons/fa6";

export default function GroupsPage({ groups = [], currentUser, t, onOpenAuth }) {
    const [selectedGroupId, setSelectedGroupId] = useState(
        groups.length > 0 ? groups[0].id : null
    );
    const [searchTerm, setSearchTerm] = useState("");
    const [inputText, setInputText] = useState("");
    const [showInfo, setShowInfo] = useState(false);
    const [mediaPreview, setMediaPreview] = useState(null);

    const fileInputRef = useRef(null);
    const chatBottomRef = useRef(null);

    const [messages, setMessages] = useState(() => {
        const saved = localStorage.getItem("group_messages");
        if (!saved) return {};
        try {
            return JSON.parse(saved);
        } catch {
            return {};
        }
    });

    useEffect(() => {
        localStorage.setItem("group_messages", JSON.stringify(messages));
    }, [messages]);

    useEffect(() => {
        chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, selectedGroupId]);

    const filteredGroups = groups.filter(
        (g) =>
            g.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            g.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const selectedGroup = groups.find((g) => g.id === selectedGroupId) || filteredGroups[0];
    const currentGroupMessages = selectedGroup ? messages[selectedGroup.id] || [] : [];

    // 🔒 Yozish ruxsatini tekshirish
    const isTeacherOfGroup =
        currentUser?.role === "teacher" &&
        selectedGroup?.teacherEmail?.toLowerCase() === currentUser?.email?.toLowerCase();

    const isStudentOfGroup =
        currentUser?.role === "student" &&
        selectedGroup?.students?.some(
            (st) => st.email?.toLowerCase() === currentUser?.email?.toLowerCase()
        );

    const canWrite = Boolean(currentUser && (isTeacherOfGroup || isStudentOfGroup));

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const fileType = file.type.startsWith("video/")
            ? "video"
            : file.type.startsWith("image/")
                ? "image"
                : "file";

        const reader = new FileReader();
        reader.onload = () => {
            setMediaPreview({
                type: fileType,
                url: reader.result,
                name: file.name,
            });
        };
        reader.readAsDataURL(file);
    };

    const handleSendMessage = (e) => {
        e.preventDefault();

        if (!currentUser) {
            if (onOpenAuth) onOpenAuth();
            return;
        }

        if (!canWrite) return;
        if (!inputText.trim() && !mediaPreview) return;

        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(
            now.getMinutes()
        ).padStart(2, "0")}`;

        const newMessage = {
            id: Date.now(),
            senderName: currentUser.name || "Foydalanuvchi",
            senderRole: currentUser.role || "student",
            senderEmail: currentUser.email,
            text: inputText.trim(),
            time: timeStr,
            mediaType: mediaPreview?.type || null,
            mediaUrl: mediaPreview?.url || null,
            mediaName: mediaPreview?.name || null,
        };

        setMessages((prev) => ({
            ...prev,
            [selectedGroup.id]: [...(prev[selectedGroup.id] || []), newMessage],
        }));

        setInputText("");
        setMediaPreview(null);
    };

    const addEmoji = (emoji) => {
        setInputText((prev) => prev + emoji);
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden h-[calc(100vh-140px)] min-h-[580px] flex flex-col md:flex-row relative">
            {/* 📱 CHAP TOMON: GURUHLAR RO'YXATI */}
            <div className="w-full md:w-80 lg:w-96 border-r border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50/50 dark:bg-slate-900/60 shrink-0">
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                            <FaUsers className="text-indigo-600 dark:text-indigo-400" />
                            <span>{t?.groups || "Guruhlar"}</span>
                        </h2>
                        <span className="text-xs font-bold px-2.5 py-0.5 bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 rounded-full">
                            {filteredGroups.length}
                        </span>
                    </div>

                    <div className="relative">
                        <FaMagnifyingGlass className="absolute left-3.5 top-3 text-slate-400 text-xs" />
                        <input
                            type="text"
                            placeholder={t?.searchGroup || "Guruh yoki fanni qidirish..."}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-200"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-1 divide-y divide-slate-100 dark:divide-slate-800/40">
                    {filteredGroups.length === 0 ? (
                        <div className="text-center py-12 px-4 text-slate-400 text-xs">
                            {t?.noGroupsFound || "Guruhlar topilmadi"}
                        </div>
                    ) : (
                        filteredGroups.map((group) => {
                            const isSelected = selectedGroup?.id === group.id;
                            const lastMsg = (messages[group.id] || []).slice(-1)[0];

                            const userIsMember =
                                (currentUser?.role === "teacher" &&
                                    group.teacherEmail?.toLowerCase() === currentUser?.email?.toLowerCase()) ||
                                (currentUser?.role === "student" &&
                                    group.students?.some(
                                        (st) => st.email?.toLowerCase() === currentUser?.email?.toLowerCase()
                                    ));

                            return (
                                <div
                                    key={group.id}
                                    onClick={() => {
                                        setSelectedGroupId(group.id);
                                        setShowInfo(false);
                                    }}
                                    className={`p-3 rounded-2xl cursor-pointer transition-all flex items-center gap-3 select-none ${isSelected
                                            ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                                            : "hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-300"
                                        }`}
                                >
                                    <div
                                        className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shrink-0 shadow-sm ${isSelected
                                                ? "bg-white/20 text-white"
                                                : "bg-gradient-to-tr from-indigo-500 to-violet-500 text-white"
                                            }`}
                                    >
                                        {group.title.charAt(0).toUpperCase()}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <h3
                                                className={`text-sm font-bold truncate ${isSelected ? "text-white" : "text-slate-900 dark:text-white"
                                                    }`}
                                            >
                                                {group.title}
                                            </h3>
                                            <span
                                                className={`text-[10px] ${isSelected ? "text-indigo-200" : "text-slate-400"
                                                    }`}
                                            >
                                                {lastMsg ? lastMsg.time : ""}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between mt-0.5">
                                            <p
                                                className={`text-xs truncate ${isSelected ? "text-indigo-100" : "text-slate-500 dark:text-slate-400"
                                                    }`}
                                            >
                                                {lastMsg
                                                    ? `${lastMsg.senderName}: ${lastMsg.mediaType ? "📷 Media" : lastMsg.text}`
                                                    : `📅 ${group.schedule}`}
                                            </p>
                                            {userIsMember && (
                                                <span
                                                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md shrink-0 ml-1 ${isSelected
                                                            ? "bg-white/20 text-white"
                                                            : "bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400"
                                                        }`}
                                                >
                                                    A'zo
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* 💬 O'NG TOMON: TELEGRAM CHAT */}
            <div className="flex-1 flex flex-col bg-[#eef2f5] dark:bg-slate-950 overflow-hidden relative">
                {selectedGroup ? (
                    <>
                        <div className="p-3.5 px-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 shadow-sm z-10">
                            <div className="flex items-center gap-3.5">
                                <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
                                    {selectedGroup.title.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h2 className="text-sm font-black text-slate-900 dark:text-white">
                                        {selectedGroup.title}
                                    </h2>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
                                        <span>{selectedGroup.subject}</span> • <span>{selectedGroup.students?.length || 0} o'quvchi</span>
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => setShowInfo(!showInfo)}
                                className={`p-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${showInfo
                                        ? "bg-indigo-600 text-white"
                                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                                    }`}
                            >
                                <FaCircleInfo className="text-sm" />
                                <span className="hidden sm:inline">Ma'lumot</span>
                            </button>
                        </div>

                        {/* Chat oynasi */}
                        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                            {currentGroupMessages.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
                                    <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-2xl">
                                        💬
                                    </div>
                                    <p className="text-sm font-semibold">Ushbu guruhda hozircha xabarlar yo'q</p>
                                    <p className="text-xs">
                                        {canWrite ? "Guruh a'zolari bilan muloqotni boshlang!" : "Yozishmalar shu yerda ko'rinadi"}
                                    </p>
                                </div>
                            ) : (
                                currentGroupMessages.map((msg) => {
                                    const isMe = currentUser && msg.senderEmail === currentUser.email;

                                    return (
                                        <div
                                            key={msg.id}
                                            className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                                        >
                                            <div
                                                className={`max-w-[85%] sm:max-w-[70%] rounded-2xl p-3.5 shadow-sm space-y-1.5 ${isMe
                                                        ? "bg-indigo-600 text-white rounded-tr-none"
                                                        : "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-200 dark:border-slate-800"
                                                    }`}
                                            >
                                                {!isMe && (
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="text-[11px] font-bold text-indigo-500">
                                                            {msg.senderName}
                                                        </span>
                                                        <span className="text-[9px] uppercase px-1.5 py-0.2 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 rounded font-semibold">
                                                            {msg.senderRole}
                                                        </span>
                                                    </div>
                                                )}

                                                {msg.mediaType === "video" && (
                                                    <video
                                                        controls
                                                        src={msg.mediaUrl}
                                                        className="rounded-xl w-full max-h-64 object-cover mt-1"
                                                    />
                                                )}

                                                {msg.mediaType === "image" && (
                                                    <img
                                                        src={msg.mediaUrl}
                                                        alt="Media"
                                                        className="rounded-xl w-full max-h-72 object-cover mt-1"
                                                    />
                                                )}

                                                {msg.text && (
                                                    <p className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">
                                                        {msg.text}
                                                    </p>
                                                )}

                                                <div className={`text-[10px] text-right ${isMe ? "text-indigo-200" : "text-slate-400"}`}>
                                                    {msg.time}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={chatBottomRef} />
                        </div>

                        {/* Media Preview */}
                        {mediaPreview && (
                            <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {mediaPreview.type === "video" ? (
                                        <FaVideo className="text-indigo-500 text-xl" />
                                    ) : (
                                        <FaImage className="text-indigo-500 text-xl" />
                                    )}
                                    <div>
                                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[200px]">
                                            {mediaPreview.name || "Biriktirilgan fayl"}
                                        </p>
                                        <span className="text-[10px] text-slate-400 uppercase">
                                            {mediaPreview.type}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setMediaPreview(null)}
                                    className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg"
                                >
                                    <FaXmark />
                                </button>
                            </div>
                        )}

                        {/* 🔐 XABAR YOZISH QISMI / QULFLANGAN PANEL */}
                        {canWrite ? (
                            <form
                                onSubmit={handleSendMessage}
                                className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileUpload}
                                    accept="image/*,video/*"
                                    className="hidden"
                                />
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
                                    title="Rasm yoki Video yuklash"
                                >
                                    <FaPaperclip className="text-base" />
                                </button>

                                <button
                                    type="button"
                                    onClick={() => addEmoji("👍")}
                                    className="p-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg hidden sm:inline-block"
                                >
                                    👍
                                </button>
                                <button
                                    type="button"
                                    onClick={() => addEmoji("🔥")}
                                    className="p-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg hidden sm:inline-block"
                                >
                                    🔥
                                </button>

                                <input
                                    type="text"
                                    placeholder="Xabar yozing..."
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    className="flex-1 bg-slate-100 dark:bg-slate-800 border-0 rounded-2xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100"
                                />

                                <button
                                    type="submit"
                                    disabled={!inputText.trim() && !mediaPreview}
                                    className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white p-3 rounded-2xl shadow-md transition shrink-0"
                                >
                                    <FaPaperPlane className="text-xs sm:text-sm" />
                                </button>
                            </form>
                        ) : (
                            <div className="p-4 bg-slate-100/90 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 flex items-center justify-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                                <FaLock className="text-amber-500 text-sm" />
                                <span>
                                    {!currentUser
                                        ? "Guruhga yozish uchun avval tizimga kiring."
                                        : currentUser.role === "teacher"
                                            ? "Siz faqat o'zingiz yaratgan guruhlarga yoza olasiz."
                                            : "Siz faqat o'zingiz a'zo bo'lgan guruhlarga yoza olasiz."}
                                </span>
                                {!currentUser && (
                                    <button
                                        onClick={onOpenAuth}
                                        className="ml-2 text-indigo-600 dark:text-indigo-400 underline font-bold"
                                    >
                                        Kirish
                                    </button>
                                )}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center space-y-3">
                        <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">
                            Guruhni tanlang
                        </h3>
                    </div>
                )}

                {/* Guruh ma'lumotlari paneli */}
                {showInfo && selectedGroup && (
                    <div className="absolute inset-y-0 right-0 w-full sm:w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl z-20 flex flex-col p-5 space-y-4 overflow-y-auto">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                            <h3 className="font-bold text-slate-900 dark:text-white text-base">Guruh Ma'lumotlari</h3>
                            <button
                                onClick={() => setShowInfo(false)}
                                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                                <FaXmark />
                            </button>
                        </div>

                        <div className="text-center space-y-2 py-2">
                            <div className="w-16 h-16 rounded-3xl bg-indigo-600 text-white text-2xl font-bold flex items-center justify-center mx-auto shadow-lg">
                                {selectedGroup.title.charAt(0).toUpperCase()}
                            </div>
                            <h4 className="font-bold text-slate-900 dark:text-white text-lg">{selectedGroup.title}</h4>
                            <p className="text-xs text-indigo-600 font-semibold">{selectedGroup.subject}</p>
                        </div>

                        <div className="space-y-3 text-xs">
                            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl space-y-1">
                                <span className="text-slate-400 block font-medium">📅 Dars Jadvali:</span>
                                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedGroup.schedule}</span>
                            </div>
                            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl space-y-1">
                                <span className="text-slate-400 block font-medium">👨‍🏫 O'qituvchi:</span>
                                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedGroup.teacherEmail}</span>
                            </div>
                        </div>

                        <div className="space-y-2 pt-2">
                            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                                <FaUserGraduate /> A'zolar ({selectedGroup.students?.length || 0})
                            </h5>
                            <div className="space-y-2">
                                {!selectedGroup.students || selectedGroup.students.length === 0 ? (
                                    <p className="text-xs text-slate-400 italic">O'quvchilar yo'q</p>
                                ) : (
                                    selectedGroup.students.map((st, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center gap-2.5 p-2 bg-slate-50 dark:bg-slate-800/40 rounded-xl"
                                        >
                                            <div className="w-7 h-7 rounded-lg bg-indigo-500 text-white flex items-center justify-center font-bold text-xs">
                                                {st.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{st.name}</p>
                                                <p className="text-[10px] text-slate-400 truncate">{st.email}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}