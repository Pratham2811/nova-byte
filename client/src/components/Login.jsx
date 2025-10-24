import React, { useState } from "react";
import { LogIn, User, Lock, Loader2, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Theme Constants (Keeping your established cyber aesthetic)
const NEON_CYAN = "cyan-400";
const NEON_FUCHSIA = "fuchsia-500";
const MAIN_GRADIENT = "bg-gradient-to-r from-cyan-400 to-fuchsia-400";
const BUTTON_GRADIENT = "bg-gradient-to-r from-cyan-500 to-fuchsia-600";
const SHADOW_FUCHSIA = "shadow-[0_0_80px_rgba(236,72,153,0.3)]";
const NEON_RED = "rose-400";
const NEON_GREEN = "emerald-400";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false); // State for successful login
  const navigate =useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!email || !password) {
      setError("Input stream incomplete. All fields required.");
      return;
    }

    setLoading(true);

    // Using HTTP protocol as determined earlier
    const url = `http://localhost:80/user/login-user`;
    
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email, password: password }),
        credentials:"include"
      });

      let data = {};
      try {
        data = await response.json();
      } catch (e) {
        // Handle cases where the server sends a non-JSON response (shouldn't happen with your backend, but good practice)
        data.message = "Server response unreadable or empty.";
      }
      
      if (response.ok) {
        // HTTP 200: Successful Login
        console.log("Login Successful! Server Response:", data.message);
        setSuccess(true);
        setError(null);
        
        // Clear inputs after successful login
        setEmail('');
        setPassword('');
 navigate('/')
      } else {
        // HTTP 401 or 404 from backend: Authentication Failure
        console.error("Authentication Failure. Server Response:", data.message);
        setError(data.message || "Authentication Failure. Invalid Network ID or Access Key.");
        setSuccess(false);
      }

    } catch (networkError) {
      // Critical network errors (e.g., server offline, CORS block)
      console.error("Network Error:", networkError);
      setError("Critical network connection failure. Unable to reach access gate.");
      setSuccess(false);
    }
    
    setLoading(false);
  };

  return (
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
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              // Matching Input Style
              className={`w-full p-3 pl-12 pr-4 bg-gray-700/70 text-white border border-gray-600/50 rounded-xl 
                          focus:outline-none focus:ring-4 focus:ring-fuchsia-500/50 focus:border-cyan-400 hover:border-fuchsia-400 placeholder-gray-400 transition-all duration-300`}
              disabled={loading || success} // Disable input on load or success
              required
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <Lock className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-${NEON_FUCHSIA} z-10`} />
            <input
              type="text"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              // Matching Input Style
              className={`w-full p-3 pl-12 pr-4 bg-gray-700/70 text-white border border-gray-600/50 rounded-xl 
                          focus:outline-none focus:ring-4 focus:ring-fuchsia-500/50 focus:border-cyan-400 hover:border-fuchsia-400 placeholder-gray-400 transition-all duration-300`}
              disabled={loading || success} // Disable input on load or success
              required
            />
          </div>

          {/* Status Message Display */}
          {(error || success) && (
            <div className={`p-4 rounded-xl text-sm text-center font-semibold 
              ${error ? `bg-rose-600/20 border border-rose-500/50 text-${NEON_RED} shadow-[0_0_15px_rgba(244,63,94,0.5)]`
                    : `bg-emerald-600/20 border border-emerald-500/50 text-${NEON_GREEN} shadow-[0_0_15px_rgba(52,211,153,0.5)]`
              } flex items-center justify-center gap-3`}>
                {success ? <CheckCircle className="w-5 h-5"/> : null}
                {error || "Authentication successful. Redirecting..."}
            </div>
          )}

          {/* Login Button: Matching Register Form Style */}
          <button
            type="submit"
            disabled={loading || success}
            className={`w-full mt-8 ${BUTTON_GRADIENT} text-base sm:text-lg py-3 rounded-xl font-bold uppercase tracking-widest text-white
                        shadow-[0_10px_40px_rgba(0,255,255,0.4)] transition-all duration-300 transform hover:scale-[1.03] hover:shadow-[0_15px_60px_rgba(236,72,153,0.6)] disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                AUTHENTICATING...
              </span>
            ) : success ? (
              <span className="flex items-center justify-center gap-2">
                <CheckCircle size={20} />
                ACCESS GRANTED
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
