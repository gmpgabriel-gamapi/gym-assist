// [FRONTEND] arquivo: src/components/training/SeriesCard.jsx (MODIFICADO)
import { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { getSeriesById } from "../../services/seriesService"; // Importa o serviço
import ExerciseCard from "./ExerciseCard";

const CardWrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 8px;
  padding: ${({ theme }) => theme.spacing.medium};
  margin-bottom: ${({ theme }) => theme.spacing.medium};
  border: 1px solid transparent;
  transition: all 0.2s ease-in-out;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`;

const Title = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
`;

const HeaderControls = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.medium};
`;

const SuggestedTag = styled.span`
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.background};
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: bold;
`;

const ExpandIcon = styled.span`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  transform: ${({ $isExpanded }) =>
    $isExpanded ? "rotate(180deg)" : "rotate(0deg)"};
  transition: transform 0.2s ease-in-out;
`;

const StartButton = styled.button`
  padding: 4px 8px;
  border-radius: 4px;
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 0.9rem;
  cursor: pointer;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  background-color: transparent;
  color: ${({ theme }) => theme.colors.primary};

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.background};
  }
`;

const ExercisesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};
  margin-top: ${({ theme }) => theme.spacing.medium};
  padding-top: ${({ theme }) => theme.spacing.medium};
  border-top: 1px solid ${({ theme }) => theme.colors.background};
`;

const InfoText = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-style: italic;
  font-size: 0.9rem;
`;

function SeriesCard({ series, isSuggested }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [detailedSeries, setDetailedSeries] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleExpandToggle = async () => {
    const nextIsExpanded = !isExpanded;
    setIsExpanded(nextIsExpanded);

    // Busca os dados apenas na primeira vez que o card é expandido
    if (nextIsExpanded && !detailedSeries) {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getSeriesById(series.id);
        setDetailedSeries(data);
      } catch (err) {
        setError("Não foi possível carregar os exercícios.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <CardWrapper>
      <CardHeader onClick={handleExpandToggle}>
        <Title>{series.name}</Title>
        <HeaderControls>
          {isSuggested && <SuggestedTag>Sugerido</SuggestedTag>}
          {!isSuggested && (
            <StartButton
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/treino/player/${series.id}`);
              }}
            >
              Iniciar
            </StartButton>
          )}
          <ExpandIcon $isExpanded={isExpanded}>▼</ExpandIcon>
        </HeaderControls>
      </CardHeader>
      {isExpanded && (
        <ExercisesList>
          {isLoading && <InfoText>Carregando exercícios...</InfoText>}
          {error && <InfoText style={{ color: "#E53E3E" }}>{error}</InfoText>}
          {detailedSeries && detailedSeries.exercises.length === 0 && (
            <InfoText>Esta série não possui exercícios.</InfoText>
          )}
          {detailedSeries &&
            detailedSeries.exercises.map((ex) => (
              <ExerciseCard key={ex.id} exercise={ex} />
            ))}
        </ExercisesList>
      )}
    </CardWrapper>
  );
}

export default SeriesCard;
