import React from 'react'
import { Navigate } from 'react-router-dom'

function ProtectedRoute({children}) {
 const isLoggedIn = localStorage.getItem("isLoggedIn")
 if(!isLoggedIn){
 return <Navigate to='/' />
 }
 else{
  return children
 }
}

export default ProtectedRoute
