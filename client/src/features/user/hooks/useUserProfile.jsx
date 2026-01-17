/**
 * useUserProfile Hook
 * Manages user profile data and editing operations
 */

import { useState, useEffect } from "react";
import { fetchUserProfile } from "../services/user.service";

export const useUserProfile = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
  });
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        const response = await fetchUserProfile();
        setUserData({
          name: response.data.data.username || "",
          email: response.data.data.useremail || "",
        });
      } catch (err) {
        console.error("Error fetching user:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleEditClick = (field, value) => {
    setEditingField(field);
    setTempValue(value);
  };

  const handleSave = (field) => {
    if (!tempValue.trim()) return;
    
    let newUserData = { ...userData };
    if (field === "Username") {
      newUserData.name = tempValue;
      newUserData.id = tempValue.substring(0, 2).toUpperCase();
    }
    if (field === "Email Address") {
      newUserData.email = tempValue;
    }
    
    setUserData(newUserData);
    setEditingField(null);
    setTempValue("");
  };

  const handleCancel = () => {
    setEditingField(null);
    setTempValue("");
  };

  return {
    userData,
    editingField,
    tempValue,
    loading,
    error,
    handleEditClick,
    handleSave,
    handleCancel,
    setTempValue,
  };
};
