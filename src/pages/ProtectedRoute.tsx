import React from 'react'
import {Navigate} from 'react-router-dom';
import useCredentialsStore from '../store/credentialsStore'

interface PropsWithChildren {
    user: boolean | null;
    children: React.ReactElement
}

const ProtectedRoute: React.FC<PropsWithChildren> = ({user:any, children}) => {
  //STATE DECLARATION (dbSpy3.0)
  const user = useCredentialsStore(state => state.user);
  const setUser = useCredentialsStore(state => state.setUser);
  //END: STATE DECLARATION

  return user ? children : <Navigate to='/login' replace />
}

export default ProtectedRoute