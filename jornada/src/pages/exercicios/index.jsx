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
  School as ModuloIcon,
  ArrowBack as BackIcon,
  ArrowBackIosNew,
  ArrowForwardIos,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import "./index.css";

const moduleColors = {
  "Variáveis e Tipos de Dados": { main: "#6ee7b7", border: "rgba(110, 231, 183, 0.5)" },
  Condicionais: { main: "#facc15", border: "rgba(250, 204, 21, 0.5)" },
  "Laços de Repetição": { main: "#fb923c", border: "rgba(251, 146, 60, 0.5)" },
  Funções: { main: "#a78bfa", border: "rgba(167, 139, 250, 0.5)" },
  "Perguntas diversas": { main: "#38b36d", border: "rgba(56, 179, 109, 0.5)" },
};

export default function PaginaExercicios() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [modulos, setModulos] = useState([]);
  const [navValue, setNavValue] = useState(1);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);

  useEffect(() => {
    const data = localStorage.getItem("userData");
    if (data) {
      const user = JSON.parse(data);
      setUserData(user);
      const modulosFixos = [
        "Variáveis e Tipos de Dados",
        "Condicionais",
        "Laços de Repetição",
        "Funções",
        "Perguntas diversas",
      ];
      setModulos(modulosFixos);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleGoBack = () => navigate("/menu");
  const handleLogout = () => {
    localStorage.removeItem("userData");
    navigate("/login");
  };
  const goToDicas = () => navigate("/dicas");
  const goToPerfil = () => navigate("/perfil");
  const handleModuleClick = (nomeModulo) => {
    const levelId = userData?.fases?.[nomeModulo] || 1;
    navigate(`/quiz/${encodeURIComponent(nomeModulo)}/${levelId}`);
  };
  const goToPrevModule = () => {
    setCurrentModuleIndex((prevIndex) => (prevIndex === 0 ? modulos.length - 1 : prevIndex - 1));
  };
  const goToNextModule = () => {
    setCurrentModuleIndex((prevIndex) => (prevIndex === modulos.length - 1 ? 0 : prevIndex + 1));
  };
  const handleCarouselClick = (index, nomeModulo) => {
    if (index === currentModuleIndex) {
      handleModuleClick(nomeModulo);
    } else if (index === (currentModuleIndex + 1) % modulos.length) {
      goToNextModule();
    } else if (index === (currentModuleIndex - 1 + modulos.length) % modulos.length) {
      goToPrevModule();
    }
  };
  const getCardPositionClass = (index) => {
    if (index === currentModuleIndex) return "carousel-item-center";
    if (index === (currentModuleIndex + 1) % modulos.length) return "carousel-item-right";
    if (index === (currentModuleIndex - 1 + modulos.length) % modulos.length) return "carousel-item-left";
    return "carousel-item-hidden";
  };
  const getModuleColors = (nomeModulo) => {
    return moduleColors[nomeModulo] || { main: "#6ee7b7", border: "rgba(56, 179, 109, 0.5)" };
  };

  return (
    <Box className="perfil-layout">
      <AppBar position="static" sx={{ background: "#1e293b", boxShadow: "none" }}>
        <Toolbar>
          <IconButton color="inherit" onClick={handleGoBack} sx={{ mr: 1 }}>
            <BackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: "bold" }}></Typography>
          <IconButton color="inherit" onClick={() => navigate("/configuracoes")}>
            <Settings />
          </IconButton>
          <IconButton color="inherit" onClick={handleLogout}>
            <Logout />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box className="perfil-content" sx={{ paddingBottom: "72px" }}>
        <Box sx={{ width: "100%", maxWidth: 500, display: "flex", flexDirection: "column", gap: 3 }}>
          <Typography
            variant="h3" 
            gutterBottom
            sx={{
              color: "white",
              fontWeight: 800, 
              mb: 7,
              textAlign: "start",
              textShadow: "0 0 10px rgba(110, 231, 183, 0.4)", 
            }}
          >
            Módulos de Estudo
          </Typography>

          <Box className="carousel-3d-wrapper">
            <IconButton onClick={goToPrevModule} className="carousel-arrow prev">
              <ArrowBackIosNew />
            </IconButton>

            <Box className="carousel-3d-container">
              {modulos.length > 0 ? (
                modulos
                  .filter((nomeModulo) => nomeModulo !== "Desafio da Mistura")
                  .map((nomeModulo, index) => {
                    const colors = getModuleColors(nomeModulo);
                    return (
                      <Box key={nomeModulo} className={`card-3d-hover ${getCardPositionClass(index)}`}>
                        <Card
                          sx={{
                            width: "100%",
                            height: "100%",
                            borderRadius: "24px",
                            background: "rgba(30, 41, 59, 0.8)",
                            color: "white",
                            border: `2px solid ${colors.border}`,
                            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                            "&:hover": {
                              borderColor: colors.main,
                              boxShadow: `0 6px 16px rgba(0,0,0,0.3), 0 0 15px ${colors.main}50`,
                            },
                          }}
                        >
                          <CardActionArea
                            onClick={() => handleCarouselClick(index, nomeModulo)}
                            sx={{ p: 2, height: "100%" }}
                          >
                            <CardContent
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                gap: 2,
                                p: "0 !important",
                                height: "100%",
                              }}
                            >
                              <ModuloIcon sx={{ fontSize: 60, color: colors.main }} />
                              <Box sx={{ textAlign: "center" }}>
                                <Typography variant="h5" component="div" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                                  {nomeModulo}
                                </Typography>
                                <Typography variant="body2" sx={{ color: "#cbd5e1", mt: 0.5 }}>
                                  Clique para ver
                                </Typography>
                              </Box>
                            </CardContent>
                          </CardActionArea>
                        </Card>
                      </Box>
                    );
                  })
              ) : (
                <Typography sx={{ color: "#b0bec5", textAlign: "center" }}>Nenhum módulo encontrado.</Typography>
              )}
            </Box>

            <IconButton onClick={goToNextModule} className="carousel-arrow next">
              <ArrowForwardIos />
            </IconButton>
          </Box>
        </Box>
      </Box>

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
    </Box>
  );
}
