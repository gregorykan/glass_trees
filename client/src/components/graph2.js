import React from 'react'
import * as d3 from 'd3'
import { times } from 'lodash'

const containerStyle = {
  width: 800,
  height: 600,
  backgroundColor: 'skyblue',
  display: 'flex',
  alignItems: 'center'
}

var width = 800;
var height = 600;
var simulation = d3.forceSimulation()
  .force('collide', d3.forceCollide(d => 2 * d.size))
  .force('charge', d3.forceManyBody(-650))
  .force('center', d3.forceCenter(width / 2, height / 2))
  .stop();

class Graph extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {selected: null};
  //
  //   this.selectNode = this.selectNode.bind(this);
  // }

  // shouldComponentUpdate(nextProps, nextState) {
  //   if (nextProps.version === this.props.version) {
  //     // if version is the same, no updates to data
  //     // so it must be interaction to select+highlight a node
  //     this.calculateHighlights(nextState.selected);
  //     this.circles.attr('opacity', d =>
  //       !nextState.selected || this.highlightedNodes[d.key] ? 1 : 0.2)
  //     this.lines.attr('opacity', d =>
  //       !nextState.selected || this.highlightedLinks[d.key] ? 0.5 : 0.1)
  //     return false;
  //   }
  //   return true;
  // }

  componentDidMount() {
    this.container = d3.select(this.refs.container);
    this.calculateData();
    // this.calculateHighlights(this.state.selected);
    this.renderLinks();
    this.renderNodes();
  }

  // componentDidUpdate() {
  //   this.calculateData();
  //   // this.calculateHighlights(this.state.selected);
  //   this.renderLinks();
  //   this.renderNodes();
  // }

  calculateData() {
    // nodes and links are mutated in this function
    // they are given all the extra stuff that d3 needs to render them
    var {nodes, links} = this.props;
    simulation.nodes(nodes)
      .force('link', d3.forceLink(links).id(d => d.id).distance(50));

    times(2000, () => simulation.tick());

    this.nodes = nodes;
    this.links = links;
  }

  // calculateHighlights(selected) {
  //   this.highlightedNodes = {};
  //   this.highlightedLinks = {};
  //   if (selected) {
  //     this.highlightedNodes[selected] = 1;
  //     _.each(this.links, link => {
  //       if (link.source.key === selected) {
  //         this.highlightedNodes[link.target.key] = 1;
  //         this.highlightedLinks[link.key] = 1;
  //       }
  //       if (link.target.key === selected) {
  //         this.highlightedNodes[link.source.key] = 1;
  //         this.highlightedLinks[link.key] = 1;
  //       }
  //     });
  //   }
  // }

  renderNodes() {
    this.circles = this.container.selectAll('g')
      .data(this.nodes, d => d.id);
    // exit
    this.circles.exit().remove();
    // enter + update
    this.circles = this.circles.enter().append('g')
      .classed('node', true)
      .merge(this.circles)

    this.circles.append('circle')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', d => 10) // size - radius?
      .attr('opacity', d => 1)
      // .attr('opacity', d =>
      //   !this.state.selected || this.highlightedNodes[d.key] ? 1 : 0.2)
      // .on('click', this.selectNode);
    this.circles.append('text')
      .attr("dx", 12)
      .attr("dy", "2em")
      .text(d => d.label)
  }

  renderLinks() {
    this.lines = this.container.selectAll('line')
      .data(this.links, d => d.id);
    // exit
    this.lines.exit().remove();
    // enter + update
    this.lines = this.lines.enter().insert('line', 'circle')
      .classed('link', true)
      .merge(this.lines)
      .attr('stroke-width', d => 2) // size
      .attr('stroke', d => 'black')
      .attr('x1', d => d.source.x)
      .attr('x2', d => d.target.x)
      .attr('y1', d => d.source.y)
      .attr('y2', d => d.target.y)
      .attr('opacity', d => 1)
      // .attr('opacity', d =>
      //   !this.state.selected || this.highlightedLinks[d.key] ? 0.5 : 0.1);
  }

  // selectNode(node) {
  //   if (node.key === this.state.selected) {
  //     this.setState({selected: null});
  //   } else {
  //     this.setState({selected: node.key});
  //   }
  // }

  render() {
    return (
      <div style={containerStyle}>
        <svg style={{ backgroundColor: 'pink', height: 600, width: 800 }} ref='container' />
      </div>
    )
  }
}

export default Graph
