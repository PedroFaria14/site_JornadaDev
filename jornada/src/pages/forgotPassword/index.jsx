import React, { useState } from "react";
import {
  TextField,
  Button,
  InputAdornment,
  Box,
  Typography,
} from "@mui/material";
import { Email } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import "../login/index.css"; 


const API_URL = "https://projeto-codepath.onrender.com";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(""); 

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/request-password-reset`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || "Email não encontrado ou falha no envio.");
      }

      console.log("Solicitação enviada:", result.message);
      
      navigate("/reset-password", { state: { email: email } });
      
    } catch (error) {
      console.error("Erro ao solicitar redefinição:", error);
      setMessage(error.message);
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
          Esqueceu a senha?
        </Typography>

        <Typography sx={{ textAlign: "center", color: "#e0e0e0", mb: "25px", fontSize: "0.9rem" }}>
          Digite seu e-mail abaixo e enviaremos um código de 6
          dígitos para redefinir sua senha.
        </Typography>

        <Box component="form" onSubmit={handleForgotPassword}>
          <TextField
            name="email"
            label="E-mail"
            variant="filled" 
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ ...textInputSx, mb: 2.5 }} 
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email sx={{ color: iconColor }} />
                </InputAdornment>
              ),
            }}
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
            Enviar código
          </Button>
        </Box>

        <Typography sx={{ textAlign: "center", color: "#fff", mt: "20px" }}>
          Lembrou a senha?{" "}
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