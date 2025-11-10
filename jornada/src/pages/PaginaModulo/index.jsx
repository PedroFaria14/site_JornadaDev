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
  Button,
  Divider,
} from "@mui/material";
import {
  Settings,
  Logout,
  Home as HomeIcon,
  ListAlt as ExerciciosIcon,
  OndemandVideo as DicasIcon,
  Person as PerfilIcon,
  Casino as RoletaIcon,
  PlayArrow as PlayIcon,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import "./index.css"; 

const API_URL = "https://projeto-codepath.onrender.com";

export default function Paginamenu() {
  const navigate = useNavigate();
  const { moduleName } = useParams();
  const [userData, setUserData] = useState(null);
  const [navValue, setNavValue] = useState(0);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const data = localStorage.getItem("userData");
      if (!data) {
        navigate("/login");
        return;
      }

      const { email } = JSON.parse(data);

      try {
        const response = await fetch(`${API_URL}/profile/${email}`);
        if (!response.ok) throw new Error("Erro ao buscar perfil");

        const result = await response.json();
        if (result.success) {
          setUserData(result.user);
        } else {
          console.error("Erro no backend:", result.message);
        }
      } catch (error) {
        console.error("Erro ao buscar perfil:", error);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userData");
    navigate("/login");
  };
  const goToDicas = () => {
    navigate("/dicas");
  };
  const goToPerfil = () => {
    navigate("/perfil");
  };
  const goToExerciciosQuiz = () => {
    navigate(`/exercicios`);
  };
  const handleDesafioClick = () => {
    navigate(`/roleta`);
  };

  const renderCardFront = (icon, title, iconColor) => (
    <Box
      className="card-face card-front"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        p: 2,
      }}
    >
      {React.cloneElement(icon, { sx: { fontSize: 70, color: iconColor } })}
      <Typography variant="h5" sx={{ fontWeight: 700, mt: 1, textAlign: "center" }}>
        {title}
      </Typography>
    </Box>
  );

  const renderCardBack = (title, description, actionText, onClick, iconColor) => (
    <Box
      className="card-face card-back"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        p: 2,
        transform: "rotateY(180deg)",
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 600, textAlign: "center" }}>
        {title}
      </Typography>
      <Typography variant="body2" sx={{ color: "#cbd5e1", mt: 1, mb: 2, textAlign: "center" }}>
        {description}
      </Typography>
      <Button
        variant="contained"
        startIcon={<PlayIcon />}
        onClick={onClick}
        sx={{
          mt: 2,
          bgcolor: iconColor,
          "&:hover": { bgcolor: iconColor.replace(")", ", 0.8)") },
          color: "black", 
          fontWeight: "bold",
        }}
      >
        {actionText}
      </Button>
    </Box>
  );

  return (
    <Box className="perfil-layout">
      <AppBar
        position="static"
        sx={{
          background: "linear-gradient(to right, #1e293b)",
          boxShadow: "none",
        }}
      >
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}></Typography>
          <IconButton color="inherit" onClick={() => navigate("/configuracoes")}>
            <Settings />
          </IconButton>
          <IconButton color="inherit" onClick={handleLogout}>
            <Logout />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box className="perfil-content">
        <Typography
          variant="h3"
          gutterBottom
          sx={{
            color: "white",
            fontWeight: 800,
            mb: 2, 
            textAlign: "center",
            textShadow: "0 0 10px rgba(110, 231, 183, 0.4)",
          }}
        >
          O que deseja fazer?
        </Typography>

        <Divider
          sx={{
            width: "100px",
            height: "2px",
            mb: 16,
            background: "linear-gradient(to right, transparent, #6ee7b7, transparent)",
            opacity: 0.6,
          }}
        />

        <Box
          className="card-container-3d"
          sx={{
            width: "100%",
            maxWidth: 1000,
            display: "flex",
            flexWrap: "wrap", 
            justifyContent: "center",
            gap: 3,
            overflow: "visible",
            px: 2,
          }}
        >
          <Card
            className="flip-card"
            sx={{
              width: { xs: "90%", md: "28%" },
              aspectRatio: "1/1",
              background: "transparent",
              boxShadow: "none",
              border: "none",
            }}
          >
            <Box
              className="card-inner"
              sx={{
                border: "2px solid rgba(56, 179, 109, 0.3)",
                borderRight: "2px solid rgba(56, 179, 109, 0.3)",

                backgroundColor: "rgba(30, 41, 59, 0.8)",
              }}
            >
              {renderCardFront(<ExerciciosIcon />, "Iniciar Exercícios", "#6ee7b7")}
              {renderCardBack(
                "Iniciar Exercícios",
                "Comece sua jornada de aprendizado nos módulos interativos.",
                "Explorar",
                goToExerciciosQuiz,
                "#6ee7b7"
              )}
            </Box>
          </Card>

          <Card
            className="flip-card roleta-card-focal-point" 
            sx={{
              width: { xs: "90%", md: "28%" },
              aspectRatio: "1/1",
              background: "transparent",
              boxShadow: "none",
              border: "none",
            }}
          >
            <Box
              className="card-inner" 
              sx={{
                border: "2px solid rgba(139, 92, 246, 0.3)",
                borderRadius: "16px",
                backgroundColor: "rgba(30, 41, 59, 0.8)",
              }}
            >
              {renderCardFront(<RoletaIcon />, "Desafio da Roleta", "#a78bfa")}
              {renderCardBack(
                "Desafio da Roleta",
                "Gire a roleta e teste seus conhecimentos com perguntas aleatórias!",
                "Girar Roleta",
                handleDesafioClick,
                "#a78bfa"
              )}
            </Box>
          </Card>

          <Card
            className="flip-card"
            sx={{
              width: { xs: "90%", md: "28%" },
              aspectRatio: "1/1",
              background: "transparent",
              boxShadow: "none",
              border: "none",
            }}
          >
            <Box
              className="card-inner"
              sx={{
                border: "2px solid rgba(110, 231, 183, 0.3)",
                borderRadius: "16px",
                backgroundColor: "rgba(30, 41, 59, 0.8)",
              }}
            >
              {renderCardFront(<DicasIcon />, "Dicas de Vídeos", "#6ee7b7")}
              {renderCardBack(
                "Dicas de Vídeos",
                "Assista a vídeos explicativos para reforçar seu aprendizado.",
                "Ver Dicas",
                goToDicas,
                "#6ee7b7"
              )}
            </Box>
          </Card>
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
            if (newValue === 2) navigate("/dicas");
            if (newValue === 3) navigate("/perfil");
          }}
          sx={{
            background: "transparent",
            "& .MuiBottomNavigationAction-root": { color: "#94a3b8", minWidth: "auto", padding: "6px 0" },
            "& .Mui-selected": { color: "#6ee7b7 !important", "& .MuiSvgIcon-root": { transform: "scale(1.1)" } },
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
