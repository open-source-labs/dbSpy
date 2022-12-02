import React, { useState, useEffect } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import DBDisplay from "./pages/DBDisplay";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import "./styles/index.css"
import Shared from "./pages/Shared";
import ProtectedRoute from "./pages/ProtectedRoute";
import useCredentialsStore from "./store/credentialsStore";

export default function App() {
  //STATE DECLARATION (dbSpy3.0)
  const user = useCredentialsStore(state => state.user);
  const setUser = useCredentialsStore(state => state.setUser);
  //END: STATE DECLARATION

  /*
    React Router, a library for Client-Side Rendering, with 4 different paths:
    1. "/" - main launch page
    2. "/signup" - sign up page
    3. "/login" - login page
    4. "/display" | "/display/" - database visualization application page; only accessible when user is authorized;
  */

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Shared />}>
          {/* index renders root directory */}
          <Route index element={<Home />} />
          <Route path='login' element={<Login />} />
          <Route path='signup' element={<Signup />} />
          <Route path='display' element={
            <ProtectedRoute user={user}>
              <DBDisplay />
            </ProtectedRoute>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
