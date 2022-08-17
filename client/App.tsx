import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import DBDisplay from "./pages/DBDisplay";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import  "./styles.css"



export default function App() {
  /*
  States Declaration:
  "user" - object that describes the user data coming back from OAuth2.0;
  */
  const [user, setUser] = useState({
    name: null,
    email: null,
    id: null,
    picture: null,
  });

  /*
  UseEffect to fetch user data from "/protected" route;
  "fetchData" - a function that fetches user data from "/protected" route;
  setUser with data come back from fetch request;
  */
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetch("/protected");
      const result = await data.json();
      if (result !== null) {
        setUser({
          name: result.given_name,
          email: result.email,
          id: result.id,
          picture: result.picture,
        });
      } else {
        setUser({ name: null, email: null, id: null, picture: null });
      }
    };

    /* invocation of "fetchData" with error handling with catch */
    fetchData().catch((err) => {
      console.error;
      setUser({ name: null, email: null, id: null, picture: null });
    });
  }, []);

  /*
    React Router, a library for Client-Side Rendering, with 4 different paths:
    1. "/" - main launch page
    2. "/signup" - sign up page
    3. "/login" - login page
    4. "/display" | "/display/:id" - database visualization application page; only accessible when user is authorized;
  */
  return (
    <Routes>
      <Route path={"/"} element={<Home user={user} setUser={setUser} />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/display/access"
        element={
          user.id !== null ? (
            <DBDisplay user={user} setUser={setUser} />
          ) : (
            "Redirecting"
          )
        }
      />

      <Route
        path="/display/access/:id"
        element={
          user.id !== null ? (
            <DBDisplay user={user} setUser={setUser} />
          ) : (
            "Redirecting"
          )
        }
      />
    </Routes>
  );
}
