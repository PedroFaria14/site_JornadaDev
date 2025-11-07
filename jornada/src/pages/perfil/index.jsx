import React, { useState, useEffect, useRef } from "react"; // <<< NOVO: importou o useRef
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
import "./index.css";

const API_URL = "https://projeto-codepath.onrender.com";

// ... (sua função calculateCompletedPhases não muda) ...
const calculateCompletedPhases = (fases) => {
  let total = 0;
  let completed = 0;

  if (!fases || typeof fases !== "object") {
    return "0/0";
  }

  for (const moduleName in fases) {
    const moduleFases = fases[moduleName];
    if (Array.isArray(moduleFases)) {
      total += moduleFases.length;
      completed += moduleFases.filter((fase) => fase.liberada && !fase.atual).length;
    }
  }
  const finalCompleted = completed > 0 ? completed + 1 : total > 0 ? 1 : 0;
  return `${finalCompleted}/${total}`;
};

export default function PaginaPerfil() {
  const navigate = useNavigate();
  const [navValue, setNavValue] = useState(3);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fasesCompletas, setFasesCompletas] = useState("0/0");

  // <<< NOVO: States para a foto de perfil local
  const [profileImage, setProfileImage] = useState(null); // Armazena a URL da foto (local ou da API)
  const fileInputRef = useRef(null); // Referência para o input de arquivo escondido

  useEffect(() => {
    const data = localStorage.getItem("userData");
    if (!data) {
      navigate("/login");
      return;
    }

    const user = JSON.parse(data);
    setProfileData(user);
    setFasesCompletas(calculateCompletedPhases(user.fases));
    setLoading(false);

    // Tenta carregar uma foto de perfil vinda dos dados (se existir)
    if (user.fotoUrl) {
      setProfileImage(user.fotoUrl);
    }

    const userEmail = user.email;

    const fetchProfileUpdates = async () => {
      try {
        const response = await fetch(`${API_URL}/profile/${userEmail}`);
        if (!response.ok) {
          throw new Error("Falha ao buscar atualizações.");
        }
        const result = await response.json();
        if (result.success && result.user) {
          setProfileData(result.user);
          localStorage.setItem("userData", JSON.stringify(result.user));
          setFasesCompletas(calculateCompletedPhases(result.user.fases));

          // Atualiza a foto também com os dados do banco
          if (result.user.fotoUrl) {
            setProfileImage(result.user.fotoUrl);
          }
        }
      } catch (error) {
        console.error("Erro ao buscar atualizações do perfil:", error);
      }
    };

    fetchProfileUpdates();
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

  const formatarData = (dataISO) => {
    // ... (função de formatar data não muda) ...
    try {
      if (!dataISO) return "Não informado";
      const data = new Date(dataISO);
      if (isNaN(data.getTime())) return "Não informado";
      return data.toLocaleDateString("pt-BR", { timeZone: "UTC" });
    } catch (error) {
      return "Não informado";
    }
  };

  // <<< NOVO: Função para "clicar" no input escondido
  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  // <<< NOVO: Função que roda quando o usuário escolhe um arquivo
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Cria uma URL local para o arquivo e atualiza o state
      setProfileImage(URL.createObjectURL(file));
      // NOTA: Aqui você poderia também chamar uma função para
      // fazer o UPLOAD desse 'file' para o seu backend/S3/Firebase.
    }
  };

  return (
    <Box className="home-layout">
      {/* --- Input de arquivo escondido --- */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        hidden
        accept="image/png, image/jpeg" // Aceita só imagens
      />
      {/* --- Fim do Input --- */}

      <AppBar
        position="static"
        sx={{
          background: "linear-gradient(to right, #1e2b3b)",
          boxShadow: "none",
        }}
      >
        {/* ... (Toolbar e AppBar não mudam) ... */}
        <Toolbar>
          <IconButton color="inherit" onClick={handleGoBack} sx={{ mr: 2 }}>
            <BackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: "bold" }}>
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
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          background: "linear-gradient(to bottom, #1e293b 0%, #0f172a 100%)",
          overflowY: "auto",
          width: "100%",
          padding: "32px 20px 100px 20px",
          gap: 4, // <<< MUDANÇA: Adiciona 32px de espaço entre CADA item
        }}
      >
        {loading ? (
          <CircularProgress color="success" sx={{ mt: 5 }} />
        ) : profileData ? (
          <>
            {/* --- SEÇÃO AVATAR --- */}
            {/* <<< MUDANÇA: 'mb: 4' removido pois o 'gap' do pai cuida disso */}
            <Box sx={{ textAlign: "center" }}>
              <Avatar
                alt={profileData.nome}
                src={profileImage} // <<< MUDANÇA: Usa a foto do state
                onClick={handleAvatarClick} // <<< NOVO: Clicável
                sx={{
                  width: 120,
                  height: 120,
                  bgcolor: "#38b36d",
                  fontSize: "3rem",
                  mx: "auto",
                  mb: 1,
                  border: "3px solid #6ee7b7",
                  cursor: "pointer", // <<< NOVO: Mãozinha
                  "&:hover": { opacity: 0.8 }, // <<< NOVO: Efeito
                }}
              >
                {/* <<< MUDANÇA: Só mostra as iniciais se NÃO TIVER foto */}
                {!profileImage &&
                  (profileData.nome ? (
                    profileData.nome.charAt(0).toUpperCase()
                  ) : (
                    <PerfilIcon sx={{ fontSize: "3rem" }} />
                  ))}
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: "bold", color: "white", mt: 1 }}>
                {profileData.nome}
              </Typography>
              <Typography variant="body2" sx={{ color: "#b0bec5", mb: 1 }}>
                {profileData.email}
              </Typography>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={handleUpdateProfile}
                sx={{
                  mt: 2,
                  color: "#6ee7b7",
                  borderColor: "#6ee7b7",
                  "&:hover": {
                    borderColor: "#38b36d",
                    backgroundColor: "rgba(56, 179, 109, 0.1)",
                  },
                }}
              >
                Editar Perfil
              </Button>
            </Box>

            {/* --- CARD DE STATS --- */}
            {/* <<< MUDANÇA: 'mb: 3' removido */}
            <Card
              sx={{
                width: "100%",
                maxWidth: 450,
                background: "rgba(30, 41, 59, 0.9)",
                color: "white",
                borderRadius: "16px",
                boxShadow: "0 8px 32px 0 rgba(0,0,0,0.3)",
                border: "1px solid rgba(56, 179, 109, 0.4)",
              }}
            >
              {/* ... (Card de Stats não muda o conteúdo) ... */}
              <CardContent
                sx={{
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                  padding: "24px !important",
                  gap: 2,
                }}
              >
                <Box sx={{ textAlign: "center", flex: 1 }}>
                  <NivelIcon sx={{ fontSize: 30, color: "#6ee7b7" }} />
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {profileData.nivel || "Iniciante"}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#b0bec5" }}>
                    Nível
                  </Typography>
                </Box>
                <Divider orientation="vertical" flexItem sx={{ bgcolor: "rgba(255,255,255,0.2)" }} />
                <Box sx={{ textAlign: "center", flex: 1 }}>
                  <LocalFireDepartment sx={{ fontSize: 30, color: "#fcd34d" }} />
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {profileData.streak || 0}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#b0bec5" }}>
                    Sequência
                  </Typography>
                </Box>
                <Divider orientation="vertical" flexItem sx={{ bgcolor: "rgba(255,255,255,0.2)" }} />
                <Box sx={{ textAlign: "center", flex: 1 }}>
                  <FasesIcon sx={{ fontSize: 30, color: "#38b36d" }} />
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {fasesCompletas}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#b0bec5" }}>
                    Fases
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {/* --- CARD DE INFORMAÇÕES --- */}
            {/* <<< MUDANÇA: 'mb: 4' removido */}
            <Card
              sx={{
                width: "100%",
                maxWidth: 450,
                background: "rgba(30, 41, 59, 0.9)",
                color: "white",
                borderRadius: "16px",
                border: "1px solid rgba(56, 179, 109, 0.4)",
              }}
            >
              {/* ... (Card de Informações não muda o conteúdo) ... */}
              <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Email sx={{ color: "#b0bec5" }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Email"
                      secondary={profileData.email || "Não informado"}
                      primaryTypographyProps={{ color: "#b0bec5" }}
                      secondaryTypographyProps={{ color: "white", fontWeight: "bold" }}
                    />
                  </ListItem>
                  <Divider component="li" sx={{ bgcolor: "rgba(255,255,255,0.1)", ml: "72px" }} />
                  <ListItem>
                    <ListItemIcon>
                      <Cake sx={{ color: "#b0bec5" }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Data de Nascimento"
                      secondary={formatarData(profileData.data_nascimento)}
                      primaryTypographyProps={{ color: "#b0bec5" }}
                      secondaryTypographyProps={{ color: "white", fontWeight: "bold" }}
                    />
                  </ListItem>
                  <Divider component="li" sx={{ bgcolor: "rgba(255,255,255,0.1)", ml: "72px" }} />
                  <ListItem>
                    <ListItemIcon>
                      <Phone sx={{ color: "#b0bec5" }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Telefone"
                      secondary={profileData.telefone || "Não informado"}
                      primaryTypographyProps={{ color: "#b0bec5" }}
                      secondaryTypographyProps={{ color: "white", fontWeight: "bold" }}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>

            {/* --- Botão Sair da Conta --- */}
            <Button
              variant="contained"
              color="error"
              startIcon={<Logout />}
              onClick={handleLogout}
              sx={{
                width: "100%",
                maxWidth: 450,
                py: 1.5,
                borderRadius: "12px",
                fontWeight: "bold",
                fontSize: "1rem",
                bgcolor: "#dc2626",
                "&:hover": { bgcolor: "#b91c1c" },
              }}
            >
              Sair da conta
            </Button>
          </>
        ) : (
          !loading && (
            <Typography color="white" sx={{ mt: 5 }}>
              Não foi possível carregar os dados do perfil.
            </Typography>
          )
        )}
      </Box>

      {/* --- RODAPÉ --- */}
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
        {/* ... (BottomNavigation não muda) ... */}
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
