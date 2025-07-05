"use client";

import { useEffect, useState } from "react";
import { MapPin, Mail, Phone, Send } from "lucide-react";
import { addData } from "@/services";

const initialFormData = {
  name: "",
  email: "",
  message: "",
};

export default function FooterContact() {
  const [formData, setFormData] = useState(initialFormData);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSendMessage() {
    if (!isValidForm()) return;
    
    setIsLoading(true);
    
    try {
      const res = await addData("contact", formData);
      console.log(res, 'contact-res');

      if (res && res.success) {
        setFormData(initialFormData);
        setShowSuccessMessage(true);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (showSuccessMessage) {
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 2000);
    }
  }, [showSuccessMessage]);

  const isValidForm = () => {
    return formData &&
      formData.name !== "" &&
      formData.email !== "" &&
      formData.message !== ""
      ? true
      : false;
  };

  return (
    <footer className="relative">
      {/* Wave Section */}
      <div className="relative">
        <svg 
          className="w-full h-16 md:h-24" 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="55%" stopColor="#059669" /> {/* emerald-600 */}
              <stop offset="100%" stopColor="#047857" /> {/* emerald-700 */}
            </linearGradient>
          </defs>
          <path 
            d="M0,60 C300,20 600,100 900,60 C1050,40 1150,80 1200,60 L1200,120 L0,120 Z" 
            fill="url(#waveGradient)"
            className="drop-shadow-sm"
          />
        </svg>
      </div>


      {/* Footer Content */}
      <div style={{background: 'linear-gradient(135deg, #059669 0%, #047857 100%)'}} className="text-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Contact Form - Compact */}
            <div className="md:col-span-1">
              <h3 className="text-lg font-semibold mb-3 flex items-center text-white-500">
                <Mail className="w-4 h-4 mr-2" />
                Send Message
              </h3>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 text-sm rounded bg-white/20 border border-white/30 placeholder-white/50 text-white focus:outline-none focus:border-white/50"
                />
                <input
                  type="email"
                  placeholder="Your email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 text-sm rounded bg-white/20 border border-white/30 placeholder-white/50 text-white focus:outline-none focus:border-white/50"
                />
                <textarea
                  placeholder="Your message"
                  rows="3"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full px-3 py-2 text-sm rounded bg-white/20 border border-white/30 placeholder-white/50 text-white focus:outline-none focus:border-white/50 resize-none"
                />
                {showSuccessMessage && (
                  <p className="text-xs text-green-200 font-medium text-white-500">Message sent successfully!</p>
                )}
                <button
                  onClick={handleSendMessage}
                  disabled={!isValidForm() || isLoading}
                  className="w-full py-2 px-4 bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed rounded text-sm font-medium transition-all duration-200 flex items-center justify-center text-white-500"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2 text-white-500"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-3 h-3 mr-2 text-white-500" />
                      Send
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Contact Info */}
            <div className="md:col-span-1">
              <h3 className="text-lg font-semibold mb-3 flex items-center text-white-500">
                <Phone className="w-4 h-4 mr-2" />
                Get in Touch
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-start text-white-500">
                  <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-white-500">Address</p>
                    <p className="text-white-500">Jl. Contoh No. 123<br />Depok, Yogyakarta 55281</p>
                  </div>
                </div>
                <div className="flex items-center text-white-500">
                  <Mail className="w-4 h-4 mr-2" />
                  <div>
                    <p className="font-medium text-white-500">Email</p>
                    <p className="text-white-500">hello@example.com</p>
                  </div>
                </div>
                <div className="flex items-center text-white-500">
                  <Phone className="w-4 h-4 mr-2" />
                  <div>
                    <p className="font-medium text-white-500">Phone</p>
                    <p className="text-white-500">+62 812-3456-7890</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mini Map */}
            <div className="md:col-span-1">
              <h3 className="text-lg font-semibold mb-3 flex items-center text-white-500">
                <MapPin className="w-4 h-4 mr-2" />
                Location
              </h3>
              <div className="bg-white/20 rounded-lg p-3 h-48 flex items-center justify-center relative overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3955.239456123456!2d110.123456!3d-7.789012!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zN8KwNDUnMjEuNiJTIDExMMKwMDcnMjQuMCJF!5e0!3m2!1sen!2sid!4v1623456789!5m2!1sen!2sid"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  className="rounded-lg"
                ></iframe>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="mt-6 pt-4 border-t border-white-500">
            <div className="flex flex-col md:flex-row justify-between items-center text-sm text-white-500">
              <p className="text-white-500">© 2025 Your Company. All rights reserved.</p>
            </div>
          </div>
        </div>

        {/* Decorative gradient overlay */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"></div>
      </div>
    </footer>
  );
}