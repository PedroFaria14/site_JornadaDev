import React, { useRef, useEffect, useState } from "react";

const degToRad = (deg) => (deg * Math.PI) / 180;


const CustomWheel = ({
  prizes = [],
  mustStartSpinning = false,
  onStopSpinning = () => {},
  spinDuration = 4,
  size = 400,
  outerBorderColor = "#0c0b0bff",
  pointerColor = "#38b36d",
}) => {
  const canvasRef = useRef(null);
  const [rotation, setRotation] = useState(0); 
  const [currentPrize, setCurrentPrize] = useState(null);

  const totalPrizes = Math.max(1, prizes.length);
  const degreesPerSegment = 360 / totalPrizes;
  const radius = size / 2;

  // --- Desenha a roleta ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, size, size);

    // Desenha fatias
    prizes.forEach((prize, index) => {
      const startAngle = degToRad(index * degreesPerSegment - 90); // -90 para começar em cima (12h)
      const endAngle = degToRad((index + 1) * degreesPerSegment - 90);

      ctx.beginPath();
      ctx.moveTo(radius, radius);
      ctx.arc(radius, radius, radius - 10, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = prize.style?.backgroundColor ?? "#ccc";
      ctx.fill();

      ctx.strokeStyle = "rgba(0,0,0,0.12)";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Texto no centro do setor
      ctx.save();
      const midAngle = (index * degreesPerSegment + degreesPerSegment / 2) - 90;
      ctx.translate(radius, radius);
      ctx.rotate(degToRad(midAngle));
      ctx.fillStyle = prize.style?.textColor ?? "#111";
      ctx.font = "bold 14px Arial";
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      ctx.fillText(prize.option, radius * 0.72, 0);
      ctx.restore();
    });

    // círculo central
    ctx.beginPath();
    ctx.arc(radius, radius, 22, 0, Math.PI * 2);
    ctx.fillStyle = outerBorderColor;
    ctx.fill();

    // borda externa
    ctx.beginPath();
    ctx.arc(radius, radius, radius - 3, 0, Math.PI * 2);
    ctx.strokeStyle = outerBorderColor;
    ctx.lineWidth = 8;
    ctx.stroke();
  }, [prizes, size, degreesPerSegment, radius, outerBorderColor]);

 
  const angularDistance = (a, b) => {
    const diff = Math.abs(((a - b + 540) % 360) - 180);
    return diff;
  };

  useEffect(() => {
    if (!mustStartSpinning) return;

    const extraRotations = 360 * (5 + Math.random() * 4.5);
    const newRotation = rotation + extraRotations;


    setRotation(newRotation);

   
    const timer = setTimeout(() => {
      const normalized = ((newRotation % 360) + 360) % 360;

      const pointerAngle = 90;

      let bestIndex = 0;
      let bestDist = 1e9;

      for (let i = 0; i < totalPrizes; i++) {
        const sectorCenter = (i * degreesPerSegment + degreesPerSegment / 2) - 90;
        const displayedCenter = ((sectorCenter + normalized) % 360 + 360) % 360;
        const dist = angularDistance(displayedCenter, pointerAngle);
        if (dist < bestDist) {
          bestDist = dist;
          bestIndex = i;
        }
      }

      const landedIndex = bestIndex % totalPrizes;
      const landedPrize = prizes[landedIndex];

      setCurrentPrize(landedPrize);
      onStopSpinning(landedPrize, landedIndex);
    }, spinDuration * 1000);

    return () => clearTimeout(timer);
   
  }, [mustStartSpinning]);

  const wheelStyle = {
    width: size,
    height: size,
    transform: `rotate(${rotation}deg)`,
    transition: mustStartSpinning
      ? `transform ${spinDuration}s cubic-bezier(0.25, 0.1, 0.25, 1)`
      : "transform 0.2s linear",
  };

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <div style={wheelStyle}>
        <canvas ref={canvasRef} width={size} height={size} style={{ display: "block" }} />
      </div>

      
      <div
        style={{
          position: "absolute",
          top: "-18px", 
          left: "50%",
          transform: "translateX(-50%) rotate(180deg)", 
          width: 0,
          height: 0,
          borderLeft: "15px solid transparent",
          borderRight: "15px solid transparent",
          borderTop: `35px solid ${pointerColor}`,
          zIndex: 50,
        }}
      />

      {/* Feedback textual opcional */}
      {currentPrize && !mustStartSpinning && (
        <div
          style={{
            position: "absolute",
            bottom: "-48px",
            width: "100%",
            textAlign: "center",
            color: "#6ee7b7",
            fontWeight: "700",
            fontSize: "1.05rem",
            textShadow: "0 0 10px rgba(110,231,183,0.45)",
          }}
        >
          🎉 Caiu em: {currentPrize.option}
        </div>
      )}
    </div>
  );
};

export default CustomWheel;
