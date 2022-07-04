import React from "react";
import { Link } from "react-router-dom";
import HomeNavbar from "../components/Home/HomeNavbar";
import Body from "../components/Home/Body";
import HomeFooter from "../components/Home/HomeFooter";

export default function Home() {

 

  return (
    <div>
      <HomeNavbar />
      <Link to={"/signup"}>
        <button>sign up</button>
      </Link>
      <Link to={"/login"}>
        <button>login</button>
      </Link>
   
      <Link to={"/display"}>
        <button>display</button>
      </Link>
      <Body />
      <HomeFooter />
    </div>
  );
}
