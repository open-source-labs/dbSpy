import React, { useState, useEffect } from "react";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import DBDisplay from "./pages/DBDisplay";
import HomeFooter from "./components/Home/HomeFooter";
import { useNavigate } from "react-router-dom";
export default function App() {
  // const [user, setUser] = useState(null)
  //useEffect to validate user session by default set to null

  //declare function userAuth which uses fetch method to server
  // route to /applicationAuth
  // which will return from response.json user session details
  // if user session exist, use setUser to response.json
  // if does not exist, redirect
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState({
    name: null,
    email: null,
    id: null,
    picture: null,
  });
  let navigate = useNavigate();

  useEffect(() => {
    // declare the async data fetching function
    const fetchData = async () => {
      const data = await fetch("/protected");
      // convert data to json
      const result = await data.json();
      if (result !== null) {
        setUser({
          name: result.given_name,
          email: result.email,
          id: result.id,
          picture: result.picture,
        });
        console.log(result);
      } else {
        setUser({ name: null, email: null, id: null, picture: null });
        // navigate("/");
      }
    };

    // call the function
    fetchData()
      // make sure to catch any error
      .catch((err) => {
        console.error;
        setUser({ name: null, email: null, id: null, picture: null });
      });
  }, []);

  return (
    <Routes>
      <Route path="/signup" element={<Signup />} />

      <Route path="/login" element={<Login />} />

      <Route path={"/"} element={<Home user={user} loggedIn={loggedIn} />} />

      <Route
        path="/display"
        // element={<DBDisplay user={user} />}
        element={
          user.id !== null ? (
            <DBDisplay
              user={user}
              loggedIn={loggedIn}
              setLoggedIn={setLoggedIn}
            />
          ) : (
            "PLEASE LOG IN..."
          )
        }
      />

      <Route
        path="/display/:id"
        element={
          <DBDisplay
            user={user}
            loggedIn={loggedIn}
            setLoggedIn={setLoggedIn}
          />
        }
        // element={
        //   user.id !== null ? <DBDisplay user={user} /> : "PLEASE LOG IN..."
        // }
      />
    </Routes>
  );
}
