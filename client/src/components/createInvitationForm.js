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

const CreateInvitationForm = (props) => {
  const {
    doCreateInvitation,
    doUpdateInvitationEmailField,
    invitationEmailField
  } = props

  const handleEmailChange = (e) => {
    return doUpdateInvitationEmailField(e.target.value)
  }

  const handleSubmit = () => {
    const formData = {
      email: invitationEmailField
    }
    return doCreateInvitation(formData)
  }

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>Create Invitation</h1>
      <form style={formStyle}>
        <TextField
          label={'Email'}
          type='email'
          value={invitationEmailField}
          onChange={handleEmailChange}
        />
        <Button
          variant='outlined'
          style={buttonStyle}
          type='button'
          onClick={handleSubmit}
        >Invite</Button>
      </form>
    </div>
  )
}

export default CreateInvitationForm
