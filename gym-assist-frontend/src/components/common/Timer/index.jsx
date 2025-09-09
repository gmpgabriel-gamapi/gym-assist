import { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { useAuth } from "../../../context/AuthContext";

const TimerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.medium};
`;

const TimerWrapper = styled.div`
  font-family: "Roboto Mono", monospace;
  font-size: 5rem;
  color: ${({ theme }) => theme.colors.primary};
  text-align: center;
`;

const PhaseLabel = styled.p`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
  font-family: ${({ theme }) => theme.fonts.heading};
`;

const Controls = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.small};
`;

const TimerButton = styled.button`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.surfaceHover};
  color: ${({ theme }) => theme.colors.text};
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  &:hover {
    background-color: ${({ theme }) => theme.colors.surfaceHover};
  }
`;

const formatTime = (timeInSeconds) => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}`;
};

const createSound = (src) => new Audio(src);

function Timer({ action, interval = 0, repetitions = 0, onComplete }) {
  const { volume } = useAuth();
  const [phase, setPhase] = useState("action");
  const [timeLeft, setTimeLeft] = useState(action);
  const [repsLeft, setRepsLeft] = useState(repetitions);
  const [isPaused, setIsPaused] = useState(false);

  const playSound = (soundSrc) => {
    const sound = createSound(soundSrc);
    sound.volume = volume;
    sound.play();
  };

  const handleComplete = useCallback(() => {
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    if (isPaused) return;

    if (timeLeft <= 0) {
      if (phase === "action") {
        playSound("/sounds/alarme_execucao.mp3");
        if (repsLeft > 0) {
          setPhase("interval");
          setTimeLeft(interval);
          setRepsLeft((r) => r - 1);
        } else {
          handleComplete();
        }
      } else if (phase === "interval") {
        playSound("/sounds/alarme_intervalo.mp3");
        setPhase("action");
        setTimeLeft(action);
      }
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [
    timeLeft,
    phase,
    repsLeft,
    action,
    interval,
    handleComplete,
    isPaused,
    volume,
  ]);

  useEffect(() => {
    if (isPaused) return;

    if (timeLeft > 0 && timeLeft % 60 === 0) {
      playSound("/sounds/alarme_minutos_cheio.mp3");
    }
    if (timeLeft > 0 && timeLeft % 10 === 0 && timeLeft % 60 !== 0) {
      playSound("/sounds/alarme_segundos_cheio.mp3");
    }
    if (timeLeft <= 3 && timeLeft > 0) {
      playSound("/sounds/alarme_contagem_regressiva.mp3");
    }
  }, [timeLeft, isPaused, volume]);

  const handlePauseToggle = () => setIsPaused((prev) => !prev);
  const handleAddMinute = () => setTimeLeft((t) => t + 60);
  const handleRestart = () => {
    setIsPaused(false);
    setTimeLeft(action);
    setPhase("action");
    setRepsLeft(repetitions);
  };
  const handleSkip = () => handleComplete();

  const getPhaseLabel = () => {
    if (phase === "action" && repetitions > 0)
      return `Execução (${repetitions - repsLeft}/${repetitions + 1})`;
    if (phase === "interval")
      return `Intervalo (${repetitions - repsLeft}/${repetitions})`;
    return "Descansar";
  };

  return (
    <TimerContainer>
      <PhaseLabel>{getPhaseLabel()}</PhaseLabel>
      <TimerWrapper>{formatTime(timeLeft)}</TimerWrapper>
      <Controls>
        <TimerButton onClick={handlePauseToggle}>
          {isPaused ? "Continuar" : "Pausar"}
        </TimerButton>
        <TimerButton onClick={handleAddMinute}>+1 min</TimerButton>
        <TimerButton onClick={handleRestart}>Reiniciar</TimerButton>
        <TimerButton onClick={handleSkip}>Pular</TimerButton>
      </Controls>
    </TimerContainer>
  );
}

export default Timer;
