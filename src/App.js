import React, { useState } from "react";
import * as d3 from "d3";
import "./App.css";

const draw = (x, y, container) => {
  const circle = container
    .append("circle")
    .attr("cx", x)
    .attr("cy", y)
    .attr("r", 56);
  const text = container
    .append("text")
    .attr("x", x)
    .attr("y", y)
    .text("lorem ipsum");

  let bb = text.node().getBBox();
  let centerX = bb.width / 2;
  let centerY = bb.height / 4;

  text.attr("x", x - centerX);
  text.attr("y", y + centerY);

  return { circle, text };
};

const App = () => {
  const [circles, setCircles] = useState([]);

  const clientWidth = document.documentElement.clientWidth - 200;
  const clientHeight = document.documentElement.clientHeight - 30;
  let svg;

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
        circle: drawn.circle,
        text: drawn.text,
        x,
        y
      })
    );
  };

  const handleRemove = () => {
    if (circles.length === 0) return;
    const indexToDelete = circles.length - 1;
    const newCircles = circles.slice(0, indexToDelete);
    circles[indexToDelete].circle.remove();
    circles[indexToDelete].text.remove();
    setCircles(newCircles);
  };

  return (
    <>
      <div id='controls'>
        <button className='button' onClick={handleAdd}>
          Add
        </button>
        <button className='button' onClick={handleRemove}>
          Remove last
        </button>
      </div>
      <svg
        width={clientWidth}
        height={clientHeight}
        ref={element => (svg = d3.select(element))}></svg>
    </>
  );
};

export default App;
