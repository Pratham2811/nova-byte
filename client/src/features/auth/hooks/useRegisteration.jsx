import React, { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";

export const useRegisterations = (userData) => {
   const [otpDialogOpen, setOtpDialogOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  //   const [loading, setLoading] = useState({});
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { register, loading, sendOtp, isEmailVerified, resetEmailVerification } =
    useAuth();

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
console.log(password,confirmPassword);

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const response = await register({
      name,
      email,
      password,
    });

    if (response.success) {
      toast.success("Account created successfully");
      navigate("/login");
    } else {
      toast.error(response.error);
    }
  };
  const handleOptSending = async () => {
    const response = await sendOtp(email);
    if (response.success) {
      setOtpDialogOpen(true);
    } else {
      toast.error(response.error || "Failed to send OTP");
    }
  };
  return {
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    error,
    handleSubmit,
    loading,
   setConfirmPassword,
    name,
    setName,
   handleOptSending,
    isEmailVerified,
    resetEmailVerification,
    otpDialogOpen,
    setOtpDialogOpen
  };
};
