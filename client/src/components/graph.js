import React from 'react'
import { Graph as ReactD3Graph } from 'react-d3-graph'
import { isNil, isEmpty, debounce, omit } from 'lodash'

import Node from './node'

const containerStyle = {
  margin: 20
}

const graphConfig = {
  staticGraph: true,
  nodeHighlightBehavior: true,
  height: 400,
  width: 70 / 100 * Number(window.innerWidth),
  node: {
    fontSize: 17,
    highlightFontSize: 17,
    size: 700,
    labelProperty: 'label',
    viewGenerator: (node) => <Node node={node} />
  },
  link: {
    highlightColor: 'lightblue',
    color: 'grey'
  },
  d3: {
    gravity: -650,
    linkLength: 150
  }
}

class Graph extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      config: graphConfig
    }
  }

  // GK: NB: this is a 100% hack to get the nodes to position properly
  // i.e. starting with staticGraph as true and then immediately turning that off
  componentDidMount () {
    this.setState({
      config: {
        ...this.state.config,
        staticGraph: false
      }
    })
  }

  render () {
    const {
      data,
      onClickNode
    } = this.props

    // GK: NB: this is another 100% hack that i'm quite proud of..
    // setting d3 gravity was causing the app to perform really badly CPU-wise
    // i realised that i only needed d3 gravity to set the initial nodes
    // and after that it can be turned off, preserving the drag and drop functionality.
    // i tried making staticGraph true again but it didn't allow me to move nodes
    const handleOnClickNode = (nodeId) => {
      this.setState({
        config: omit(this.state.config, 'd3')
      })
      onClickNode(nodeId)
    }

    if (isNil(data) || isEmpty(data.nodes)) return null

    return (
      <ReactD3Graph
        id='graph-id'
        data={data}
        config={this.state.config}
        onClickNode={handleOnClickNode}
      />
    )
  }
}

export default Graph
