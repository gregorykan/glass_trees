import React from 'react'
import * as d3 from 'd3'
import { map, filter, includes, concat, isEmpty, remove, find, clone, forEach, reduce, keys, omit } from 'lodash'

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

// GK: TODO: BUG:
// if a question node has been updated (resolved or reopened)
// and you collapse that node
// when you un-collapse it, all the child nodes fly everywhere


class D3ForceGraph extends React.Component {
  state = {
    nodeIdsToHide: {},
    linkIdsToHide: {},
    nodeIdsToUnhide: {},
    linkIdsToUnhide: {},
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
    node = node.data(nodes, d => d)
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
    const orderedResolvedNodeIds = resolvedNodeIds.sort((a, b) => { return a - b })
    forEach(orderedResolvedNodeIds, resolvedNodeId => {
      this.setHiddenNodeAndLinkIdsForResolvedNode(resolvedNodeId, this.props.links)
    })
    this.startGraph()
  }

  setHiddenNodeAndLinkIdsForResolvedNode = (resolvedNodeId, links) => {
    const hiddenNodeAndLinkIds = this.getChildNodeAndLinkIdsForRawNodesAndLinks(resolvedNodeId, links)
    this.setState({
      ...this.state,
      nodeIdsToHide: {
        ...this.state.nodeIdsToHide,
        ...hiddenNodeAndLinkIds.hiddenNodeIds,
      },
      linkIdsToHide: {
        ...this.state.linkIdsToHide,
        ...hiddenNodeAndLinkIds.hiddenLinkIds
      },
      hiddenNodesAndLinksByNodeId: {
        ...this.state.hiddenNodesAndLinksByNodeId,
        [resolvedNodeId]: hiddenNodeAndLinkIds
      }
    })
  }

  getChildNodeAndLinkIdsForRawNodesAndLinks = (rootNodeId, links) => {
    var hiddenNodeIds = {}
    var hiddenLinkIds = {}

    const recurse = (nodeId, links) => {
      const childLinks = filter(links, link => {
        return link.source === nodeId
      })
      if (!isEmpty(childLinks)) {
        const childNodeIds = reduce(childLinks, (sofar, childLink) => {
          return concat(sofar, [childLink.target])
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

    recurse(rootNodeId, links)

    return {
      hiddenNodeIds: omit(hiddenNodeIds, [rootNodeId]),
      hiddenLinkIds: hiddenLinkIds
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (nextProps.newNodeIds.length > 0 && this.props.newNodeIds.length === 0) return true
    if (nextProps.updatedNodeIds.length > 0 && this.props.updatedNodeIds.length === 0) return true
    if (keys(nextState.nodeIdsToHide).length > 0) return true
    if (keys(nextState.nodeIdsToUnhide).length > 0) return true
    const nodeIdsToHighlight = nextProps.nodeIdsToHighlight || []
    const linkIdsToHighlight = nextProps.linkIdsToHighlight || []
    node
      .select('circle')
      .attr('stroke', d => includes(nodeIdsToHighlight, d.id) ? 'blue' : 'none')
      .attr('stroke-width', d => includes(nodeIdsToHighlight, d.id) ? 4 : 0)
    link
      .attr('stroke', d => includes(linkIdsToHighlight, d.id) ? 'blue' : 'black')
      .attr('stroke-width', d => includes(linkIdsToHighlight, d.id) ? 4 : 2)
    if (keys(nextState.nodeIdsToHide).length === 0) return false
    if (keys(nextState.nodeIdsToUnhide).length === 0) return false
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
    const {
      nodeIdsToHide,
      nodeIdsToUnhide
    } = this.state
    if (!isEmpty(newNodeIds)) {
      this.pushNewNodesAndLinks()
    }
    if (!isEmpty(updatedNodeIds)) {
      this.updateNodes()
    }
    if (!isEmpty(nodeIdsToHide)) {
      this.removeHiddenNodesAndLinks()
    }
    if (!isEmpty(nodeIdsToUnhide)) {
      this.addBackHiddenNodesAndLinks()
    }
    this.updateGraph()
    doClearNewNodeIds()
    doClearNewLinkIds()
    doClearUpdatedNodeIds()
  }

  removeHiddenNodesAndLinks = () => {
    const { nodeIdsToHide, linkIdsToHide } = this.state
    remove(nodes, node => {
      return Boolean(nodeIdsToHide[node.id])
    })
    remove(links, link => {
      return Boolean(linkIdsToHide[link.id])
    })
    this.setState({
      nodeIdsToHide: {},
      linkIdsToHide: {}
    })
  }

  addBackHiddenNodesAndLinks = () => {
    const { nodeIdsToUnhide, linkIdsToUnhide } = this.state
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
      links.push(newLink)
    })
    this.setState({
      nodeIdsToUnhide: {},
      linkIdsToUnhide: {},
    })
  }

  getChildNodeAndLinkIds = (rootNodeId, links) => {
    var hiddenNodeIds = {}
    var hiddenLinkIds = {}

    const recurse = (nodeId, links) => {
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

    recurse(rootNodeId, links)

    return {
      hiddenNodeIds: omit(hiddenNodeIds, [rootNodeId]),
      hiddenLinkIds: hiddenLinkIds
    }
  }

  toggleCollapse = (rootNodeId) => {
    if (d3.event.defaultPrevented) return
    const {
      hiddenNodesAndLinksByNodeId
    } = this.state
    const hiddenNodeInfo = hiddenNodesAndLinksByNodeId[rootNodeId]
    if (!isEmpty(hiddenNodeInfo)) {
      console.log('uncollapsing node', rootNodeId)
      const nodeIdsAlreadyHidden = keys(hiddenNodesAndLinksByNodeId) // [267]
      forEach(nodeIdsAlreadyHidden, (nodeIdAlreadyHidden) => {
        if (Boolean(hiddenNodeInfo.hiddenNodeIds[nodeIdAlreadyHidden])) {
          this.setState({
            ...this.state,
            hiddenNodesAndLinksByNodeId: {
              ...omit(this.state.hiddenNodesAndLinksByNodeId, nodeIdAlreadyHidden)
            }
          })
        }
      })
      this.setState({
        ...this.state,
        nodeIdsToUnhide: hiddenNodeInfo.hiddenNodeIds,
        linkIdsToUnhide: hiddenNodeInfo.hiddenLinkIds,
        hiddenNodesAndLinksByNodeId: {
          ...omit(this.state.hiddenNodesAndLinksByNodeId, rootNodeId)
        }
      })
    } else {
      console.log('collapsing node', rootNodeId)
      const hiddenNodeAndLinkIds = this.getChildNodeAndLinkIds(rootNodeId, this.props.links)
      this.setState({
        ...this.state,
        nodeIdsToHide: {
          ...this.state.nodeIdsToHide,
          ...hiddenNodeAndLinkIds.hiddenNodeIds,
        },
        linkIdsToHide: {
          ...this.state.linkIdsToHide,
          ...hiddenNodeAndLinkIds.hiddenLinkIds
        },
        hiddenNodesAndLinksByNodeId: {
          ...this.state.hiddenNodesAndLinksByNodeId,
          [rootNodeId]: hiddenNodeAndLinkIds
        }
      })
    }
  }

  updateNodes = () => {
    const { updatedNodeIds } = this.props
      updatedNodeIds.forEach(updatedNodeId => {
        const nextNode = find(this.props.nodes, { id: updatedNodeId })
        forEach(nodes, node => {
          if (node.id === nextNode.id) {
            node.label = nextNode.label
            node.description = nextNode.description
            node.resolved = nextNode.resolved
          }
        })
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
