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

const API_URL = "https://projeto-codepath.onrender.com";

export default function Paginamenu() {
  const navigate = useNavigate();
  const { moduleName } = useParams();
  const decodedModuleName = moduleName ? decodeURIComponent(moduleName) : "Módulo";

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

  

  return (
    <Box className="perfil-layout">
      {/* CABEÇALHO */}
      <AppBar
        position="static"
        sx={{
          background: "linear-gradient(to right, #1e293b, #334155)",
          boxShadow: 'none'
        }}
      >
        <Toolbar>
          
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Menu
          </Typography>
          <IconButton color="inherit" onClick={() => navigate("/configuracoes")}>
            <Settings />
          </IconButton>
          <IconButton color="inherit" onClick={handleLogout}>
            <Logout />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* CONTEÚDO CENTRAL */}
      <Box className="perfil-content">
        <Typography
          variant="h4"
          gutterBottom
          sx={{ color: 'white', fontWeight: 700, mb: 4, textAlign: 'center' }}
        >
          O que deseja fazer?
        </Typography>

        <Box sx={{ width: '100%', maxWidth: 500, display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Card Dicas */}
          <Card sx={{
            borderRadius: '16px',
            background: 'rgba(30, 41, 59, 0.8)',
            color: "white",
            border: '1px solid rgba(56, 179, 109, 0.3)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            '&:hover': { borderColor: '#38b36d', boxShadow: '0 6px 16px rgba(0,0,0,0.3)' }
          }}>
            <CardActionArea onClick={goToDicas} sx={{ p: 1.5 }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2.5, p: '0 !important' }}>
                <DicasIcon sx={{ fontSize: 45, color: '#6ee7b7' }} />
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>Dicas de Vídeos</Typography>
                  <Typography variant="body2" sx={{ color: '#cbd5e1' }}>Veja vídeos de apoio para este módulo.</Typography>
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>

          {/* Card Exercícios */}
          <Card sx={{
            borderRadius: '16px',
            background: 'rgba(30, 41, 59, 0.8)',
            color: "white",
            border: '1px solid rgba(56, 179, 109, 0.3)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            '&:hover': { borderColor: '#38b36d', boxShadow: '0 6px 16px rgba(0,0,0,0.3)' }
          }}>
            <CardActionArea onClick={goToExerciciosQuiz} sx={{ p: 1.5 }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2.5, p: '0 !important' }}>
                <ExerciciosIcon sx={{ fontSize: 45, color: '#6ee7b7' }} />
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>Iniciar Exercícios</Typography>
                  <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
                    Começar os exercícios de {decodedModuleName}.
                  </Typography>
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
        </Box>
      </Box>

      {/* RODAPÉ */}
      <Paper sx={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: "#1e293b", zIndex: 100, borderTop: '1px solid #334155'
      }} elevation={0}>
        <BottomNavigation
          showLabels
          value={navValue}
          onChange={(event, newValue) => {
            setNavValue(newValue);
            if (newValue === 0) navigate("/menu/");
            if (newValue === 1) navigate("/exercicios");
            if (newValue === 2) navigate("/dicas");
            if (newValue === 3) navigate("/perfil");
          }}
          sx={{
            background: "transparent",
            "& .MuiBottomNavigationAction-root": { color: "#94a3b8", minWidth: 'auto', padding: '6px 0' },
            "& .Mui-selected": { color: "#6ee7b7 !important", '& .MuiSvgIcon-root': { transform: 'scale(1.1)' } }
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
