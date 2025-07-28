import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import CompleteProfile from "./pages/CompleteProfile.jsx";
export default function App() {
  const token = localStorage.getItem("token");

  return (
   <div className = "container">
    <GoogleOAuthProvider clientId="523680828415-e6caf4jrta8c26rfmgda81uad5p6rcu7.apps.googleusercontent.com">
      <BrowserRouter>
        <Routes>
           
          <Route path="/" element={token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/complete-profile" element={<CompleteProfile />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider></div>
  );
}