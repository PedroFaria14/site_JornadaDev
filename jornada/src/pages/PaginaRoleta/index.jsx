import React, { useRef, useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
} from "@mui/material";
import { ArrowBack as BackIcon } from "@mui/icons-material";

// --- Funções Utilitárias ---
// Converte graus em radianos
const degToRad = (deg) => deg * (Math.PI / 180);

// 🎨 Paleta de Cores & Prêmios (Definida fora dos componentes para evitar recriação)
const colorPalette = ["#6ee7b7", "#64b5f6", "#ffd54f", "#f08080", "#ba68c8"];
const textColor = "#1A202C"; // Texto escuro para contraste
const WHEEL_SIZE = 400; // Tamanho da roleta em pixels
const outerBorderColor = "#38b36d"; // Cor verde vibrante

const roulettePrizes = [
  {
    option: "Funções",
    fullName: "Funções",
    style: { backgroundColor: colorPalette[0], textColor: textColor },
  },
  {
    option: "Variáveis",
    fullName: "Variáveis",
    style: { backgroundColor: colorPalette[1], textColor: textColor },
  },
  {
    option: "Condicionais",
    fullName: "Condicionais",
    style: { backgroundColor: colorPalette[2], textColor: textColor },
  },
  {
    option: "Laços",
    fullName: "Laços",
    style: { backgroundColor: colorPalette[3], textColor: textColor },
  },
  {
    option: "Diversos",
    fullName: "Diversos",
    style: { backgroundColor: colorPalette[4], textColor: textColor },
  },
];

// --- Componente da Roleta Customizada (CustomWheel) ---
const CustomWheel = ({
  prizes,
  mustStartSpinning,
  prizeNumber,
  onStopSpinning,
  spinDuration = 4, // Duração do giro em segundos
  size,
  outerBorderColor,
}) => {
  const canvasRef = useRef(null);
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);

  // Memoizar cálculos para evitar recálculos desnecessários
  const { totalPrizes, degreesPerSegment, radius } = useMemo(() => {
    const total = prizes.length;
    return {
      totalPrizes: total,
      degreesPerSegment: 360 / total,
      radius: size / 2,
    };
  }, [prizes.length, size]);

  // 1. Desenhar a roleta (Canvas)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, size, size);

    // Aplicar a rotação de estado no canvas para desenhar
    ctx.save();
    // A rotação é aplicada via CSS, mas se quisermos desenhar algo fixo,
    // garantimos que o Canvas está no centro correto.
    // O desenho deve ser refeito sempre que os prêmios ou o tamanho mudam.

    prizes.forEach((prize, index) => {
      // Calcular ângulos (iniciando em 0, rodando no sentido horário)
      const startAngle = degToRad(index * degreesPerSegment);
      const endAngle = degToRad((index + 1) * degreesPerSegment);

      // Desenhar o segmento
      ctx.beginPath();
      ctx.moveTo(radius, radius);
      ctx.arc(radius, radius, radius - 10, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = prize.style.backgroundColor;
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Desenhar o texto (Módulos)
      ctx.save();
      ctx.translate(radius, radius);
      // Rodar para o centro do segmento
      ctx.rotate(startAngle + degToRad(degreesPerSegment / 2));

      // Ajustar cor e fonte
      ctx.fillStyle = prize.style.textColor;
      ctx.font = "bold 16px Inter, sans-serif";
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";

      // Posição do texto
      ctx.fillText(prize.option, radius * 0.75, 0);
      ctx.restore();
    });

    // Desenhar o círculo central
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

    ctx.restore(); // Restaurar o estado do Canvas
  }, [prizes, size, degreesPerSegment, radius, outerBorderColor]);

  // 2. Lógica de Animação de Rotação (Giro)
  useEffect(() => {
    if (mustStartSpinning && !isSpinning) {
      setIsSpinning(true);
      const segmentIndex = totalPrizes - 1 - prizeNumber;
      const finalDegree = segmentIndex * degreesPerSegment + degreesPerSegment / 2;
      const minRotations = 10 * 360;
      const currentOffset = rotation % 360;
      const rotationNeeded = finalDegree - currentOffset;
      const normalizedRotationNeeded = rotationNeeded > 0 ? rotationNeeded : rotationNeeded + 360;
      const totalRotation = minRotations + normalizedRotationNeeded;
      setRotation(totalRotation);

      const timer = setTimeout(() => {
        setIsSpinning(false);
        setRotation(totalRotation % 360);
        onStopSpinning();
      }, spinDuration * 1000);

      // ✅ LIMPEZA CORRETA
      return () => {
        clearTimeout(timer);
        setIsSpinning(false);
      };
    }
  }, [mustStartSpinning, prizeNumber]);

  // 3. Estilos de Rotação (Aplicado ao div pai que envolve o Canvas)
  const wheelStyle = {
    transition: isSpinning
      ? `transform ${spinDuration}s cubic-bezier(0.25, 0.1, 0.25, 1)` // Efeito de desaceleração suave
      : "none",
    transform: `rotate(${rotation}deg)`,
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: size,
        height: size,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "50%",
        boxShadow: `0 0 40px -10px ${outerBorderColor}`,
      }}
    >
      {/* Roleta que Gira */}
      <div style={wheelStyle}>
        <canvas ref={canvasRef} width={size} height={size} style={{ display: "block" }} />
      </div>

      {/* Triângulo indicador (Pointer) - Fixo no topo */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: 0,
          height: 0,
          borderLeft: "15px solid transparent",
          borderRight: "15px solid transparent",
          borderBottom: `20px solid #f9fafb`, // Ponteiro Branco/Claro
          filter: `drop-shadow(0 0 5px ${outerBorderColor})`,
          zIndex: 10,
        }}
      ></Box>
    </Box>
  );
};

// --- Componente Principal da Página (App) ---
export default function App() {
  // Use um placeholder simples para navegação e dados
  const navigate = (path) => console.log(`Maps TO: ${path}`);
  const [userData] = useState({
    fases: {
      Funções: 2,
      Variáveis: 1,
      // ... outros dados
    },
  });

  const [loading, setLoading] = useState(false); // Simulação de carregamento

  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [result, setResult] = useState(null);

  // Hook para simular a navegação e autenticação (adaptado)
  useEffect(() => {
    // Aqui seria a lógica de autenticação real
    setLoading(false);
  }, []);

  const handleSpinClick = () => {
    if (mustSpin) return;

    // 1. Número do prêmio aleatório
    const newPrizeNumber = Math.floor(Math.random() * roulettePrizes.length);

    // 2. Define o prêmio e inicia o giro
    setPrizeNumber(newPrizeNumber);
    setMustSpin(true);
    setResult(null);
    console.log(`Girando para o prêmio #${newPrizeNumber} (${roulettePrizes[newPrizeNumber].fullName})`);
  };

  const handleStopSpinning = () => {
    setMustSpin(false);

    // Pega o nome COMPLETO do array
    const challenge = roulettePrizes[prizeNumber].fullName;

    console.log("A sorte decidiu:", challenge);
    setResult(challenge);
  };

  const handleStartChallenge = () => {
    if (!result) return;
    const moduleName = result;
    const levelId = userData?.fases?.[moduleName] || 1;

    console.log(`Iniciando desafio: ${moduleName} no nível ${levelId}`);
    // Simula a navegação real
    // navigate(`/quiz/${encodeURIComponent(moduleName)}/${levelId}`);
    setResult(null); // Fecha o modal
  };

  if (loading || !userData) {
    return (
      <Box className="flex justify-center items-center h-screen bg-gray-900">
        <CircularProgress color="success" />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        p: 3,
        minHeight: "100vh",
        backgroundColor: "#111827", // Fundo escuro
        color: "white",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <IconButton
        onClick={() => navigate("/exercicios")}
        sx={{
          color: "white",
          position: "absolute",
          top: 24,
          left: 24,
          zIndex: 10,
          bgcolor: "rgba(56, 179, 109, 0.1)",
          "&:hover": { bgcolor: "rgba(56, 179, 109, 0.3)" },
        }}
      >
        <BackIcon fontSize="large" />
      </IconButton>

      <Typography
        variant="h3"
        sx={{
          fontWeight: "extrabold",
          mb: 2,
          textAlign: "center",
          color: "#6ee7b7",
          textShadow: "0 0 10px rgba(110, 231, 183, 0.5)",
        }}
      >
        Desafio da Mistura
      </Typography>
      <Typography sx={{ color: "#b0bec5", mb: 8, fontSize: "1.2rem", textAlign: "center" }}>
        Gire a roleta para descobrir o seu próximo desafio de código!
      </Typography>

      {/* Container da Roleta */}
      <Box
        sx={{
          position: "relative",
          width: `${WHEEL_SIZE}px`,
          height: `${WHEEL_SIZE}px`,
          mb: 8,
        }}
      >
        <CustomWheel
          mustStartSpinning={mustSpin}
          prizeNumber={prizeNumber}
          prizes={roulettePrizes}
          onStopSpinning={handleStopSpinning}
          spinDuration={4}
          size={WHEEL_SIZE}
          outerBorderColor={outerBorderColor}
        />
      </Box>

      {/* Botão GIRAR */}
      <Button
        variant="contained"
        onClick={handleSpinClick}
        disabled={mustSpin}
        sx={{
          bgcolor: outerBorderColor,
          color: "#111827", // Texto escuro no botão verde
          fontWeight: "bold",
          fontSize: "1.2rem",
          padding: "12px 48px",
          borderRadius: "16px",
          transition: "all 0.3s ease",
          boxShadow: `0 4px 15px rgba(56, 179, 109, 0.4)`,
          "&:hover": {
            bgcolor: "#2f9a5d",
            transform: "translateY(-2px)",
            boxShadow: `0 6px 20px rgba(56, 179, 109, 0.6)`,
          },
          "&.Mui-disabled": { bgcolor: "#475569", color: "#9e9e9e", boxShadow: "none" },
        }}
      >
        {mustSpin ? <CircularProgress size={28} color="inherit" /> : "GIRAR"}
      </Button>

      {/* Dialog de Resultado */}
      <Dialog
        open={!!result && !mustSpin}
        keepMounted
        onClose={handleStartChallenge}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            background: "#111827",
            color: "white",
            border: `3px solid ${outerBorderColor}`,
            p: 2,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: "bold", textAlign: "center", fontSize: "1.8rem" }}>
          🥳 Desafio Sorteado!
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center" }}>
          <Typography variant="h4" sx={{ fontWeight: "extrabold", color: "#6ee7b7", mb: 2 }}>
            {result}
          </Typography>
          <DialogContentText sx={{ color: "#e0e0e0" }}>
            Você deve completar o quiz deste módulo para avançar!
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: "center" }}>
          <Button
            onClick={handleStartChallenge}
            variant="contained"
            sx={{
              bgcolor: outerBorderColor,
              color: "#111827",
              "&:hover": { bgcolor: "#2f9a5d" },
              borderRadius: "8px",
              px: 4,
              py: 1.5,
              fontWeight: "bold",
            }}
          >
            Começar Agora!
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
