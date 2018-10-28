import React from 'react'
import { Graph as ReactD3Graph } from 'react-d3-graph'
import { isNil, isEmpty } from 'lodash'

import CreateFirstNodeForm from './createFirstNodeForm'

const Graph = (props) => {
  const {
    data,
    config,
    onClickNode,
    nodeFormData,
    doUpdateNodeFormDataLabel,
    doUpdateNodeFormDataDescription,
    doCreateFirstNode,
    currentUser,
    workspace
  } = props

  if (isNil(data) || isEmpty(data.nodes)) {
    return (
      <CreateFirstNodeForm
        nodeFormData={nodeFormData}
        doUpdateNodeFormDataLabel={doUpdateNodeFormDataLabel}
        doUpdateNodeFormDataDescription={doUpdateNodeFormDataDescription}
        doCreateFirstNode={doCreateFirstNode}
        currentUser={currentUser}
        workspace={workspace}
      />
    )
  }

  return (
    <ReactD3Graph
      id='graph-id'
      data={data}
      config={config}
      onClickNode={onClickNode}
    />
  )
}

export default Graph
