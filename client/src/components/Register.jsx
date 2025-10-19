import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { User, Mail, Lock, CheckCircle, XCircle, ArrowUpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const UserRegistrationForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState(""); // success | error
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate=useNavigate()
  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle submit - FINALIZED LOGIC
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    setStatusType("");
    setIsSubmitting(true);

    // FIX: Changed protocol from HTTPS to HTTP since the Express server 
    // is running on port 80 (standard HTTP) without SSL configuration.
    const url = "http://localhost:80/user/create-user";
    console.log(`Attempting POST to: ${url} with data:`, formData);

    try {
      const response = await fetch(url, {
        method: "POST",
        // CRITICAL: Set the header so Express knows to use express.json() middleware
        headers: {
          "Content-Type": "application/json",
        },
        // FIX: Send the formData object directly, which is best practice
        body: JSON.stringify(formData),
      });

      // Attempt to parse response data regardless of success status
      let data = {};
      try {
          data = await response.json();
      } catch (error) {
          data.message = `Server error, could not read JSON. Status: ${response.status}`;
      }
      
      // Check if the HTTP status code indicates success (200-299 range)
      if (response.ok) {
        setStatus(`SUCCESS: ${data.message || 'User created successfully.'}`);
        setStatusType("success");
        setTimeout(()=>{
          navigate('/login')  
        },2000)
      } else {
        // Server responded with an error status (4xx or 5xx)
        setStatus(`${data.message || 'Server error occurred.'} (Code: ${response.status})`);
        setStatusType("error");
      }
    } catch (error) {
      console.error("Network Error: The request failed before reaching the server.", error);
      setStatus("ERROR: Network connection failed. Check server status and URL.");
      setStatusType("error");
    }

    setIsSubmitting(false);
  };

  return (
    // Background: Deepest black (950) for max contrast.
    <div className="relative flex items-center justify-center min-h-screen bg-gray-950 text-white overflow-hidden p-4">
      {/* Background Glows: Stronger Fuchsia and Cyan */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-fuchsia-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

      {/* Card: Intense Shadow/Glow (shadow-[0_0_80px_rgba(...)]) */}
      <Card className="relative z-10 bg-gray-800/50 backdrop-blur-xl p-6 sm:p-10 rounded-3xl w-full max-w-md md:max-w-lg border border-gray-700/50 shadow-[0_0_80px_rgba(236,72,153,0.3)] transition-all duration-300">
        
        {/* Heading: More Fluorescent Gradient */}
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400 tracking-widest uppercase">
          CYBER REGISTRATION
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Input Fields */}
          {[
            { id: "username", name: "username", type: "text", placeholder: "Username", Icon: User },
            { id: "email", name: "email", type: "email", placeholder: "Email Address", Icon: Mail },
            { id: "password", name: "password", type: "password", placeholder: "Password", Icon: Lock },
          ].map(({ id, name, type, placeholder, Icon }) => (
            <div key={id}>
              <Label htmlFor={id} className="text-sm font-medium mb-2 block text-gray-300">
                {placeholder.split(' ')[0]}
              </Label>
              <div className="relative">
                {/* Icon Color: Neon Cyan */}
                <Icon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyan-400 z-10" />
                <Input
                  id={id}
                  name={name}
                  type={type}
                  placeholder={placeholder}
                  value={formData[name]}
                  onChange={handleChange}
                  // Focus Ring: Neon Pink/Cyan
                  className="w-full pl-12 pr-4 py-3 bg-gray-700/70 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 transition-all duration-300 focus:ring-4 focus:ring-fuchsia-500/50 focus:border-cyan-400 hover:border-fuchsia-400"
                  required
                />
              </div>
            </div>
          ))}


          {/* Status Message */}
          {status && (
            <div
              className={`flex items-center gap-3 text-sm sm:text-base p-4 rounded-xl font-semibold border ${
                statusType === "success"
                  // Success: Neon Green for contrast and confirmation
                  ? "bg-emerald-600/20 text-emerald-400 border-emerald-500/50 shadow-[0_0_15px_rgba(52,211,153,0.5)]"
                  // Error: Neon Red/Rose
                  : "bg-rose-600/20 text-rose-400 border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.5)]"
              }`}
            >
              {statusType === "success" ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 flex-shrink-0" />
              )}
              {status}
            </div>
          )}

          {/* Submit Button: Full Neon Gradient and Loading State */}
          <Button
            type="submit"
            disabled={isSubmitting}
            // Button Gradient: Intense Cyan to Fuchsia
            className="w-full mt-4 bg-gradient-to-r from-cyan-500 to-fuchsia-600 text-base sm:text-lg py-3 rounded-xl font-bold uppercase tracking-widest shadow-[0_10px_40px_rgba(0,255,255,0.4)] transition-all duration-300 transform hover:scale-[1.03] hover:shadow-[0_15px_60px_rgba(236,72,153,0.6)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <ArrowUpCircle className="w-5 h-5 animate-spin" />
                SENDING DATA...
              </span>
            ) : (
              "REGISTER ACCOUNT"
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
};
