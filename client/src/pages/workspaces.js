import React from 'react'
import { connect } from 'redux-bundler-react'

import WorkspacesList from '../components/workspacesList'

const Workspaces = (props) => {
  const {
    doUpdateHash,
    workspaces
  } = props
  return (
    <WorkspacesList
      workspaces={workspaces}
    />
  )
}

export default connect(
  'doUpdateHash',
  'selectWorkspaces',
  Workspaces
)
