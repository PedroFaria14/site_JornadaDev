import React, { useState, useEffect } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Card,
  CardActionArea,
  CardContent,
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
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import "./index.css";

export default function PaginaModulo() {
  const navigate = useNavigate();
  const { moduleName } = useParams();
  const [userData, setUserData] = useState(null);
  const [navValue, setNavValue] = useState(0); // Exercícios ativo

  // --- Carrega os dados do usuário ---
  useEffect(() => {
    const data = localStorage.getItem("userData");
    if (data) {
      setUserData(JSON.parse(data));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  // --- Função de Logout ---
  const handleLogout = () => {
    localStorage.removeItem("userData");
    navigate("/login");
  };

  // --- Navegação dos cards ---
  const goToDicas = () => {
    navigate(`/dicas/${moduleName}`);
  };

  const goToExercicios = () => {
    navigate(`/quiz/${moduleName}`);
  };

  const goToPerfil = () => {
    navigate("/perfil");
  };

  return (
    <Box className="home-layout">
      {/* --- 1. CABEÇALHO --- */}
      <AppBar position="static" sx={{ background: "#1e293b" }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Olá, {userData?.nome?.split(" ")[0] || "Usuário"}
          </Typography>
         <IconButton color="inherit" onClick={() => navigate("/configuracoes")}>
  <Settings />
</IconButton>
          <IconButton color="inherit" onClick={handleLogout}>
            <Logout />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* --- 2. CONTEÚDO --- */}
      <Box className="home-content">
        <Typography
          variant="h4"
          gutterBottom
          sx={{ color: "white", fontWeight: "bold", mb: 3 }}
        >
          Venha Aprender
        </Typography>

        <Box
          sx={{
            width: "100%",
            maxWidth: 500,
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          {/* --- Card 1: Dicas de Vídeos --- */}
          <Card
            sx={{
              width: "100%",
              background: "rgba(18, 25, 49, 0.85)",
              color: "white",
              border: "1px solid #334155",
              borderRadius: "16px",
            }}
          >
            <CardActionArea onClick={goToDicas}>
              <CardContent
                sx={{ display: "flex", alignItems: "center", gap: 2 }}
              >
                <DicasIcon sx={{ fontSize: 40, color: "#38b36d" }} />
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                    Dicas de Vídeos
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#b0bec5" }}>
                    Veja vídeos de apoio para este módulo.
                  </Typography>
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>

          {/* --- Card 2: Iniciar Exercícios --- */}
          <Card
            sx={{
              width: "100%",
              background: "rgba(18, 25, 49, 0.85)",
              color: "white",
              border: "1px solid #334155",
              borderRadius: "16px",
            }}
          >
            <CardActionArea onClick={goToExercicios}>
              <CardContent
                sx={{ display: "flex", alignItems: "center", gap: 2 }}
              >
                <ExerciciosIcon sx={{ fontSize: 40, color: "#38b36d" }} />
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                    Iniciar Exercícios
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#b0bec5" }}>
                    Começar os exercícios.
                  </Typography>
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
        </Box>
      </Box>

      {/* --- 3. RODAPÉ --- */}
      <Paper
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "#1e293b",
        }}
        elevation={3}
      >
        <BottomNavigation
  showLabels
  value={navValue}
  onChange={(event, newValue) => {
    setNavValue(newValue);
    if (newValue === 0) navigate("/modulo");               // Home
    if (newValue === 1) navigate("/exercicios");     // Exercícios
    if (newValue === 2) navigate("/dicas");          // Dicas
    if (newValue === 3) navigate("/perfil");         // Perfil
  }}
  sx={{
    background: "transparent",
    "& .MuiBottomNavigationAction-root": { color: "#b0bec5" },
    "& .Mui-selected": { color: "#38b36d !important" },
  }}
>
  <BottomNavigationAction label="Home" icon={<HomeIcon />} />
  <BottomNavigationAction label="Exercícios" icon={<ExerciciosIcon />} />
  <BottomNavigationAction label="Dicas" icon={<DicasIcon />} />
  <BottomNavigationAction label="Perfil" icon={<PerfilIcon />} />
</BottomNavigation>
      </Paper>
    </Box>
  );
}
