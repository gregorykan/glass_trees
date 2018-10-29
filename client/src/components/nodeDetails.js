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

const nodeDetailsHeaderStyle = {
  textAlign: 'center',
  margin: 20
}

const buttonStyle = {
  margin: '0px 20px 20px 20px'
}

const createNodeContainerStyle = {
  margin: 20
}

const currentVotesStyle = {
  marginBottom: 20
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
    doUnresolveNode,
    cancelSingleNodeView,
    doVoteForNode
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
      <div style={containerStyle}>
        <div style={createNodeContainerStyle}>
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
      </div>
    )
  }

  const renderResolveActions = () => {
    if (currentNode.resolved) {
      return (
        <Button style={buttonStyle} variant='outlined' type='button' onClick={() => { doUnresolveNode(currentNode.id) }}>Mark as unresolved</Button>
      )
    } else if (currentUser.id === currentNode.user_id) {
      return (
        <Button style={buttonStyle} variant='outlined' type='button' onClick={() => { doResolveNode(currentNode.id) }}>Mark as resolved</Button>
      )
    } else {
      return null
    }
  }

  const renderAdditionalActionsForQuestionNode = () => {
    if (!isNil(nodeTypeToBeCreated)) return null
    if (currentNode.node_type === 'option') return null
    return (
      <div style={containerStyle}>
        <Button style={buttonStyle} variant='outlined' type='button' onClick={() => { doUpdateNodeTypeToBeCreated('option') }}>Add an option</Button>
        {renderResolveActions()}
      </div>
    )
  }

  const renderActions = () => {
    if (!isNil(nodeTypeToBeCreated)) return null
    return (
      <div style={containerStyle}>
        <Button style={buttonStyle} variant='outlined' type='button' onClick={() => { doUpdateNodeTypeToBeCreated('clarifyingQuestion') }}>Ask a clarifying question</Button>
        <Button style={buttonStyle} variant='outlined' type='button' onClick={() => { doUpdateNodeTypeToBeCreated('followUpQuestion') }}>Ask a follow-up question</Button>
        <Button style={buttonStyle} variant='outlined' type='button' onClick={cancelSingleNodeView}>Cancel</Button>
      </div>
    )
  }

  const handleVote = (isUpvote) => {
    const formData = {
      node_id: currentNode.id,
      is_upvote: isUpvote,
      user_id: currentUser.id
    }
    doVoteForNode(formData)
  }

  return (
    <div style={containerStyle}>
      <h3 style={nodeDetailsHeaderStyle}>{currentNode.label}</h3>
      <span style={currentVotesStyle}>score: {currentNode.upvotes.length - currentNode.downvotes.length}</span>
      <Button style={buttonStyle} variant='outlined' type='button' onClick={() => { handleVote(true) }}>UPVOTE</Button>
      <Button style={buttonStyle} variant='outlined' type='button' onClick={() => { handleVote(false) }}>DOWNVOTE</Button>
      {renderNodeCreationForm()}
      {renderAdditionalActionsForQuestionNode()}
      {renderActions()}
    </div>
  )
}

export default NodeDetails
