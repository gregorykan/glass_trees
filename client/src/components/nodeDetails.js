import React from 'react'
import { Button, TextField } from '@material-ui/core'
import { isEmpty, isNil } from 'lodash'

import CreateNodeForm from './createNodeForm'

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
}

const headerStyle = {
  textAlign: 'center'
}

const submitButtonStyle = {
  marginTop: 20
}

const NodeDetails = (props) => {
  const {
    currentNode,
    nodeFormData,
    doUpdateNodeFormDataLabel,
    doUpdateNodeFormDataDescription,
    doCreateNode,
    nodeTypeToBeCreated,
    doUpdateNodeTypeToBeCreated,
    currentUser,
    workspace,
    doResolveNode,
    doUnresolveNode
  } = props

  if (isNil(currentNode)) return null

  const renderNodeCreationForm = () => {
    if (isNil(nodeTypeToBeCreated)) return null
    const nodeTypeToBeCreatedToHeaderText = {
      'clarifyingQuestion': 'Ask a clarifying question',
      'followUpQuestion': 'Ask a follow-up question',
      'option': 'Add an option'
    }
    return (
      <div>
        <h3 style={headerStyle}>{nodeTypeToBeCreatedToHeaderText[nodeTypeToBeCreated]}</h3>
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
  }

  const renderResolveActions = () => {
    if (currentNode.resolved) {
      return (
        <Button style={submitButtonStyle} variant='outlined' type='button' onClick={() => { doUnresolveNode(currentNode.id) }}>Mark as unresolved</Button>
      )
    } else {
      return (
        <Button style={submitButtonStyle} variant='outlined' type='button' onClick={() => { doResolveNode(currentNode.id) }}>Mark as resolved</Button>
      )
    }
  }

  const renderAdditionalActionsForQuestionNode = () => {
    if (currentNode.nodeType === 'option') return null
    return (
      <div style={containerStyle}>
        <Button style={submitButtonStyle} variant='outlined' type='button' onClick={() => { doUpdateNodeTypeToBeCreated('option') }}>Add an option</Button>
        {renderResolveActions()}
      </div>
    )
  }

  return (
    <div style={containerStyle}>
      <h3>{currentNode.label}</h3>
      {renderNodeCreationForm()}
      <Button style={submitButtonStyle} variant='outlined' type='button' onClick={() => { doUpdateNodeTypeToBeCreated('clarifyingQuestion') }}>Ask a clarifying question</Button>
      <Button style={submitButtonStyle} variant='outlined' type='button' onClick={() => { doUpdateNodeTypeToBeCreated('followUpQuestion') }}>Ask a follow-up question</Button>
      {renderAdditionalActionsForQuestionNode()}
    </div>
  )
}

export default NodeDetails
