import React from 'react'
import { isEmpty } from 'lodash'
import { Card, CardContent, CardActions, Button, CardActionArea, Typography } from '@material-ui/core'

const containerStyle = {
  display: 'flex',
  flexDirection: 'column'
}

const textStyle = {
  textAlign: 'center'
}

const innerContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: 10
}

const WorkspacesList = (props) => {
  const {
    workspaces,
    doUpdateHash
  } = props

  const renderWorkspace = (workspace) => {
    return (
      <Card key={workspace.id} style={innerContainerStyle}>
        <CardActionArea onClick={() => { doUpdateHash(`workspaces/${workspace.id}`) }}>
          <CardContent>
            <Typography variant='headline'>
              {workspace.name}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    )
  }
  const renderWorkspaces = (workspaces) => {
    if (isEmpty(workspaces)) return null
    return workspaces.map(renderWorkspace)
  }
  return (
    <div style={containerStyle}>
      <h1 style={textStyle}>Workspaces</h1>
      <Button variant='outlined' onClick={() => { doUpdateHash('workspaces/new') }}>Start a New Workspace</Button>
      {renderWorkspaces(workspaces)}
    </div>
  )
}

export default WorkspacesList
