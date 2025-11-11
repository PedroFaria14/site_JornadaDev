import React, { useState, useEffect } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Card,
  CardContent,
  Paper,
  BottomNavigation,
  BottomNavigationAction,
  Button,
  CardMedia,
  CardActions,
  Grid,
  CircularProgress,
} from "@mui/material";
import {
  Settings,
  Logout,
  Home as HomeIcon,
  ListAlt as ExerciciosIcon,
  OndemandVideo as DicasIcon,
  Person as PerfilIcon,
  ArrowBack as BackIcon,
  PlayCircleOutline as PlayIcon,
  ArrowBackIosNew as ArrowBackIosIcon, 
  ArrowForwardIos as ArrowForwardIosIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion"; 
import "./index.css";

const sampleVideos = [
  // Lógica (Iniciante)
  {
    id: 1,
    title: "Lógica de Programação #01",
    description: "Conceitos iniciais para quem nunca programou. Essencial para iniciantes.",
    category: "Lógica",
    level: "iniciante",
    url: "https://www.youtube.com/watch?v=iF2Mdbrp_X8",
    thumbnail: "https://img.youtube.com/vi/iF2Mdbrp_X8/mqdefault.jpg",
  },
  {
    id: 4,
    title: "Estruturas Condicionais (if/else)",
    description: "Tomando decisões no código com condições lógicas.",
    category: "Lógica",
    level: "iniciante",
    url: "https://www.youtube.com/watch?v=fXv4_fZ4-0A",
    thumbnail: "https://img.youtube.com/vi/fXv4_fZ4-0A/mqdefault.jpg",
  },

  // Python (Iniciante)
  {
    id: 2,
    title: "Curso Python #04",
    description: "Primeiros comandos e a sintaxe básica de Python.",
    category: "Python",
    level: "iniciante",
    url: "https://www.youtube.com/watch?v=31llNGKwddo",
    thumbnail: "https://img.youtube.com/vi/31llNGKwddo/mqdefault.jpg",
  },
  {
    id: 2.1,
    title: "Entrada de Dados (input)",
    description: "Como receber dados do usuário de forma interativa.",
    category: "Python",
    level: "iniciante",
    url: "https://www.youtube.com/watch?v=C-r-gQi-g-c",
    thumbnail: "https://img.youtube.com/vi/C-r-gQi-g-c/mqdefault.jpg",
  },

  // JavaScript (Iniciante)
  {
    id: 3,
    title: "Variáveis em JavaScript",
    description: "Entenda var, let e const para declarar variáveis.",
    category: "JavaScript",
    level: "iniciante",
    url: "https://www.youtube.com/watch?v=C2Fq-S-2qGk",
    thumbnail: "https://img.youtube.com/vi/C2Fq-S-2qGk/mqdefault.jpg",
  },
  {
    id: 3.1,
    title: "O que é o DOM?",
    description: "Entendendo o Document Object Model para interagir com HTML.",
    category: "JavaScript",
    level: "iniciante",
    url: "https://www.youtube.com/watch?v=U_gANry-N4o",
    thumbnail: "https://img.youtube.com/vi/U_gANry-N4o/mqdefault.jpg",
  },

  // C++ (Iniciante)
  {
    id: 10,
    title: "Introdução ao C++",
    description: "Seu primeiro programa em C++: 'Hello World!'.",
    category: "C++",
    level: "iniciante",
    url: "https://www.youtube.com/watch?v=f2W21nLw8zE",
    thumbnail: "https://img.youtube.com/vi/f2W21nLw8zE/mqdefault.jpg",
  },
  {
    id: 10.1,
    title: "Variáveis e Tipos em C++",
    description: "Declarando e usando diferentes tipos de dados.",
    category: "C++",
    level: "iniciante",
    url: "https://www.youtube.com/watch?v=GwL0fU3m6g0",
    thumbnail: "https://img.youtube.com/vi/GwL0fU3m6g0/mqdefault.jpg",
  },

  // Java (Iniciante)
  {
    id: 12,
    title: "Curso Java Básico",
    description: "Conceitos fundamentais da linguagem Java para iniciantes.",
    category: "Java",
    level: "iniciante",
    url: "https://www.youtube.com/watch?v=8zG0714R8Xo",
    thumbnail: "https://img.youtube.com/vi/8zG0714R8Xo/mqdefault.jpg",
  },
  {
    id: 12.1,
    title: "Variáveis e Tipos Primitivos",
    description: "Aprendendo a usar as variáveis em Java.",
    category: "Java",
    level: "iniciante",
    url: "https://www.youtube.com/watch?v=Qh_B5x7Fp84",
    thumbnail: "https://img.youtube.com/vi/Qh_B5x7Fp84/mqdefault.jpg",
  },

  // Web Dev (Iniciante)
  {
    id: 14,
    title: "HTML e CSS para Iniciantes",
    description: "Construindo a estrutura e estilo de páginas web.",
    category: "Web Dev",
    level: "iniciante",
    url: "https://www.youtube.com/watch?v=epDCjksKMok",
    thumbnail: "https://img.youtube.com/vi/epDCjksKMok/mqdefault.jpg",
  },
  {
    id: 14.1,
    title: "Estrutura Básica do HTML",
    description: "Os elementos essenciais de uma página web.",
    category: "Web Dev",
    level: "iniciante",
    url: "https://www.youtube.com/watch?v=FM2bJ0a76a8",
    thumbnail: "https://img.youtube.com/vi/FM2bJ0a76a8/mqdefault.jpg",
  },

  // Data Science (Iniciante)
  {
    id: 15,
    title: "Introdução à Data Science com Python",
    description: "Usando Pandas e NumPy para análise de dados.",
    category: "Data Science",
    level: "iniciante",
    url: "https://www.youtube.com/watch?v=L2y3gN5a92s",
    thumbnail: "https://img.youtube.com/vi/L2y3gN5a92s/mqdefault.jpg",
  },
  {
    id: 15.1,
    title: "O que é Data Science?",
    description: "Uma visão geral sobre o campo da ciência de dados.",
    category: "Data Science",
    level: "iniciante",
    url: "https://www.youtube.com/watch?v=X3paePLg-K8",
    thumbnail: "https://img.youtube.com/vi/X3paePLg-K8/mqdefault.jpg",
  },

  // Lógica (Intermediario)
  {
    id: 6,
    title: "Algoritmos e Estrutura de Dados",
    description: "Introdução a conceitos fundamentais de eficiência.",
    category: "Lógica",
    level: "intermediario",
    url: "https://www.youtube.com/watch?v=Ejgd-mrbj2k",
    thumbnail: "https://img.youtube.com/vi/Ejgd-mrbj2k/mqdefault.jpg",
  },
  {
    id: 6.1,
    title: "Recursão: Conceitos e Exemplos",
    description: "Resolvendo problemas de forma elegante e repetitiva.",
    category: "Lógica",
    level: "intermediario",
    url: "https://www.youtube.com/watch?v=kQ48M6-sE7w",
    thumbnail: "https://img.youtube.com/vi/kQ48M6-sE7w/mqdefault.jpg",
  },

  // Python (Intermediario)
  {
    id: 5,
    title: "Loops com For em Python",
    description: "Repetindo tarefas eficientemente com laços de repetição.",
    category: "Python",
    level: "intermediario",
    url: "https://www.youtube.com/watch?v=0kIB1b-QjE4",
    thumbnail: "https://img.youtube.com/vi/0kIB1b-QjE4/mqdefault.jpg",
  },
  {
    id: 7,
    title: "Manipulação de Listas em Python",
    description: "Trabalhando com coleções de dados: adicionar, remover, buscar.",
    category: "Python",
    level: "intermediario",
    url: "https://www.youtube.com/watch?v=1tG8b1r-a6g",
    thumbnail: "https://img.youtube.com/vi/1tG8b1r-a6g/mqdefault.jpg",
  },

  // JavaScript (Intermediario)
  {
    id: 8,
    title: "Funções em JavaScript",
    description: "Como criar e usar funções avançadas, closures e escopo.",
    category: "JavaScript",
    level: "intermediario",
    url: "https://www.youtube.com/watch?v=iZ00-q9qg0k",
    thumbnail: "https://img.youtube.com/vi/iZ00-q9qg0k/mqdefault.jpg",
  },
  {
    id: 8.1,
    title: "Callbacks e Promises",
    description: "Lidando com operações assíncronas no JavaScript.",
    category: "JavaScript",
    level: "intermediario",
    url: "https://www.youtube.com/watch?v=PO_QJ1i_SgQ",
    thumbnail: "https://img.youtube.com/vi/PO_QJ1i_SgQ/mqdefault.jpg",
  },

  {
    id: 11,
    title: "Ponteiros em C++",
    description: "Entendendo o gerenciamento de memória e aritmética de ponteiros.",
    category: "C++",
    level: "avançado",
    url: "https://www.youtube.com/watch?v=aG402Yh89pA",
    thumbnail: "https://img.youtube.com/vi/aG402Yh89pA/mqdefault.jpg",
  },
  {
    id: 12,
    title: "Ponteiros em C++",
    description: "Entendendo o gerenciamento de memória e aritmética de ponteiros.",
    category: "C++",
    level: "avançado",
    url: "https://www.youtube.com/watch?v=aG402Yh89pA",
    thumbnail: "https://img.youtube.com/vi/aG402Yh89pA/mqdefault.jpg",
  },
  {
    id: 13,
    title: "Orientação a Objetos em Java",
    description: "Classes, objetos, herança, polimorfismo e interfaces.",
    category: "Java",
    level: "intermediario",
    url: "https://www.youtube.com/watch?v=uK1l0X6QWqs",
    thumbnail: "https://img.youtube.com/vi/uK1l0X6QWqs/mqdefault.jpg",
  },
  {
    id: 14,
    title: "Orientação a Objetos em Java",
    description: "Classes, objetos, herança, polimorfismo e interfaces.",
    category: "Java",
    level: "intermediario",
    url: "https://www.youtube.com/watch?v=uK1l0X6QWqs",
    thumbnail: "https://img.youtube.com/vi/uK1l0X6QWqs/mqdefault.jpg",
  },
  {
    id: 15.3,
    title: "Visualização de Dados com Matplotlib",
    description: "Criando gráficos informativos para seus dados.",
    category: "Data Science",
    level: "intermediario",
    url: "https://www.youtube.com/watch?v=FgrQ_y_tJ5w",
    thumbnail: "https://img.youtube.com/vi/FgrQ_y_tJ5w/mqdefault.jpg",
  },

  {
    id: 16.3,
    title: "Visualização de Dados com Matplotlib",
    description: "Criando gráficos informativos para seus dados.",
    category: "Data Science",
    level: "intermediario",
    url: "https://www.youtube.com/watch?v=FgrQ_y_tJ5w",
    thumbnail: "https://img.youtube.com/vi/FgrQ_y_tJ5w/mqdefault.jpg",
  },
];
// --- FIM DOS DADOS DE EXEMPLO ---

const API_URL = "https://projeto-codepath.onrender.com";

export default function PaginaDicas() {
  const navigate = useNavigate();
  const [navValue, setNavValue] = useState(2);
  const [userData, setUserData] = useState(null);
  const [relevantVideosByCategory, setRelevantVideosByCategory] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);

  useEffect(() => {
    const fetchProfileAndFilterVideos = async () => {
      setLoading(true);
      const storedData = localStorage.getItem("userData");
      if (!storedData) {
        navigate("/login");
        return;
      }
      const storedUser = JSON.parse(storedData);
      const userEmail = storedUser?.email;
      if (!userEmail) {
        navigate("/login");
        return;
      }

      let fetchedUserData = null;
      try {
        const response = await fetch(`${API_URL}/profile/${userEmail}`);
        if (!response.ok) throw new Error("Falha ao buscar perfil.");
        const result = await response.json();
        if (result.success && result.user) {
          fetchedUserData = result.user;
          setUserData(fetchedUserData);
          localStorage.setItem("userData", JSON.stringify(fetchedUserData));
        } else {
          throw new Error(result.message || "Erro perfil.");
        }
      } catch (error) {
        console.error("Erro fetch perfil:", error);
        fetchedUserData = storedUser;
        setUserData(fetchedUserData);
      }

      if (fetchedUserData) {
        const userLevel = (fetchedUserData.nivel || "iniciante").toLowerCase();

        const relevantVideos = sampleVideos.filter((video) => video.level && video.level.toLowerCase() === userLevel);

        const groupedRelevantVideos = relevantVideos.reduce((acc, video) => {
          if (!acc[video.category]) {
            acc[video.category] = [];
          }
          acc[video.category].push(video);
          return acc;
        }, {});

        setRelevantVideosByCategory(groupedRelevantVideos);
        setCurrentCategoryIndex(0);
      } else {
        console.error("Não foi possível determinar o nível do usuário.");
        setRelevantVideosByCategory({});
      }

      setLoading(false);
    };

    fetchProfileAndFilterVideos();
  }, [navigate]);

  // --- Funções Auxiliares ---
  const handleLogout = () => {
    localStorage.removeItem("userData");
    navigate("/login");
  };
  const handleGoBack = () => {
    navigate("/menu");
  };
  const watchVideo = (url) => {
    if (url && url.startsWith("http")) {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      alert("URL inválida.");
    }
  };

  // --- Funções de Navegação do Carrossel ---
  const categories = Object.keys(relevantVideosByCategory);
  const activeCategoryName = categories[currentCategoryIndex];
  const allVideosInCategory = relevantVideosByCategory[activeCategoryName] || [];
  const videosToShow = allVideosInCategory.slice(0, 3)

  const handleNextCategory = () => {
    setCurrentCategoryIndex((prevIndex) => (prevIndex + 1) % categories.length);
  };

  const handlePrevCategory = () => {
    setCurrentCategoryIndex((prevIndex) => (prevIndex - 1 + categories.length) % categories.length);
  };

  const renderVideoCard = (video) => (
    <Grid item sm={4} md={4} key={video.id}>
      <Card
        component={motion.div} 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        sx={{
          width: 300, 
          height: 380,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "rgba(30, 41, 59, 0.95)",
          color: "white",
          borderRadius: "16px",
          border: "1px solid #334155",
          boxShadow: "0 0 12px rgba(110, 231, 183, 0.25)", 
          transition: "transform 0.25s ease, box-shadow 0.25s ease",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 0 20px rgba(110, 231, 183, 0.45)",
          },
        }}
      >
        <CardMedia
          component="img"
          height="160"
          image={video.thumbnail || "https://via.placeholder.com/300x160?text=Video"}
          alt={video.title}
          sx={{ objectFit: "cover", borderTopLeftRadius: "16px", borderTopRightRadius: "16px" }}
        />
        <CardContent sx={{ flexGrow: 1, minHeight: "120px" }}>
          {" "}
          <Typography
            gutterBottom
            variant="h6"
            component="div"
            sx={{ fontWeight: "bold", fontSize: "1.1rem", mb: 1, lineHeight: 1.3 }}
          >
            {video.title}
          </Typography>
          <Typography variant="body2" color="#b0bec5">
            {video.description}
          </Typography>
        </CardContent>
        <CardActions sx={{ justifyContent: "flex-start", pl: 2, pb: 2, pt: 0 }}>
          <Button
            size="small"
            variant="contained"
            startIcon={<PlayIcon />}
            onClick={() => watchVideo(video.url)}
            sx={{ bgcolor: "#38b36d", "&:hover": { bgcolor: "#2f9a5d" } }}
          >
            Assistir
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );

  return (
    <Box className="perfil-layout">
      {/* --- CABEÇALHO --- */}
      <AppBar position="static" sx={{ background: "#1e293b", boxShadow: "none" }}>
        <Toolbar>
          <IconButton color="inherit" onClick={handleGoBack} sx={{ mr: 1 }}>
            <BackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: "bold" }}></Typography>
          <IconButton color="inherit" onClick={() => navigate("/configuracoes")}>
            <Settings />
          </IconButton>
          <IconButton color="inherit" onClick={handleLogout}>
            <Logout />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* --- CONTEÚDO CENTRAL --- */}
      <Box
        className="perfil-content"
        sx={{
          justifyContent: "flex-start",
          pb: "100px",
          p: { xs: "20px 10px 100px 10px", sm: "32px 20px 100px 20px" },
        }}
      >
        {loading ? (
          <CircularProgress color="success" sx={{ mt: 5 }} />
        ) : (
          <>
            <Typography
              variant="h4"
              gutterBottom
              sx={{ color: "white", fontWeight: "bold", mb: 3, textAlign: "center", width: "100%" }}
            >
              Explore Vídeos de <span style={{ color: "#6ee7b7" }}>{userData?.nivel || "Nível"}</span>!
            </Typography>

            {categories.length > 0 ? (
              <Box
                sx={{
                  width: "100%",
                  maxWidth: 1100,
                  mt: 3,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  background: "rgba(18, 25, 49, 0.6)",
                  borderRadius: "20px",
                  p: { xs: 2, sm: 3 },
                  boxShadow: "0 8px 32px 0 rgba(0,0,0,0.4)",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    mb: 4,
                    gap: { xs: 1, sm: 3 }, 
                  }}
                >
                  <IconButton
                    onClick={handlePrevCategory}
                    disabled={categories.length <= 1}
                    sx={{
                      color: "#6ee7b7",
                      "&:disabled": { color: "#4a5568" },
                      fontSize: { xs: "1.8rem", sm: "2.5rem" },
                    }}
                  >
                    <ArrowBackIosIcon />
                  </IconButton>

                  <Typography
                    variant="h4"
                    component="div"
                    sx={{
                      color: "white",
                      fontWeight: "bold",
                      textAlign: "center",
                      minWidth: { xs: "120px", sm: "200px" },
                      fontSize: { xs: "1.5rem", sm: "2rem" },
                    }}
                  >
                    {activeCategoryName}
                  </Typography>

                  <IconButton
                    onClick={handleNextCategory}
                    disabled={categories.length <= 1}
                    sx={{
                      color: "#6ee7b7",
                      "&:disabled": { color: "#4a5568" },
                      fontSize: { xs: "1.8rem", sm: "2.5rem" },
                    }}
                  >
                    <ArrowForwardIosIcon />
                  </IconButton>
                </Box>

                {categories.length > 1 && (
                  <Box sx={{ display: "flex", justifyContent: "center", mt: -2, mb: 3, gap: 1 }}>
                    {categories.map((_, index) => (
                      <Box
                        key={index}
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          bgcolor: index === currentCategoryIndex ? "#6ee7b7" : "#4a5568",
                          transition: "background-color 0.3s",
                        }}
                      />
                    ))}
                  </Box>
                )}

                <Box sx={{ width: "100%", minHeight: "350px" }}>
                  {" "}
                  {videosToShow.length > 0 ? (
                    <AnimatePresence mode="wait">
                      {" "}
                      <motion.div
                        key={activeCategoryName} 
                        initial={{
                          opacity: 0,
                          x:
                            currentCategoryIndex > (categories.findIndex((cat) => cat === activeCategoryName) || 0)
                              ? -50
                              : 50,
                        }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{
                          opacity: 0,
                          x:
                            currentCategoryIndex > (categories.findIndex((cat) => cat === activeCategoryName) || 0)
                              ? 50
                              : -50,
                        }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        style={{ width: "100%" }} 
                      >
                        <Grid container spacing={3} sx={{ justifyContent: "center" }}>
                          {videosToShow.map(renderVideoCard)}
                        </Grid>
                      </motion.div>
                    </AnimatePresence>
                  ) : (
                    <Typography
                      sx={{ color: "#b0bec5", mt: 3, textAlign: "center", width: "100%", fontSize: "1.1rem" }}
                    >
                      Nenhum vídeo nesta categoria para o seu nível no momento.
                    </Typography>
                  )}
                  {videosToShow.length > 0 && videosToShow.length < 3 && (
                    <Typography
                      sx={{
                        color: "#b0bec5",
                        mt: 3,
                        textAlign: "center",
                        width: "100%",
                        fontStyle: "italic",
                        fontSize: "0.9rem",
                      }}
                    >
                      (Mais vídeos para esta categoria em breve!)
                    </Typography>
                  )}
                </Box>
              </Box>
            ) : (
              !loading && (
                <Typography sx={{ color: "#b0bec5", mt: 5, textAlign: "center", width: "100%", fontSize: "1.1rem" }}>
                  Nenhum vídeo encontrado para o seu nível ({userData?.nivel || "Nível"}) no momento.
                </Typography>
              )
            )}
          </>
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
          borderTop: "1px solid #334155",
        }}
        elevation={0}
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
            "& .MuiBottomNavigationAction-root": { color: "#94a3b8" },
            "& .Mui-selected": { color: "#6ee7b7 !important" },
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
