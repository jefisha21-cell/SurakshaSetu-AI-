import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { getCurrentUser } from "./services/authService";
import { checkUserExists, getUserPolicy } from "./services/firestoreService";

import LoginScreen from "./screens/LoginScreen";
import OtpScreen from "./screens/OtpScreen";
import ProfileSetupScreen from "./screens/ProfileSetupScreen";
import PlanSelectionScreen from "./screens/PlanSelectionScreen";
import DashboardScreen from "./screens/DashboardScreen";

const spinnerStyle = {
  width: 40, height: 40,
  border: "3px solid #dde3f0",
  borderTopColor: "#1A73E8",
  borderRadius: "50%",
  animation: "spin 0.7s linear infinite",
};

const Spinner = () => (
  <>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    <div style={{ display:"flex", justifyContent:"center", alignItems:"center", height:"100vh" }}>
      <div style={spinnerStyle} />
    </div>
  </>
);

export default function App() {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const resolve = async () => {
      try {
        const user = getCurrentUser();
        if (!user) { setStatus("guest"); return; }
        const exists = await checkUserExists(user.uid);
        if (!exists) { setStatus("profile"); return; }
        const policy = await getUserPolicy(user.uid);
        setStatus(policy ? "dashboard" : "plan");
      } catch {
        setStatus("guest");
      }
    };
    resolve();
  }, []);

  if (status === "loading") return <Spinner />;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/otp" element={<OtpScreen />} />
        <Route path="/profile-setup" element={<ProfileSetupScreen />} />
        <Route path="/plan-selection" element={<PlanSelectionScreen />} />
        <Route path="/dashboard" element={<DashboardScreen />} />
        <Route
          path="*"
          element={
            <Navigate to={
              status === "guest" ? "/login" :
              status === "profile" ? "/profile-setup" :
              status === "plan" ? "/plan-selection" :
              "/dashboard"
            } replace />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
