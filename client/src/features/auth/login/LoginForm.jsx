import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../thunks/loginThunk";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Assuming a shared auth slice, or adjust path to your specific reducer
  const { isLoading } = useSelector((state) => state.auth.registeration || state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(login({ email, password })).unwrap();
      toast.success("Welcome back!");
      navigate("/");
    } catch (error) {
      toast.error(error || "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA] p-4 font-sans text-slate-900">
      <div className="w-full max-w-[1000px] animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="flex flex-col items-center py-12 px-6 sm:px-12 lg:px-24">
            
            {/* Header Section */}
            <div className="text-center space-y-3 mb-10">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
                Welcome back
              </h1>
              <p className="text-slate-500 text-base max-w-sm mx-auto">
                Enter your details to access your Acme Inc. account.
              </p>
            </div>

            {/* Form Container */}
            <div className="w-full max-w-[450px]">
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 font-medium">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 bg-slate-50 border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-indigo-500/20 rounded-lg transition-all"
                  />
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-slate-700 font-medium">Password</Label>
                    <Link
                      to="/forgot-password"
                      className="text-xs font-medium text-indigo-600 hover:text-indigo-700 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 bg-slate-50 border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-indigo-500/20 rounded-lg transition-all"
                  />
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="h-12 w-full mt-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-md shadow-indigo-500/20 transition-all active:scale-[0.98]"
                  disabled={!email || !password || isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>

                {/* Divider */}
                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-slate-400">Or continue with</span>
                  </div>
                </div>

                {/* Social Logins */}
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" type="button" className="h-11 border-slate-200 hover:bg-slate-50 text-slate-700 font-medium">
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                    Google
                  </Button>
                  <Button variant="outline" type="button" className="h-11 border-slate-200 hover:bg-slate-50 text-slate-700 font-medium">
                    <svg className="mr-2 h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.419-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                    Github
                  </Button>
                </div>

                <p className="text-center text-sm text-slate-500 mt-4">
                  Don't have an account?{" "}
                  <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500 hover:underline">
                    Sign up
                  </Link>
                </p>

              </form>
            </div>
            
            {/* Footer Terms */}
            <div className="mt-12 text-center text-xs text-slate-400">
              By continuing, you agree to our{" "}
              <a href="#" className="underline hover:text-indigo-600">Terms of Service</a>
              {" "}and{" "}
              <a href="#" className="underline hover:text-indigo-600">Privacy Policy</a>.
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;