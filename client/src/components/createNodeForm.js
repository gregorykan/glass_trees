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

const CreateNodeForm = props => {
  const {
    currentNodeId,
    doCreateNode,
    nodeFormData,
    doUpdateNodeFormDataLabel,
    doUpdateNodeFormDataDescription,
    nodeCreationType,
    doUpdateNodeTypeToBeCreated
   } = props

  const handleLabelChange = (e) => {
    doUpdateNodeFormDataLabel(e.target.value)
  }

  const handleDescriptionChange = (e) => {
    doUpdateNodeFormDataDescription(e.target.value)
  }

  const handleSubmit = () => {
    const nodeCreationTypesToNodeTypes = {
      'clarifyingQuestion': 'question',
      'followUpQuestion': 'question',
      'option': 'option'
    }
    const formData = {
      ...nodeFormData,
      current_node_id: currentNodeId,
      node_creation_type: nodeCreationType,
      node_type: nodeCreationTypesToNodeTypes[nodeCreationType]
    }
    console.log('create node form data', formData)
    doCreateNode(formData)
  }

  const handleCancel = () => {
    doUpdateNodeTypeToBeCreated()
  }

  return (
    <div style={containerStyle}>
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
        <Button style={submitButtonStyle} variant='outlined' type='button' onClick={handleSubmit}>Submit</Button>
        <Button style={submitButtonStyle} variant='outlined' type='button' onClick={handleCancel}>Cancel</Button>
      </form>
    </div>
  )
}

export default CreateNodeForm
