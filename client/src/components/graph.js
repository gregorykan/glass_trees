import React from 'react'
import Graph3 from './graph3'
import { isNil, isEmpty } from 'lodash'

class Graph extends React.Component {
  render () {
    const {
      data,
      onClickNode,
      nodesByCurrentNode
    } = this.props

    const handleOnClickNode = (nodeId) => {
      onClickNode(nodeId)
    }

    if (isNil(data) || isEmpty(data.nodes)) return null

    return (
      <Graph3 links={data.links} nodes={data.nodes} nodesByCurrentNode={nodesByCurrentNode} onClickNode={handleOnClickNode} />
    )
  }
}

export default Graph
