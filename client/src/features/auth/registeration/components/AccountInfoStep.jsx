import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { createAccount } from "../../thunks/registrationThunks";
import { useNavigate } from "react-router-dom";
import { updateFormData } from "../../slices/authSlice";

export function AccountInfoStep() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { formData, isLoading } = useSelector((state) => state.auth.registeration);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    dispatch(updateFormData({ username, password }));
    try {
      await dispatch(createAccount({ ...formData, username, password })).unwrap();
      toast.success("Account created successfully");
      navigate("/login");
    } catch (error) {
      toast.error(error || "Registration failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username" className="text-slate-700 font-medium">Username</Label>
          <Input
            id="username"
            placeholder="johndoe"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="h-12 bg-slate-50 border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-indigo-500/20 rounded-lg"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-slate-700 font-medium">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 bg-slate-50 border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-indigo-500/20 rounded-lg"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm-password" className="text-slate-700 font-medium">Confirm Password</Label>
          <Input
            id="confirm-password"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="h-12 bg-slate-50 border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-indigo-500/20 rounded-lg"
          />
        </div>
      </div>

      <Button 
        type="submit" 
        className="h-12 w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-md shadow-indigo-500/20 mt-2"
        disabled={isLoading}
      >
        {isLoading ? "Creating account..." : "Complete Registration"}
      </Button>
    </form>
  );
}