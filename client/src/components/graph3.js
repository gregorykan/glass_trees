import React from 'react'
import * as d3 from 'd3'

var link = null
var node = null
var tooltip = null
var chart = null
var simulation = null
var nodes = null
var links = []

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  //Drag functions
  dragStart = d => {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  };

  drag = d => {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  };

  dragEnd = d => {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  //Setting location when ticked
  ticked = () => {
    link
      .attr("x1", d => { return d.source.x; })
      .attr("y1", d => { return d.source.y; })
      .attr("x2", d => { return d.target.x; })
      .attr("y2", d => { return d.target.y; })

    node
      .selectAll('text')
        .attr('dx', d => d.x - 10)
        .attr('dy', d => d.y + 20)
    node
      .selectAll('circle')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
    }

  startGraph = () => {
    nodes = this.props.nodes
    links = this.props.links

    const width = 640,
          height = 480;

    //Initializing chart
    chart = d3.select('.chart')
      .attr('width', width)
      .attr('height', height);

    //Creating tooltip
    tooltip = d3.select('.container')
      .append('div')
      .attr('class', 'tooltip')

    //Initializing force simulation
    simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink())
      .force('charge', d3.forceManyBody(-1000))
      .force('collide', d3.forceCollide())
      .force('center', d3.forceCenter(width / 2, height / 2))
      // .force("y", d3.forceY(0))
      // .force("x", d3.forceX(0));

    //Creating links
    link = chart.append('g')
      .attr('class', 'links')
      .selectAll('line')

    //Creating nodes
    node = chart.append('g')
      .attr('class', 'nodes')
      .selectAll('g')

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
      .attr('opacity', 0.4)
      .merge(link)

    // Updating nodes
    node = node.data(nodes)
    node.exit().remove()
    node = node.enter()
      .append('g')
    node.append('text')
      .text(d => d.label)
    node.append('circle')
      .attr('r', 10)
      .attr('opacity', 1)
      .attr('stroke', 'black')
      .attr('stroke-width', 2)
      .attr('fill', 'red')
      .on('click', d => { onClickNode(d.id) })
      .call(d3.drag()
         .on('start', this.dragStart)
         .on('drag', this.drag)
         .on('end', this.dragEnd)
      ).on('mouseover',d => {
        tooltip.html(d.label)
          .style('left', d3.event.pageX + 5 +'px')
          .style('top', d3.event.pageY + 5 + 'px')
          .style('opacity', .9);
      }).on('mouseout', () => {
        tooltip.style('opacity', 0)
          .style('left', '0px')
          .style('top', '0px');
      })
      .merge(node)

    //Starting simulation
    simulation.nodes(nodes)
      .on('tick', this.ticked);

    simulation.force('link', d3.forceLink(links).id(d => d.id).distance(60))

    simulation.alpha(1).restart()
  }

  componentDidMount() {
    this.startGraph()
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (nextProps.nodes.length !== this.props.nodes.length) return true
    return false
  }

  componentDidUpdate () {
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
    );
  }
}

export default App
