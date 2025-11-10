import React, { useState } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Switch,
  BottomNavigation,
  BottomNavigationAction,
  ListItemButton, 
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button, 
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
  ChevronRight as ArrowRightIcon,
  HelpOutline as HelpIcon, 
  Description as DescriptionIcon, 
  PrivacyTip as PrivacyIcon, 
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import "./index.css";

export default function PaginaConfiguracoes() {
  const navigate = useNavigate();
  const [navValue, setNavValue] = useState(null);
  const [notificacoes, setNotificacoes] = useState(true);

  const [dialogAberto, setDialogAberto] = useState(false);

  const handleGoBack = () => {
    navigate(-1); 
  };

  const handleAbrirDialogSair = () => {
    setDialogAberto(true); 
  };

  const handleFecharDialogSair = () => {
    setDialogAberto(false); 
  };

  const handleConfirmarSair = () => {
    localStorage.removeItem("userData");
    setDialogAberto(false);
    navigate("/login");
  };

  const SectionHeader = ({ title }) => (
    <Typography
      variant="overline"
      sx={{
        color: "#94a3b8",
        fontWeight: "bold",
        padding: "16px 0 8px",
        display: "block",
        width: "90%",
        maxWidth: 500,
        margin: "0 auto",
      }}
    >
      {title}
    </Typography>
  );

  const ListCard = (props) => (
    <Paper
      elevation={0}
      sx={{
        background: "rgba(30, 41, 59, 0.6)",
        border: "1px solid #334155",
        borderRadius: "16px",
        overflow: "hidden", 
        mb: 3,
        width: "90%",
        maxWidth: 500,
        margin: "0 auto",
      }}
      {...props}
    />
  );

  return (
    <Box className="perfil-layout">
      {/* --- CABEÇALHO --- */}
      <AppBar
        position="static"
        sx={{
          background: "linear-gradient(to right, #1e293b)",
          boxShadow: "none",
        }}
      >
        <Toolbar>
          <IconButton color="inherit" onClick={handleGoBack} sx={{ mr: 2 }}>
            <BackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: "bold" }}>
            Configurações
          </Typography>
        </Toolbar>
      </AppBar>

      {/* --- CONTEÚDO CENTRAL --- */}
      <Box className="perfil-content" sx={{ alignItems: "center" }}>
        <SectionHeader title="Conta" />
        <ListCard>
          <List sx={{ p: 0 }}>
            <ListItemButton onClick={() => navigate("/perfil/editar")}>
              <ListItemIcon>
                <EditIcon sx={{ color: "#6ee7b7" }} />
              </ListItemIcon>
              <ListItemText primary="Editar Perfil" sx={{ color: "white" }} />
              <ArrowRightIcon sx={{ color: "#94a3b8" }} />
            </ListItemButton>
            <Divider component="li" sx={{ bgcolor: "rgba(255,255,255,0.1)" }} />
            <ListItemButton onClick={() => navigate("/mudar-senha")}>
              {" "}
              <ListItemIcon>
                <LockIcon sx={{ color: "#6ee7b7" }} />
              </ListItemIcon>
              <ListItemText primary="Mudar Senha" sx={{ color: "white" }} />
              <ArrowRightIcon sx={{ color: "#94a3b8" }} />
            </ListItemButton>
          </List>
        </ListCard>

        <SectionHeader title="Preferências" />
        <ListCard>
          <List sx={{ p: 0 }}>
            <ListItem>
              {" "}
              <ListItemIcon>
                <NotificationsIcon sx={{ color: "#6ee7b7" }} />
              </ListItemIcon>
              <ListItemText primary="Notificações Push" sx={{ color: "white" }} />
              <Switch
                checked={notificacoes}
                onChange={() => setNotificacoes(!notificacoes)}
                color="success" 
                sx={{
                  "& .MuiSwitch-thumb": { bgcolor: notificacoes ? "#6ee7b7" : "#94a3b8" },
                  "& .Mui-checked + .MuiSwitch-track": {
                    backgroundColor: "#38b36d !important",
                  },
                }}
              />
            </ListItem>
          </List>
        </ListCard>

        <SectionHeader title="Ajuda & Suporte" />
        <ListCard>
          <List sx={{ p: 0 }}>
            <ListItemButton onClick={() => alert("Abrir link do Fale Conosco!")}>
              <ListItemIcon>
                <HelpIcon sx={{ color: "#a78bfa" }} />
              </ListItemIcon>
              <ListItemText primary="Fale Conosco" sx={{ color: "white" }} />
              <ArrowRightIcon sx={{ color: "#94a3b8" }} />
            </ListItemButton>
          </List>
        </ListCard>

        <SectionHeader title="Sobre" />
        <ListCard>
          <List sx={{ p: 0 }}>
            <ListItemButton onClick={() => alert("Abrir Termos de Uso!")}>
              <ListItemIcon>
                <DescriptionIcon sx={{ color: "#94a3b8" }} />
              </ListItemIcon>
              <ListItemText primary="Termos de Uso" sx={{ color: "white" }} />
            </ListItemButton>
            <Divider component="li" sx={{ bgcolor: "rgba(255,255,255,0.1)" }} />
            <ListItemButton onClick={() => alert("Abrir Política de Privacidade!")}>
              <ListItemIcon>
                <PrivacyIcon sx={{ color: "#94a3b8" }} />
              </ListItemIcon>
              <ListItemText primary="Política de Privacidade" sx={{ color: "white" }} />
            </ListItemButton>
          </List>
        </ListCard>

       <SectionHeader title="Ações" sx={{ backgroundColor: "transparent" }} />
 <ListCard
 sx={{
 border: "1px solid rgba(220, 38, 38, 0.4)",
 background: "rgba(30, 41, 59, 0.6)", 
 boxShadow: "0 0 12px rgba(220, 38, 38, 0.25)",
 transition: "all 0.3s ease",
 mb: 5, 
 "&:hover": {
 boxShadow: "0 0 20px rgba(220, 38, 38, 0.5)",
 transform: "translateY(-2px)",
 },
 }}
 >
 <List sx={{ p: 0 }}>
 <ListItemButton onClick={handleAbrirDialogSair}>
 <ListItemIcon
  sx={{ minWidth: 40 }} 
 >
  <Logout sx={{ color: "#ef4444" }} />
 </ListItemIcon>
 <ListItemText
  primary="Sair da Conta"
  sx={{
  color: "#fca5a5",
  fontWeight: 600,
  ml: -1, 
  }}
 />
 </ListItemButton>
 </List>
 </ListCard>
      </Box>

      <Paper
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "#1e293b",
          zIndex: 100,
        }}
        elevation={3}
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

      <Dialog
        open={dialogAberto}
        onClose={handleFecharDialogSair}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          sx: {
            background: "#1e293b",
            color: "white",
            borderRadius: "16px",
            border: "1px solid #334155",
          },
        }}
      >
        <DialogTitle id="alert-dialog-title" sx={{ fontWeight: "bold" }}>
          {"Sair da Conta"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" sx={{ color: "#b0bec5" }}>
            Tem certeza de que deseja sair? Você precisará fazer login novamente.
          </DialogContentText>
        </DialogContent>
        <DialogActions
          sx={{
            p: "16px 24px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button
            onClick={handleFecharDialogSair}
            sx={{
              color: "#94a3b8",
              fontWeight: "600",
              textTransform: "none",
              borderRadius: "10px",
              px: 2,
              "&:hover": {
                color: "#6ee7b7",
                background: "rgba(110, 231, 183, 0.1)",
              },
            }}
          >
            Cancelar
          </Button>

          <Button
            onClick={handleConfirmarSair}
            autoFocus
            sx={{
              background: "linear-gradient(90deg, #38b36d, #6ee7b7)",
              color: "#0f172a",
              fontWeight: "700",
              textTransform: "none",
              px: 3,
              borderRadius: "12px",
              boxShadow: "0 0 12px rgba(110, 231, 183, 0.4)",
              transition: "all 0.3s ease",
              "&:hover": {
                background: "linear-gradient(90deg, #6ee7b7, #38b36d)",
                boxShadow: "0 0 18px rgba(110, 231, 183, 0.6)",
                transform: "translateY(-2px)",
              },
            }}
          >
            Sair
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
