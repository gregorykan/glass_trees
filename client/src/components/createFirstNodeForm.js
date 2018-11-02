import React from 'react'
import { Button, TextField, Select, MenuItem, FormControl, InputLabel, FormGroup } from '@material-ui/core'
import { isNil } from 'lodash'

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

const headerStyle = {
  textAlign: 'center'
}

const submitButtonStyle = {
  marginTop: 20
}

const CreateFirstNodeForm = props => {
  const {
    doCreateFirstNode,
    nodeFormData,
    doUpdateNodeFormDataLabel,
    doUpdateNodeFormDataDescription,
    workspace,
    currentUser
   } = props

  const handleLabelChange = (e) => {
    doUpdateNodeFormDataLabel(e.target.value)
  }

  const handleDescriptionChange = (e) => {
    doUpdateNodeFormDataDescription(e.target.value)
  }

  const handleSubmit = () => {
    const formData = {
      ...nodeFormData,
      node_type: 'question',
      workspace_id: workspace.id,
      user_id: currentUser.id
    }
    doCreateFirstNode(formData)
  }

  return (
    <div style={containerStyle}>
      <h3 style={headerStyle}>What's your question?</h3>
      <form style={formStyle}>
        <TextField
          label={'Label'}
          type='text'
          value={nodeFormData.label}
          onChange={handleLabelChange}
        />
        <TextField
          label={'Description'}
          type='text'
          value={nodeFormData.description}
          onChange={handleDescriptionChange}
        />
        <Button style={submitButtonStyle} variant='outlined' type='button' onClick={handleSubmit}>Start</Button>
      </form>
    </div>
  )
}

export default CreateFirstNodeForm
