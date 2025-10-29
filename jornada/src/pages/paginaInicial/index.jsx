import React from "react";
import { Button, Box, Typography } from "@mui/material";
import "./index.css"; 
import { useNavigate } from "react-router-dom";

import iconeApp from "../../assets/Icone.png"

export default function PaginaInicial() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <Box
        sx={{
          textAlign: "center",
          maxWidth: "600px",
          
          background: "rgba(18, 25, 49, 0.85)", 
          
          padding: { xs: "30px", sm: "40px" },
          borderRadius: "20px", 
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontSize: { xs: "2.2rem", sm: "2.8rem" },
            fontWeight: "bold",
            color: "white", 
            mb: "0.5rem",
          }}
        >
          Bem-vindo!
        </Typography>

        <Box
          component="img"
          src={iconeApp} 
          alt="Ícone"
          sx={{
            width: "100px",
            height: "100px",
            objectFit: "contain",
            mb: 1.5,
          }}
        />

        <Typography
          sx={{
            color: "#e0e0e0", 
            fontSize: { xs: "1rem", sm: "1.1rem" },
            mb: "2.5rem",
          }}
        >
          Aprenda lógica para programação de graça! Agora!
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" }, 
            gap: "12px",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Button
            variant="contained"
            onClick={() => navigate("/register")}
            sx={{
              bgcolor: "#38b36d",
              color: "white",
              width: "240px",
              fontWeight: "bold",
              "&:hover": { bgcolor: "#2f9a5d" },
            }}
          >
            Começar Agora
          </Button>

          <Button
            variant="contained"
            onClick={() => navigate("/login")}
            sx={{
              bgcolor: "#4b1ca8",
              color: "white",
              width: "240px",
              fontWeight: "bold",
              "&:hover": { bgcolor: "#3a1584" },
            }}
          >
            Ir para Login
          </Button>
        </Box>
      </Box>
    </div>
  );
}