import React from 'react'
import { Button, TextField } from '@material-ui/core'

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  marginBottom: 20
}

const formStyle = {
  display: 'flex',
  flexDirection: 'row',
  marginTop: 20
}

const buttonStyle = {
  marginLeft: 20
}

const textFieldStyle = {
  minWidth: 200
}

const textFieldInputStyle = {
  fontSize: 30
}

const WorkspaceForm = (props) => {
  const {
    handleSubmit,
    handleNameChange,
    nameFieldValue
  } = props

  return (
    <div style={containerStyle}>
      <form style={formStyle}>
        <TextField
          type='text'
          value={nameFieldValue}
          onChange={handleNameChange}
          style={textFieldStyle}
          InputProps={{
            style: textFieldInputStyle
          }}
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

export default WorkspaceForm
