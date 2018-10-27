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

const GroupForm = (props) => {
  const {
    handleSubmit,
    handleNameChange,
    nameFieldValue
  } = props

  return (
    <div style={containerStyle}>
      <form style={formStyle}>
        <TextField
          label={'Name'}
          type='email'
          value={nameFieldValue}
          onChange={handleNameChange}
        />
        <Button
          variant='outlined'
          style={buttonStyle}
          type='button'
          onClick={handleSubmit}
        >Save</Button>
      </form>
    </div>
  )
}

export default GroupForm
