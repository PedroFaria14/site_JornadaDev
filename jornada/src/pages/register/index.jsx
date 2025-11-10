import React, { useState } from "react";
import {
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email,
  Person,
  Phone, 
  Cake,  
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import "./index.css"; 

const API_URL ="https://projeto-codepath.onrender.com";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    data_nascimento: "", 
    telefone: "",        
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.senha !== formData.confirmarSenha) {
      alert("As senhas não coincidem!");
      return;
    }

    const { confirmarSenha, ...registerData } = formData;

    try {
      const registerResponse = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData),
      });

      if (!registerResponse.ok) {
        const errorData = await registerResponse.json();
        throw new Error(errorData.detail || "Falha ao registrar.");
      }
      

      const loginResponse = await fetch(`${API_URL}/login`, {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({
           email: formData.email,
           senha: formData.senha,
         }),
      });

      if (!loginResponse.ok) {
         throw new Error("Conta criada, mas falha ao fazer login. Tente logar manualmente.");
      }

      const loginResult = await loginResponse.json();

      if (loginResult.success && loginResult.user) {
        localStorage.setItem("userData", JSON.stringify(loginResult.user));
        
        alert("Conta criada com sucesso! Vamos começar seu teste de nível.");
        
        navigate("/teste-nivelamento"); 

      } else {
        throw new Error("Conta criada, mas dados de login não retornados.");
      }

    } catch (error) {
      console.error("Erro no processo de registro:", error);
      alert(`Erro: ${error.message}`);
      if (error.message.includes("Tente logar manualmente")) {
        navigate("/login");
      }
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
    <div className="register-container">
      <Box
        sx={{
          background: "rgba(18, 25, 49, 0.85)",
          padding: { xs: "30px", sm: "40px 35px" },
          borderRadius: "20px",
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
          width: { xs: "100%", sm: 400 },
          maxWidth: "100%",
        }}
      >
        <Typography
          variant="h5"
          component="h2"
          sx={{
            textAlign: "center",
            color: "white",
            mb: "25px",
            fontWeight: "bold",
          }}
        >
          Crie sua conta
        </Typography>

        <Box component="form" onSubmit={handleRegister}>

          <TextField
            name="nome"
            label="Nome completo"
            variant="filled"
            fullWidth
            value={formData.nome}
            onChange={handleChange}
            sx={{ ...textInputSx, mb: 2.5 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person sx={{ color: iconColor }} />
                </InputAdornment>
              ),
            }}
          />

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
            name="data_nascimento"
            label="Data de Nascimento"
            type="date"
            variant="filled"
            fullWidth
            value={formData.data_nascimento}
            onChange={handleChange}
            sx={{ ...textInputSx, mb: 2.5 }}
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Cake sx={{ color: iconColor }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            name="telefone"
            label="Telefone (DDD + Número)"
            variant="filled"
            fullWidth
            value={formData.telefone}
            onChange={handleChange}
            sx={{ ...textInputSx, mb: 2.5 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Phone sx={{ color: iconColor }} />
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

          <TextField
            name="confirmarSenha"
            label="Confirmar senha"
            type={showPassword ? "text" : "password"}
            variant="filled"
            fullWidth
            value={formData.confirmarSenha}
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
              mt: "10px",
              "&:hover": { backgroundColor: "#2f9a5d" },
            }}
          >
            Registrar
          </Button>
        </Box>

        <Typography sx={{ textAlign: "center", color: "#fff", mt: "15px" }}>
          Já tem conta?{" "}
          <Box
            component="span"
            onClick={() => navigate("/login")}
            sx={{
              color: "#00a86b", 
              fontWeight: "bold",
              cursor: "pointer",
              "&:hover": { color: "#00c77e" },
            }}
          >
            Faça login
          </Box>
        </Typography>
      </Box>
    </div>
  );
}