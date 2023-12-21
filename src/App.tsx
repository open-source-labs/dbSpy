import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import DBDisplay from './pages/DBDisplay';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Shared from './pages/Shared';
import useCredentialsStore from './store/credentialsStore';
import './styles/index.css';
import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import DBDisplay from './pages/DBDisplay';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Shared from './pages/Shared';
import useCredentialsStore from './store/credentialsStore';
import './styles/index.css';

const App: React.FC = () => {
  //STATE DECLARATION (dbSpy3.0)
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
        <Route path="/" element={<Shared />}>
          {/* index renders root directory */}
          <Route index element={<Home />} />
          <Route path="login" element={user ? <DBDisplay /> : <Login />} />
          <Route path="signup" element={user ? <DBDisplay /> : <Signup />} />
          <Route path="login" element={user ? <DBDisplay /> : <Login />} />
          <Route path="signup" element={user ? <DBDisplay /> : <Signup />} />
        </Route>
        <Route path="display" element={<DBDisplay />} />
        <Route path="display" element={<DBDisplay />} />
      </Routes>
    </BrowserRouter>
  );
};
};

export default App;

