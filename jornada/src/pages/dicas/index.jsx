import React, { useState, useEffect } from "react";
import {
  Box, AppBar, Toolbar, Typography, IconButton, Card, CardContent, Paper,
  BottomNavigation, BottomNavigationAction, Button, CardMedia, CardActions, Grid,
  CircularProgress 
} from "@mui/material";
import {
  Settings, Logout, Home as HomeIcon, ListAlt as ExerciciosIcon, OndemandVideo as DicasIcon,
  Person as PerfilIcon, ArrowBack as BackIcon, PlayCircleOutline as PlayIcon 
  // Removido StarIcon, pois não há mais seção "Recomendados" separada
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
// Use o CSS do Perfil/Home
import "./index.css"

// --- DADOS DE EXEMPLO ---
// Verifique se os 'level' aqui estão como esperado ('iniciante', 'Intermediario', 'Avançado')
const sampleVideos = [
  // Lógica
  { id: 1, title: "Lógica de Programação #01", description: "Conceitos iniciais para quem nunca programou.", category: "Lógica", level: "iniciante", url: "https://www.youtube.com/watch?v=iF2Mdbrp_X8", thumbnail: "https://img.youtube.com/vi/iF2Mdbrp_X8/mqdefault.jpg" },
  { id: 4, title: "Estruturas Condicionais (if/else)", description: "Tomando decisões no código.", category: "Lógica", level: "iniciante", url: "https://www.youtube.com/watch?v=fXv4_fZ4-0A", thumbnail: "https://img.youtube.com/vi/fXv4_fZ4-0A/mqdefault.jpg" },
  { id: 6, title: "Algoritmos e Estrutura de Dados", description: "Introdução a conceitos fundamentais.", category: "Lógica", level: "Intermediario", url: "https://www.youtube.com/watch?v=algoritmos-intro", thumbnail: "https://via.placeholder.com/150/777777/FFFFFF?text=Algoritmos" }, 
  // Python
  { id: 2, title: "Curso Python #04", description: "Primeiros comandos em Python.", category: "Python", level: "iniciante", url: "https://www.youtube.com/watch?v=31llNGKwddo", thumbnail: "https://img.youtube.com/vi/31llNGKwddo/mqdefault.jpg" },
  { id: 5, title: "Loops com For em Python", description: "Repetindo tarefas eficientemente.", category: "Python", level: "Intermediario", url: "https://www.youtube.com/watch?v=for-python-video-id", thumbnail: "https://via.placeholder.com/150/FF0000/FFFFFF?text=Python+For" }, 
  { id: 7, title: "Manipulação de Listas em Python", description: "Trabalhando com coleções de dados.", category: "Python", level: "Intermediario", url: "https://www.youtube.com/watch?v=python-listas", thumbnail: "https://via.placeholder.com/150/00FF00/000000?text=Python+Listas" },
  // JavaScript
  { id: 3, title: "Variáveis em JavaScript", description: "Entenda var, let e const.", category: "JavaScript", level: "iniciante", url: "https://www.youtube.com/watch?v=variable-javascript-video-id", thumbnail: "https://via.placeholder.com/150/0000FF/808080?text=JS+Var" }, 
  { id: 8, title: "Funções em JavaScript", description: "Como criar e usar funções.", category: "JavaScript", level: "Intermediario", url: "https://www.youtube.com/watch?v=javascript-funcoes", thumbnail: "https://via.placeholder.com/150/FFFF00/000000?text=JS+Funções" },
  { id: 9, title: "DOM e Eventos no JavaScript", description: "Manipulando elementos HTML.", category: "JavaScript", level: "Avançado", url: "https://www.youtube.com/watch?v=javascript-dom", thumbnail: "https://via.placeholder.com/150/FF00FF/FFFFFF?text=JS+DOM" }, 
  // C++ 
  { id: 10, title: "Introdução ao C++", description: "Seu primeiro programa em C++.", category: "C++", level: "iniciante", url: "https://www.youtube.com/watch?v=cpp-intro", thumbnail: "https://via.placeholder.com/150/CCCCCC/000000?text=C%2B%2B+Intro" },
  { id: 11, title: "Ponteiros em C++", description: "Entendendo o gerenciamento de memória.", category: "C++", level: "Avançado", url: "https://www.youtube.com/watch?v=cpp-ponteiros", thumbnail: "https://via.placeholder.com/150/000000/FFFFFF?text=C%2B%2B+Pointers" },
  // Java 
  { id: 12, title: "Curso Java Básico", description: "Conceitos fundamentais da linguagem Java.", category: "Java", level: "iniciante", url: "https://www.youtube.com/watch?v=java-basico", thumbnail: "https://via.placeholder.com/150/FFA500/000000?text=Java+Básico" },
  { id: 13, title: "Orientação a Objetos em Java", description: "Classes, objetos e herança.", category: "Java", level: "Intermediario", url: "https://www.youtube.com/watch?v=java-oop", thumbnail: "https://via.placeholder.com/150/800080/FFFFFF?text=Java+OOP" },
  // Web Dev 
  { id: 14, title: "HTML e CSS para Iniciantes", description: "Construindo a estrutura e estilo de páginas web.", category: "Web Dev", level: "iniciante", url: "https://www.youtube.com/watch?v=html-css-intro", thumbnail: "https://via.placeholder.com/150/4682B4/FFFFFF?text=HTML+CSS" },
  // Data Science 
  { id: 15, title: "Introdução à Data Science com Python", description: "Usando Pandas e NumPy.", category: "Data Science", level: "Intermediario", url: "https://www.youtube.com/watch?v=data-science-py", thumbnail: "https://via.placeholder.com/150/20B2AA/FFFFFF?text=Data+Sci+Py" },
];
// --- FIM DOS DADOS DE EXEMPLO ---

const API_URL = "https://projeto-codepath.onrender.com"; // URL base da API

export default function PaginaDicas() {
  const navigate = useNavigate();
  const [navValue, setNavValue] = useState(2); 
  const [userData, setUserData] = useState(null); 
  const [relevantVideosByCategory, setRelevantVideosByCategory] = useState({}); 
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchProfileAndFilterVideos = async () => {
      setLoading(true); 

      const storedData = localStorage.getItem("userData");
      if (!storedData) { navigate("/login"); return; }
      const storedUser = JSON.parse(storedData);
      const userEmail = storedUser?.email;

      if (!userEmail) { navigate("/login"); return; }

      let fetchedUserData = null; 

      try {
        const response = await fetch(`${API_URL}/profile/${userEmail}`);
        if (!response.ok) { throw new Error("Falha ao buscar perfil."); }
        const result = await response.json();
        if (result.success && result.user) {
          fetchedUserData = result.user; 
          setUserData(fetchedUserData); 
          localStorage.setItem("userData", JSON.stringify(fetchedUserData)); 
        } else { throw new Error(result.message || "Erro perfil."); }
      } catch (error) {
        console.error("Erro fetch perfil:", error);
        fetchedUserData = storedUser; // Fallback
        setUserData(fetchedUserData); 
      }

      // FILTRA OS VÍDEOS USANDO COMPARAÇÃO CASE-INSENSITIVE
      if (fetchedUserData) {
          const userLevel = (fetchedUserData.nivel || 'iniciante').toLowerCase(); 
          
          
          // Filtra APENAS os vídeos que batem com o nível
          const relevantVideos = sampleVideos.filter(video => 
              video.level && video.level.toLowerCase() === userLevel 
          );
          

          // Agrupa esses vídeos relevantes por categoria
          const groupedRelevantVideos = relevantVideos.reduce((acc, video) => { 
                if (!acc[video.category]) { acc[video.category] = []; }
                acc[video.category].push(video);
                return acc;
             }, {});
            
          setRelevantVideosByCategory(groupedRelevantVideos); 

      } else {
          console.error("Não foi possível determinar o nível do usuário.");
          setRelevantVideosByCategory({}); 
      }
      
      setLoading(false); 
    };

    fetchProfileAndFilterVideos(); 
  }, [navigate]); 

  // --- Funções Auxiliares ---
  const handleLogout = () => { localStorage.removeItem("userData"); navigate("/login"); };
  const handleGoBack = () => { navigate(-1); }; 
  const watchVideo = (url) => { if (url && url.startsWith('http')) { window.open(url, '_blank', 'noopener,noreferrer'); } else { alert('URL inválida.'); } };

  // --- Função para renderizar um Card de Vídeo ---
  const renderVideoCard = (video) => (
    <Grid item xs={12} sm={6} md={4} key={video.id}> 
      <Card sx={{ 
          height: '100%', display: 'flex', flexDirection: 'column',
          background: "#111827", color: "white", borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          transition: 'transform 0.2s ease-in-out', 
           '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 16px rgba(0,0,0,0.3)' }
      }}>
        <CardMedia component="img" height="140" image={video.thumbnail || "https://via.placeholder.com/300x140?text=Video"} alt={video.title} sx={{ objectFit: 'cover' }}/>
        <CardContent sx={{ flexGrow: 1 }}> 
          <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 'bold', fontSize: '1.1rem', mb: 1 }}>{video.title}</Typography>
          <Typography variant="body2" color="#b0bec5">{video.description}</Typography>
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-start', pl: 2, pb: 2, pt: 0 }}> 
          <Button size="small" variant="contained" startIcon={<PlayIcon />} onClick={() => watchVideo(video.url)} sx={{ bgcolor: '#38b36d', '&:hover': { bgcolor: '#2f9a5d' } }}>Assistir</Button>
        </CardActions>
      </Card>
    </Grid>
  );

  return (
    <Box className="perfil-layout"> 
      
      {/* --- CABEÇALHO --- */}
      <AppBar position="static" sx={{ background: "#1e293b", boxShadow: 'none' }}>
        <Toolbar>
          <IconButton color="inherit" onClick={handleGoBack} sx={{ mr: 1 }}><BackIcon /></IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>Dicas de Vídeos</Typography>
          <IconButton color="inherit" onClick={() => alert("Configurações!")}><Settings /></IconButton>
          <IconButton color="inherit" onClick={handleLogout}><Logout /></IconButton>
        </Toolbar>
      </AppBar>

      {/* --- CONTEÚDO CENTRAL --- */}
      <Box className="perfil-content"> 
        {loading ? (
            <CircularProgress color="success" sx={{ mt: 5 }} />
        ) : (
            <> 
                {/* Título Principal */}
                 <Typography variant="h4" gutterBottom sx={{color: 'white', fontWeight: 'bold', mb: 4, textAlign: 'center'}}>
                    Vídeos para seu Nível ({userData?.nivel || 'Nível'})
                 </Typography>

                {/* --- Seção ÚNICA: Vídeos Relevantes por Categoria --- */}
                {Object.keys(relevantVideosByCategory).length > 0 ? (
                  Object.keys(relevantVideosByCategory).map(category => (
                    <Box key={category} sx={{ width: '100%', maxWidth: 1000, mb: 4 }}>
                      <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold', mb: 2 }}>
                        {category} {/* Nome da Categoria */}
                      </Typography>
                      <Grid container spacing={2}>
                        {relevantVideosByCategory[category].map(renderVideoCard)} 
                      </Grid>
                    </Box>
                  ))
                ) : (
                  // Mensagem se NENHUM vídeo relevante foi encontrado
                  !loading && <Typography sx={{color: '#b0bec5', mt: 5, textAlign: 'center', width: '100%'}}>
                      Nenhum vídeo encontrado para o seu nível ({userData?.nivel || 'Nível'}) no momento.
                  </Typography>
                )}
            </>
        )}
      </Box>

      {/* --- RODAPÉ --- */}
      <Paper 
        sx={{ 
          position: 'fixed', bottom: 0, left: 0, right: 0,
          background: "#1e293b", 
          zIndex: 100,
          borderTop: '1px solid #334155' 
        }} 
        elevation={0} 
      >
        <BottomNavigation 
            showLabels value={navValue} 
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
                "& .Mui-selected": { color: "#6ee7b7 !important" } 
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