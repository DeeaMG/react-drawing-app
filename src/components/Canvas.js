import React, { useEffect } from "react";
import { useOnDraw } from "./Hooks";

const Canvas = ({ width, height, color }) => {
  const { canvasRef, setCanvasRef, onCanvasMouseDown } = useOnDraw(onDraw);

  const initializeCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  function onDraw(ctx, point, prevPoint) {
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
      link.download = "my-drawing.png";
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
      <button onClick={saveCanvas} style={{ marginTop: "10px" }}>
        Save Image
      </button>
    </>
  );
};

export default Canvas;

const canvasStyle = {
  border: "1px solid black",
};
