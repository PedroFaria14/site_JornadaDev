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
  TextField,
  BottomNavigation,
  BottomNavigationAction,
  InputAdornment,
} from "@mui/material";
import {
  Settings,
  Logout,
  Home as HomeIcon,
  ListAlt as ExerciciosIcon,
  OndemandVideo as DicasIcon,
  Person as PerfilIcon,
  Save as SaveIcon,
  ArrowBack as BackIcon,
  Phone,
  AccountCircle,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import "./index.css"; // mesmo CSS usado no perfil

const API_URL = "https://projeto-codepath.onrender.com";

export default function PaginaEditarPerfil() {
  const navigate = useNavigate();
  const [navValue, setNavValue] = useState(3);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({ nome: "", telefone: "" });
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const data = localStorage.getItem("userData");
    if (!data) {
      navigate("/login");
      return;
    }
    const user = JSON.parse(data);
    setUserData(user);
    setUserEmail(user.email);
    setFormData({ nome: user.nome || "", telefone: user.telefone || "" });
    setLoading(false);

    const fetchLatestProfile = async () => {
      try {
        const response = await fetch(`${API_URL}/profile/${user.email}`);
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.user) {
            setFormData({
              nome: result.user.nome || "",
              telefone: result.user.telefone || "",
            });
            setUserData(result.user);
          }
        }
      } catch (error) {
        console.error("Erro ao buscar dados recentes:", error);
      }
    };
    fetchLatestProfile();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault(); 
    setLoading(true);
    try {
        // CORREÇÃO: URL e MÉTODO CORRETOS
        const response = await fetch(`${API_URL}/update_profile/${userEmail}`, { 
            method: 'PUT', // <-- CORRIGIDO
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ // Envia APENAS nome e telefone
                nome: formData.nome,
                telefone: formData.telefone
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "Falha ao atualizar perfil.");
        }

        const result = await response.json();

        if (result.success) {
            alert("Perfil atualizado com sucesso!");
            
            // ATUALIZA o localStorage
            const updatedUserData = { ...userData, ...formData }; 
            localStorage.setItem("userData", JSON.stringify(updatedUserData));

            navigate("/perfil");
        } else {
            throw new Error(result.message || "Erro ao atualizar.");
        }
    } catch (error) {
        console.error("Erro ao atualizar perfil:", error);
        alert(`Erro: ${error.message}`);
        setLoading(false); 
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userData");
    navigate("/login");
  };

  const handleGoBack = () => navigate(-1);

  const textInputSx = {
    mb: 2.5,
    "& .MuiFilledInput-root": {
      backgroundColor: "rgba(255,255,255,0.05)",
      borderRadius: "12px",
      color: "#fff",
    },
    "& .MuiInputLabel-root": {
      color: "#94a3b8",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#38b36d",
    },
  };

  const iconColor = "#94a3b8";

  return (
    <Box className="perfil-layout">
      <AppBar
        position="static"
        sx={{
          background: "linear-gradient(to right, #1e293b, #334155)",
          boxShadow: "none",
        }}
      >
        <Toolbar>
          <IconButton color="inherit" onClick={handleGoBack} sx={{ mr: 2 }}>
            <BackIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, fontWeight: "bold" }}
          >
            Editar Perfil
          </Typography>
          <IconButton color="inherit" onClick={handleLogout}>
            <Logout />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box className="perfil-content">
        <Typography
          variant="h4"
          gutterBottom
          sx={{ color: "white", fontWeight: "bold", mb: 3 }}
        >
          Atualize seus dados
        </Typography>

        {loading ? (
          <CircularProgress color="success" sx={{ mt: 5 }} />
        ) : (
          <Card
            sx={{
              width: "90%",
              maxWidth: 500,
              background: "rgba(18, 25, 49, 0.85)",
              color: "white",
              border: "1px solid #334155",
              p: 3,
              borderRadius: "16px",
            }}
          >
            <CardContent>
              <Box component="form" onSubmit={handleUpdateProfile}>
                <TextField
                  name="nome"
                  label="Nome Completo"
                  variant="filled"
                  fullWidth
                  value={formData.nome}
                  onChange={handleChange}
                  sx={textInputSx}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountCircle sx={{ color: iconColor }} />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  name="telefone"
                  label="Telefone"
                  variant="filled"
                  fullWidth
                  value={formData.telefone}
                  onChange={handleChange}
                  sx={textInputSx}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone sx={{ color: iconColor }} />
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  color="success"
                  startIcon={<SaveIcon />}
                  disabled={loading}
                  sx={{
                    mt: 2,
                    width: "100%",
                    py: 1.5,
                    borderRadius: "12px",
                    fontWeight: "bold",
                    fontSize: "1rem",
                    bgcolor: "#38b36d",
                    "&:hover": { bgcolor: "#2f9a5d" },
                  }}
                >
                  {loading ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}
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
            if (newValue === 0) navigate("/menu/");
            if (newValue === 1) navigate("/exercicios");
            if (newValue === 2) navigate("/dicas");
            if (newValue === 3) navigate("/perfil");
          }}
          sx={{
            background: "#1e293b",
            "& .Mui-selected, & .MuiBottomNavigationAction-label.Mui-selected":
              { color: "#38b36d" },
            "& .MuiBottomNavigationAction-root": {
              color: "#94a3b8",
            },
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
