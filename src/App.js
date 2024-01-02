import React, { useState } from "react";
import "./App.css";
import { SketchPicker } from "react-color";
import Canvas from "./components/Canvas/Canvas";

function App() {
  const [color, setColor] = useState("#000000");

  const handleColorChange = (color) => {
    setColor(color.hex);
  };

  return (
    <div className="App">
      <SketchPicker color={color} onChangeComplete={handleColorChange} />
      <Canvas width={700} height={500} color={color} />
    </div>
  );
}

export default App;
