import React, { useState } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Card,
  CardContent,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Switch, // Para o toggle de Notificações
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
  Edit as EditIcon,
  Lock as LockIcon,
  Notifications as NotificationsIcon,
  ChevronRight as ArrowRightIcon, // Ícone de seta
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
// 1. Reutilize o CSS do Perfil para manter o layout
import "./index.css";

export default function PaginaConfiguracoes() {
  const navigate = useNavigate();
  // 2. Deixa o ícone "Home" ativo (ou 'null' para nenhum)
  const [navValue, setNavValue] = useState(null); 
  const [notificacoes, setNotificacoes] = useState(true); // Estado do toggle

  // --- Função de Logout ---
  const handleLogout = () => {
    localStorage.removeItem("userData");
    navigate("/login");
  };

  // --- Função para voltar ---
  const handleGoBack = () => {
    navigate(-1); // Volta para a página anterior (Home, Perfil, etc.)
  };

  return (
    // 3. USA O LAYOUT CSS DO PERFIL
    <Box className="perfil-layout">
      
      {/* --- 1. CABEÇALHO (NAV SUPERIOR) --- */}
      <AppBar position="static" 
        sx={{ 
          background: "linear-gradient(to right, #1e293b, #334155)",
          boxShadow: 'none'
        }}
      >
        <Toolbar>
          <IconButton color="inherit" onClick={handleGoBack} sx={{ mr: 2 }}>
            <BackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Configurações
          </Typography>
          {/* (O ícone de Configurações não precisa estar na própria pág. de config) */}
        </Toolbar>
      </AppBar>

      {/* --- 2. CONTEÚDO CENTRAL (LISTA DE OPÇÕES) --- */}
      <Box className="perfil-content">
        
        {/* --- Card "Conta" --- */}
        <Typography variant="h6" sx={{ color: '#b0bec5', width: '90%', maxWidth: 500, mt: 2, mb: 1, fontWeight: 'bold' }}>
          Conta
        </Typography>
        <Card sx={{ 
            width: '90%', maxWidth: 500, mb: 3,
            background: "rgba(30, 41, 59, 0.9)", color: "white",
            borderRadius: '16px', border: '1px solid rgba(56, 179, 109, 0.4)'
        }}>
          <List sx={{ p: 0 }}>
            {/* Editar Perfil */}
            <ListItem button onClick={() => navigate("/perfil/editar")}>
              <ListItemIcon><EditIcon sx={{ color: '#6ee7b7' }} /></ListItemIcon>
              <ListItemText primary="Editar Perfil" />
              <ArrowRightIcon sx={{ color: '#94a3b8' }} />
            </ListItem>
            <Divider component="li" sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
            {/* Mudar Senha */}
            <ListItem button onClick={() => alert("Página de Mudar Senha (a criar)")}>
              <ListItemIcon><LockIcon sx={{ color: '#6ee7b7' }} /></ListItemIcon>
              <ListItemText primary="Mudar Senha" />
              <ArrowRightIcon sx={{ color: '#94a3b8' }} />
            </ListItem>
          </List>
        </Card>

        {/* --- Card "Preferências" --- */}
        <Typography variant="h6" sx={{ color: '#b0bec5', width: '90%', maxWidth: 500, mb: 1, fontWeight: 'bold' }}>
          Preferências
        </Typography>
        <Card sx={{ 
            width: '90%', maxWidth: 500, mb: 3,
            background: "rgba(30, 41, 59, 0.9)", color: "white",
            borderRadius: '16px', border: '1px solid rgba(56, 179, 109, 0.4)'
        }}>
          <List sx={{ p: 0 }}>
            {/* Notificações */}
            <ListItem>
              <ListItemIcon><NotificationsIcon sx={{ color: '#6ee7b7' }} /></ListItemIcon>
              <ListItemText primary="Notificações Push" />
              <Switch
                checked={notificacoes}
                onChange={() => setNotificacoes(!notificacoes)}
                color="success"
              />
            </ListItem>
          </List>
        </Card>

        {/* --- Card "Ações" --- */}
        <Typography variant="h6" sx={{ color: '#b0bec5', width: '90%', maxWidth: 500, mb: 1, fontWeight: 'bold' }}>
          Ações
        </Typography>
        <Card sx={{ 
            width: '90%', maxWidth: 500, mb: 3,
            background: "rgba(30, 41, 59, 0.9)", color: "white",
            borderRadius: '16px', border: '1px solid rgba(220, 38, 38, 0.4)' // Borda vermelha
        }}>
          {/* Sair da Conta */}
          <List sx={{ p: 0 }}>
            <ListItem button onClick={handleLogout}>
              <ListItemIcon><Logout sx={{ color: '#dc2626' }} /></ListItemIcon>
              <ListItemText primary="Sair da Conta" sx={{ color: '#f87171' }} />
            </ListItem>
          </List>
        </Card>

      </Box>

      {/* --- 3. RODAPÉ (NAV INFERIOR) --- */}
      <Paper 
        sx={{ 
          position: 'fixed', bottom: 0, left: 0, right: 0,
          background: "#1e293b", zIndex: 100 
        }} 
        elevation={3}
      >
        <BottomNavigation
          showLabels
          value={navValue} // Nenhum ícone ativo
          onChange={(event, newValue) => {
            setNavValue(newValue);
            if (newValue === 0) navigate("/modulo");
            if (newValue === 1) navigate("/exercicios");
            if (newValue === 2) alert("Navegar para Dicas!"); // navigate("/dicas");
            if (newValue === 3) navigate("/perfil"); 
          }}
          sx={{ 
            background: "transparent",
            "& .MuiBottomNavigationAction-root": { color: "#b0bec5" },
            "& .Mui-selected": { color: "#38b36d !important" }
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