import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import DBDisplay from './pages/DBDisplay';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Shared from './pages/Shared';
import TestNewQuery from './pages/TestNewQuery';
import ViewSavedQueries from './pages/ViewSavedQueries';
import GitHubCallback from './pages/GitHubCallback';

//-- used to store and access login info. using Zustand (state management library)
import useCredentialsStore from './store/credentialsStore';
import './styles/index.css';

const App: React.FC = () => {
  //STATE DECLARATION (dbSpy3.0)
  //-- calling this custom hook to get the current user
  //-- state.user is a bool or obj? if trythy -> user is logged in, if falsy (null / undefined) -> user is not logged in
  const user = useCredentialsStore((state) => state.user);
  //END: STATE DECLARATION

  /*
    React Router, a library for Client-Side Rendering, with 4 different paths:
    1. "/" - main launch page
    2. "/signup" - sign up page
    3. "/login" - login page
    4. "/display" | "/display/" - database visualization application page; only accessible when user is authorized;
    ** Reroutes either to home or display if signed in depending on 
  */

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Shared />}>
          {/* index is default page | visiting `/` loads Home page */}
          <Route index element={<Home />} />
          <Route path="login" element={user ? <DBDisplay /> : <Login />} />
          <Route path="signup" element={user ? <DBDisplay /> : <Signup />} />
          <Route path="display" element={user ? <DBDisplay /> : <Login />} />
          <Route path="test-new-query" element={user ? <TestNewQuery /> : <Login />} />
          <Route
            path="view-saved-queries"
            element={user ? <ViewSavedQueries /> : <Login />}
          />
        </Route>

        {/* --- OAUTH CALLBACK ROUTE --- */}
        {/* GH callback sits outside of the shared route flow */}
        {/* Because this is a redirect from GitHub after successful authentication, it needs to be processed immediately when the user lands on it */}
        <Route path="/auth/github/callback" element={<GitHubCallback />} />

        {/* main dashboard? route does not live inside the Shared layout */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
