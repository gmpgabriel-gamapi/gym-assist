import React from "react";
import styled from "styled-components";

const ExerciseName = styled.h1`
  font-size: 2.5rem;
  color: ${({ theme }) => theme.colors.primary};
  text-align: center;
`;

const ExerciseInfo = styled.p`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.large};
`;

const SetsTrackerWrapper = styled.div`
  width: 100%;
  max-width: 500px;
  margin: ${({ theme }) => theme.spacing.large} 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.medium};
`;

const SetRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.small}
    ${({ theme }) => theme.spacing.medium};
  background-color: ${({ theme, $isCompleted }) =>
    $isCompleted ? "transparent" : theme.colors.surface};
  border: 1px solid
    ${({ theme, $isCompleted }) =>
      $isCompleted ? theme.colors.surface : "transparent"};
  border-radius: 8px;
  min-height: 50px;
`;

const SetLabel = styled.span`
  font-size: 1.1rem;
  font-weight: bold;
  color: ${({ theme, $isCompleted }) =>
    $isCompleted ? theme.colors.textSecondary : theme.colors.text};
`;

const SetInput = styled.input`
  width: 85px;
  padding: 8px;
  border-radius: 4px;
  border: none;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  font-size: 1rem;
`;

const SetLogDisplay = styled.span`
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.primary};
`;

const CompleteSetButton = styled.button`
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.background};
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 1rem;
  cursor: pointer;
`;

const ControlsWrapper = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.medium};
  margin-top: auto;
`;

const ControlButton = styled.button`
  padding: 10px 20px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colors.surface};
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 1rem;
  cursor: pointer;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

function PlayerView({
  exercise,
  performedSetsCount,
  currentSetData,
  onSetDataChange,
  onLogSet,
  onSkipExercise,
  onViewList,
}) {
  const isExerciseDone =
    exercise.status === "completed" || exercise.status === "skipped";

  const getSetRowLabel = (status) => {
    if (status === "completed") return "Concluído";
    if (status === "skipped") return "Pulado";
    return "Aguardando";
  };

  return (
    <>
      <ExerciseName>{exercise.name}</ExerciseName>
      <ExerciseInfo>
        {exercise.sets} séries de {exercise.reps} (Última carga:{" "}
        {exercise.lastLoad})
      </ExerciseInfo>
      <SetsTrackerWrapper>
        {Array.from({ length: parseInt(exercise.sets, 10) }, (_, index) => {
          const setNumber = index + 1;
          const performedSet = exercise.performedSets.find(
            (s) => s.setNumber === setNumber
          );
          const isCompleted = !!performedSet;
          const isCurrent = performedSetsCount === index && !isExerciseDone;
          return (
            <SetRow key={setNumber} $isCompleted={isCompleted}>
              <SetLabel $isCompleted={isCompleted}>Série {setNumber}</SetLabel>
              {isCompleted ? (
                <SetLogDisplay>
                  {performedSet.weight} kg x {performedSet.reps} reps
                </SetLogDisplay>
              ) : isCurrent ? (
                <>
                  <SetInput
                    type="number"
                    placeholder="Carga"
                    value={currentSetData.weight}
                    onChange={(e) =>
                      onSetDataChange({
                        ...currentSetData,
                        weight: e.target.value,
                      })
                    }
                  />
                  <SetInput
                    type="text"
                    placeholder="Reps"
                    value={currentSetData.reps}
                    onChange={(e) =>
                      onSetDataChange({
                        ...currentSetData,
                        reps: e.target.value,
                      })
                    }
                  />
                  <CompleteSetButton onClick={onLogSet}>
                    Concluir
                  </CompleteSetButton>
                </>
              ) : (
                <span>{getSetRowLabel(exercise.status)}</span>
              )}
            </SetRow>
          );
        })}
      </SetsTrackerWrapper>
      <ControlsWrapper>
        <ControlButton onClick={onViewList}>Ver Lista Completa</ControlButton>
        <ControlButton onClick={onSkipExercise} disabled={isExerciseDone}>
          Pular Exercício
        </ControlButton>
      </ControlsWrapper>
    </>
  );
}

export default PlayerView;
