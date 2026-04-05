import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function App() {
  const colorRef = useRef("black");
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState("black");

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected:", socket.id);
    });
    
    socket.on("startDrawing", ({ x, y , color}) => {
    ctxRef.current.strokeStyle = color;
    
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(x, y);
    });
    
    socket.on("draw", ({ x, y ,color}) => {
    ctxRef.current.strokeStyle = color;
    ctxRef.current.lineTo(x, y);
    ctxRef.current.stroke();
    });

    

    socket.on("stopDrawing", () => {
      ctxRef.current.closePath();
    });

    socket.on("clearCanvas", () => {   
    const canvas = canvasRef.current;
    ctxRef.current.clearRect(0, 0, canvas.width, canvas.height);
    });

    const canvas = canvasRef.current;
    canvas.width = 500;
    canvas.height = 500;

    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    // ctx.strokeStyle = "black";
    ctx.lineWidth = 3;

    ctxRef.current = ctx;
  }, []);

  const startDrawing = (e) => {
    setDrawing(true);

    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;

    ctxRef.current.strokeStyle = colorRef.current; // 👈 important
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(x, y);

    socket.emit("startDrawing", { x, y ,color: colorRef.current });
  };

  const draw = (e) => {
  if (!drawing) return;

  const x = e.nativeEvent.offsetX;
  const y = e.nativeEvent.offsetY;

  ctxRef.current.strokeStyle = colorRef.current; // 👈 IMPORTANT

  ctxRef.current.lineTo(x, y);
  ctxRef.current.stroke();

  socket.emit("draw", { x, y, color: colorRef.current  }); // 👈 send color
  };

  const stopDrawing = () => {
    setDrawing(false);
    
    ctxRef.current.closePath();

    socket.emit("stopDrawing");
  };

  const clearCanvas = () => {
  const canvas = canvasRef.current;
  ctxRef.current.clearRect(0, 0, canvas.width, canvas.height);

  socket.emit("clearCanvas");
  };
  


  return (
    <div>
      
      <h1>Scribble App</h1>

      <input
          type="color"
          onChange={(e) => {
            setColor(e.target.value);
            colorRef.current = e.target.value; // 👈 important
          }}
      />
      <canvas
        
        ref={canvasRef}
        style={{ border: "2px solid black" }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
      />
      <button onClick={clearCanvas}>Clear</button>
      
    </div>
  );
}

export default App;