import React from 'react';
import useCredentialsStore from '../store/credentialsStore';

const Dashboard = () => {
  //STATE DECLARATION (dbSpy3.0)
  const user = useCredentialsStore(state => state.user);
  const setUser = useCredentialsStore(state => state.setUser);
  //END: STATE DECLARATION

  return (
    <div>Dashboard</div>
  )
}

export default Dashboard;