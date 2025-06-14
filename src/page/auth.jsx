import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setLoggedIn } from "../utils/auth";
import { loginUser, registerUser } from "../utils/api";

export default function AuthPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    password: "",
    confirmPassword: ""
  });
  const [notif, setNotif] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotif("");
    
    // Password validation
    if (form.password.length < 6) {
      setNotif("Password minimal 6 karakter");
      setTimeout(() => setNotif(""), 3000); // Auto dismiss after 3 seconds
      return;
    }

    try {
      if (isLogin) {
        // LOGIN
        const res = await loginUser({ email: form.email, password: form.password });
        if (res && res.token) {
          localStorage.setItem('token', res.token);
          setLoggedIn(true);
          setNotif("Login berhasil!");
          setTimeout(() => {
            setNotif("");
            navigate("/dashboard");
          }, 3000);
        } else if (res && res.message) {
          setNotif("Login gagal: " + res.message);
          setTimeout(() => setNotif(""), 3000);
        } else {
          setNotif("Login gagal: Token tidak ditemukan");
          setTimeout(() => setNotif(""), 3000);
        }
      } else {
        // REGISTER
        if (form.password !== form.confirmPassword) {
          setNotif("Password dan konfirmasi password tidak sama");
          setTimeout(() => setNotif(""), 3000);
          return;
        }
        try {
          const res = await registerUser({
            name: form.name,
            email: form.email,
            password: form.password,
          });
          if (res && res.message) {
            setNotif(res.message);
          } else {
            setNotif("Registrasi berhasil! Silakan login.");
          }
          setTimeout(() => setNotif(""), 3000);
          setIsLogin(true);
        } catch (errReg) {
          setNotif((errReg && errReg.message) ? errReg.message : 'Registrasi gagal.');
          setTimeout(() => setNotif(""), 3000);
        }
      }
    } catch (err) {
      setNotif((err && err.message) ? err.message : 'Terjadi kesalahan.');
      setTimeout(() => setNotif(""), 3000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-green-100">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        {notif && (
          <div className={`mb-4 p-3 rounded text-center font-semibold border animate-fade-in ${
            notif.toLowerCase().includes('berhasil')
              ? 'bg-green-100 text-green-800 border-green-300'
              : 'bg-red-100 text-red-800 border-red-300'
          }`}>
            {notif}
          </div>
        )}
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-green-100 mb-2">
            <img 
              src="/logo-sortify.png" 
              alt="Sortify Logo" 
              className="w-20 h-20 object-contain"
              style={{ paddingTop: '15px' }}
            />
          </div>
          <h1 className="text-2xl font-bold text-green-700 mb-1">Sortify</h1>
          <p className="text-green-700 text-sm">Platform AI untuk Klasifikasi Sampah</p>
        </div>
        <div className="flex mb-6">
          <button
            className={`flex-1 py-2 rounded-l-lg font-semibold ${isLogin ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
            onClick={() => setIsLogin(true)}
          >
            <span className="inline-flex items-center"><span className="mr-2">↩️</span>Masuk</span>
          </button>
          <button
            className={`flex-1 py-2 rounded-r-lg font-semibold ${!isLogin ? "bg-green-700 text-white" : "bg-gray-100 text-gray-500"}`}
            onClick={() => setIsLogin(false)}
          >
            <span className="inline-flex items-center"><span className="mr-2">👤</span>Daftar</span>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Nama lengkap Anda"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
                  required
                />
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="phone"
                  placeholder="08123456789"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-1/2 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
                  required
                />
                <input
                  type="text"
                  name="city"
                  placeholder="Kota"
                  value={form.city}
                  onChange={handleChange}
                  className="w-1/2 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
                  required
                />
              </div>
            </>
          )}
          <div>
            <input
              type="email"
              name="email"
              placeholder="nama@email.com"
              value={form.email}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
              required
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
              required
            />
            {form.password && form.password.length < 6 && (
              <p className="text-red-500 text-xs mt-1">
                Password minimal 6 karakter
              </p>
            )}
          </div>
          {!isLogin && (
            <div>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Konfirmasi Password"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
                required
              />
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg mt-2"
          >
            {isLogin ? "Masuk ke Sortify" : "Daftar ke Sortify"}
          </button>
        </form>
        {isLogin && (
          <div className="text-right mt-2">
            <a href="#" className="text-green-600 text-sm hover:underline">Lupa password?</a>
          </div>
        )}
        {/* ...hapus tombol login sosial dan pemisah... */}
        <p className="text-center text-xs text-gray-500 mt-2">
          {isLogin
            ? "Bergabunglah dengan 10,000+ eco-warriors lainnya dalam misi menyelamatkan bumi! 🌏"
            : "Dengan mendaftar, Anda menyetujui Syarat & Ketentuan kami"}
        </p>
      </div>
    </div>
  );
}
