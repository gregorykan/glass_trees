import React from 'react'
import { Button, TextField } from '@material-ui/core'
import { isEmpty, isNil } from 'lodash'

import Graph from './graph'
import CreateNodeForm from './createNodeForm'
import CreateFirstNodeForm from './createFirstNodeForm'
import WorkspaceForm from './workspaceForm'
import NodeDetails from './nodeDetails'

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
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

const nodeDetailsContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  borderWidth: '1px',
  borderColor: 'black',
  borderStyle: 'solid'
}

const graphContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  borderWidth: '1px',
  borderColor: 'black',
  borderStyle: 'solid'
}

const submitButtonStyle = {
  marginTop: 20
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
      doUpdateHash,
      nodes,
      links,
      doSelectNode,
      currentNode,
      doUpdateNodeFormDataLabel,
      doUpdateNodeFormDataDescription,
      nodeFormData,
      doCreateNode,
      nodeTypeToBeCreated,
      doUpdateNodeTypeToBeCreated,
      doResolveNode,
      doUnresolveNode,
      doCreateFirstNode,
      currentUser
    } = this.props

    const data = {
      nodes: nodes,
      links: links
    }

    const graphConfig = {
      nodeHighlightBehavior: true,
      node: {
        color: 'lightgreen',
        size: 120,
        highlightStrokeColor: 'blue',
        labelProperty: 'label'
      },
      link: {
        highlightColor: 'lightblue'
      },
      d3: {
        gravity: -200
      }
    }

    const onClickNode = (nodeId) => {
      doSelectNode(nodeId)
    }

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
        <WorkspaceForm
          handleNameChange={handleNameChange}
          handleSubmit={handleSubmit}
          nameFieldValue={workspaceNameField}
          workspace={workspace}
        />
        <div style={graphContainerStyle}>
          <Graph
            data={data}
            config={graphConfig}
            onClickNode={onClickNode}
            nodeFormData={nodeFormData}
            doUpdateNodeFormDataLabel={doUpdateNodeFormDataLabel}
            doUpdateNodeFormDataDescription={doUpdateNodeFormDataDescription}
            doCreateFirstNode={doCreateFirstNode}
            currentUser={currentUser}
            workspace={workspace}
          />
        </div>
        <div style={nodeDetailsContainerStyle}>
          <NodeDetails
            currentNode={currentNode}
            nodeFormData={nodeFormData}
            doUpdateNodeFormDataLabel={doUpdateNodeFormDataLabel}
            doUpdateNodeFormDataDescription={doUpdateNodeFormDataDescription}
            doCreateNode={doCreateNode}
            doUpdateNodeTypeToBeCreated={doUpdateNodeTypeToBeCreated}
            currentUser={currentUser}
            workspace={workspace}
            doResolveNode={doResolveNode}
            doUnresolveNode={doUnresolveNode}
            nodeTypeToBeCreated={nodeTypeToBeCreated}
          />
        </div>
      </div>
    )
  }
}

export default WorkspaceComponent
