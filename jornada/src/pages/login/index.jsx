import React, { useState } from "react";
import {
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Box,        // Importado
  Typography, // Importado
} from "@mui/material";
import { Visibility, VisibilityOff, Email } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import "./index.css";

const API_URL = "https://projeto-codepath.onrender.com";

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", senha: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), 
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Email ou senha inválidos.");
      }

      const result = await response.json();

      if (result.success && result.user) {

        localStorage.setItem("userData", JSON.stringify(result.user));
        
        navigate("/menu/"); 

      } else {
        throw new Error(result.message || "Erro desconhecido no login.");
      }
      
    } catch (error) {
      console.error("Erro no login:", error);
      alert(`Erro: ${error.message}`);
    }
  };

  const textInputSx = {
    "& .MuiFilledInput-root": {
      backgroundColor: "rgba(255, 255, 255, 0.08)",
      color: "white",
      borderRadius: "10px",
      "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.12)" },
      "&.Mui-focused": { backgroundColor: "rgba(255, 255, 255, 0.15)" },
      "&:before, &:after": { borderBottom: "none" },
    },
    "& .MuiInputLabel-root": { color: "#b0bec5" },
    "& .MuiInputLabel-root.Mui-focused": { color: "white" },
  };

  const iconColor = "#b0bec5";

  return (
    <div className="login-container">
      <Box
        sx={{
          background: "rgba(18, 25, 49, 0.85)", 
          padding: { xs: "30px", sm: "40px 35px" },
          borderRadius: "20px",
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
          width: { xs: "100%", sm: 380 },
          maxWidth: "100%",
        }}
      >
        <Typography
          variant="h5"
          component="h2"
          sx={{
            textAlign: "center",
            color: "white",
            mb: "30px",
            fontWeight: "bold",
          }}
        >
          Bem-vindo de volta!
        </Typography>

        <Box component="form" onSubmit={handleLogin}>
          <TextField
            name="email"
            label="E-mail"
            variant="filled" 
            fullWidth
            value={formData.email}
            onChange={handleChange}
            sx={{ ...textInputSx, mb: 2.5 }} 
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email sx={{ color: iconColor }} /> 
                </InputAdornment>
              ),
            }}
          />

          <TextField
            name="senha"
            label="Senha"
            type={showPassword ? "text" : "password"}
            variant="filled" 
            fullWidth
            value={formData.senha}
            onChange={handleChange}
            sx={{ ...textInputSx, mb: 2.5 }} 
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? (
                      <VisibilityOff sx={{ color: iconColor }} />
                    ) : (
                      <Visibility sx={{ color: iconColor }} />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

         <Typography
            onClick={() => navigate("/forgot-password")}
            sx={{
              textAlign: "right",
              color: "#dcdcdc",
              fontSize: "0.9rem",
              mb: "20px",
              cursor: "pointer",
              "&:hover": { color: "white" },
            }}
          >
            Esqueceu a senha?
          </Typography>

          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: "#38b36d", 
              color: "white",
              fontWeight: "bold",
              width: "100%",
              padding: "10px",
              borderRadius: "10px",
              "&:hover": { backgroundColor: "#2f9a5d" },
            }}
          >
            Entrar
          </Button>
        </Box>

        <Typography sx={{ textAlign: "center", color: "#fff", mt: "15px" }}>
          Ainda não tem conta?{" "}
          <Box
            component="span"
            onClick={() => navigate("/register")}
            sx={{
              color: "#00a86b", 
              fontWeight: "bold",
              cursor: "pointer",
              "&:hover": { color: "#00c77e" },
            }}
          >
            Crie uma
          </Box>
        </Typography>
      </Box>
    </div>
  );
}