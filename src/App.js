import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';
import './App.css';

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
    .text('lorem ipsum');

  let bb = text.node().getBBox();
  let centerX = bb.width / 2;
  let centerY = bb.height / 4;

  text.attr('x', x - centerX);
  text.attr('y', y + centerY);

  return { circle, text, group };
};

const App = () => {
  const [circles, setCircles] = useState([]);

  const clientWidth = document.documentElement.clientWidth - 200;
  const clientHeight = document.documentElement.clientHeight - 30;
  let svg;

  const force = d3
    .forceSimulation()
    .force('charge', d3.forceManyBody().strength(5))
    .force('center', d3.forceCenter(clientWidth / 3, clientHeight / 3))
    .force('collision', d3.forceCollide().radius(56));

  useEffect(() => {
    const groupWithData = svg.selectAll('g').data(circles);
    //groupWithData.exit().remove();

    force.nodes(circles).on('tick', () => {
      groupWithData.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    //force.alphaTarget(0.3).restart();
  }, [circles]);

  const handleAdd = () => {
    const maxCirclesNumX = Math.floor(clientWidth / 124);
    const maxCirclesNumY = Math.floor(clientHeight / 124);
    const x = 128,
      y = 128;

    const drawn = draw(x, y, svg);
    setCircles(
      circles.concat({
        id: `${x * y + Math.floor(Math.random() * 50)}`,
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
    //  circles[indexToDelete].text.remove();
    setCircles(newCircles);
  };

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
