import React, { useState } from "react";
import { LogIn, User, Lock, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

// --- INTERSTELLAR THEME CONSTANTS ---
const THEME = {
  GOLD: "text-[#E09F3E]",
  GOLD_BORDER: "border-[#E09F3E]",
  ICE: "text-[#A5C9CA]",
  BG_VOID: "bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#111] via-black to-black",
  GLASS_CARD: "bg-white/5 backdrop-blur-md border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)]",
  INPUT_FIELD: "bg-black/50 border border-white/10 text-white focus:border-[#E09F3E] focus:ring-1 focus:ring-[#E09F3E] placeholder-gray-600 font-mono tracking-wide",
  BTN_PRIMARY: "bg-[#E09F3E] text-black hover:bg-[#c78b32] shadow-[0_0_20px_rgba(224,159,62,0.3)] transition-all duration-300",
  TEXT_GRADIENT: "text-transparent bg-clip-text bg-gradient-to-r from-[#E09F3E] via-[#FCEAbb] to-[#E09F3E]",
};

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!email || !password) {
      setError("CREDENTIALS MISSING. INPUT REQUIRED.");
      return;
    }

    setLoading(true);
    const url = `http://localhost:80/user/login-user`;
    
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include"
      });

      let data = {};
      try {
        data = await response.json();
      } catch (e) {
        data.message = "UPLINK ERROR: INVALID RESPONSE";
      }
      
      if (response.ok) {
        console.log("ACCESS GRANTED");
        setSuccess(true);
        setError(null);
        setEmail('');
        setPassword('');
        
        // Small delay for the user to see the success state before redirect
        setTimeout(() => navigate('/'), 800); 
      } else {
        setError(data.message || "ACCESS DENIED: INVALID SIGNATURE");
        setSuccess(false);
      }

    } catch (networkError) {
      console.error("Network Error:", networkError);
      setError("CONNECTION FAILURE: SERVER UNREACHABLE");
      setSuccess(false);
    }
    setLoading(false);
  };

  return (
    <div className={`relative flex items-center justify-center min-h-screen ${THEME.BG_VOID} text-white overflow-hidden p-4`}>
      
      {/* Cinematic Background Elements (Subtle Stars/Glows) */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#E09F3E]/10 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>

      {/* Main Card */}
      <div className={`relative z-10 p-8 sm:p-12 rounded-2xl w-full max-w-md md:max-w-lg transition-all duration-500 ${THEME.GLASS_CARD}`}>
        
        {/* Header */}
        <div className="flex flex-col items-center mb-10">
          <div className="mb-4 p-4 rounded-full bg-white/5 border border-white/10 shadow-[0_0_15px_rgba(224,159,62,0.1)]">
             <LogIn className={`w-8 h-8 ${THEME.GOLD}`} />
          </div>
          <h2 className={`text-2xl sm:text-3xl font-light tracking-[0.2em] uppercase ${THEME.TEXT_GRADIENT}`}>
            Identity Check
          </h2>
          <p className="text-gray-500 text-xs tracking-widest mt-2 uppercase">
            Secure Terminal Access
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Email Input */}
          <div className="relative group">
            <User className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 ${THEME.ICE} z-10 opacity-70 group-focus-within:opacity-100 transition-opacity`} />
            <input
              type="email"
              placeholder="OPERATOR_ID (EMAIL)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full p-3 pl-12 pr-4 rounded-lg outline-none transition-all duration-300 text-sm ${THEME.INPUT_FIELD}`}
              disabled={loading || success}
              required
            />
          </div>

          {/* Password Input */}
          <div className="relative group">
            <Lock className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 ${THEME.GOLD} z-10 opacity-70 group-focus-within:opacity-100 transition-opacity`} />
            <input
              type="password"
              placeholder="ACCESS_KEY (PASSWORD)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full p-3 pl-12 pr-4 rounded-lg outline-none transition-all duration-300 text-sm ${THEME.INPUT_FIELD}`}
              disabled={loading || success}
              required
            />
          </div>

          {/* Status Message Display */}
          {(error || success) && (
            <div className={`p-3 rounded border text-xs font-mono tracking-wide flex items-center justify-center gap-3 transition-all duration-300
              ${error 
                ? "bg-rose-950/30 border-rose-900/50 text-rose-400" 
                : "bg-emerald-950/30 border-emerald-900/50 text-emerald-400"
              }`}
            >
              {success ? <CheckCircle className="w-4 h-4"/> : <AlertCircle className="w-4 h-4" />}
              {error || "AUTHENTICATION VERIFIED. REDIRECTING..."}
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading || success}
            className={`w-full mt-6 py-3 rounded-lg font-bold text-sm tracking-[0.15em] uppercase transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${THEME.BTN_PRIMARY}`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <Loader2 className="w-4 h-4 animate-spin" />
                CONNECTING...
              </span>
            ) : success ? (
              <span className="flex items-center justify-center gap-3">
                <CheckCircle size={18} />
                GRANTED
              </span>
            ) : (
              <span className="flex items-center justify-center gap-3">
                ENTER SYSTEM
              </span>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <p className="text-xs text-gray-500 font-mono">
            NO CREDENTIALS FOUND? 
            <button 
              className={`ml-2 font-bold hover:text-white transition-colors duration-200 ${THEME.ICE} underline underline-offset-4 decoration-white/20 hover:decoration-white/50`}
              onClick={(e) => { 
                e.preventDefault();
                navigate("/register")
              }}
            >
              INITIALIZE REGISTRATION
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};