import React, { useState, useEffect } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Card,
  CardContent,
  Paper,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Avatar,
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
  Email,
  Phone,
  Cake,
  LocalFireDepartment,
  Edit as EditIcon,
  EmojiEvents as NivelIcon,
  Checklist as FasesIcon,
  ArrowBack as BackIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import "./index.css" 

const API_URL = "https://projeto-codepath.onrender.com";

const calculateCompletedPhases = (fases) => {
  let total = 0;
  let completed = 0;
  
  if (!fases || typeof fases !== 'object') {
    return "0/0";
  }

  for (const moduleName in fases) {
    const moduleFases = fases[moduleName];
    if (Array.isArray(moduleFases)) {
      total += moduleFases.length;
      completed += moduleFases.filter(fase => fase.liberada && !fase.atual).length;
    }
  }

  const finalCompleted = completed > 0 ? completed + 1 : 0; 
  
  return `${finalCompleted}/${total}`;
};


export default function PaginaPerfil() {
  const navigate = useNavigate();
  const [navValue, setNavValue] = useState(3);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [fasesCompletas, setFasesCompletas] = useState("0/0");

  useEffect(() => {
    const data = localStorage.getItem("userData");
    if (!data) {
      navigate("/login");
      return;
    }
    
    // 1. 👇 CARREGA OS DADOS DO LOCALSTORAGE IMEDIATAMENTE
    // Isso garante que o "intermediario" (que o teste salvou) apareça NA HORA.
    const user = JSON.parse(data);
    setProfileData(user);
    setFasesCompletas(calculateCompletedPhases(user.fases));
    setLoading(false); // Para de carregar
    
    const userEmail = user.email;

    // 2. 👇 AGORA, BUSCA ATUALIZAÇÕES EM SEGUNDO PLANO
    // (Apenas para garantir que os dados fiquem sincronizados com o banco)
    const fetchProfileUpdates = async () => {
      console.log("Buscando atualizações do perfil em segundo plano...");
      try {
        const response = await fetch(`${API_URL}/profile/${userEmail}`);
        if (!response.ok) {
          throw new Error("Falha ao buscar atualizações.");
        }
        
        const result = await response.json();
        
        if (result.success && result.user) {
          // 3. Atualiza o state e o localStorage com os dados mais recentes do banco
          setProfileData(result.user);
          localStorage.setItem("userData", JSON.stringify(result.user));
          setFasesCompletas(calculateCompletedPhases(result.user.fases));
          console.log("Perfil em segundo plano atualizado.", result.user);
        }
      } catch (error) {
        console.error("Erro ao buscar atualizações do perfil:", error);
        // Não faz nada se falhar, fica com os dados locais que já carregamos
      }
    };

    fetchProfileUpdates(); // Chama a busca em segundo plano
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userData");
    navigate("/login");
  };

  const handleUpdateProfile = () => {
    navigate("/perfil/editar"); 
  };

  const handleGoBack = () => {
    navigate("/menu/"); 
  };

  return (
    <Box className="home-layout">
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
            Perfil
          </Typography>
          <IconButton color="inherit" onClick={() => navigate("/configuracoes")}>
  <Settings />
</IconButton>
        </Toolbar>
      </AppBar>

      <Box 
        className="perfil-content" 
        sx={{ 
          flexGrow: 1, display: 'flex', flexDirection: 'column', 
          alignItems: 'center', pt: 4, 
          background: "linear-gradient(to bottom, #1e293b 0%, #0f172a 100%)",
          overflowY: 'auto', width: '100%', pb: 8, 
          height:"800"
        }}
      >
        {loading ? (
          <CircularProgress color="success" sx={{ mt: 5 }} />
        ) : profileData ? (
          <>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Avatar 
                alt={profileData.nome} 
                src="/path/to/profile_pic.jpg" 
                sx={{ 
                  width: 120, height: 120, bgcolor: '#38b36d',
                  fontSize: '3rem', mx: 'auto', mb: 1,
                  border: '3px solid #6ee7b7'
                }}
              >
                {profileData.nome ? profileData.nome.charAt(0).toUpperCase() : <PerfilIcon sx={{fontSize: '3rem'}} />}
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'white', mt: 1 }}>
                {profileData.nome}
              </Typography>
              <Typography variant="body2" sx={{ color: '#b0bec5', mb: 1 }}>
                {profileData.email}
              </Typography>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={handleUpdateProfile}
                sx={{
                  mt: 2, color: '#6ee7b7', borderColor: '#6ee7b7',
                  '&:hover': {
                    borderColor: '#38b36d',
                    backgroundColor: 'rgba(56, 179, 109, 0.1)',
                  },
                }}
              >
                Editar Perfil
              </Button>
            </Box>

            <Card sx={{ 
                width: '90%', maxWidth: 400, mb: 4,
                background: "rgba(30, 41, 59, 0.9)",
                color: "white", borderRadius: '16px',
                boxShadow: '0 8px 32px 0 rgba(0,0,0,0.3)',
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)',
                border: '1px solid rgba(56, 179, 109, 0.4)', p: 2
            }}>
              <CardContent sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', p: '0 !important' }}>
                <Box sx={{ textAlign: 'center', flex: 1 }}>
                  <NivelIcon sx={{ fontSize: 30, color: '#6ee7b7' }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{profileData.nivel || 'Iniciante'}</Typography>
                  <Typography variant="caption" sx={{ color: '#b0bec5' }}>Nível</Typography>
                </Box>
                <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
                <Box sx={{ textAlign: 'center', flex: 1 }}>
                  <LocalFireDepartment sx={{ fontSize: 30, color: '#fcd34d' }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{profileData.streak || 0}</Typography>
                  <Typography variant="caption" sx={{ color: '#b0bec5' }}>Sequência</Typography>
                </Box>
                <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
                <Box sx={{ textAlign: 'center', flex: 1 }}>
                  <FasesIcon sx={{ fontSize: 30, color: '#38b36d' }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{fasesCompletas}</Typography>
                  <Typography variant="caption" sx={{ color: '#b0bec5' }}>Fases</Typography>
                </Box>
              </CardContent>
            </Card>

            <Card sx={{ 
                width: '90%', maxWidth: 400, mb: 4,
                background: "rgba(30, 41, 59, 0.9)",
                color: "white", borderRadius: '16px',
                boxShadow: '0 8px 32px 0 rgba(0,0,0,0.3)',
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)',
                border: '1px solid rgba(56, 179, 109, 0.4)'
            }}>
              <CardContent sx={{ p: 0 }}>
                <List>
                  <ListItem>
                    <ListItemText 
                      primary="Data de Nascimento" 
                      secondary={profileData.data_nascimento ? new Date(profileData.data_nascimento).toLocaleDateString('pt-BR', {timeZone: 'UTC'}) : 'Não informado'} 
                      primaryTypographyProps={{ color: '#b0bec5' }}
                      secondaryTypographyProps={{ color: 'white', fontWeight: 'bold' }}
                    />
                  </ListItem>
                  <Divider component="li" sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
                  <ListItem>
                    <ListItemText 
                      primary="Telefone" 
                      secondary={profileData.telefone || 'Não informado'} 
                      primaryTypographyProps={{ color: '#b0bec5' }}
                      secondaryTypographyProps={{ color: 'white', fontWeight: 'bold' }}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>

            {/* --- Botão Sair da Conta --- */}
            <Button
              variant="contained" color="error"
              startIcon={<Logout />} onClick={handleLogout}
              sx={{
                width: '90%', maxWidth: 400, py: 1.5,
                borderRadius: '12px', fontWeight: 'bold', fontSize: '1rem',
                bgcolor: '#dc2626', '&:hover': { bgcolor: '#b91c1c' },
              }}
            >
              Sair da conta
            </Button>

          </>
        ) : (
          !loading && <Typography color="white" sx={{ mt: 5 }}>Não foi possível carregar os dados do perfil.</Typography>
        )}
      </Box>

     
      <Paper 
        sx={{ 
          position: 'fixed', bottom: 0, left: 0, right: 0,
          background: "#1e293b", zIndex: 100 
        }} 
        elevation={3}
      >
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