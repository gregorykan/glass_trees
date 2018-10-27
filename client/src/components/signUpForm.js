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

const SignUpForm = (props) => {
  const {
    doUpdateSignUpEmailField,
    doUpdateSignUpPasswordField,
    doUpdateSignUpPasswordConfirmationField,
    signUpEmailField,
    signUpPasswordField,
    signUpPasswordConfirmationField,
    doSignUp
  } = props

  const handleEmailChange = (e) => {
    doUpdateSignUpEmailField(e.target.value)
  }

  const handlePasswordChange = (e) => {
    doUpdateSignUpPasswordField(e.target.value)
  }

  const handlePasswordConfirmationChange = (e) => {
    doUpdateSignUpPasswordConfirmationField(e.target.value)
  }

  const handleSubmit = () => {
    const formData = {
      email: signUpEmailField,
      password: signUpPasswordField,
      password_confirmation: signUpPasswordConfirmationField
    }
    doSignUp(formData)
  }

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>Sign Up</h1>
      <form style={formStyle}>
        <TextField
          label={'Email'}
          type='email'
          value={signUpEmailField}
          onChange={handleEmailChange}
        />
        <TextField
          label={'Password'}
          type='password'
          value={signUpPasswordField}
          onChange={handlePasswordChange}
        />
        <TextField
          label={'Password Confirmation'}
          type='password'
          value={signUpPasswordConfirmationField}
          onChange={handlePasswordConfirmationChange}
        />
        <Button
          variant='outlined'
          style={buttonStyle}
          type='button'
          onClick={handleSubmit}
        >Complete Signup</Button>
      </form>
    </div>
  )
}

export default SignUpForm
