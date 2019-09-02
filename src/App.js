import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';
import './App.css';

const App = () => {
  const [circles, setCircles] = useState([]);

  const clientWidth = document.documentElement.clientWidth - 200;
  const clientHeight = document.documentElement.clientHeight - 30;
  let svg;

  //function for drawing circles using d3, centering text within them and grouping as one
  const draw = (x, y, container) => {
    const group = container.append('g').attr('class', 'node');

    const circle = group
      .append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', 56);
    const text = group
      .append('text')
        .attr('x', x)
        .attr('y', y)
        .attr('text-anchor', 'middle')
        .text('lorem ipsum');

    return { circle, text, group };
  };

  //creates new forceSimulation with:
  //force applied amongst all nodes - positive strength means that nodes attract each other
  //force to push all nodes towards X: clientWidth/2.5, Y: clientHeight/2.5
  //collision detection in radius of 56 around each node - the same as radius of a circle
  const force = d3
    .forceSimulation()
    .force('attraction', d3.forceManyBody().strength(60))
    .force('forceX', d3.forceX()
        .strength(0.1)
        .x(clientWidth / 2.5))
    .force('forceY', d3.forceY()
        .strength(0.1)
        .y(clientHeight / 2.5))
    .force('collision', d3.forceCollide()
        .radius(56)
        .iterations(2));

  //useEffect - with each change of 'circles' state:
  //select groups, each with circle and text attached to it
  //assign data to the selection
  //with each tick of simulation make smooth transition
  //to calculated position
  useEffect(() => {
    const groupWithData = svg.selectAll('g').data(circles);

    force.nodes(circles).on('tick', () => {
      groupWithData
        .transition()
        .duration(80)
          .attr('transform', d => `translate(${d.x}, ${d.y})`);
    });
    //when enabled, makes nodes move a little more after adding one
    //force.alphaTarget(0.3);
  }, [circles]);

  const handleAdd = () => {
    //unnecessary with force simulation
    //const maxCirclesNumX = Math.floor(clientWidth / 124);
    //const maxCirclesNumY = Math.floor(clientHeight / 124);
    const x = 32,
      y = 32;

    const drawn = draw(x, y, svg);
    setCircles(
      circles.concat({
        id: `${x * y + Math.floor(Math.random() * 10000)}`,
        group: drawn.group,
        circle: drawn.circle,
        text: drawn.text,
        x: x,
        y: y,
      }),
    );
  };

  const handleRemove = () => {
    if (circles.length === 0) return;
    const indexToDelete = circles.length - 1;
    const newCircles = circles.slice(0, indexToDelete);
    circles[indexToDelete].group.remove();
    setCircles(newCircles);
  };

  //using ref to access <svg> tag with d3
  return (
    <>
      <div id="controls">
        <button className="button" onClick={handleAdd}>
          Add
        </button>
        <button className="button" onClick={handleRemove}>
          Remove last
        </button>
      </div>
      <svg
        width={clientWidth}
        height={clientHeight}
        ref={element => (svg = d3.select(element))}
      ></svg>
    </>
  );
};

export default App;
