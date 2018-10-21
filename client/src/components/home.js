import React from 'react'
import { connect } from 'redux-bundler-react'
import { Button } from '@material-ui/core'
import { Graph } from 'react-d3-graph'
import { isEmpty, isNil } from 'lodash'

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

const Home = (props) => {
  const {
    doUpdateHash,
    nodes,
    links,
    doSelectNode,
    currentNode
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
        </div>
        : null
      }
    </div>
  )
}

export default Home
