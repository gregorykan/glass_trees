import React from 'react'
import { Graph as ReactD3Graph } from 'react-d3-graph'
import { isNil, isEmpty, debounce } from 'lodash'

const containerStyle = {
  margin: 20
}

class Graph extends React.Component {
  constructor(props) {
    super(props)
    this.graph = React.createRef()
    this.state = {
      config: props.config
    }
  }

  // GK: NB: this is a 100% hack to get the nodes to position properly
  // i.e. starting with staticGraph as true and then immediately turning that off
  componentDidMount () {
    this.setState({
      config: {
        ...this.state.config,
        staticGraph: !this.state.config.staticGraph
      }
    })
  }

  render () {
    const {
      data,
      onClickNode
    } = this.props

    if (isNil(data) || isEmpty(data.nodes)) return null

    return (
      <div>
        <ReactD3Graph
          id='graph-id'
          data={data}
          config={this.state.config}
          onClickNode={onClickNode}
          ref={this.graph}
        />
      </div>
    )
  }
}

export default Graph
