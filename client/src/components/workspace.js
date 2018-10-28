import React from 'react'
import { Button, TextField } from '@material-ui/core'
import { Graph } from 'react-d3-graph'
import { isEmpty, isNil } from 'lodash'

import CreateNodeForm from './createNodeForm'
import CreateFirstNodeForm from './createFirstNodeForm'

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

const nodeInfoContainerStyle = {
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

    const myConfig = {
      nodeHighlightBehavior: true,
      node: {
        color: 'lightgreen',
        size: 120,
        highlightStrokeColor: 'blue',
        labelProperty: 'label'
      },
      link: {
        highlightColor: 'lightblue'
      }
    }

    const onClickNode = (nodeId) => {
      doSelectNode(nodeId)
    }

    const renderNodeCreationForm = () => {
      if (isNil(nodeTypeToBeCreated)) return null
      if (nodeTypeToBeCreated === 'clarifyingQuestion') {
        return (
          <div>
            <h3 style={headerStyle}>Ask a clarifying question</h3>
            <CreateNodeForm
              currentNodeId={currentNode.id}
              nodeFormData={nodeFormData}
              doUpdateNodeFormDataLabel={doUpdateNodeFormDataLabel}
              doUpdateNodeFormDataDescription={doUpdateNodeFormDataDescription}
              doCreateNode={doCreateNode}
              nodeCreationType={nodeTypeToBeCreated}
              doUpdateNodeTypeToBeCreated={doUpdateNodeTypeToBeCreated}
              currentUser={currentUser}
              workspace={workspace}
            />
          </div>
        )
      } else if (nodeTypeToBeCreated === 'followUpQuestion') {
        return (
          <div>
            <h3 style={headerStyle}>Ask a follow-up question</h3>
            <CreateNodeForm
              currentNodeId={currentNode.id}
              nodeFormData={nodeFormData}
              doUpdateNodeFormDataLabel={doUpdateNodeFormDataLabel}
              doUpdateNodeFormDataDescription={doUpdateNodeFormDataDescription}
              doCreateNode={doCreateNode}
              nodeCreationType={nodeTypeToBeCreated}
              doUpdateNodeTypeToBeCreated={doUpdateNodeTypeToBeCreated}
              currentUser={currentUser}
              workspace={workspace}
            />
          </div>
        )
      } else if (nodeTypeToBeCreated === 'option') {
        return (
          <div>
            <h3 style={headerStyle}>Add an option</h3>
            <CreateNodeForm
              currentNodeId={currentNode.id}
              nodeFormData={nodeFormData}
              doUpdateNodeFormDataLabel={doUpdateNodeFormDataLabel}
              doUpdateNodeFormDataDescription={doUpdateNodeFormDataDescription}
              doCreateNode={doCreateNode}
              nodeCreationType={nodeTypeToBeCreated}
              doUpdateNodeTypeToBeCreated={doUpdateNodeTypeToBeCreated}
              currentUser={currentUser}
              workspace={workspace}
            />
          </div>
        )
      } else {
        return null
      }
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
        <h1 style={headerStyle}>{workspace.name}</h1>
        <WorkspaceForm
          handleNameChange={handleNameChange}
          handleSubmit={handleSubmit}
          nameFieldValue={workspaceNameField}
        />
        {
          !isEmpty(nodes)
          ?
          <div style={graphContainerStyle}>
            <Graph
              id='graph-id' // id is mandatory, if no id is defined rd3g will throw an error
              data={data}
              config={myConfig}
              onClickNode={onClickNode}
              // onRightClickNode={onRightClickNode}
              // onClickGraph={onClickGraph}
              // onClickLink={onClickLink}
              // onRightClickLink={onRightClickLink}
              // onMouseOverNode={onMouseOverNode}
              // onMouseOutNode={onMouseOutNode}
              // onMouseOverLink={onMouseOverLink}
              // onMouseOutLink={onMouseOutLink}
            />
          </div>
          : <CreateFirstNodeForm
            nodeFormData={nodeFormData}
            doUpdateNodeFormDataLabel={doUpdateNodeFormDataLabel}
            doUpdateNodeFormDataDescription={doUpdateNodeFormDataDescription}
            doCreateFirstNode={doCreateFirstNode}
            currentUser={currentUser}
            workspace={workspace}
            />
        }
        {
          !isNil(currentNode)
          ? <div style={nodeInfoContainerStyle}>
            <h3>{currentNode.label}</h3>
            {renderNodeCreationForm()}
            <Button style={submitButtonStyle} variant='outlined' type='button' onClick={() => { doUpdateNodeTypeToBeCreated('clarifyingQuestion') }}>Ask a clarifying question</Button>
            <Button style={submitButtonStyle} variant='outlined' type='button' onClick={() => { doUpdateNodeTypeToBeCreated('followUpQuestion') }}>Ask a follow-up question</Button>
            {
              currentNode.node_type === 'question'
              ?
              <div>
                <Button style={submitButtonStyle} variant='outlined' type='button' onClick={() => { doUpdateNodeTypeToBeCreated('option') }}>Add an option</Button>
                { !currentNode.resolved ? <Button style={submitButtonStyle} variant='outlined' type='button' onClick={() => { doResolveNode(currentNode.id) }}>Mark as resolved</Button>
                  : <Button style={submitButtonStyle} variant='outlined' type='button' onClick={() => { doUnresolveNode(currentNode.id) }}>Mark as unresolved</Button>
                }
              </div>
              : null
            }
          </div>
          : null
        }
      </div>
    )
  }
}

export default WorkspaceComponent
