import React, { useState } from "react";
import { LogIn, User, Lock, Loader2 } from "lucide-react";

// Theme Constants
const NEON_CYAN = "cyan-400";
const NEON_FUCHSIA = "fuchsia-500";
const MAIN_GRADIENT = "bg-gradient-to-r from-cyan-400 to-fuchsia-400"; // Used in Title
const BUTTON_GRADIENT = "bg-gradient-to-r from-cyan-500 to-fuchsia-600"; // Used in Button
const SHADOW_FUCHSIA = "shadow-[0_0_80px_rgba(236,72,153,0.3)]"; // Card Shadow
const NEON_RED = "rose-400"; // Error Color

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Input stream incomplete. All fields required.");
      return;
    }

    setLoading(true);

    // --- Simulated Login Logic ---
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (email === "user@cyber.com" && password === "matrix") {
      // Use console log instead of alert()
      console.log("Login Successful! Access Granted."); 
      setError(null);
    } else {
      setError("Authentication Failure. Invalid Network ID or Access Key.");
    }
    
    setLoading(false);
  };

  return (
    // Background: Deepest black (950) for max contrast, matching register form.
    <div className="relative flex items-center justify-center min-h-screen bg-gray-950 text-white overflow-hidden p-4">
      {/* Background Glows: Stronger Fuchsia and Cyan (Matching Register Form) */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-fuchsia-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

      {/* Card: Intense Shadow/Glow (Matching Register Form) */}
      <div 
        className={`relative z-10 bg-gray-800/50 backdrop-blur-xl p-6 sm:p-10 rounded-3xl w-full max-w-md md:max-w-lg border border-gray-700/50 ${SHADOW_FUCHSIA} transition-all duration-300`}
      >
        
        {/* Header/Title: Matching Register Form Gradient */}
        <div className="flex flex-col items-center mb-8">
          <LogIn 
            className={`w-8 h-8 sm:w-10 sm:h-10 mb-3 text-transparent bg-clip-text`} 
            style={{ backgroundImage: `linear-gradient(to right, #00ffff, #ff00ff)` }}
          />
          <h2 className={`text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text ${MAIN_GRADIENT} tracking-widest uppercase`}>
            ACCESS GATE LOGIN
          </h2>
          <p className="text-gray-400 text-sm mt-2">Enter credentials for network access.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Email Input */}
          <div className="relative">
            <User className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-${NEON_CYAN} z-10`} />
            <input
              type="email"
              placeholder="NETWORK ID (Email)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              // Matching Input Style
              className={`w-full p-3 pl-12 pr-4 bg-gray-700/70 text-white border border-gray-600/50 rounded-xl 
                          focus:outline-none focus:ring-4 focus:ring-fuchsia-500/50 focus:border-cyan-400 hover:border-fuchsia-400 placeholder-gray-400 transition-all duration-300`}
              disabled={loading}
              required
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <Lock className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-${NEON_FUCHSIA} z-10`} />
            <input
              type="password"
              placeholder="ACCESS KEY (Password)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              // Matching Input Style
              className={`w-full p-3 pl-12 pr-4 bg-gray-700/70 text-white border border-gray-600/50 rounded-xl 
                          focus:outline-none focus:ring-4 focus:ring-fuchsia-500/50 focus:border-cyan-400 hover:border-fuchsia-400 placeholder-gray-400 transition-all duration-300`}
              disabled={loading}
              required
            />
          </div>

          {/* Error Message: Matching Register Form Style */}
          {error && (
            <div className={`p-4 rounded-xl bg-rose-600/20 border border-rose-500/50 text-${NEON_RED} text-sm text-center font-semibold shadow-[0_0_15px_rgba(244,63,94,0.5)]`}>
              {error}
            </div>
          )}

          {/* Login Button: Matching Register Form Style */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-8 ${BUTTON_GRADIENT} text-base sm:text-lg py-3 rounded-xl font-bold uppercase tracking-widest text-white
                        shadow-[0_10px_40px_rgba(0,255,255,0.4)] transition-all duration-300 transform hover:scale-[1.03] hover:shadow-[0_15px_60px_rgba(236,72,153,0.6)] disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                AUTHENTICATING...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <LogIn size={20} />
                LOG IN TO MATRIX
              </span>
            )}
          </button>
        </form>

        {/* Footer/Navigation Link */}
        <div className="mt-8 pt-6 border-t border-gray-800 text-center">
          <p className="text-sm text-gray-500">
            Need an account? 
            <a 
              href="#" 
              className={`font-semibold ml-2 transition-colors duration-200 
                          text-${NEON_CYAN} hover:text-white`}
              onClick={(e) => { e.preventDefault(); console.log('Navigate to Registration'); }}
            >
              REGISTER ACCOUNT
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
