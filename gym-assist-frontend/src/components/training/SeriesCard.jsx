import { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
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

function SeriesCard({ series, isSuggested }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  return (
    <CardWrapper>
      <CardHeader onClick={() => setIsExpanded(!isExpanded)}>
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
          {(series.exercises || []).map((ex) => (
            <ExerciseCard key={ex.id} exercise={ex} />
          ))}
        </ExercisesList>
      )}
    </CardWrapper>
  );
}

export default SeriesCard;
