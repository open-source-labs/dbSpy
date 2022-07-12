import React from "react";
import { Link, useNavigate } from "react-router-dom";
import HomeNavbar from "../components/Home/HomeNavbar";
import Body from "../components/Home/Body";
import HomeFooter from "../components/Home/HomeFooter";

// UI components from MUI

interface stateChangeProps {
  user: {
    email: string | null;
    id: string | null;
    name: string | null;
    picture: string | null;
  };
  loggedIn: boolean;
}

/* "Home" Component - main launch page */
export default function Home({ user, loggedIn }: stateChangeProps) {
  const navigate = useNavigate();

  /*
  "logout" - a function that fetches data from "/logout" route; 
  it gets invoked when "LogOut" button is clicked and returns {logout: true | false}
  Once logout is successful, navigate/redirect to "/login" route;
  Leveraging localStorage for authentication status for component rendering;
  */
  function logout() {
    localStorage.setItem("isLoggedIn", "false");
    fetch("/logout")
      .then((response) => response.json())
      .then((data) => {
        navigate("/login");
      })
      .catch((err: {}) => {
        navigate("/login");
      });
  }

  /*
  Three main components under Home:
  1. HomeNavbar - conditional rendering implemented for authorized users (localStorage)
  2. Body - contents describe dbSpy products
  3. HomeFooter
  */
  return (
    <div>
      <HomeNavbar />
      {localStorage.getItem("isLoggedIn") === "true" ? (
        <div>
          <Link to={"/"}>
            <button onClick={logout}>Log Out</button>
          </Link>
          <Link to={`/display/${user.id}`}>
            <button>display</button>
          </Link>
        </div>
      ) : (
        <div>
          <Link to={"/signup"}>
            {/* <button>Sign up</button> */}
          </Link>
          <Link to={"/login"}>
            {/* <button>Log in</button> */}
          </Link>
          <Link to={"/login"}>
            {/* <button>Free demo</button> */}
          </Link>
        </div>
      )}

      <Body />
      <HomeFooter />
    </div>
  );
}
