import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/auth.service";

/**
 * useRegister Hook
 * Handles registration logic, state, and API calls
 */
export const useRegister = () => {
    const navigate = useNavigate();
    
    // Form State
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: ""
    });

    // UI States
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");

    // Handlers
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (error) setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setStatusMessage("");
        setSuccess(false);

        try {
            // Validation
            if (formData.password.length < 6) {
                throw new Error("Password must be at least 6 characters.");
            }

            const response = await registerUser(
                formData.username, 
                formData.email, 
                formData.password
            );
            
            setSuccess(true);
            setStatusMessage("Registration successful! Redirecting to login...");
            
            // Delay navigation for user to see success message
            setTimeout(() => {
                navigate("/login");
            }, 1500);

        } catch (err) {
            console.error("Registration failed:", err);
            setError(err.message || "Registration failed. Please try again.");
            setStatusMessage(err.message || "Registration failed.");
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
        handleSubmit
    };
};
