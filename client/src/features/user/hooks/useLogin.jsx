import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/auth.service";

/**
 * useLogin Hook
 * Handles login logic, state, and API calls
 */
export const useLogin = () => {
    const navigate = useNavigate();
    
    // Form State
    const [formData, setFormData] = useState({
        email: "prathameshmadane18@gmail.com",
        password: "12345678"
    });

    // UI States
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    // Handlers
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user types
        if (error) setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess(false);

        try {
            const response = await loginUser(formData.email, formData.password);
            
            // Assuming successful login returns a token
            if (response.data?.token) {
                localStorage.setItem("token", response.data.token);
            }
            // Or if user data is returned
            if (response.data?.user) {
                localStorage.setItem("user", JSON.stringify(response.data.user));
            }

            setSuccess(true);
            
            // Delay navigation slightly to show success state
            setTimeout(() => {
                navigate("/");
            }, 1000);

        } catch (err) {
            console.error("Login failed:", err);
            setError(err.message || "Invalid credentials. Access denied.");
        } finally {
            setLoading(false);
        }
    };

    return {
        formData,
        loading,
        error,
        success,
        handleChange,
        handleSubmit
    };
};