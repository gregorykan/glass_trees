import React from 'react'
import { Button, TextField } from '@material-ui/core'

import WorkspaceForm from './workspaceForm'

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

const CreateWorkspaceForm = (props) => {
  const {
    doCreateWorkspace,
    doUpdateWorkspaceNameField,
    workspaceNameField,
    currentUser
  } = props

  const handleNameChange = (e) => {
    return doUpdateWorkspaceNameField(e.target.value)
  }

  const handleSubmit = () => {
    const formData = {
      name: workspaceNameField,
      group_id: currentUser.group_id
    }
    return doCreateWorkspace(formData)
  }

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>What's your question?</h1>
      <WorkspaceForm
        handleNameChange={handleNameChange}
        handleSubmit={handleSubmit}
        nameFieldValue={workspaceNameField}
        isCreating={true}
      />
    </div>
  )
}

export default CreateWorkspaceForm
