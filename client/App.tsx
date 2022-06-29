import React from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";

export default function App() {
  return (
    <Routes>
      <Route path="/signup" element={<Signup />} />

      <Route path="/login" element={<Login />} />

      <Route path={"/"} element={<Home />} />
    </Routes>
  );
}
