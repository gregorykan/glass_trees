import React from 'react'
import { connect } from 'redux-bundler-react'
import { Button } from '@material-ui/core'
import { Graph } from 'react-d3-graph'
import { isEmpty, isNil } from 'lodash'

import CreateQuestionForm from './createQuestionForm'

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center'
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

const headerStyle = {
  textAlign: 'center'
}

const navStyle = {
  flexDirection: 'row'
}

const submitButtonStyle = {
  marginTop: 20
}

const Home = (props) => {
  const {
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
    doUpdateNodeTypeToBeCreated
  } = props

  const mockData = {
    nodes: [{ id: 'Harry' }, { id: 'Sally' }, { id: 'Alice' }],
    links: [{ source: 'Harry', target: 'Sally' }, { source: 'Harry', target: 'Alice' }]
  }

  const data = {
    nodes: nodes,
    links: links
  }

  // the graph configuration, you only need to pass down properties
  // that you want to override, otherwise default ones will be used
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
          <CreateQuestionForm
            currentNodeId={currentNode.id}
            nodeFormData={nodeFormData}
            doUpdateNodeFormDataLabel={doUpdateNodeFormDataLabel}
            doUpdateNodeFormDataDescription={doUpdateNodeFormDataDescription}
            doCreateNode={doCreateNode}
            doUpdateNodeTypeToBeCreated={doUpdateNodeTypeToBeCreated}
          />
        </div>
      )
    } else if (nodeTypeToBeCreated === 'followUpQuestion') {
      return (
        <div>
          <h3 style={headerStyle}>Ask a follow-up question</h3>
          <CreateQuestionForm
            currentNodeId={currentNode.id}
            nodeFormData={nodeFormData}
            doUpdateNodeFormDataLabel={doUpdateNodeFormDataLabel}
            doUpdateNodeFormDataDescription={doUpdateNodeFormDataDescription}
            doCreateNode={doCreateNode}
            questionType='follow-up'
            doUpdateNodeTypeToBeCreated={doUpdateNodeTypeToBeCreated}
          />
        </div>
      )
    } else {
      return null
    }
  }

  if (isEmpty(nodes) || isEmpty(links)) return null
  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>glass.trees</h1>
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
      {
        !isNil(currentNode)
        ? <div style={nodeInfoContainerStyle}>
          <h3>{currentNode.label}</h3>
          <span>type: {currentNode.node_type}</span>
          {renderNodeCreationForm()}
          <Button style={submitButtonStyle} variant='outlined' type='button' onClick={() => { doUpdateNodeTypeToBeCreated('clarifyingQuestion') }}>Ask a clarifying question</Button>
          <Button style={submitButtonStyle} variant='outlined' type='button' onClick={() => { doUpdateNodeTypeToBeCreated('followUpQuestion') }}>Ask a follow-up question</Button>
        </div>
        : null
      }
    </div>
  )
}

export default Home
