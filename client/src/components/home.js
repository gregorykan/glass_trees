import React from 'react'
import { connect } from 'redux-bundler-react'
import { Button } from '@material-ui/core'
import { Graph } from 'react-d3-graph'
import { isEmpty, isNil } from 'lodash'

import CreateNodeForm from './createNodeForm'
import CreateFirstNodeForm from './createFirstNodeForm'

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
    doUpdateNodeTypeToBeCreated,
    doResolveNode,
    doUnresolveNode,
    doCreateFirstNode
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
          <CreateNodeForm
            currentNodeId={currentNode.id}
            nodeFormData={nodeFormData}
            doUpdateNodeFormDataLabel={doUpdateNodeFormDataLabel}
            doUpdateNodeFormDataDescription={doUpdateNodeFormDataDescription}
            doCreateNode={doCreateNode}
            nodeCreationType={nodeTypeToBeCreated}
            doUpdateNodeTypeToBeCreated={doUpdateNodeTypeToBeCreated}
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
          />
        </div>
      )
    } else {
      return null
    }
  }

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>glass.trees</h1>
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

export default Home
