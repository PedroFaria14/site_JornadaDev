import React, { useState, useEffect } from "react";
import {
  Box, AppBar, Toolbar, Typography, IconButton, Card, CardContent,
  Button, LinearProgress, CircularProgress, Dialog, DialogTitle,
  DialogContent, DialogContentText, DialogActions, FormControl,
  FormControlLabel, Radio, RadioGroup, useTheme,
} from "@mui/material";
import {
  CheckCircle, ArrowBack as BackIcon, Settings, Logout, SportsEsports,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";

const API_URL = "https://projeto-codepath.onrender.com";

const moduleNameMapping = {
  "Variáveis e Tipos de Dados": "Variáveis e Tipos de Dados",
  "Condicionais": "Condicionais",
  "Laços de Repetição": "Laços de Repetição",
  "Perguntas diversas": "Perguntas diversas",
  "Funções": "Funções",
};

export default function PaginaQuiz() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { moduleName: encodedModuleName, levelId } = useParams();
  const moduleName = decodeURIComponent(encodedModuleName || "");

  const [userData, setUserData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [quizFinished, setQuizFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [incorrectQuestions, setIncorrectQuestions] = useState([]);
  const [showRedoDialog, setShowRedoDialog] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem("userData");
    if (!data) {
      navigate("/login");
      return;
    }
    const user = JSON.parse(data);

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_URL}/profile/${user.email}`);
        if (!res.ok) throw new Error("Erro ao buscar perfil");
        const result = await res.json();
        setUserData(result.success ? result.user : user);
      } catch {
        setUserData(user);
      }
    };
    fetchProfile();
  }, [navigate]);

  useEffect(() => {
    if (!userData) return;
    if (!moduleName || moduleName === "undefined") {
      setQuestions([]);
      setLoading(false);
      return;
    }

    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const levelMap = { "1": "Facil", "2": "Medio", "3": "Dificil" };
        const nivelQuery = levelMap[levelId] || "Facil";
        let url = `${API_URL}/pergunta/?nivel=${nivelQuery}`;

        if (moduleName.includes("Desafio")) {
          url += `&count=5`;
        } else {
          const tipo = moduleNameMapping[moduleName];
          if (!tipo) {
            console.error(`❌ Módulo "${moduleName}" não encontrado.`);
            setQuestions([]);
            setLoading(false);
            return;
          }
          url += `&tipo=${encodeURIComponent(tipo)}&count=3`;
        }

        const res = await fetch(url);
        const data = await res.json();
        if (data.success && data.perguntas?.length) {
          setQuestions(data.perguntas);
        } else {
          setQuestions([]);
        }
      } catch (err) {
        console.error("Erro ao buscar perguntas:", err);
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [userData, moduleName, levelId]);

  const handleLevelUp = () => {
    const currentLevelNum = parseInt(levelId, 10);
    if (!currentLevelNum || currentLevelNum >= 3) return;

    const nextLevelNum = currentLevelNum + 1;
    const moduleKey = moduleName;
    const updatedUserData = { ...userData };

    if (!updatedUserData.fases) {
      updatedUserData.fases = {};
    }

    if ((updatedUserData.fases[moduleKey] || 0) < nextLevelNum) {
      updatedUserData.fases[moduleKey] = nextLevelNum;
    }

    localStorage.setItem("userData", JSON.stringify(updatedUserData));
    setUserData(updatedUserData);
  };

  useEffect(() => {
    if (quizFinished && userData && incorrectQuestions.length === 0) {
      handleLevelUp();
    }
  }, [quizFinished, userData, incorrectQuestions]);

  const handleAnswerSelect = (e) => {
    if (!feedback) {
      setSelectedAnswer(e.target.value);
    }
  };

  const handleAnswerSubmit = async () => {
    if (!selectedAnswer || isSubmitting || feedback) return;
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
      if (!response.ok) throw new Error(result.detail || "Erro ao enviar resposta");

      if (result.success) {
        setIncorrectQuestions((prev) =>
          prev.filter((q) => q.idPergunta !== currentQuestion.idPergunta)
        );
      } else {
        setIncorrectQuestions((prev) => {
          const exists = prev.some((q) => q.idPergunta === currentQuestion.idPergunta);
          return exists ? prev : [...prev, currentQuestion];
        });
      }

      setFeedback(result);
    } catch (error) {
      console.error(error);
      alert(`Erro: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setFeedback(null);

    const isLastQuestion = currentQuestionIndex + 1 >= questions.length;
    if (isLastQuestion) {
      if (incorrectQuestions.length > 0) {
        setShowRedoDialog(true);
      } else {
        setQuizFinished(true);
      }
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleRedoQuiz = () => {
    setShowRedoDialog(false);
    setQuestions(incorrectQuestions);
    setIncorrectQuestions([]);
    setCurrentQuestionIndex(0);
    setQuizFinished(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("userData");
    navigate("/login");
  };

  const handleGoBack = () => navigate("/exercicios");

  if (loading || !userData) {
    return (
      <Box className="perfil-layout" sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", flexDirection: "column" }}>
        <CircularProgress color="success" />
        <Typography sx={{ color: "white", mt: 2 }}>Carregando Quiz...</Typography>
      </Box>
    );
  }

  if (!questions.length) {
    return (
      <Box className="perfil-layout" sx={{ justifyContent: "center", alignItems: "center", textAlign: "center", p: 3 }}>
        <Typography variant="h5" sx={{ color: "#b0bec5" }}>
          Nenhuma pergunta encontrada.
        </Typography>
        <Typography sx={{ color: "#777", mt: 1 }}>
          Módulo: {moduleName || "Desconhecido"} | Nível: {levelId || "1"}
        </Typography>
        <Button variant="outlined" color="success" sx={{ mt: 2 }} onClick={handleGoBack}>
          Voltar
        </Button>
      </Box>
    );
  }

  if (quizFinished) {
    return (
      <Box className="perfil-layout" sx={{ justifyContent: "center", alignItems: "center", textAlign: "center", p: 3 }}>
        <CheckCircle sx={{ fontSize: 80, color: "#38b36d", mb: 2 }} />
        <Typography variant="h4" sx={{ color: "white", fontWeight: "bold" }}>Parabéns!</Typography>
        <Typography sx={{ color: "#e0e0e0", mt: 1, mb: 3 }}>
          Você completou o Nível {levelId} do módulo {moduleName} com 100% de acerto!
        </Typography>
        <Button variant="contained" sx={{ bgcolor: "#38b36d", "&:hover": { bgcolor: "#2f9a5d" } }} onClick={handleGoBack}>
          Voltar aos Módulos
        </Button>
      </Box>
    );
  }

  const question = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const normalize = (str) => (str || "").toString().trim().toLowerCase();

  const getOptionStyles = (opcao) => {
    if (!feedback) {
      return {
        background: "rgba(255,255,255,0.05)",
        border: selectedAnswer === opcao ? "2px solid #38b36d" : "2px solid transparent",
        "&:hover": { background: "rgba(255,255,255,0.1)" },
        transition: "all 0.25s ease",
      };
    }

    const correctAnswer = normalize(
      feedback.respostaCorreta ||
        feedback.respostacorreta ||
        feedback.resposta_correta ||
        feedback.correta ||
        feedback.resposta
    );

    const isCorrect = normalize(opcao) === correctAnswer;
    const isSelected = normalize(opcao) === normalize(selectedAnswer);

    if (isCorrect) {
      return {
        background: "rgba(255,255,255,0.05)",
        border: "2px solid #38b36d",
        color: "#38b36d",
        fontWeight: "bold",
        boxShadow: "0 0 8px rgba(56,179,109,0.3)",
      };
    }

    if (isSelected && !isCorrect) {
      return {
        background: "rgba(255,255,255,0.05)",
        
        fontWeight: "bold",
      };
    }

    return {
      background: "rgba(255,255,255,0.02)",
      border: "2px solid transparent",
      opacity: 0.8,
      color: "#94a3b8",
    };
  };

  const getRadioColor = (opcao) => {
    if (!feedback)
      return { color: "#94a3b8", "&.Mui-checked": { color: "#38b36d" } };

    const correctAnswer = normalize(
      feedback.respostaCorreta ||
        feedback.respostacorreta ||
        feedback.resposta_correta ||
        feedback.correta ||
        feedback.resposta
    );

    const isCorrect = normalize(opcao) === correctAnswer;
    const isSelected = normalize(opcao) === normalize(selectedAnswer);

    if (isCorrect) return { color: "#38b36d" };
    if (isSelected && !isCorrect) return { color: "#dc2626" };
    return { color: "#94a3b8" };
  };

  return (
    <Box className="perfil-layout">
      {/* --- AppBar --- */}
      <AppBar position="static" sx={{ background: "#1e293b", boxShadow: "none" }}>
        <Toolbar>
          <IconButton color="inherit" onClick={handleGoBack} sx={{ mr: 1 }}>
            <BackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
            Quiz - {moduleName}
          </Typography>
          <IconButton color="inherit" onClick={() => navigate("/configuracoes")}>
            <Settings />
          </IconButton>
          <IconButton color="inherit" onClick={handleLogout}>
            <Logout />
          </IconButton>
        </Toolbar>
        <LinearProgress variant="determinate" value={progress} color="success" sx={{ height: "6px" }} />
      </AppBar>

      <Box className="perfil-content" sx={{ justifyContent: "center" }}>
        <Card sx={{ width: "90%", maxWidth: 700, background: "rgba(18, 25, 49, 0.9)", color: "white", border: "1px solid #334155", borderRadius: "16px", p: { xs: 2, sm: 3 } }}>
          <CardContent>
            <Typography sx={{ color: "#94a3b8", mb: 2, fontWeight: "bold" }}>
              Pergunta {currentQuestionIndex + 1} de {questions.length}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: "bold", mb: 4, lineHeight: 1.4 }}>
              {question?.pergunta}
            </Typography>

            <FormControl component="fieldset" fullWidth disabled={!!feedback || isSubmitting}>
              <RadioGroup value={selectedAnswer} onChange={handleAnswerSelect}>
                {question?.opcoes?.map((opcao, idx) => (
                  <FormControlLabel
                    key={idx}
                    value={opcao}
                    control={<Radio sx={getRadioColor(opcao)} />}
                    label={<Typography sx={{ color: getOptionStyles(opcao).color || "white" }}>{opcao}</Typography>}
                    sx={{
                      mb: 1.5,
                      borderRadius: "8px",
                      padding: "8px 16px",
                      transition: "all 0.3s ease",
                      ...getOptionStyles(opcao),
                    }}
                  />
                ))}
              </RadioGroup>
            </FormControl>

            {feedback ? (
              <Box
                sx={{
                  mt: 4,
                  p: 3,
                  borderRadius: "12px",
                  background: feedback.success ? "rgba(56, 179, 109, 0.1)" : "rgba(220, 38, 38, 0.1)",
                  border: `1px solid ${feedback.success ? "#38b36d" : "#dc2626"}`,
                  boxShadow: `0 0 10px ${feedback.success ? "rgba(56, 179, 109, 0.5)" : "rgba(220, 38, 38, 0.5)"}`,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 2, pb: 1, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                  <Box sx={{ color: feedback.success ? "#38b36d" : "#dc2626", mr: 1, fontSize: "2rem", display: "flex" }}>
                    <SportsEsports sx={{ transform: feedback.success ? "rotate(0deg)" : "rotate(180deg)", transition: "transform 0.5s" }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: "bold", color: feedback.success ? "#38b36d" : "#dc2626" }}>
                    {feedback.message}
                  </Typography>
                </Box>

                <Typography sx={{ color: "#e0e0e0", mb: 3 }}>{feedback.explicacao}</Typography>

                <Button
                  variant="contained"
                  onClick={handleNext}
                  color="success"
                  sx={{ width: "100%", py: 1.5, fontWeight: "bold", fontSize: "1rem", borderRadius: "12px" }}
                >
                  {currentQuestionIndex + 1 < questions.length ? "Próxima Pergunta" : "Finalizar Quiz"}
                </Button>
              </Box>
            ) : (
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

      <Dialog
        open={showRedoDialog}
        onClose={() => setShowRedoDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            background: "#111827",
            color: "white",
            border: `2px solid #dc2626`,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>Quase lá!</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "#e0e0e0" }}>
            Você errou {incorrectQuestions.length} pergunta(s).  
            Para dominar este módulo, você precisa acertar todas.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: "space-between" }}>
          <Button onClick={handleGoBack} sx={{ color: "#94a3b8" }}>
            Voltar aos Módulos
          </Button>
          <Button
            onClick={handleRedoQuiz}
            variant="contained"
            sx={{ bgcolor: "#38b36d", "&:hover": { bgcolor: "#2f9a5d" }, borderRadius: "8px" }}
          >
            Refazer as {incorrectQuestions.length} erradas
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
