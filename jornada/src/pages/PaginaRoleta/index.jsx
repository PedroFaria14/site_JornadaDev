import React, { useState, useEffect } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  CircularProgress,
  Paper,
  BottomNavigation,
  BottomNavigationAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Slide,
} from "@mui/material";
import {
  Settings,
  Logout,
  Home as HomeIcon,
  ListAlt as ExerciciosIcon,
  OndemandVideo as DicasIcon,
  Person as PerfilIcon,
  ArrowBack as BackIcon,
  Star as StarIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const colorPalette = ["#6ee7b7", "#64b5f6", "#ffd54f", "#f08080", "#ba68c8"];
const outerBorderColor = "#38b36d";
const pointerColor = "#38b36d";
const WHEEL_SIZE = 360;

const roulettePrizes = [
  { option: "Funções", fullName: "Funções" },
  { option: "Variáveis", fullName: "Variáveis e Tipos de Dados" },
  { option: "Condicionais", fullName: "Condicionais" },
  { option: "Laços", fullName: "Laços de Repetição" },
  { option: "Diversos", fullName: "Perguntas diversas" },
];

const ModalTransition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function PaginaRoleta() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [mustSpin, setMustSpin] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [prizeNumber, setPrizeNumber] = useState(0); 
  const [showResultModal, setShowResultModal] = useState(false);
  const [navValue, setNavValue] = useState(1); 

  useEffect(() => {
    const data = localStorage.getItem("userData");
    if (data) setUserData(JSON.parse(data));
    else navigate("/login");
  }, [navigate]);

  const handleGoBack = () => navigate("/menu");
  const handleLogout = () => {
    localStorage.removeItem("userData");
    navigate("/login");
  };
  const goToDicas = () => navigate("/dicas");
  const goToPerfil = () => navigate("/perfil");

  const handleSpinClick = () => {
    if (mustSpin) return;

    const newPrizeIndex = Math.floor(Math.random() * roulettePrizes.length);
    setPrizeNumber(newPrizeIndex);
    setMustSpin(true);


    const totalPrizes = roulettePrizes.length;
    const anglePerPrize = 360 / totalPrizes;
    
   
    const pointerAngle = 270;

   
    const prizeMiddleAngle = (newPrizeIndex * anglePerPrize) + (anglePerPrize / 2);

  
    const targetRotation = pointerAngle - prizeMiddleAngle;

   
    const newRotation = (360 * 10) + targetRotation;

    setRotation(newRotation);
    
    setTimeout(() => {
      setMustSpin(false);
      setShowResultModal(true);
    }, 4500);
  };

  const handleAcceptChallenge = () => {
    setShowResultModal(false);
    const nomeModuloSorteado = roulettePrizes[prizeNumber].fullName;
    navigate(`/quiz/${encodeURIComponent(nomeModuloSorteado)}/3`);
  };

  const getPrizeName = () => {
    if (roulettePrizes[prizeNumber]) {
        return roulettePrizes[prizeNumber].fullName;
    }
    return "";
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #0f172a, #1e293b)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        color: "white",
        pb: 9, 
      }}
    >
      {/* 🔝 Topbar */}
      <AppBar position="static" sx={{ background: "transparent", boxShadow: "none" }}>
        <Toolbar>
          <IconButton color="inherit" onClick={handleGoBack}>
            <BackIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton color="inherit" onClick={() => navigate("/configuracoes")}>
            <Settings />
          </IconButton>
          <IconButton color="inherit" onClick={handleLogout}>
            <Logout />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* 🎮 Card Central */}
      <Paper
        elevation={10}
        sx={{
          mt: 4,
          p: 4,
          borderRadius: "24px",
          backdropFilter: "blur(10px)",
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.1)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          width: "90%",
          maxWidth: "600px",
        }}
      >
        <Typography
          variant="h3"
          sx={{
            mb: 2,
            fontWeight: 900,
            color: "#6ee7b7",
            textShadow: "0 0 15px rgba(110,231,183,0.7)",
          }}
        >
          Desafio da Roleta
        </Typography>

        <Typography sx={{ mb: 4, color: "#cbd5e1" }}>
          Gire a roleta e descubra o seu próximo desafio!
        </Typography>

        <Box sx={{ position: "relative", mb: 10 }}>
        
          <Box
            sx={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%) rotate(180deg)", 
              width: 0,
              height: 0,
              borderLeft: "15px solid transparent",
              borderRight: "15px solid transparent",
              borderBottom: `25px solid ${pointerColor}`,
              zIndex: 20,
              filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.5))",
            }}
          />

          <Box
            sx={{
              width: `${WHEEL_SIZE}px`,
              height: `${WHEEL_SIZE}px`,
              borderRadius: "50%",
              border: `8px solid ${outerBorderColor}`,
              overflow: "hidden",
              transform: `rotate(${rotation}deg)`,
              transition: mustSpin
                ? "transform 4s cubic-bezier(0.33, 1, 0.68, 1)"
                : "none",
              position: "relative",
              boxShadow: "0 0 25px rgba(56,179,109,0.4)",
            }}
          >
            {roulettePrizes.map((item, i) => {
              const angle = 360 / roulettePrizes.length;
              return (
                <Box
                  key={i}
                  sx={{
                    position: "absolute",
                    width: "50%",
                    height: "50%",
                    background: colorPalette[i % colorPalette.length], 
                    top: "50%",
                    left: "50%",
                    transformOrigin: "0% 0%",
                    transform: `rotate(${angle * i}deg) skewY(${90 - angle}deg)`,
                    border: "1px solid rgba(0,0,0,0.1)",
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      top: "30%",
                      left: "-40%",
                      width: "150%",
                      textAlign: "center",
                      transform: `skewY(-${90 - angle}deg) rotate(${angle / 2}deg)`,
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#0f172a",
                        fontWeight: "bold",
                        fontSize: "1rem",
                        textShadow: "0 1px 2px rgba(255,255,255,0.8)",
                      }}
                    >
                      {item.option}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>

          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "90px",
              height: "90px",
              borderRadius: "50%",
              background: "#0f172a",
              border: `4px solid ${outerBorderColor}`,
              zIndex: 10,
            }}
          />
        </Box>

        <Button
          variant="contained"
          disabled={mustSpin}
          onClick={handleSpinClick}
          sx={{
            bgcolor: outerBorderColor,
            color: "#111827",
            fontWeight: "bold",
            fontSize: "1.1rem",
            px: 6,
            py: 1.5,
            borderRadius: "16px",
            transition: "all 0.3s ease",
            "&:hover": {
              bgcolor: "#2f9a5d",
              transform: "translateY(-2px)",
              boxShadow: "0 0 20px rgba(56,179,109,0.6)",
            },
            "&:disabled": {
              bgcolor: "rgba(56, 179, 109, 0.5)",
              color: "rgba(0, 0, 0, 0.4)"
            }
          }}
        >
          {mustSpin ? <CircularProgress size={24} color="inherit" /> : "GIRAR"}
        </Button>
      </Paper>

      <Paper
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "rgba(15,23,42,0.8)",
          backdropFilter: "blur(10px)",
          borderTop: "1px solid rgba(255,255,255,0.1)",
          zIndex: 100,
        }}
        elevation={3}
      >
        <BottomNavigation
          showLabels
          value={navValue}
          onChange={(e, newValue) => {
            setNavValue(newValue);
            if (newValue === 0) navigate("/menu");
            if (newValue === 1) navigate("/exercicios"); 
            if (newValue === 2) goToDicas();
            if (newValue === 3) goToPerfil();
          }}
          sx={{
            background: "transparent", 
            "& .MuiBottomNavigationAction-root": {
              color: "#94a3b8",
            },
            "& .Mui-selected": {
              color: "#6ee7b7 !important",
            },
          }}
        >
          <BottomNavigationAction label="Home" icon={<HomeIcon />} />
          <BottomNavigationAction label="Exercícios" icon={<ExerciciosIcon />} />
          <BottomNavigationAction label="Dicas" icon={<DicasIcon />} />
          <BottomNavigationAction label="Perfil" icon={<PerfilIcon />} />
        </BottomNavigation>
      </Paper>

      <Dialog
        open={showResultModal}
        TransitionComponent={ModalTransition}
        keepMounted
        onClose={() => setShowResultModal(false)}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            background: "#1e293b",
            color: "#e0e0e0",
            border: "1px solid #334155",
          },
        }}
      >
        <DialogTitle
          sx={{
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "1.5rem",
            color: "#6ee7b7",
          }}
        img-
        >
          <StarIcon sx={{ verticalAlign: "middle", mr: 1 }} />
          Desafio Sorteado!
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "#cbd5e1", textAlign: "center" }}>
            Você foi desafiado a mostrar o que sabe sobre:
          </DialogContentText>
          <Typography variant="h5" sx={{ textAlign: "center", fontWeight: "bold", mt: 2, color: "white" }}>
            {getPrizeName()}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", px: 3, pb: 2 }}>
          <Button
            variant="contained"
            onClick={handleAcceptChallenge}
            sx={{
              bgcolor: outerBorderColor,
              color: "#111827",
              fontWeight: "bold",
              borderRadius: "12px",
              "&:hover": { bgcolor: "#2f9a5d" },
            }}
          >
            Aceitar Desafio
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}