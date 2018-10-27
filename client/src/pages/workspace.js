import React from 'react'
import { connect } from 'redux-bundler-react'
import { isNil } from 'lodash'

import WorkspaceComponent from '../components/workspace'

const Workspace = (props) => {
  const {
    doUpdateHash,
    thisWorkspace,
    workspaceNameField,
    doUpdateWorkspaceNameField,
    doUpdateWorkspace
  } = props
  if (isNil(thisWorkspace)) return null
  return (
    <WorkspaceComponent
      workspace={thisWorkspace}
      doUpdateHash={doUpdateHash}
      workspaceNameField={workspaceNameField}
      doUpdateWorkspaceNameField={doUpdateWorkspaceNameField}
      doUpdateWorkspace={doUpdateWorkspace}
    />
  )
}

export default connect(
  'doUpdateHash',
  'selectThisWorkspace',
  'selectWorkspaceNameField',
  'doUpdateWorkspaceNameField',
  'doUpdateWorkspace',
  Workspace
)
