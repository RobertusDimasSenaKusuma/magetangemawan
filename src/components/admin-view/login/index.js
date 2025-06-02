"use client";

import { useState } from "react";
import FormControls from "../form-controls";

const controls = [
  {
    name: "username",
    placeholder: "Enter User name",
    type: "text",
    label: "Enter User name",
  },
  {
    name: "password",
    placeholder: "Enter Password",
    type: "password",
    label: "Enter Password",
  },
];

export default function Login({ formData, setFormData, handleLogin }) {
  const [loading, setLoading] = useState(false);

  const onLoginClick = async () => {
    setLoading(true);
    try {
      const success = await handleLogin(); // pastikan handleLogin mengembalikan true/false
      if (success) {
        alert("Login berhasil!");
      } else {
        alert("Login gagal. Periksa username atau password.");
      }
    } catch (error) {
      alert("Terjadi kesalahan saat login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="bg-[#ffffff] shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <FormControls
          controls={controls}
          formData={formData}
          setFormData={setFormData}
        />
        <button
          onClick={onLoginClick}
          className="mt-[10px] border border-green-600 p-4 font-bold text-[16px]"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
}
