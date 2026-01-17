/**
 * useSidebar Hook
 * Manages sidebar state and responsive behavior
 */

import { useState, useEffect, useRef } from "react";

export const useSidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle resize for responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobile(false);
        setIsSidebarOpen(true);
      } else {
        setIsMobile(true);
        setIsSidebarOpen(false);
      }
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return {
    isSidebarOpen,
    isMobile,
    setIsSidebarOpen,
  };
};

/**
 * useUserMenu Hook
 * Manages user menu dropdown state with click outside detection
 */
export const useUserMenu = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    
    const handleEscape = (event) => {
      if (event.key === "Escape") setIsUserMenuOpen(false);
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return {
    isUserMenuOpen,
    setIsUserMenuOpen,
    userMenuRef,
  };
};
