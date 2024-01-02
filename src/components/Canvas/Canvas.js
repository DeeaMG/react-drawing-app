import React, { useEffect } from "react";
import { useOnDraw } from "../Hooks";
import "./Canvas.css";

const Canvas = ({ width, height, color }) => {
  const { canvasRef, setCanvasRef, onCanvasMouseDown, saveCurrentState, undoLast } =
    useOnDraw(onDraw);

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

    drawLine(prevPoint, point, ctx, color, 5);
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
    ctx.arc(start.x, start.y, 2, 0, 2 * Math.PI);
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
    <>
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
    </>
  );
};

export default Canvas;

const canvasStyle = {
  border: "1px solid black",
  marginTop: "1rem",
  marginBottom: "1rem",
};
