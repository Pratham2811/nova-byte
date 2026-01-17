/**
 * useAuth Hook
 * Manages authentication state and operations (login/register)
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../services/auth.service";

export const useAuth = (mode = "login") => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setStatusMessage("");

    // Validation
    if (mode === "login" && (!formData.email || !formData.password)) {
      setError("CREDENTIALS MISSING");
      return;
    }

    if (mode === "register" && (!formData.username || !formData.email || !formData.password)) {
      setError("All fields are required");
      return;
    }

    setLoading(true);

    try {
      let response;
      
      if (mode === "login") {
        response = await loginUser(formData.email, formData.password);
        setSuccess(true);
        setStatusMessage("VERIFIED. REDIRECTING...");
        setTimeout(() => navigate("/"), 800);
      } else {
        response = await registerUser(formData.username, formData.email, formData.password);
        setSuccess(true);
        setStatusMessage(`SUCCESS: ${response.data.message || 'User created successfully.'}`);
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err) {
      const errorMessage = err.message || (mode === "login" ? "ACCESS DENIED" : "Server error occurred.");
      setError(errorMessage);
      setStatusMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    loading,
    error,
    success,
    statusMessage,
    handleChange,
    handleSubmit,
    setFormData,
  };
};
