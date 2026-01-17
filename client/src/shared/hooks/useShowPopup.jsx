import React, { useState, useEffect } from "react";
export const useShowPopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  // Use a useEffect to automatically hide the popup after a few seconds
  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => {
        setShowPopup(false);
        setPopupMessage("");
      }, 3000); // Popup disappears after 3 seconds
      // Cleanup the timer if the component unmounts or the popup state changes
      return () => clearTimeout(timer);
    }
  }, [showPopup]);

  // The function to trigger the popup
  const show = (message) => {
    setPopupMessage(message);
    setShowPopup(true);
  };

  return { showPopup, popupMessage, show, setShowPopup };
};
