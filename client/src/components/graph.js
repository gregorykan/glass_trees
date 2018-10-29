import React from 'react'
import { Graph as ReactD3Graph } from 'react-d3-graph'
import { isNil, isEmpty } from 'lodash'

import CreateFirstNodeForm from './createFirstNodeForm'

const containerStyle = {
  margin: 20
}

class Graph extends React.Component {
  constructor(props) {
    super(props);
    this.graph = React.createRef();
  }

  clickAndHighlightNode = (nodeId) => {
    this.props.handleNodeClick(nodeId)
    this.graph.current._setNodeHighlightedValue(nodeId)
  }

  render () {
    const {
      data,
      config,
      handleNodeClick,
      nodeFormData,
      doUpdateNodeFormDataLabel,
      doUpdateNodeFormDataDescription,
      doCreateFirstNode,
      currentUser,
      workspace
    } = this.props

    if (isNil(data) || isEmpty(data.nodes)) {
      return (
        <div style={containerStyle}>
          <CreateFirstNodeForm
            nodeFormData={nodeFormData}
            doUpdateNodeFormDataLabel={doUpdateNodeFormDataLabel}
            doUpdateNodeFormDataDescription={doUpdateNodeFormDataDescription}
            doCreateFirstNode={doCreateFirstNode}
            currentUser={currentUser}
            workspace={workspace}
          />
        </div>
      )
    }

    return (
      <ReactD3Graph
        id='graph-id'
        data={data}
        config={config}
        ref={this.graph}
        onClickNode={this.clickAndHighlightNode}
      />
    )
  }
}

export default Graph
