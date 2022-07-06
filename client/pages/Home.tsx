import React from "react";
import { Link, useNavigate } from "react-router-dom";
import HomeNavbar from "../components/Home/HomeNavbar";
import Body from "../components/Home/Body";
import HomeFooter from "../components/Home/HomeFooter";

interface stateChangeProps {
  user: {
    email: string | null;
    id: string | null;
    name: string | null;
    picture: string | null;
  };
  loggedIn: boolean;
}

export default function Home({ user, loggedIn }: stateChangeProps) {
  const navigate = useNavigate();
  function logout() {
    localStorage.setItem("isLoggedIn", "false");

    fetch("/logout")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        navigate("/login");
      })
      .catch((err: {}) => {
        console.log("Error:", err);
        navigate("/login");
      });

    localStorage.console.log("clicked");
  }

  console.log("LoggedIn?", loggedIn);

  return (
    <div>
      <HomeNavbar />

      {localStorage.getItem("isLoggedIn") === "true" ? (
        <div>
          <Link to={"/"}>
            <button onClick={logout}>logout</button>
          </Link>
          <Link to={`/display/${user.id}`}>
            <button>display</button>
          </Link>
        </div>
      ) : (
        <div>
          <Link to={"/signup"}>
            <button>sign up</button>
          </Link>
          <Link to={"/login"}>
            <button>login</button>
          </Link>
          {/* <Link to={"/login"}>
            <button>display</button>
          </Link> */}
        </div>
      )}

      <Body />
      <HomeFooter />
    </div>
  );
}
