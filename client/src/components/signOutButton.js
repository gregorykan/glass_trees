import React from 'react'
import { Button } from '@material-ui/core'

const buttonStyle = {
  bottom: 15,
  position: 'fixed'
}

const SignOutButton = ({ doSignOut }) => {
  const handleSignOut = () => {
    doSignOut()
  }
  return (
    <Button style={buttonStyle} variant='outlined' onClick={handleSignOut}>Sign Out</Button>
  )
}

export default SignOutButton
