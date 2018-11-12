import React from 'react'
import * as d3 from 'd3'

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { nodes, links } = this.props
    const data = {
      nodes,
      links
    }

    const width = 640,
          height = 480;

    //Initializing chart
    const chart = d3.select('.chart')
      .attr('width', width)
      .attr('height', height);

    //Creating tooltip
    const tooltip = d3.select('.container')
      .append('div')
      .attr('class', 'tooltip')
      .html('Tooltip');

    //Initializing force simulation
    const simulation = d3.forceSimulation()
      .force('link', d3.forceLink())
      .force('charge', d3.forceManyBody())
      .force('collide', d3.forceCollide())
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force("y", d3.forceY(0))
      .force("x", d3.forceX(0));


    //Drag functions
    const dragStart = d => {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    };

    const drag = d => {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    };

    const dragEnd = d => {
      if (!d3.event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    //Creating links
    const link = chart.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(data.links).enter()
      .append('line');

    //Creating nodes
    const node = d3.select('.chart')
      .selectAll('circle')
      .data(data.nodes).enter()
      .append('circle')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      // .attr('r', d => 10) // size - radius?
      // .attr('opacity', d => 1)
      .attr('stroke', 'black')
      .attr('stroke-width', 2)
      .attr('fill', 'red')
      .attr('r', d => 10) // size - radius?
      .attr('opacity', d => 1)
      // .attr('class', d => {return 'flag flag-' + d.code;})
      .call(d3.drag()
         .on('start', dragStart)
         .on('drag', drag)
         .on('end', dragEnd)
      ).on('mouseover',d => {
        tooltip.html(d.country)
          .style('left', d3.event.pageX + 5 +'px')
          .style('top', d3.event.pageY + 5 + 'px')
          .style('opacity', .9);
      }).on('mouseout', () => {
        tooltip.style('opacity', 0)
          .style('left', '0px')
          .style('top', '0px');
      });

    //Setting location when ticked
    const ticked = () => {
      link
        .attr("x1", d => { return d.source.x; })
        .attr("y1", d => { return d.source.y; })
        .attr("x2", d => { return d.target.x; })
        .attr("y2", d => { return d.target.y; })
        .attr('stroke-width', d => 2) // size
        .attr('stroke', d => 'black')

    node
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', d => 10) // size - radius?
      .attr('opacity', d => 1)
    };

    //Starting simulation
    simulation.nodes(data.nodes)
      .on('tick', ticked);

    // simulation.force('link')
    //   .links(data.links);

    simulation.force('link', d3.forceLink(data.links).id(d => d.id).distance(60))

  }

  render() {
    return (
      <div className='container'>
        <h1>National Contiguity</h1>
        <div className='chartContainer'>
          <svg className='chart'>
          </svg>
        </div>
      </div>
    );
  }
}

export default App
