import { createContext, useContext, useState, useEffect } from "react";
import {
  loginApi,
  registerApi,
  logoutApi,
  getCurrentUserApi,
  sendOtpApi,
  verifyOtpApi,
} from "../services/auth.service";
import { redirect } from "react-router-dom";
import { toast } from "sonner";


const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Start true to check session
 
  const[userEmail,setUserEmail]=useState("");
  const[verifying,setVerifying]=useState(false);
  const[isEmailVerified,setIsEmailVerified]=useState(false);
  const[isOtpSent,setIsOtpSent]=useState(false);
  
  // Check if user is already logged in on app load
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setLoading(true);
      const response = await getCurrentUserApi();

      console.log("this is response", response);

      if (response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
      }
    } catch (error) {
      // Not logged in - that's fine
      setUser(null);
      setIsAuthenticated(false);
      redirect("/login");
    } finally {
      setLoading(false);
    }
  };

  const login = async (userData) => {
    try {
      setLoading(true);
      const response = await loginApi(userData);
      setUser(response.user);
      setIsAuthenticated(true);
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await registerApi(userData);
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Registration failed",
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const response = await logoutApi();
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  // Update user data (for profile edits)
  const updateUser = (userData) => {
    setUser((prev) => ({ ...prev, ...userData }));
  };

  const sendOtp = async (email) => {
    try {
      setUserEmail(email);
      const response = await sendOtpApi(email);
      const ok =
        response?.success === true ||
        response?.verified === true ||
        (response?.success !== false && response?.verified !== false);
      setIsOtpSent(true);
      return {
        success: ok,
        data: response,
        error: ok ? undefined : response?.message || "Failed to send OTP",
      };
    } catch (error) {
      setIsOtpSent(false);
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to send OTP",
      };
    }
  };

  const verifyOtp = async (otp) => {
    try {
      setVerifying(true);
      const response = await verifyOtpApi({ otp, email: userEmail });
      const ok = response?.success === false ? false : true;
      if (ok) {
        setIsEmailVerified(true);
      }
      return {
        success: ok,
        data: response,
        error: ok ? undefined : response?.message || "Invalid OTP",
      };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Invalid OTP",
      };
    } finally {
      setVerifying(false);
    }
  };

  const resetEmailVerification=async()=>{
    setIsEmailVerified(false);
    setIsOtpSent(false);
    setVerifying(false);
    
  }
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        logout,
        register,
        updateUser,
        checkAuth,
        userEmail,
        isEmailVerified,
        verifyOtp,
        sendOtp,
        verifying,
        setUserEmail,
       isOtpSent,
       resetEmailVerification
       
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
