import React, { useState, useEffect } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  CircularProgress,

  Paper,
  BottomNavigation,
  BottomNavigationAction,
} from "@mui/material";
import {
  Settings,
  Logout,
  Home as HomeIcon,
  ListAlt as ExerciciosIcon,
  OndemandVideo as DicasIcon,
  Person as PerfilIcon,
  ArrowBack as BackIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import "./index.css"; // Reutiliza o CSS do PaginaExercicios

// Importa o componente da roleta
import CustomWheel from "../CustomWheel/index";

// --- Configurações da Roleta (Movido do seu App.js) ---
const colorPalette = ["#6ee7b7", "#64b5f6", "#ffd54f", "#f08080", "#ba68c8"];
const textColor = "#1A202C";
const WHEEL_SIZE = 400;
const outerBorderColor = "#38b36d";
const pointerColor = "#38b36d"; // Cor da seta (do nosso chat anterior)

const roulettePrizes = [
  {option: "Funções", fullName: "Funções", style: { backgroundColor: colorPalette[0], textColor: textColor } },
  { option: "Variáveis", fullName: "Variáveis e Tipos de Dados", style: { backgroundColor: colorPalette[1], textColor: textColor } },
  { option: "Condicionais", fullName: "Condicionais", style: { backgroundColor: colorPalette[2], textColor: textColor } },
  { option: "Laços", fullName: "Laços de Repetição", style: { backgroundColor: colorPalette[3], textColor: textColor } },
  { option: "Diversos", fullName: "Perguntas diversas", style: { backgroundColor: colorPalette[4], textColor: textColor } },
];

// --- Componente da Página ---
export default function PaginaRoleta() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [navValue, setNavValue] = useState(1); // Mantém "Exercícios" selecionado

  // Estado da Roleta (do seu App.js)
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  // const [result, setResult] = useState(null); // <-- Removido (não é mais usado)

  // Carrega dados do usuário (do PaginaExercicios)
  useEffect(() => {
    const data = localStorage.getItem("userData");
    if (data) {
      setUserData(JSON.parse(data));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  // --- Handlers de Navegação (do PaginaExercicios) ---
  const handleGoBack = () => {
    navigate("/exercicios"); // Volta para a lista de exercícios
  };

  const handleLogout = () => {
    localStorage.removeItem("userData");
    navigate("/login");
  };
  const goToDicas = () => navigate("/dicas");
  const goToPerfil = () => navigate("/perfil");

  // --- Handlers da Roleta (do App.js) ---
  const handleSpinClick = () => {
    if (mustSpin) return;
    const newPrizeNumber = Math.floor(Math.random() * roulettePrizes.length);
    setPrizeNumber(newPrizeNumber);
    setMustSpin(true);
    // setResult(null); // <-- Removido (não é mais usado)
  };

  const handleStopSpinning = () => {
    setMustSpin(false);

    // 1. Pega o nome do módulo que a roleta sorteou
    const nomeModuloSorteado = roulettePrizes[prizeNumber].fullName;

    // 2. Pega o level (EXATAMENTE a mesma lógica da PaginaExercicios)
    //    Isso funciona porque você já carrega o 'userData' no useEffect
    const levelId = userData?.fases?.[nomeModuloSorteado] || 1;

    // 3. Navega IMEDIATAMENTE (EXATAMENTE a mesma lógica)
    navigate(`/quiz/${encodeURIComponent(nomeModuloSorteado)}/3`);
  };

  // const handleStartChallenge = () => { ... }; // <-- Removido (não é mais usado)

  return (
    <Box className="perfil-layout">
      {/* --- CABEÇALHO (do PaginaExercicios) --- */}
      <AppBar position="static" sx={{ background: "#1e293b", boxShadow: "none" }}>
        <Toolbar>
          <IconButton color="inherit" onClick={handleGoBack} sx={{ mr: 1 }}>
            <BackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: "bold" }}>
            Desafio da Roleta 
          </Typography>
          <IconButton color="inherit" onClick={() => navigate("/configuracoes")}>
            <Settings />
          </IconButton>
          <IconButton color="inherit" onClick={handleLogout}>
            <Logout />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* --- CONTEÚDO CENTRAL (Roleta do App.js) --- */}
      {/* Usamos a classe "perfil-content" para centralizar o conteúdo */}
      <Box className="perfil-content" sx={{ paddingBottom: "72px" }}>
        
        {/* Títulos da roleta (do App.js) */}
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
           Desafio da Roleta 
        </Typography>
        <Typography sx={{ color: "#b0bec5", mb: 8, fontSize: "1.2rem", textAlign: "center" }}>
          Gire a roleta para descobrir o seu próximo desafio de código!
        </Typography>

        {/* Container da Roleta (do App.js) */}
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
            pointerColor={pointerColor} // Passando a cor da seta
          />
        </Box>

        {/* Botão GIRAR (do App.js) */}
        <Button
          variant="contained"
          onClick={handleSpinClick}
          disabled={mustSpin}
          sx={{
            bgcolor: outerBorderColor,
            color: "#111827",
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

      </Box>

      {/* --- RODAPÉ (do PaginaExercicios) --- */}
      <Paper
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "#1e293b",
          zIndex: 100,
          borderTop: "1px solid #334155",
        }}
        elevation={0}
      >
        <BottomNavigation
          showLabels
          value={navValue}
          onChange={(event, newValue) => {
            setNavValue(newValue);
            if (newValue === 0) navigate("/menu");
            if (newValue === 1) navigate("/exercicios");
            if (newValue === 2) goToDicas();
            if (newValue === 3) goToPerfil();
          }}
          sx={{
            background: "transparent",
            "& .MuiBottomNavigationAction-root": { color: "#94a3b8", minWidth: "auto", padding: "6px 0" },
            "& .Mui-selected": { color: "#6ee7b7 !important" },
          }}
        >
          <BottomNavigationAction label="Home" icon={<HomeIcon />} />
          <BottomNavigationAction label="Exercícios" icon={<ExerciciosIcon />} />
          <BottomNavigationAction label="Dicas" icon={<DicasIcon />} />
          <BottomNavigationAction label="Perfil" icon={<PerfilIcon />} />
        </BottomNavigation>
      </Paper>

      {/* --- DIALOG DE RESULTADO (Removido) --- */}
      
    </Box>
  );
}