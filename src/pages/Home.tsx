// React & React Router Modules
import React from "react";

//Components imported
import Body from "../components/Home/Body";
import HomeFooter from "../components/Home/HomeFooter";
import HomeLoggedInNavbar from "../components/Home/HomeLoggedInNavbar";
import HomeNavbar from "../components/Home/HomeNavbar";
import Description from '../components/Home/Description';
import Contributors from '../components/Home/Contributors';
import useCredentialsStore from "../store/credentialsStore";

// interface stateChangeProps {
  // user: {
  //   email: string | null;
  //   id: string | null;
  //   name: string | null;
  //   picture: string | null;
  // };
  // setUser: (user: any) => void;
// }

/* "Home" Component - main launch page */
export default function Home() {
  //STATE DECLARATION (dbSpy3.0)
  const user = useCredentialsStore(state => state.user);
  const setUser = useCredentialsStore(state => state.setUser);
  //END: STATE DECLARATION

  
  /*
  Three main components under Home:
  1. HomeNavbar - conditional rendering implemented for authorized users (localStorage)
  2. Body - contents describe dbSpy products
  3. HomeFooter
  */
  return (
  //   <div>
  //     {user.id !== null ? (
  //       <HomeLoggedInNavbar user={user} setUser={setUser} />
  //     ) : (
  //       <HomeNavbar />
  //     )}
  //     <Body />
      
  //     <HomeFooter />
  //   </div>
  // );
  <>
   <div className="flex items-center justify-between flex-wrap bg-blue-500 p-6">
  <h2>Home Test</h2>
  {/* <Description></Description> */}
  {/* {user.id !== null ? (
    <HomeLoggedInNavbar user={user} setUser={setUser} />
  ) : (
    <HomeNavbar />
  )}
  <Body />
  
  <HomeFooter /> */}
  </div>
  <Contributors />
</>
);
}
