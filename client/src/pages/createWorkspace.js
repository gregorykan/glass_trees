import React from 'react'
import { connect } from 'redux-bundler-react'

import CreateWorkspaceForm from '../components/createWorkspaceForm'

const CreateWorkspace = ({
  doCreateWorkspace,
  workspaceNameField,
  doUpdateWorkspaceNameField,
  currentUser
 }) => {
  return (
    <CreateWorkspaceForm
      doCreateWorkspace={doCreateWorkspace}
      workspaceNameField={workspaceNameField}
      doUpdateWorkspaceNameField={doUpdateWorkspaceNameField}
      currentUser={currentUser}
    />
  )
}

export default connect(
  'doCreateWorkspace',
  'selectWorkspaceNameField',
  'doUpdateWorkspaceNameField',
  'selectCurrentUser',
  CreateWorkspace
)
