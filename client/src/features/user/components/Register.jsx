import React from "react";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useRegister } from "../hooks/useRegister";
import { Input, Button, Card } from "@/shared/components";

export const UserRegistrationForm = () => {
  const navigate = useNavigate();
  const { formData, loading, success, error, statusMessage, handleChange, handleSubmit } = useRegister();
  
  const isError =  !!error;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      {/* Brand Header */}
      <div className="mb-8 text-center">
         <h1 className="text-2xl font-semibold text-gray-800 flex items-center justify-center gap-2">
           <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md">S</div>
           Streamly
        </h1>
        <p className="text-gray-500 text-sm mt-2">Create your Streamly account</p>
      </div>

      <Card className="w-full max-w-[450px] p-8 border border-gray-200 bg-white shadow-sm rounded-lg">
        <div className="mb-6">
            <h2 className="text-xl font-medium text-gray-900">Create Account</h2>
            <p className="text-sm text-gray-600 mt-1">Enter your details to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
            <Input
                label="Username"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Choose a username"
                disabled={loading || success}
                required
                className="text-sm"
            />

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

            <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Choose a password (min 6 chars)"
                disabled={loading || success}
                required
                className="text-sm"
                helperText="Use 8 or more characters with a mix of letters, numbers & symbols"
            />

            {/* Status Message */}
            {statusMessage && (
                <div className={`p-3 rounded text-sm flex items-center gap-2 ${
                    !isError ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
                }`}>
                    {!isError ? <CheckCircle size={16}/> : <AlertCircle size={16}/>}
                    {statusMessage}
                </div>
            )}

            <div className="flex justify-between items-center pt-2">
                <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                    Sign in instead
                </Link>
                <Button
                    type="submit"
                    disabled={loading || success}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded transition-colors"
                >
                    {loading ? (
                    <span className="flex items-center gap-2">
                        <Loader2 size={16} className="animate-spin" />
                        Creating...
                    </span>
                    ) : success ? (
                    "Success"
                    ) : (
                    "Next"
                    )}
                </Button>
            </div>
        </form>
      </Card>

      <div className="mt-8 flex gap-6 text-xs text-gray-500">
        <a href="#" className="hover:text-gray-900">Help</a>
        <a href="#" className="hover:text-gray-900">Privacy</a>
        <a href="#" className="hover:text-gray-900">Terms</a>
      </div>
    </div>
  );
};
