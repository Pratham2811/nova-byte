import React from "react";
import { LogIn, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useLogin } from "../hooks/useLogin";
import { Input, Button, Card } from "@/shared/components";

export const Login = () => {
  const navigate = useNavigate();
  const { formData, loading, error, success, handleChange, handleSubmit } = useLogin();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      {/* Brand Header */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-semibold text-gray-800 flex items-center justify-center gap-2">
           <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md">S</div>
           Streamly
        </h1>
        <p className="text-gray-500 text-sm mt-2">Sign in to your Streamly account</p>
      </div>

      <Card className="w-full max-w-[400px] p-8 border border-gray-200 bg-white shadow-sm rounded-lg">
        <div className="mb-6 text-center">
            <h2 className="text-xl font-medium text-gray-900">Welcome Back</h2>
            <p className="text-sm text-gray-600 mt-1">Enter your credentials to access your workspace</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            disabled={loading || success}
            required
            className="text-sm"
          />

          <div className="space-y-1">
             <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                disabled={loading || success}
                required
                className="text-sm"
            />
            <div className="flex justify-end">
                <a href="#" className="text-xs text-blue-600 hover:text-blue-700 font-medium">Forgot password?</a>
            </div>
          </div>

          {(error || success) && (
            <div className={`p-3 rounded text-sm flex items-center gap-2 ${
                success ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
            }`}>
              {success ? <CheckCircle size={16}/> : <AlertCircle size={16}/>}
              {error || "Login successful. Redirecting..."}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading || success}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded transition-colors"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                Signing in...
              </span>
            ) : success ? (
               "Success"
            ) : (
               "Next"
            )}
          </Button>
        </form>

        <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
                Not your computer? Use a Private Window to sign in.
            </p>
            <div className="mt-4 pt-4 border-t border-gray-100">
                <span className="text-sm text-gray-600">Don't have an account? </span>
                <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium text-sm">Create account</Link>
            </div>
        </div>
      </Card>

      <div className="mt-8 flex gap-6 text-xs text-gray-500">
        <a href="#" className="hover:text-gray-900">Help</a>
        <a href="#" className="hover:text-gray-900">Privacy</a>
        <a href="#" className="hover:text-gray-900">Terms</a>
      </div>
    </div>
  );
};