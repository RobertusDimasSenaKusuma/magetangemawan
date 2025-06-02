"use client";
import { useState } from "react";
import FormControls from "../form-controls";

const controls = [
  {
    name: "username",
    placeholder: "Enter your username",
    type: "text",
    label: "Username",
  },
  {
    name: "password",
    placeholder: "Enter your password",
    type: "password",
    label: "Password",
  },
];

export default function Login({ formData, setFormData, handleLogin }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Please sign in to your account
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4" onKeyPress={handleKeyPress}>
            <FormControls
              controls={controls}
              formData={formData}
              setFormData={setFormData}
            />
          </div>

          <button
            onClick={onLoginClick}
            disabled={loading || !formData?.username || !formData?.password}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition-all duration-200 ${
              loading || !formData?.username || !formData?.password
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 active:transform active:scale-[0.98]"
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
              "Sign In"
            )}
          </button>

          {/* Additional Links */}
          <div className="text-center space-y-2">
            <a
              href="#"
              className="text-sm text-indigo-600 hover:text-indigo-500 transition-colors"
            >
              Forgot your password?
            </a>
            <div className="text-sm text-gray-600">
              Don't have an account?{" "}
              <a
                href="#"
                className="text-indigo-600 hover:text-indigo-500 font-medium transition-colors"
              >
                Sign up here
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500">
          By signing in, you agree to our{" "}
          <a href="#" className="text-indigo-600 hover:text-indigo-500">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-indigo-600 hover:text-indigo-500">
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  );
}