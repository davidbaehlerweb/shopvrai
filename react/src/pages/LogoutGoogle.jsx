import React from 'react'
import { GoogleLogout } from 'react-google-login'

const clientId="580332257996-nhteq0dh32m410tgfql9klnu9o8cj9dk.apps.googleusercontent.com";

const LogoutGoogle = () => {
    const onSuccess=()=>{
        console.log("Log out successfully")
    }
  return (
    <div>
      <GoogleLogout
        clientId={clientId}
        buttonText={'Logout'}
        onLogoutSuccess={onSuccess}
      />
    </div>
  )
}

export default LogoutGoogle
