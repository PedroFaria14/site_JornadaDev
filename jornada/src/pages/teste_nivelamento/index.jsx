import React, { useState, useEffect } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Card,
  CardContent,
  Button,
  LinearProgress,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
// 1. IMPORTADO O 'EmojiEvents' (Troféu) para o pop-up final
import { CheckCircle, Cancel, EmojiEvents as TrophyIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import "./index.css"; // Reutiliza o CSS do quiz

const API_URL = "https://projeto-codepath.onrender.com";
const COUNT_FACIL = 3;
const COUNT_MEDIO = 2;

// 2. MAPA DE RESULTADOS (para o pop-up)
const levelResultsMap = {
  iniciante: {
    title: "Nível Iniciante (1)",
    message: "Você está começando sua jornada agora. Vamos aprender o básico!",
    color: "#94a3b8", // Cinza
  },
  intermediario: {
    title: "Nível Intermediário (2)",
    message: "Você já tem uma boa base! Vamos aprimorar suas habilidades.",
    color: "#6ee7b7", // Verde
  },
  avancado: {
    title: "Nível Avançado (3)",
    message: "Impressionante! Você já domina os conceitos. Vamos aos desafios!",
    color: "#a78bfa", // Roxo
  },
};

export default function PaginaNivelamento() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);

  // 3. States para o pop-up final
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [testResult, setTestResult] = useState("iniciante"); // Guarda o resultado ("iniciante", "intermediario", etc.)

  // 🔹 Busca o perfil
  useEffect(() => {
    const data = localStorage.getItem("userData");
    if (!data) {
      navigate("/login");
      return;
    }
    const user = JSON.parse(data);
    setUserData(user);
  }, [navigate]);

  // 🔹 Busca as perguntas do teste
  useEffect(() => {
    if (!userData) return;

    const fetchTestQuestions = async () => {
      setLoading(true);
      try {
        const nivelFacil = (userData.nivel || "iniciante").toLowerCase();
        const nivelMedio = "intermediario";

        const urlFacil = `${API_URL}/pergunta/?nivel=${nivelFacil}&count=${COUNT_FACIL}`;
        const urlMedio = `${API_URL}/pergunta/?nivel=${nivelMedio}&count=${COUNT_MEDIO}`;

        const [resFacil, resMedio] = await Promise.all([fetch(urlFacil), fetch(urlMedio)]);

        const dataFacil = await resFacil.json();
        const dataMedio = await resMedio.json();

        let allQuestions = [];
        if (dataFacil.success && dataFacil.perguntas) allQuestions = [...allQuestions, ...dataFacil.perguntas];
        if (dataMedio.success && dataMedio.perguntas) allQuestions = [...allQuestions, ...dataMedio.perguntas];

        allQuestions.sort(() => Math.random() - 0.5);

        if (allQuestions.length === 0) {
          console.error("Nenhuma pergunta de nivelamento encontrada!");
          navigate("/exercicios"); // Navega se não achar perguntas
          return;
        }
        setQuestions(allQuestions);
      } catch (err) {
        console.error("Erro ao buscar perguntas do teste:", err);
        setQuestions([]);
        navigate("/exercicios"); // Navega se der erro
      } finally {
        setLoading(false);
      }
    };

    fetchTestQuestions();
  }, [userData]);

  const handleAnswerSelect = (e) => setSelectedAnswer(e.target.value);

  // 🔹 Lógica de submeter (calcula o score)
  const handleAnswerSubmit = async () => {
    if (!selectedAnswer || isSubmitting) return;
    setIsSubmitting(true);
    const currentQuestion = questions[currentQuestionIndex];

    try {
      const response = await fetch(`${API_URL}/responderSite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idPergunta: currentQuestion.idPergunta,
          resposta: selectedAnswer,
        }),
      });
      const result = await response.json();
      if (result.success) {
        setScore((prev) => prev + 1);
      }
      setFeedback(result);
      setShowFeedbackDialog(true);
    } catch (error) {
      console.error(error);
      alert(`Erro: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🔹 Lógica de "Próxima"
  const handleNext = () => {
    setShowFeedbackDialog(false);
    setSelectedAnswer(null);
    setFeedback(null);

    const isLastQuestion = currentQuestionIndex + 1 >= questions.length;

    if (isLastQuestion) {
      handleFinishTest(); // Chama a função de finalizar
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // 4. FUNÇÃO FINALIZAR (Chama o Backend REAL + Salva Local)
  const handleFinishTest = async () => {
    setLoading(true); // Mostra tela de "Calculando..."

    const percentage = (score / questions.length) * 100;
    let finalLevel = "iniciante";
    let finalLevelNum = 1;

    if (percentage === 100) {
      finalLevel = "avancado";
      finalLevelNum = 3;
    } else if (percentage >= 50) {
      finalLevel = "intermediario";
      finalLevelNum = 2;
    }

    let updatedUserData = { ...userData };

    try {
      // --- ETAPA 1: SALVAR NO BACKEND ---
      const response = await fetch(`${API_URL}/profile/set-global-level`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userData.email,
          globalLevel: finalLevel,
        }),
      });

      if (!response.ok) {
        throw new Error("Falha ao salvar nível no backend (continuando localmente)");
      }

      const result = await response.json();

      if (result.success && result.user) {
        updatedUserData = result.user; // Pega os dados mais recentes do backend
      }
    } catch (error) {
      console.error(error);
      updatedUserData.nivel = finalLevel; // Salva localmente se o backend falhar
    }

    // --- ETAPA 2: SALVAR LOCALMENTE (PARA A APRESENTAÇÃO) ---
    updatedUserData.nivel = finalLevel;

    const fases = updatedUserData.fases || {};
    for (const moduleKey in fases) {
      // Não mexe no 'Desafio da Mistura' se ele já tiver progresso
      if (moduleKey !== "Desafio da Roleta") {
        fases[moduleKey] = finalLevelNum;
      }
    }
    updatedUserData.fases = fases;

    localStorage.setItem("userData", JSON.stringify(updatedUserData));
    setUserData(updatedUserData);

    setTestResult(finalLevel); // Salva o resultado para o pop-up
    setLoading(false);
    setShowResultDialog(true); // 👈 ABRE O POP-UP
  };

  // 5. Função para o botão do pop-up final
  const handleGoToMenu = () => {
    setShowResultDialog(false);
    navigate("/menu"); // Navega para o menu
  };

  // --- RENDERIZAÇÕES ---

  if (loading || !userData || !questions.length) {
    let message = "Carregando seu teste de nível...";
    if (loading && questions.length > 0) message = "Calculando seu nível...";

    return (
      <Box
        className="perfil-layout"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
        }}
      >
        <CircularProgress color="success" />
        <Typography sx={{ color: "white", mt: 2 }}>{message}</Typography>
      </Box>
    );
  }

  const question = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <Box className="perfil-layout">
      {/* --- AppBar --- */}
      <AppBar position="static" sx={{ background: "#1e293b", boxShadow: "none" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
            Teste de Nivelamento
          </Typography>
        </Toolbar>
        <LinearProgress variant="determinate" value={progress} color="success" sx={{ height: "6px" }} />
      </AppBar>

      {/* --- Card da Pergunta --- */}
      <Box className="perfil-content" sx={{ justifyContent: "center" }}>
        <Card
          sx={{
            width: "90%",
            maxWidth: 700,
            background: "rgba(18, 25, 49, 0.9)",
            color: "white",
            border: "1px solid #334155",
            borderRadius: "16px",
            p: { xs: 2, sm: 3 },
          }}
        >
          <CardContent>
            <Typography sx={{ color: "#94a3b8", mb: 2, fontWeight: "bold" }}>
              Pergunta {currentQuestionIndex + 1} de {questions.length}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: "bold", mb: 4, lineHeight: 1.4 }}>
              {question?.pergunta}
            </Typography>

            <FormControl component="fieldset" fullWidth disabled={!!feedback || isSubmitting}>
              <RadioGroup value={selectedAnswer} onChange={handleAnswerSelect}>
                {question?.opcoes.map((opcao, idx) => (
                  <FormControlLabel
                    key={idx}
                    value={opcao}
                    control={<Radio sx={{ color: "#94a3b8", "&.Mui-checked": { color: "#38b36d" } }} />}
                    label={<Typography sx={{ color: "white" }}>{opcao}</Typography>}
                    sx={{
                      //
                      background: "rgba(255, 255, 255, 0.05)",
                      mb: 1.5,
                      borderRadius: "8px",
                      padding: "8px 16px",
                      // Esta linha muda a borda, em vez do fundo
                      border: selectedAnswer === opcao ? "2px solid #38b36d" : "2px solid transparent",
                      "&:hover": { background: "rgba(255, 255, 255, 0.1)" },
                    }}
                  />
                ))}
              </RadioGroup>
            </FormControl>

            {!feedback && (
              <Button
                variant="contained"
                color="success"
                sx={{ mt: 3, width: "100%", py: 1.5, fontWeight: "bold", fontSize: "1rem", borderRadius: "12px" }}
                onClick={handleAnswerSubmit}
                disabled={!selectedAnswer || isSubmitting}
              >
                {isSubmitting ? <CircularProgress size={24} color="inherit" /> : "Responder"}
              </Button>
            )}
          </CardContent>
        </Card>
      </Box>

      {/* --- Diálogo de feedback (Acerto/Erro) --- */}
      <Dialog
        open={showFeedbackDialog}
        onClose={handleNext}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            background: "#111827",
            color: "white",
            border: `2px solid ${feedback?.success ? "#38b36d" : "#dc2626"}`,
          },
        }}
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", fontWeight: "bold" }}>
          {feedback?.success ? (
            <CheckCircle sx={{ color: "#38b36d", mr: 1 }} />
          ) : (
            <Cancel sx={{ color: "#dc2626", mr: 1 }} />
          )}
          {feedback?.message}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "#e0e0e0" }}>{feedback?.explicacao}</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleNext}
            variant="contained"
            sx={{ bgcolor: "#38b36d", "&:hover": { bgcolor: "#2f9a5d" }, borderRadius: "8px" }}
          >
            {currentQuestionIndex + 1 < questions.length ? "Próxima Pergunta" : "Calcular Nível"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* // 6. 👇 Pop-up de Resultado Final 👇
       */}
      <Dialog
        open={showResultDialog}
        disableEscapeKeyDown // Impede o usuário de fechar clicando fora
        PaperProps={{
          sx: {
            borderRadius: "16px",
            background: "#111827",
            color: "white",
            border: `2px solid ${levelResultsMap[testResult].color}`, // Borda com a cor do nível
            p: 2,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: "bold", textAlign: "center", fontSize: "1.5rem" }}>
          <TrophyIcon sx={{ color: levelResultsMap[testResult].color, fontSize: 40, mb: -1, mr: 1 }} />
          Teste Finalizado!
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center" }}>
          <DialogContentText sx={{ color: "#e0e0e0", mb: 1 }}>
            Parabéns! Com base nas suas {score} de {questions.length} respostas corretas, seu nível inicial é:
          </DialogContentText>
          <Typography variant="h5" sx={{ fontWeight: "bold", color: levelResultsMap[testResult].color }}>
            {levelResultsMap[testResult].title}
          </Typography>
          <DialogContentText sx={{ color: "#b0bec5", mt: 1 }}>{levelResultsMap[testResult].message}</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: "center" }}>
          <Button
            onClick={handleGoToMenu}
            variant="contained"
            sx={{ bgcolor: "#38b36d", "&:hover": { bgcolor: "#2f9a5d" }, borderRadius: "8px", px: 4 }}
          >
            Começar a Aprender
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
