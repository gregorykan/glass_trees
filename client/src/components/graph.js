import React from 'react'
import Graph3 from './graph3'
import { isNil, isEmpty } from 'lodash'

class Graph extends React.Component {
  render () {
    const {
      data,
      onClickNode,
      linkIdsToHighlight,
      nodeIdsToHighlight,
      newNodeIds,
      updatedNodeIds,
      newLinkIds,
      doClearNewNodeIds,
      doClearUpdatedNodeIds,
      doClearNewLinkIds
    } = this.props

    const handleOnClickNode = (nodeId) => {
      onClickNode(nodeId)
    }

    if (isNil(data) || isEmpty(data.nodes)) return null

    return (
      <Graph3
        links={data.links}
        nodes={data.nodes}
        onClickNode={handleOnClickNode}
        linkIdsToHighlight={linkIdsToHighlight}
        nodeIdsToHighlight={nodeIdsToHighlight}
        newNodeIds={newNodeIds}
        updatedNodeIds={updatedNodeIds}
        newLinkIds={newLinkIds}
        doClearNewNodeIds={doClearNewNodeIds}
        doClearUpdatedNodeIds={doClearUpdatedNodeIds}
        doClearNewLinkIds={doClearNewLinkIds}
      />
    )
  }
}

export default Graph
