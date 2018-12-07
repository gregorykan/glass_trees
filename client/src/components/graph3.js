import React from 'react'
import * as d3 from 'd3'
import { map, filter, includes, concat, isEmpty, remove, find, clone, forEach, reduce, keys, omit, compact } from 'lodash'

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
  state = {
    hiddenNodesAndLinksByNodeId: {}
  }
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
    nodes = [...this.props.nodes]
    links = [...this.props.links]

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
      // .force('collide', d3.forceCollide())
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
      .on("dblclick.zoom", null)
    this.updateGraph()
  }

  updateGraph = () => {
    const { onClickNode } = this.props
    // Updating links
    link = link.data(links, d => d)
    link.exit().remove()
    var linkEnter = link.enter().append('line')
      .attr('stroke-width', 2)
      .attr('stroke', 'black')
      .attr('opacity', 0.4)
      .attr("marker-end", "url(#end)")

    link = link.merge(linkEnter)

    // Updating nodes
    node = node.data(nodes, d => d.id)
    node.exit().remove()
    var nodeEnter = node.enter()
      .append('g')
      .attr('class', 'node')
    nodeEnter.append('text')
      .text(d => d.label)
      .attr('class', 'label')
    nodeEnter
      .append('circle')
      .attr('r', d => d.nodeType === 'question' ? 15 : 10)
      .attr('opacity', 1)
      .attr('fill', d => d.resolved ? 'red' : d.nodeType === 'question' ? 'orange' : 'green')
      .on('click', d => { onClickNode(d.id) })
      .on('dblclick', d => { this.toggleCollapse(d.id) })
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
      .force('link', d3.forceLink(links).id(d => d.id).distance(100).strength(1))

    simulation.alphaTarget(1).restart()
  }

  componentDidMount() {
    // get all resolved node ids
    const resolvedNodeIds = map(filter(this.props.nodes, node => {
      return node.resolved
    }), n => n.id)
    // a hack to ensure that children go first
    const orderedResolvedNodeIds = resolvedNodeIds.sort((a, b) => { return b - a })
    this.startGraph()
    const hiddenNodesAndLinksByNodeId = this.getHiddenNodeAndLinkIdsBasedOnResolvedNodes(orderedResolvedNodeIds, links)
    this.setState({
      hiddenNodesAndLinksByNodeId
    })
    this.updateGraph()
  }

  getHiddenNodeAndLinkIdsBasedOnResolvedNodes = (orderedResolvedNodeIds, currentLinks) => {
    var hiddenNodesAndLinksByNodeId = {}

    forEach(orderedResolvedNodeIds, resolvedNodeId => {
      const hiddenNodeAndLinkIds = this.getChildNodeAndLinkIds(resolvedNodeId, currentLinks)
      const hiddenNodeIds = hiddenNodeAndLinkIds.hiddenNodeIds
      const hiddenLinkIds = hiddenNodeAndLinkIds.hiddenLinkIds
      // take them off the board
      remove(nodes, node => {
        return Boolean(hiddenNodeIds[node.id])
      })
      remove(links, link => {
        return Boolean(hiddenLinkIds[link.id])
      })
      hiddenNodesAndLinksByNodeId = {
        ...hiddenNodesAndLinksByNodeId,
        [resolvedNodeId]: hiddenNodeAndLinkIds
      }
    })
    return hiddenNodesAndLinksByNodeId
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (nextProps.newNodeIds.length > 0 && this.props.newNodeIds.length === 0) return true
    if (nextProps.updatedNodeIds.length > 0 && this.props.updatedNodeIds.length === 0) return true
    const nodeIdsToHighlight = nextProps.nodeIdsToHighlight || []
    const linkIdsToHighlight = nextProps.linkIdsToHighlight || []
    node
      .select('circle')
      .attr('stroke', d => includes(nodeIdsToHighlight, d.id) ? 'blue' : 'none')
      .attr('stroke-width', d => includes(nodeIdsToHighlight, d.id) ? 4 : 0)
    link
      .attr('stroke', d => includes(linkIdsToHighlight, d.id) ? 'blue' : 'black')
      .attr('stroke-width', d => includes(linkIdsToHighlight, d.id) ? 4 : 2)
    return false
  }

  componentDidUpdate () {
    const {
      newNodeIds,
      doClearNewNodeIds,
      doClearNewLinkIds,
      updatedNodeIds,
      doClearUpdatedNodeIds,
    } = this.props
    if (!isEmpty(newNodeIds)) {
      this.pushNewNodesAndLinks()
    }
    if (!isEmpty(updatedNodeIds)) {
      this.updateNodes()
    }
    this.updateGraph()
    doClearNewNodeIds()
    doClearNewLinkIds()
    doClearUpdatedNodeIds()
  }

  addBackHiddenNodesAndLinks = (rootNodeId, nodeIdsToUnhide, linkIdsToUnhide) => {
    const rootNode = find(nodes, node => {
      return node.id === rootNodeId
    })
    const newNodes = filter(this.props.nodes, nextNode => {
      return Boolean(nodeIdsToUnhide[nextNode.id])
    })
    const newLinks = filter(this.props.links, nextLink => {
      return Boolean(linkIdsToUnhide[nextLink.id])
    })
    newNodes.forEach(newNode => {
      nodes.push(newNode)
    })
    newLinks.forEach(newLink => {
      const correspondingNewSourceNode = find(newNodes, newNode => {
        // BUT one of these sources is still being rendered and is NOT in newNodes
        return newNode.id === newLink.source.id
      })
      const correspondingNewTargetNode = find(newNodes, newNode => {
        return newNode.id === newLink.target.id
      })
      newLink.source = correspondingNewSourceNode || rootNode
      newLink.target = correspondingNewTargetNode
      links.push(newLink)
    })
  }

  getChildNodeAndLinkIds = (rootNodeId, links) => {
    var hiddenNodeIds = {}
    var hiddenLinkIds = {}

    const recurse = (nodeId, links) => {
      if (this.state.hiddenNodesAndLinksByNodeId[nodeId]) {
        hiddenNodeIds = {
          ...hiddenNodeIds,
          [nodeId]: true
        }
      } else {
        const childLinks = filter(links, link => {
          return link.source.id === nodeId
        })
        if (!isEmpty(childLinks)) {
          const childNodeIds = reduce(childLinks, (sofar, childLink) => {
            return concat(sofar, [childLink.target.id])
          }, [])
          forEach(childNodeIds, childNodeId => {
            recurse(childNodeId, links)
          })
        }
        hiddenNodeIds = {
          ...hiddenNodeIds,
          [nodeId]: true
        }
        hiddenLinkIds = {
          ...hiddenLinkIds,
          ...reduce(childLinks, (sofar, childLink) => {
            return {
              ...sofar,
              [childLink.id]: true
            }
          }, {})
        }
      }
    }

    recurse(rootNodeId, links)

    return {
      hiddenNodeIds: omit(hiddenNodeIds, [rootNodeId]),
      hiddenLinkIds: hiddenLinkIds
    }
  }

  toggleCollapse = (rootNodeId) => {
    // if (d3.event.defaultPrevented) return
    const {
      hiddenNodesAndLinksByNodeId
    } = this.state
    console.log('toggleCollapse', this.state)
    const hiddenNodeInfo = hiddenNodesAndLinksByNodeId[rootNodeId]
    if (!isEmpty(hiddenNodeInfo)) {
      console.log('uncollapsing node', rootNodeId)
      this.addBackHiddenNodesAndLinks(rootNodeId, hiddenNodeInfo.hiddenNodeIds, hiddenNodeInfo.hiddenLinkIds)
      this.setState({
        ...this.state,
        hiddenNodesAndLinksByNodeId: {
          ...omit(this.state.hiddenNodesAndLinksByNodeId, rootNodeId)
        }
      })
    } else {
      console.log('collapsing node', rootNodeId)
      const hiddenNodeAndLinkIds = this.getChildNodeAndLinkIds(rootNodeId, this.props.links)
      const hiddenNodeIds = hiddenNodeAndLinkIds.hiddenNodeIds
      const hiddenLinkIds = hiddenNodeAndLinkIds.hiddenLinkIds
      remove(nodes, node => {
        return Boolean(hiddenNodeIds[node.id])
      })
      remove(links, link => {
        return Boolean(hiddenLinkIds[link.id])
      })
      this.setState({
        ...this.state,
        hiddenNodesAndLinksByNodeId: {
          ...this.state.hiddenNodesAndLinksByNodeId,
          [rootNodeId]: hiddenNodeAndLinkIds
        }
      })
    }
    this.updateGraph()
  }

  updateNodes = () => {
    const { updatedNodeIds } = this.props
    const { hiddenNodesAndLinksByNodeId } = this.state
    updatedNodeIds.forEach(updatedNodeId => {
      const nextNode = find(this.props.nodes, { id: updatedNodeId })
      node
        .filter((d, i) => { return d.id === nextNode.id })
        .select('text')
        .text(d => nextNode.label)
      node
        .filter((d, i) => { return d.id === nextNode.id })
        .select('circle')
        .attr('fill', d => { return nextNode.resolved ? 'red' : nextNode.nodeType === 'question' ? 'orange' : 'green' })
      // if node is NOW resolved AND is NOT already hidden, toggle collapse
      if (nextNode.resolved && !Boolean(hiddenNodesAndLinksByNodeId[updatedNodeId])) {
        this.toggleCollapse(updatedNodeId)
      }
      // if node is NOW un-resolved AND is already hidden, toggle collapse
      if (!nextNode.resolved && Boolean(hiddenNodesAndLinksByNodeId[updatedNodeId])) {
        this.toggleCollapse(updatedNodeId)
      }
    })
  }

  pushNewNodesAndLinks = () => {
    const {
      newNodeIds,
      newLinkIds,
    } = this.props
    const newNodes = filter(this.props.nodes, nextNode => {
      return includes(newNodeIds, nextNode.id)
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
  }

  componentWillUnmount () {
    simulation.stop()
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
