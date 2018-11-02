import React from 'react'
import { Button, TextField } from '@material-ui/core'
import { isNil } from 'lodash'

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
  minWidth: window.innerWidth / 2
}

const textFieldInputStyle = {
  fontSize: 30
}

const WorkspaceForm = (props) => {
  const {
    handleSubmit,
    handleNameChange,
    nameFieldValue,
    isCreating = false,
    workspace = {}
  } = props

  const workspaceCurrentName = workspace.name

  const hasWorkspaceNameChanged = () => {
    if (isCreating) return true
    if (workspaceCurrentName !== nameFieldValue) {
      return true
    }
    return false
  }

  const renderSaveButton = () => {
    if (hasWorkspaceNameChanged()) {
      return (
        <Button
          variant='outlined'
          style={buttonStyle}
          type='button'
          onClick={handleSubmit}
        >Save</Button>
      )
    } else {
      return null
    }
  }

  return (
    <div style={containerStyle}>
      <form style={formStyle}>
        <TextField
          label={isCreating ? 'Question?' : null}
          type='text'
          value={nameFieldValue}
          onChange={handleNameChange}
          style={textFieldStyle}
          InputProps={{
            style: textFieldInputStyle
          }}
        />
        {renderSaveButton()}
      </form>
    </div>
  )
}

export default WorkspaceForm
