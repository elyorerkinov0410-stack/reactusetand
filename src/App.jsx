import React, { useState } from "react";
import Navbar from "./components/Navbar";
import TeacherDashboard from "./components/TeacherDashboard";
import StudentDashboard from "./components/StudentDashboard";
import CreateGroupModal from "./components/CreateGroupModal";
import AuthModal from "./components/AuthModal";
import Toast from "./components/Toast";

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Toast xabarnomasi uchun state
  const [toast, setToast] = useState(null); // { message: '', type: 'success' | 'error' | 'warning' | 'info' }

  // Custom alert chiqarish funksiyasi
  const showNotification = (message, type = "info") => {
    setToast({ message, type });
  };

  // Ro'yxatdan o'tgan barcha foydalanuvchilar bazasi (Telefon raqam bilan)
  const [registeredUsers, setRegisteredUsers] = useState([
    {
      id: 1,
      name: "Jamshid Aliyev",
      email: "teacher@mail.ru",
      phone: "+998 90 123 45 67",
      password: "123",
      role: "teacher",
    },
    {
      name: "Sardor",
      phone: "+998 90 765 43 21",
      email: "student@mail.ru",
      password: "123",
      role: "student",
    },
  ]);

  const [groups, setGroups] = useState([
    {
      id: 1,
      title: "Olimpiada 2026-Guruh",
      subject: "Matematika",
      schedule: "Dushanba, Chorshanba, Juma (15:00 - 17:00)",
      students: [{ id: 101, name: "Sardor Diyorov", email: "sardor@mail.ru" }],
      teacherEmail: "teacher@mail.ru",
    },
  ]);

  const [availableStudents] = useState([
    {
      id: 201,
      name: "Bobur Yoqubov",
      subject: "Fizika, Matematika",
      tag: "#8492",
    },
    {
      id: 202,
      name: "Zilola Hoshimova",
      subject: "Oliy Matematika",
      tag: "#3910",
    },
  ]);

  // Auth (Kirish va Ro'yxatdan o'tish)
  const handleAuth = (userData, isLoginView) => {
    if (isLoginView) {
      const foundUser = registeredUsers.find(
        (u) =>
          u.email === userData.email &&
          u.password === userData.password &&
          u.role === userData.role
      );

      if (foundUser) {
        setCurrentUser(foundUser);
        showNotification("Tizimga muvaffaqiyatli kirdingiz!", "success");
      } else {
        showNotification("Email, parol yoki rol noto'g'ri!", "error");
      }
    } else {
      const emailExists = registeredUsers.some(
        (u) => u.email === userData.email
      );

      if (emailExists) {
        return showNotification("Bu email allaqachon ro'yxatdan o'tgan!", "warning");
      }

      // TELEFON RAQAM SAQLANADIGAN QISM
      const newUser = {
        name: userData.name,
        phone: userData.phone, // <-- Telefon raqam saqlanadi
        email: userData.email,
        password: userData.password,
        role: userData.role,
      };

      setRegisteredUsers([...registeredUsers, newUser]);
      setCurrentUser(newUser);
      showNotification("Muvaffaqiyatli ro'yxatdan o'tdingiz!", "success");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    showNotification("Tizimdan chiqdingiz", "info");
  };

  // Yangi guruh yaratish
  const handleCreateGroup = (newGroup) => {
    const groupWithTeacher = {
      ...newGroup,
      id: Date.now(),
      students: [],
      teacherEmail: currentUser.email,
    };

    setGroups([...groups, groupWithTeacher]);
    setIsModalOpen(false);
    showNotification(`"${newGroup.title}" guruhi yaratildi!`, "success");
  };

  // O'quvchini guruhga biriktirish
  const handleAddStudentToGroup = (student, groupTitle) => {
    if (!groupTitle) return showNotification("Iltimos, guruhni tanlang!", "warning");

    setGroups((prevGroups) =>
      prevGroups.map((g) => {
        if (g.title === groupTitle) {
          const exists = g.students.some((s) => s.id === student.id);
          if (exists) {
            showNotification(`${student.name} allaqachon ushbu guruhda bor!`, "warning");
            return g;
          }

          showNotification(`${student.name} guruhga qo'shildi!`, "success");

          return {
            ...g,
            students: [
              ...g.students,
              {
                id: student.id,
                name: student.name,
                email: `${student.name.toLowerCase().replace(/\s+/g, "")}@mail.ru`,
              },
            ],
          };
        }
        return g;
      })
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans relative">
      {/* O'ng tepadan tushuvchi Notification Modal */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <Navbar currentUser={currentUser} onLogout={handleLogout} />

      {!currentUser ? (
        <AuthModal onLogin={handleAuth} showNotification={showNotification} />
      ) : (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {currentUser.role === "teacher" ? (
            <TeacherDashboard
              currentUser={currentUser}
              groups={groups}
              availableStudents={availableStudents}
              onOpenModal={() => setIsModalOpen(true)}
              onAddStudent={handleAddStudentToGroup}
            />
          ) : (
            <StudentDashboard currentUser={currentUser} groups={groups} />
          )}
        </main>
      )}

      {isModalOpen && (
        <CreateGroupModal
          onClose={() => setIsModalOpen(false)}
          onCreate={handleCreateGroup}
        />
      )}
    </div>
  );
}