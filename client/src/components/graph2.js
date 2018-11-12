import React from 'react'
import * as d3 from 'd3'
import { times } from 'lodash'

const containerStyle = {
  width: 800,
  height: 600,
  display: 'flex',
  alignItems: 'center'
}

var width = 800
var height = 600
// var simulation = d3.forceSimulation()
//   // .force('collide', d3.forceCollide(d => 2 * d.size))
//   .force('charge', d3.forceManyBody(-1000))
//   .force('center', d3.forceCenter(width / 2, height / 2))
//   .stop()

class Graph extends React.Component {
  constructor (props) {
    super(props)
    // this.state = {selected: null}
    //
    // this.selectNode = this.selectNode.bind(this)
    this.simulation = d3.forceSimulation()
      // .force('collide', d3.forceCollide(d => 2 * d.size))
      .force('charge', d3.forceManyBody(-1000))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .stop()
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   if (nextProps.version === this.props.version) {
  //     // if version is the same, no updates to data
  //     // so it must be interaction to select+highlight a node
  //     this.calculateHighlights(nextState.selected)
  //     this.circles.attr('opacity', d =>
  //       !nextState.selected || this.highlightedNodes[d.key] ? 1 : 0.2)
  //     this.lines.attr('opacity', d =>
  //       !nextState.selected || this.highlightedLinks[d.key] ? 0.5 : 0.1)
  //     return false
  //   }
  //   return true
  // }

  componentDidMount () {
    this.container = d3.select(this.refs.container)
    this.calculateData()
    // this.calculateHighlights(this.state.selected)
    this.renderLinks()
    this.renderNodes()
  }

  componentDidUpdate () {
    console.log('componentDidUpdate')
    this.calculateData()
    // this.calculateHighlights(this.state.selected)
    this.renderLinks()
    this.renderNodes()
  }

  calculateData () {
    // nodes and links are mutated in this function
    // they are given all the extra stuff that d3 needs to render them
    var { nodes, links } = this.props
    this.simulation.nodes(nodes)
      .force('link', d3.forceLink(links).id(d => d.id).distance(60))

    times(2000, () => this.simulation.tick())

    this.nodes = nodes
    this.links = links
  }

  // calculateHighlights(selected) {
  //   this.highlightedNodes = {}
  //   this.highlightedLinks = {}
  //   if (selected) {
  //     this.highlightedNodes[selected] = 1
  //     _.each(this.links, link => {
  //       if (link.source.key === selected) {
  //         this.highlightedNodes[link.target.key] = 1
  //         this.highlightedLinks[link.key] = 1
  //       }
  //       if (link.target.key === selected) {
  //         this.highlightedNodes[link.source.key] = 1
  //         this.highlightedLinks[link.key] = 1
  //       }
  //     })
  //   }
  // }

  renderNodes () {
    // svg elements set based on node properties
    this.nodeElements = this.container.selectAll('g')
      .data(this.nodes, d => d.id)
    // exit
    this.nodeElements.exit().remove()
    // enter + update
    this.nodeElements = this.nodeElements.enter().append('g')
      .classed('node', true)
      .merge(this.nodeElements)

    this.nodeElements.append('circle')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', d => 10) // size - radius?
      .attr('opacity', d => 1)
      // .attr('opacity', d =>
      //   !this.state.selected || this.highlightedNodes[d.key] ? 1 : 0.2)
      // .on('click', this.selectNode)
    this.nodeElements.append('text')
      .attr('dx', d => d.x - 10)
      .attr('dy', d => d.y + 20)
      .text(d => d.label)
  }

  renderLinks () {
    // svg elements set based on link properties
    this.linkElements = this.container.selectAll('line')
      .data(this.links, d => d.id)
    // exit
    this.linkElements.exit().remove()
    // enter + update
    this.linkElements = this.linkElements.enter()
      .append('line')
    // .insert('line', 'circle')
      .classed('link', true)
      .merge(this.linkElements)
      .attr('stroke-width', d => 2) // size
      .attr('stroke', d => 'black')
      .attr('x1', d => d.source.x)
      .attr('x2', d => d.target.x)
      .attr('y1', d => d.source.y)
      .attr('y2', d => d.target.y)
      .attr('opacity', d => 0.4)
      // .attr('opacity', d =>
      //   !this.state.selected || this.highlightedLinks[d.key] ? 0.5 : 0.1)
  }

  // selectNode(node) {
  //   if (node.key === this.state.selected) {
  //     this.setState({selected: null})
  //   } else {
  //     this.setState({selected: node.key})
  //   }
  // }

  render () {
    return (
      <div style={containerStyle}>
        <svg style={{ height: 600, width: 800 }} ref='container' />
      </div>
    )
  }
}

export default Graph
