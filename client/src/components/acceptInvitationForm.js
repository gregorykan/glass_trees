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

const AcceptInvitationForm = (props) => {
  const {
    doAcceptInvitation,
    invitationToken,
    doUpdateInvitationPasswordField,
    doUpdateInvitationPasswordConfirmationField,
    invitationPasswordField,
    invitationPasswordConfirmationField
  } = props

  const handlePasswordChange = (e) => {
    return doUpdateInvitationPasswordField(e.target.value)
  }

  const handlePasswordConfirmationChange = (e) => {
    return doUpdateInvitationPasswordConfirmationField(e.target.value)
  }

  const handleSubmit = () => {
    const formData = {
      password: invitationPasswordField,
      password_confirmation: invitationPasswordConfirmationField,
      invitation_token: invitationToken
    }
    return doAcceptInvitation(formData)
  }

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>Accept Invitation</h1>
      <form style={formStyle}>
        <TextField
          label={'Password'}
          type='password'
          value={invitationPasswordField}
          onChange={handlePasswordChange}
        />
        <TextField
          label={'Password Confirmation'}
          type='password'
          value={invitationPasswordConfirmationField}
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

export default AcceptInvitationForm
