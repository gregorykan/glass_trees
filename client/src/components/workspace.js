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

class WorkspaceComponent extends React.Component {
  componentDidMount () {
    const { doUpdateWorkspaceNameField, workspace } = this.props
    doUpdateWorkspaceNameField(workspace.name)
  }

  render () {
    const {
      doUpdateWorkspace,
      doUpdateWorkspaceNameField,
      workspaceNameField,
      workspace,
      doUpdateHash
    } = this.props

    const handleNameChange = (e) => {
      return doUpdateWorkspaceNameField(e.target.value)
    }

    const handleSubmit = () => {
      const formData = {
        name: workspaceNameField,
        id: workspace.id
      }
      return doUpdateWorkspace(formData)
    }

    return (
      <div style={containerStyle}>
        <h1 style={headerStyle}>{workspace.name}</h1>
        <WorkspaceForm
          handleNameChange={handleNameChange}
          handleSubmit={handleSubmit}
          nameFieldValue={workspaceNameField}
        />
      </div>
    )
  }
}

export default WorkspaceComponent
