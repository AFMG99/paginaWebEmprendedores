import React from 'react'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({element: Component}) => {
  const isAuthenticated = false

  return isAuthenticated ? <Component /> : <Navigate to="/" />
}

export default ProtectedRoute
