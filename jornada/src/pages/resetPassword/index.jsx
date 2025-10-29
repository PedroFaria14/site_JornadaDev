import React, { useState } from "react";
import {
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff, VpnKey } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import "../login/index.css"; 

const API_URL = "https://projeto-codepath.onrender.com";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const email = location.state?.email;
  if (!email) {
    navigate("/forgot-password"); 
  }

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    token: "",
    new_password: "",
    confirm_password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (formData.new_password !== formData.confirm_password) {
      alert("As novas senhas não coincidem!");
      return;
    }

    try {
      const payload = {
        email: email, 
        token: formData.token,
        new_password: formData.new_password,
      };

      const response = await fetch(`${API_URL}/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || "Código inválido, expirado ou erro.");
      }

      alert("Senha redefinida com sucesso! Você já pode fazer o login.");
      navigate("/login");
      
    } catch (error) {
      console.error("Erro ao redefinir senha:", error);
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
            mb: "15px",
            fontWeight: "bold",
          }}
        >
          Redefinir Senha
        </Typography>

        <Typography sx={{ textAlign: "center", color: "#e0e0e0", mb: "25px", fontSize: "0.9rem" }}>
          Enviamos um código para **{email}**. Por favor, insira o código e
          sua nova senha.
        </Typography>

        <Box component="form" onSubmit={handleResetPassword}>
          <TextField
            name="token"
            label="Código de 6 dígitos"
            variant="filled" 
            fullWidth
            value={formData.token}
            onChange={handleChange}
            sx={{ ...textInputSx, mb: 2.5 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <VpnKey sx={{ color: iconColor }} />
                </InputAdornment>
              ),
              inputProps: { maxLength: 6 }
            }}
          />

          <TextField
            name="new_password"
            label="Nova Senha"
            type={showPassword ? "text" : "password"}
            variant="filled"
            fullWidth
            value={formData.new_password}
            onChange={handleChange}
            sx={{ ...textInputSx, mb: 2.5 }} 
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
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

        
          <TextField
            name="confirm_password"
            label="Confirmar Nova Senha"
            type={showPassword ? "text" : "password"}
            variant="filled"
            fullWidth
            value={formData.confirm_password}
            onChange={handleChange}
            sx={{ ...textInputSx, mb: 2.5 }} 
          />

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
            Salvar Nova Senha
          </Button>
        </Box>
      </Box>
    </div>
  );
}