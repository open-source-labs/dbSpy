// React & React Router Modules
import React from "react";

//Components imported
import Body from "../components/Home/Body";
import HomeFooter from "../components/Home/HomeFooter";
import HomeNavbar from "../components/Home/HomeNavbar";

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
  /*
  Three main components under Home:
  1. HomeNavbar - conditional rendering implemented for authorized users (localStorage)
  2. Body - contents describe dbSpy products
  3. HomeFooter
  */
  return (
    <div>
      <HomeNavbar user={user} />
      <Body />
      <HomeFooter />
    </div>
  );
}
