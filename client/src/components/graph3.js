import React from 'react'
import * as d3 from 'd3'
import { map, filter, includes, concat } from 'lodash'

var link = null
var node = null
var tooltip = null
var chart = null
var simulation = null
var nodes = null
var links = []
var linksAndNodesContainer = null

var height = 500
var width = 70 / 100 * Number(window.innerWidth)

class D3ForceGraph extends React.Component {
  //Drag functions
  dragStart = d => {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart()
    d.fx = d.x
    d.fy = d.y
  }

  drag = d => {
    d.fx = d3.event.x
    d.fy = d3.event.y
  }

  dragEnd = d => {
    if (!d3.event.active) simulation.alphaTarget(0)
    d.fx = null
    d.fy = null
  }

  //Setting location when ticked
  ticked = () => {
    link
      .attr("x1", d => { return d.source.x })
      .attr("y1", d => { return d.source.y })
      .attr("x2", d => { return d.target.x })
      .attr("y2", d => { return d.target.y })

    node
      .select('.label')
        .attr('dx', d => d.x - 10)
        .attr('dy', d => d.y + 30)
    node
      .select('circle')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
    }

  zoom = () => {
    linksAndNodesContainer.attr("transform", d3.event.transform)
  }

  startGraph = () => {
    nodes = this.props.nodes
    links = this.props.links

    //Initializing chart
    chart = d3.select('.chart')
      .attr('width', width)
      .attr('height', height)

    //Creating tooltip
    tooltip = d3.select('.container')
      .append('div')
      .attr('class', 'tooltip')

    //Initializing force simulation
    simulation = d3.forceSimulation()
      .force('charge', d3.forceManyBody(-1000))
      .force('collide', d3.forceCollide())
      .force('center', d3.forceCenter(width / 2, height / 2))

    // build the arrow.
    chart.append("svg:defs").selectAll("marker")
        .data(["end"])      // Different link/path types can be defined here
      .enter().append("svg:marker")    // This section adds in the arrows
        .attr("id", String)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 15)
        .attr("refY", -1.5)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
      .append("svg:path")
        .attr("d", "M0,-5L10,0L0,5")

    // container for nodes and links
    linksAndNodesContainer = chart.append('g')

    //Creating links
    link = linksAndNodesContainer.append('g')
      .attr('class', 'links')
      .selectAll('line')

    //Creating nodes
    node = linksAndNodesContainer.append('g')
      .attr('class', 'nodes')
      .selectAll('.node')

    chart.call(d3.zoom()
      .scaleExtent([0.1, 8])
      .on("zoom", this.zoom))

    this.updateGraph()
  }

  updateGraph = () => {
    const { onClickNode } = this.props
    // Updating links
    link = link.data(links)
    link.exit().remove()
    link = link.enter().append('line')
      .attr('stroke-width', 2)
      .attr('stroke', 'black')
      .attr('opacity', 0.6)
      .attr("marker-end", "url(#end)")
      .merge(link)

    // Updating nodes
    node = node.data(nodes)
    node.exit().remove()
    var nodeEnter = node.enter()
      .append('g')
      .attr('class', 'node')
    nodeEnter.append('text')
      .text(d => d.label)
      .attr('class', 'label')
    nodeEnter
      .append('circle')
      .attr('r', 10)
      .attr('opacity', 1)
      .attr('stroke', 'black')
      .attr('stroke-width', 2)
      .attr('fill', 'red')
      .attr('fill', d => d.nodeType === 'question' ? 'red' : 'yellow')
      .on('click', d => { onClickNode(d.id) })
      .call(d3.drag()
         .on('start', this.dragStart)
         .on('drag', this.drag)
         .on('end', this.dragEnd)
      ).on('mouseover',d => {
        tooltip.html(d.label)
          .style('left', d3.event.pageX + 5 +'px')
          .style('top', d3.event.pageY + 5 + 'px')
          .style('opacity', .9)
      }).on('mouseout', () => {
        tooltip.style('opacity', 0)
          .style('left', '0px')
          .style('top', '0px')
      })

    node = node.merge(nodeEnter)

    //Starting simulation
    simulation.nodes(nodes)
      .on('tick', this.ticked)

    simulation
      .force('link', d3.forceLink(links).id(d => d.id).distance(150).strength(0.4))

    simulation.alphaTarget(1).restart()
  }

  componentDidMount() {
    this.startGraph()
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (nextProps.nodes.length !== this.props.nodes.length) return true
    node
      .select('circle')
      .attr('stroke', d => includes(nextProps.nodeIdsToHighlight, d.id) ? 'blue' : 'black')
      .attr('stroke-width', d => includes(nextProps.nodeIdsToHighlight, d.id) ? 4 : 2)
    link
      .attr('stroke', d => includes(nextProps.linkIdsToHighlight, d.id) ? 'blue' : 'black')
      .attr('stroke-width', d => includes(nextProps.linkIdsToHighlight, d.id) ? 4 : 2)
    return false
  }

  componentDidUpdate () {
    // GK: NB: this is an intentional diff and mutation of the arrays of links and nodes
    // the reason being that if you replace the entire array, the whole graph will re-render
    // even if you are just adding a single node.
    // however, if you mutate via pushing, that new node will be appended
    // but the rest of the graph and its current arrangement stays intact.
    const currentNodeIds = map(nodes, n => n.id)
    const nextNodeIds = map(this.props.nodes, n => n.id)
    const newNodeIds = filter(nextNodeIds, nextNodeId => {
      return !includes(currentNodeIds, nextNodeId)
    })
    const newNodes = filter(this.props.nodes, nextNode => {
      return includes(newNodeIds, nextNode.id)
    })
    const currentLinkIds = map(links, l => l.id)
    const nextLinkIds = map(this.props.links, l => l.id)
    const newLinkIds = filter(nextLinkIds, nextLinkId => {
      return !includes(currentLinkIds, nextLinkId)
    })
    const newLinks = filter(this.props.links, nextLink => {
      return includes(newLinkIds, nextLink.id)
    })
    newNodes.forEach(newNode => {
      nodes.push(newNode)
    })
    newLinks.forEach(newLink => {
      links.push(newLink)
    })
    this.updateGraph()
  }

  componentWillUnmount () {
    link = null
    node = null
    tooltip = null
    chart = null
    simulation = null
    nodes = null
    links = null
  }

  render() {
    return (
      <div className='container'>
        <svg className='chart'>
        </svg>
      </div>
    )
  }
}

export default D3ForceGraph
