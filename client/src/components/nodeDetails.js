import React from 'react'
import { Button, TextField } from '@material-ui/core'
import { isEmpty, isNil, map } from 'lodash'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp'

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

const votesContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
}

const headerContainerStyle = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center'
}

const actionsContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  flex: 1
}

const nodeDetailsContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  flex: 1
}

const optionsContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
}

const questionsContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
}

const bodyContainerStyle = {
  display: 'flex',
  flexDirection: 'row',
  alignSelf: 'stretch',
  flex: 1
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
    doVoteForNode,
    questionNodesForCurrentNode,
    optionNodesForCurrentNode,
    doSelectNode
  } = props

  if (isNil(currentNode)) return null

  const renderNodeCreationForm = () => {
    if (isNil(nodeTypeToBeCreated)) return null
    const nodeTypeToBeCreatedToHeaderText = {
      'question': 'Ask a question',
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
            nodeType={nodeTypeToBeCreated}
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
        <Button style={buttonStyle} variant='outlined' type='button' onClick={() => { doUnresolveNode(currentNode.id) }}>REOPEN</Button>
      )
    } else if (currentUser.id === currentNode.user_id) {
      return (
        <Button style={buttonStyle} variant='outlined' type='button' onClick={() => { doResolveNode(currentNode.id) }}>RESOLVE</Button>
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
        {
          !currentNode.resolved
            ? <Button style={buttonStyle} variant='outlined' type='button' onClick={() => { doUpdateNodeTypeToBeCreated('option') }}>RESPOND</Button>
            : null
        }
        {renderResolveActions()}
      </div>
    )
  }

  const renderActions = () => {
    if (!isNil(nodeTypeToBeCreated)) return null
    return (
      <div style={containerStyle}>
        <Button style={buttonStyle} variant='outlined' type='button' onClick={() => { doUpdateNodeTypeToBeCreated('question') }}>QUERY</Button>
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

  const renderOptions = () => {
    if (isEmpty(optionNodesForCurrentNode)) return null
    return (
      <div style={optionsContainerStyle}>
        <h4>Options</h4>
        { renderOptionsList() }
      </div>
    )
  }

  const renderOptionsList = () => {
    return map(optionNodesForCurrentNode, (option) => {
      return (
        <div key={option.id} onClick={() => { doSelectNode(option.id) }}>{option.label}</div>
      )
    })
  }

  const renderQuestions = () => {
    if (isEmpty(questionNodesForCurrentNode)) return null
    return (
      <div style={questionsContainerStyle}>
        <h4>Questions</h4>
        { renderQuestionsList() }
      </div>
    )
  }

  const renderQuestionsList = () => {
    return map(questionNodesForCurrentNode, (question) => {
      return (
        <div key={question.id} onClick={() => { doSelectNode(question.id) }}>{question.label}</div>
      )
    })
  }

  const score = currentNode.upvotes.length - currentNode.downvotes.length

  const calculateColourByScore = () => {
    return score >= 0 ? 'green' : 'red'
  }

  const scoreTextStyle = {
    color: calculateColourByScore(),
    fontWeight: 'bold'
  }

  return (
    <div style={containerStyle}>
      <div style={headerContainerStyle}>
        <div style={votesContainerStyle}>
          <ArrowDropUpIcon style={{ fontSize: 40 }} onClick={() => { handleVote(true) }} />
          <div style={scoreTextStyle}>
            {score}
          </div>
          <ArrowDropDownIcon style={{ fontSize: 40 }} onClick={() => { handleVote(false) }} />
        </div>
        <h3 style={nodeDetailsHeaderStyle}>{currentNode.label}</h3>
      </div>
      <div style={bodyContainerStyle}>
        <div style={actionsContainerStyle}>
          {renderNodeCreationForm()}
          {renderAdditionalActionsForQuestionNode()}
          {renderActions()}
        </div>
        <div style={nodeDetailsContainerStyle}>
          { renderOptions() }
          { renderQuestions() }
        </div>
      </div>
    </div>
  )
}

export default NodeDetails
