import React, { useState, useEffect } from "react";
import {
  Box, AppBar, Toolbar, Typography, IconButton, Card, CardActionArea,
  CardContent, Paper, BottomNavigation, BottomNavigationAction,
} from "@mui/material";
import {
  Settings, Logout, Home as HomeIcon, ListAlt as ExerciciosIcon,
  OndemandVideo as DicasIcon, Person as PerfilIcon, School as ModuloIcon,
   ArrowBack as BackIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import "./index.css"

export default function PaginaExercicios() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [modulos, setModulos] = useState([]); 
  const [navValue, setNavValue] = useState(1); 

  useEffect(() => {
    const data = localStorage.getItem("userData");
    if (data) {
      const user = JSON.parse(data);
      setUserData(user); 
      
      if (user && user.fases && typeof user.fases === 'object') {
        setModulos(Object.keys(user.fases));
      }
    
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleGoBack = () => {
    navigate("/menu"); 
  };

  const handleLogout = () => {
    localStorage.removeItem("userData");
    navigate("/login");
  };
  const goToDicas = () => { navigate("/dicas"); };
  const goToPerfil = () => { navigate("/perfil"); };

  const handleModuleClick = (nomeModulo) => {
    const levelId = userData?.fases?.[nomeModulo] || 1;
    
    
    
    navigate(`/quiz/${encodeURIComponent(nomeModulo)}/${levelId}`);
    
  
  };


  const handleDesafioClick = () => {
    const levelId = userData?.fases?.["Desafio da Mistura"] || 1;
    navigate(`/quiz/Desafio da Mistura/${levelId}`);
  };


  return (
    <Box className="perfil-layout">
      
      {/* --- CABEÇALHO --- */}
      <AppBar position="static" sx={{ background: "#1e293b", boxShadow: 'none' }}>
        <Toolbar>

          <IconButton color="inherit" onClick={handleGoBack} sx={{ mr: 1 }}>
                      <BackIcon />
                    </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
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

      {/* --- CONTEÚDO CENTRAL --- */}
      <Box 
        className="perfil-content"
        sx={{ paddingBottom: '72px' }}
      >
        <Typography variant="h4" gutterBottom sx={{color: 'white', fontWeight: 700, mb: 4, textAlign: 'center'}}>
          Módulos de Estudo
        </Typography>

        <Box sx={{ width: '100%', maxWidth: 500, display: 'flex', flexDirection: 'column', gap: 3 }}>
          
        
          {modulos.length > 0 ? (
            modulos
              .filter(nomeModulo => nomeModulo !== "Desafio da Mistura")
              .map((nomeModulo) => (
                <Card 
                  key={nomeModulo}
                  sx={{ 
                    borderRadius: '16px', background: 'rgba(30, 41, 59, 0.8)',
                    color: "white", 
                    border: '1px solid rgba(56, 179, 109, 0.3)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                    '&:hover': { 
                      borderColor: '#38b36d', 
                      boxShadow: '0 6px 16px rgba(0,0,0,0.3)' 
                    }
                  }}
                >
                  {/* Chama a função*/}
                  <CardActionArea onClick={() => handleModuleClick(nomeModulo)} sx={{ p: 1.5 }}>
                    <CardContent sx={{display: 'flex', alignItems: 'center', gap: 2.5, p: '0 !important'}}>
                      <ModuloIcon sx={{ fontSize: 45, color: '#6ee7b7' }} />
                      <Box>
                        <Typography variant="h5" component="div" sx={{fontWeight: 600}}>
                          {nomeModulo}
                        </Typography>
                        <Typography variant="body2" sx={{color: '#cbd5e1'}}>
                          Clique para ver os níveis
                        </Typography>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
            ))
          ) : (
            <Typography sx={{ color: '#b0bec5', textAlign: 'center' }}>
              Nenhum módulo de estudo encontrado.
            </Typography>
          )}

          <Card 
            sx={{ 
              borderRadius: '16px', background: 'rgba(30, 41, 59, 0.8)',
              color: "white", 
              border: '1px solid rgba(139, 92, 246, 0.3)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              '&:hover': { 
                borderColor: '#8B5CF6', 
                boxShadow: '0 6px 16px rgba(0,0,0,0.3)' 
              }
            }}
          >
            <CardActionArea onClick={handleDesafioClick} sx={{ p: 1.5 }}>
              <CardContent sx={{display: 'flex', alignItems: 'center', gap: 2.5, p: '0 !important'}}>
                <ModuloIcon sx={{ fontSize: 45, color: '#a78bfa' }} />
                <Box>
                  <Typography variant="h5" component="div" sx={{fontWeight: 600}}>
                    Desafio da Mistura
                  </Typography>
                  <Typography variant="body2" sx={{color: '#cbd5e1'}}>
                    Ir direto para o quiz
                  </Typography>
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>

        </Box>
      </Box>

      {/* --- RODAPÉ --- */}
      <Paper sx={{ 
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: "#1e293b", zIndex: 100, borderTop: '1px solid #334155'
       }} elevation={0}>
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
            "& .MuiBottomNavigationAction-root": { color: "#94a3b8", minWidth: 'auto', padding: '6px 0' },
            "& .Mui-selected": { color: "#6ee7b7 !important" }
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