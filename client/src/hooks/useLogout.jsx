import { useState, useCallback } from "react";

const useLogout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userLoggedOut, setUserLoggedOut] = useState(false);

  const logoutUser = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost/user/logout-user", {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Logout failed");
      setUserLoggedOut(true);
    } catch (err) {
      setError(err.message);
      setUserLoggedOut(false);
    } finally {
      setLoading(false);
    }
  }, []);

  return { logoutUser, userLoggedOut, loading, error };
};

export default useLogout;
