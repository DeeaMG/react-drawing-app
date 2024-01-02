import React, { useEffect, useState } from "react";
import { SketchPicker } from "react-color";
import { useOnDraw } from "../Hooks";
import "./Canvas.css";

const Canvas = ({ width, height }) => {
  const { canvasRef, setCanvasRef, onCanvasMouseDown, saveCurrentState, undoLast } =
    useOnDraw(onDraw);

  const [brushSize, setBrushSize] = useState(5);
  const [color, setColor] = useState("#000000");

  const handleColorChange = (color) => {
    setColor(color.hex);
  };

  const handleBrushSizeChange = (event) => {
    setBrushSize(event.target.value); // Update brush size from input
  };

  const initializeCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  function onDraw(ctx, point, prevPoint) {
    if (!prevPoint) {
      saveCurrentState(); // Save state at the start of a new stroke
    }

    drawLine(prevPoint, point, ctx, color, brushSize);
  }

  function drawLine(start, end, ctx, color, width) {
    start = start ?? end;
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(start.x, start.y, width / 2, 0, 2 * Math.PI);
    ctx.fill();
  }

  const saveCanvas = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
      const link = document.createElement("a");
      link.download = "drawing.png";
      link.href = image;
      link.click();
    } else {
      console.error("Canvas reference is not set.");
    }
  };

  useEffect(() => {
    // Initialize canvas when component mounts
    initializeCanvas();
  }, []);

  return (
    <div className="canvas-container">
      <div className="left-container">
        <SketchPicker color={color} onChangeComplete={handleColorChange} />
        <div className="brushSize-container">
          <label htmlFor="brushSize">Brush Size:</label>
          <input
            id="brushSize"
            type="range"
            min="1"
            max="20"
            value={brushSize}
            onChange={handleBrushSizeChange}
          />
        </div>
      </div>
      <div className="right-container">
        <canvas
          width={width}
          height={height}
          onMouseDown={onCanvasMouseDown}
          style={canvasStyle}
          ref={setCanvasRef}
        />
        <div className="buttons-container">
          <button onClick={saveCanvas} className="button button-save">
            Save Image
          </button>
          <button onClick={undoLast} className="button button-undo">
            Undo
          </button>
        </div>
      </div>
    </div>
  );
};

export default Canvas;

const canvasStyle = {
  border: "1px solid black",
  marginTop: "1rem",
  marginBottom: "1rem",
};
