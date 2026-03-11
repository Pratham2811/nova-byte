import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { HomePage } from "./pages/HomePage";
import { ProfilePage } from "./pages/ProfilePage";
import LoginPage from "./pages/auth/LoginPage";
import { Toaster } from "sonner";
import RegisterPage from "./pages/auth/RegisterPage";
import LoginForm from "./features/auth/login/LoginForm";
import { useDispatch } from "react-redux";
import { getUser } from "./features/auth/thunks/sessionThunk";
import { getIntegrationsInfo } from "./features/appIntegrations/slice/integrationThunk";
import { useEffect, useState } from "react";

function App() {
  const dispatch = useDispatch();
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        await dispatch(getUser()).unwrap();
        await dispatch(getIntegrationsInfo()).unwrap();
      } catch (error) {
        console.log(error);
      } finally {
        setAppReady(true);
      }
    };

    bootstrap();
  }, []);

  if (!appReady) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Toaster richColors position="top-right" />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/directory/:dirid" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/user-profile" element={<ProfilePage />} />
        <Route path="/login2" element={<LoginForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
