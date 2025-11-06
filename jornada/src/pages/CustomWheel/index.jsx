import React, { useRef, useEffect, useState } from "react";

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
  outerBorderColor = "#38b36d",
}) => {
  const canvasRef = useRef(null);
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const totalPrizes = prizes.length;
  const degreesPerSegment = 360 / totalPrizes;
  const radius = size / 2;

  // 1. Desenhar a roleta
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
      ctx.strokeStyle = "#fff"; // Cor da linha divisória
      ctx.lineWidth = 2;
      ctx.stroke();

      // Desenhar o texto (Módulos)
      ctx.save();
      ctx.translate(radius, radius);
      // Rodar para o centro do segmento
      ctx.rotate(startAngle + degToRad(degreesPerSegment / 2));

      // Ajustar cor e fonte
      ctx.fillStyle = prize.style.textColor;
      ctx.font = "bold 16px Arial";
      ctx.textAlign = "right"; // Alinhar à direita (perto da borda)
      ctx.textBaseline = "middle";

      // Posição do texto (Ajustar o 0.6 para mover para dentro/fora)
      ctx.fillText(prize.option, radius * 0.7, 0);
      ctx.restore();
    });

    // Desenhar o círculo central (Opcional)
    ctx.beginPath();
    ctx.arc(radius, radius, 20, 0, 2 * Math.PI);
    ctx.fillStyle = outerBorderColor;
    ctx.fill();

    // Desenhar a borda externa
    ctx.beginPath();
    ctx.arc(radius, radius, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = outerBorderColor;
    ctx.lineWidth = 10;
    ctx.stroke();
  }, [prizes, size, degreesPerSegment, radius, outerBorderColor]);

  // 2. Lógica de Animação de Rotação
  useEffect(() => {
    if (mustStartSpinning && !isSpinning) {
      setIsSpinning(true);

      // 1. Calcular a rotação final em graus
      const segmentIndex = totalPrizes - 1 - prizeNumber; // Roleta roda no sentido horário, então inverte
      const finalDegree = segmentIndex * degreesPerSegment + degreesPerSegment / 2; // Centro do segmento

      // Adiciona muitas voltas para a animação ser visível e suave
      const totalRotation = 360 * 10 + finalDegree - (rotation % 360);

      // 2. Iniciar a animação (CSS Transition)
      setRotation(totalRotation);

      // 3. Chamar o callback quando a animação terminar
      const timer = setTimeout(() => {
        setIsSpinning(false);
        // Atualiza a rotação de volta para o valor final entre 0 e 360 para a próxima vez
        setRotation(totalDegree % 360);
        onStopSpinning();
      }, spinDuration * 1000);

      return () => clearTimeout(timer);
    }
  }, [
    mustStartSpinning,
    prizeNumber,
    onStopSpinning,
    degreesPerSegment,
    totalPrizes,
    spinDuration,
    isSpinning,
    rotation,
  ]);

  // 3. Estilos de Rotação
  const wheelStyle = {
    transition: isSpinning ? `transform ${spinDuration}s cubic-bezier(0.25, 0.1, 0.25, 1)` : "none",
    transform: `rotate(${rotation}deg)`,
  };

  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        // Triângulo indicador (Pointer)
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: 0,
          height: 0,
          borderLeft: "15px solid transparent",
          borderRight: "15px solid transparent",
          borderBottom: `20px solid ${outerBorderColor}`, // Cor do ponteiro
          zIndex: 10,
        },
      }}
    >
      <div style={wheelStyle}>
        <canvas ref={canvasRef} width={size} height={size} style={{ display: "block" }} />
      </div>
      {/* Triângulo indicador (Pointer) - CSS Puro */}
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
          borderBottom: `20px solid ${outerBorderColor}`,
          zIndex: 10,
        }}
      ></div>
    </div>
  );
};

export default CustomWheel;
