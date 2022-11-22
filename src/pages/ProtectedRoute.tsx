import React, {useEffect} from 'react'
import {Navigate} from 'react-router-dom';
import useCredentialsStore from '../store/credentialsStore'
import axios from 'axios'

interface PropsWithChildren {
    user: boolean | null;
    children: React.ReactElement
}

const ProtectedRoute: React.FC<PropsWithChildren> = ({user:any, children}) => {
  //STATE DECLARATION (dbSpy3.0)
  const user = useCredentialsStore((state: { user: any; }) => state.user);

  //END: STATE DECLARATION


  return user ? children : <Navigate to='/login' replace />
}

export default ProtectedRoute;