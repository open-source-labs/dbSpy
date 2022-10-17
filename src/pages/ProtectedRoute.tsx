import React from 'react'
import {Navigate} from 'react-router-dom';

interface PropsWithChildren {
    user: boolean | null;
    children: React.ReactElement
}

const ProtectedRoute: React.FC<PropsWithChildren> = ({user, children}) => {
  return user? children : <Navigate to='/login' replace />
}

export default ProtectedRoute