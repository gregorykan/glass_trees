import React from 'react'
import { Button, TextField } from '@material-ui/core'

const containerStyle = {
  display: 'flex',
  flexDirection: 'column'
}

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  marginTop: 20,
  width: 300
}

const buttonStyle = {
  marginTop: 20
}

const headerStyle = {
  textAlign: 'center'
}

const SignInForm = (props) => {
  const {
    doUpdateSignInEmailField,
    doUpdateSignInPasswordField,
    doSignIn,
    signInEmailField,
    signInPasswordField,
    doUpdateHash
  } = props

  const handleSignInEmailChange = (e) => {
    return doUpdateSignInEmailField(e.target.value)
  }

  const handleSignInPasswordChange = (e) => {
    return doUpdateSignInPasswordField(e.target.value)
  }

  const handleSubmit = () => {
    const formData = {
      email: signInEmailField,
      password: signInPasswordField
    }
    return doSignIn(formData)
  }

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>Sign In</h1>
      <form style={formStyle}>
        <TextField
          label={'Email'}
          type='email'
          value={signInEmailField}
          onChange={handleSignInEmailChange}
        />
        <TextField
          label={'Password'}
          type='password'
          value={signInPasswordField}
          onChange={handleSignInPasswordChange}
        />
        <Button variant='outlined' style={buttonStyle} type='button' onClick={handleSubmit}>Sign In</Button>
      </form>
      <Button variant='outlined' style={buttonStyle} type='button' onClick={() => { doUpdateHash('sign-up') }}>Or Sign Up Here</Button>
    </div>
  )
}

export default SignInForm
