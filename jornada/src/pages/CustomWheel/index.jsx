import React, { useRef, useEffect, useState } from "react";
// import { Box } from "@mui/material"; // Não está sendo usado, pode ser removido

// Função utilitária para converter graus em radianos
const degToRad = (deg) => deg * (Math.PI / 180);

// --- Componente da Roleta Customizada ---
const CustomWheel = ({
  prizes,
  mustStartSpinning,
  prizeNumber,
  onStopSpinning,
  spinDuration = 4, // Duração do giro em segundos
  size = 400, // Tamanho da roleta em pixels
  outerBorderColor = "#0c0b0bff",
  pointerColor = "#FFFFFF",
}) => {
  const canvasRef = useRef(null);
  const [rotation, setRotation] = useState(0);
  // Removido o estado 'isSpinning', vamos usar 'mustStartSpinning' como a fonte da verdade
  const totalPrizes = prizes.length;
  const degreesPerSegment = 360 / totalPrizes;
  const radius = size / 2;

  // 1. Desenhar a roleta (Este useEffect está correto)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, size, size);

    prizes.forEach((prize, index) => {
      // Calcular ângulos
      const startAngle = degToRad(index * degreesPerSegment);
      const endAngle = degToRad((index + 1) * degreesPerSegment);

      // Desenhar o segmento
      ctx.beginPath();
      ctx.moveTo(radius, radius);
      ctx.arc(radius, radius, radius - 10, startAngle, endAngle); // -10 para borda interna
      ctx.closePath();
      ctx.fillStyle = prize.style.backgroundColor;
      ctx.fill();
      ctx.strokeStyle = "#1b1414ff"; // Cor da linha divisória
      ctx.lineWidth = 5;
      ctx.stroke();

      // Desenhar o texto (Módulos)
      ctx.save();
      ctx.translate(radius, radius);
      ctx.rotate(startAngle + degToRad(degreesPerSegment / 2));
      ctx.fillStyle = prize.style.textColor;
      ctx.font = "bold 16px Arial";
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      ctx.fillText(prize.option, radius * 0.7, 0);
      ctx.restore();
    });

    // Círculo central
    ctx.beginPath();
    ctx.arc(radius, radius, 20, 0, 2 * Math.PI);
    ctx.fillStyle = outerBorderColor;
    ctx.fill();

    // Borda externa
    ctx.beginPath();
    ctx.arc(radius, radius, 195, 0, 2 * Math.PI);
    ctx.strokeStyle = outerBorderColor;
    ctx.lineWidth = 10;
    ctx.stroke();
  }, [prizes, size, degreesPerSegment, radius, outerBorderColor]);

  // 2. Lógica de Animação de Rotação (CORRIGIDO)
  useEffect(() => {
    // Este efeito agora só reage a 'mustStartSpinning'
    if (mustStartSpinning) {
      // 1. Calcular a rotação final
      const segmentIndex = totalPrizes - 1 - prizeNumber;
      const finalDegree = segmentIndex * degreesPerSegment + degreesPerSegment / 2; // Centro do segmento

      // 2. Usar um callback no setRotation
      // Isso nos permite obter o 'currentRotation' sem precisar
      // colocá-lo no array de dependências.
      setRotation((currentRotation) => {
        const totalRotation = 360 * 10 + finalDegree - (currentRotation % 360);
        return totalRotation;
      });

      // 3. Chamar o callback quando a animação terminar
      // Este temporizador não será mais limpo por re-renders
      const timer = setTimeout(() => {
        onStopSpinning();
      }, spinDuration * 1000);

      // A função de limpeza só será chamada se o componente for desmontado
      // ou se mustStartSpinning mudar (o que queremos)
      return () => clearTimeout(timer);
    } else {
      // Quando o giro terminar (mustStartSpinning se torna false),
      // ajustamos a rotação de volta para um valor entre 0-360
      // para preparar o próximo giro.
      setRotation((currentRotation) => currentRotation % 360);
    }
  }, [
    mustStartSpinning, // <-- Única dependência de estado que inicia o giro
    prizeNumber,
    onStopSpinning,
    degreesPerSegment,
    totalPrizes,
    spinDuration,
  ]);

  // 3. Estilos de Rotação
  const wheelStyle = {
    // A transição só é aplicada quando 'mustStartSpinning' é true
    transition: mustStartSpinning
      ? `transform ${spinDuration}s cubic-bezier(0.25, 0.1, 0.25, 1)`
      : "none",
    transform: `rotate(${rotation}deg)`,
  };

  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
      }}
    >
      <div style={wheelStyle}>
        <canvas
          ref={canvasRef}
          width={size}
          height={size}
          style={{ display: "block" }}
        />
      </div>

      {/* Triângulo indicador (Pointer) */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: 0,
          height: 0,
          borderLeft: "15px solid transparent",
          borderRight: "15px solid transparent",
          borderTop: `40px solid ${pointerColor}`,
          zIndex: 10,
        }}
      ></div>
    </div>
  );
};

export default CustomWheel;