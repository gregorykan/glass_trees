import React from 'react'
import { Button, TextField } from '@material-ui/core'

import GroupForm from './groupForm'

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

class EditGroupForm extends React.Component {
  componentDidMount () {
    const { doUpdateGroupNameField, group } = this.props
    doUpdateGroupNameField(group.name)
  }

  render () {
    const {
      doUpdateGroup,
      doUpdateGroupNameField,
      groupNameField,
      group,
      doUpdateHash
    } = this.props

    const handleNameChange = (e) => {
      return doUpdateGroupNameField(e.target.value)
    }

    const handleSubmit = () => {
      const formData = {
        name: groupNameField,
        id: group.id
      }
      return doUpdateGroup(formData)
    }

    return (
      <div style={containerStyle}>
        <h1 style={headerStyle}>Edit Group</h1>
        <GroupForm
          handleNameChange={handleNameChange}
          handleSubmit={handleSubmit}
          nameFieldValue={groupNameField}
        />
        <Button
          variant='outlined'
          style={buttonStyle}
          type='button'
          onClick={() => { doUpdateHash('create-invitation') }}
        >Invite New Members</Button>
      </div>
    )
  }
}

export default EditGroupForm
