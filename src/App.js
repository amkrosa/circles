import React, { useState } from 'react';
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

  //adds a circle, also checks maximum number of circles 
  //within given width and height without overlapping
  const handleAdd = () => {
    const maxCirclesNumX = Math.floor(clientWidth / 124);
    const maxCirclesNumY = Math.floor(clientHeight / 124);
    let x, y;
    if (circles.length === maxCirclesNumX * maxCirclesNumY) {
      console.log("max number reached");
      return;
    }
    if (circles.length === 0) {
      x = 68;
      y = 68;
    } else if (circles.length % maxCirclesNumX === 0) {
      x = 68;
      y = circles[circles.length - 1].y + 124;
    } else {
      x = circles[circles.length - 1].x + 124;
      y = circles[circles.length - 1].y;
    }

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
