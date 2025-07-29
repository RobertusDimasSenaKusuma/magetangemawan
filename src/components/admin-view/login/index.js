"use client";
import React, { useState } from "react";
import Image from "next/image";
import desaImage from "../../../assets/logo1.jpg"; // Logo 1
import logo2Image from "../../../assets/logo_kkn.jpg"; // Logo 2
import logo3Image from "../../../assets/logo3.jpg"; // Logo 3
import personImage from "../../../assets/login.jpeg"; // Foto orang untuk right side

// Simulasi FormControls component
const FormControls = ({ controls, formData, setFormData }) => {
  const [showPassword, setShowPassword] = useState(false);
  
  return (
    <>
      {controls.map((control) => (
        <div key={control.name} className="space-y-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              {control.name === 'username' ? (
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              )}
            </div>
            <input
              type={control.name === 'password' ? (showPassword ? 'text' : 'password') : control.type}
              name={control.name}
              placeholder={control.placeholder}
              value={formData?.[control.name] || ""}
              onChange={(e) => setFormData({ ...formData, [control.name]: e.target.value })}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-700 placeholder-gray-400"
            />
            {control.name === 'password' && (
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </>
  );
};

const controls = [
  {
    name: "username",
    placeholder: "Admin",
    type: "text",
    label: "Username",
  },
  {
    name: "password",
    placeholder: "••••••••",
    type: "password",
    label: "Password",
  },
];

export default function Login({ formData = {}, setFormData = () => {}, handleLogin = () => {}, onLogout }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Reset form ketika logout
  React.useEffect(() => {
    if (onLogout) {
      const resetForm = () => {
        setFormData({});
        setError("");
      };
      // Assuming onLogout is called when user logs out
      // You can modify this based on your logout implementation
    }
  }, [onLogout, setFormData]);

  const onLoginClick = async () => {
    // Validasi input
    if (!formData?.username || !formData?.password) {
      setError("Username and password are required");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      const success = await handleLogin();
      if (success) {
        // Success handling bisa disesuaikan dengan kebutuhan
        console.log("Login successful");
      } else {
        setError("Invalid username or password. Please try again.");
      }
    } catch (error) {
      setError("An error occurred during login. Please try again.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) {
      onLoginClick();
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-20 xl:px-24 bg-white-500">
        <div className="w-full max-w-sm space-y-8 bg-white-500">
          {/* Logo */}
          <div className="flex items-center justify-center space-x-4 mb-2">
            <div className="w-12 h-12 rounded-lg overflow-hidden relative">
              <Image 
                src={desaImage} 
                alt="Logo Desa" 
                fill
                className="object-cover"
              />
            </div>
            <div className="w-12 h-12 rounded-lg overflow-hidden  relative">
              <Image 
                src={logo2Image} 
                alt="Logo 2" 
                fill
                className="object-cover"
              />
            </div>
            <div className="w-12 h-12 rounded-lg overflow-hidden relative">
              <Image 
                src={logo3Image} 
                alt="Logo 3" 
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
              Selamat Datang Admin Web Desa Sumbersawit
            </h1>
            <p className="text-sm text-gray-500">
              Masuk dengan Username dan Password yang Benar
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Login Form */}
          <div className="space-y-6" onKeyPress={handleKeyPress}>
            <div className="space-y-4">
              <FormControls
                controls={controls}
                formData={formData}
                setFormData={setFormData}
              />
            </div>

            {/* Login Button */}
            <button
              onClick={onLoginClick}
              disabled={loading || !formData?.username || !formData?.password}
              className={`w-full flex justify-center py-4 px-4 rounded-xl text-sm font-medium text-white transition-all duration-200 ${
                loading || !formData?.username || !formData?.password
                  ? "bg-green1-500 cursor-not-allowed text-white-500"
                  : "bg-green-500 hover:bg-green1-500 text-white-500 focus:ring-2 focus:ring-offset-2 focus:ring-green-500 active:transform active:scale-[0.98]"
              }`}
            >
              {loading ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </div>
              ) : (
                "Login"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Right Side - Person Photo */}
      <div className="hidden lg:flex flex-1 bg-white-500 relative overflow-hidden">
        {/* Person Image */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full h-full">
            <Image 
              src={personImage} 
              alt="Person" 
              fill
              className="object-contain"
            />
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-green1-500 rounded-full opacity-30"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-orange-500 rounded-full opacity-40"></div>
        <div className="absolute top-1/2 left-10 w-16 h-16 bg-blue-500 rounded-full opacity-50"></div>
        
        {/* Floating Cards */}
        <div className="absolute top-1/4 left-1/4 w-24 h-16 bg-green1-500  rounded-lg transform rotate-12 shadow-lg">
          <div className="p-2 space-y-1">
            <div className="h-2 bg-white-500 rounded"></div>
            <div className="h-2 bg-white-500 rounded w-3/4"></div>
          </div>
        </div>
        
        <div className="absolute bottom-1/3 right-1/4 w-20 h-14 bg-green1-500  rounded-lg transform -rotate-12 shadow-lg">
          <div className="p-2 space-y-1">
            <div className="h-2 bg-white-500 rounded"></div>  
            <div className="h-2 bg-white-500  00 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    </div>
  );
}