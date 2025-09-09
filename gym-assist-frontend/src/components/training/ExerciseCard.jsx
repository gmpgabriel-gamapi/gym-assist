import styled from "styled-components";

const CardWrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing.medium};
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ExerciseInfo = styled.div`
  & > h4 {
    color: ${({ theme }) => theme.colors.text};
    font-size: 1.1rem;
  }
  & > p {
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 0.9rem;
  }
`;

const LastLoad = styled.div`
  font-size: 1rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
`;

function ExerciseCard({ exercise }) {
  return (
    <CardWrapper>
      <ExerciseInfo>
        <h4>{exercise.name}</h4>
        <p>
          {exercise.sets} x {exercise.reps}
        </p>
      </ExerciseInfo>
      <LastLoad>{exercise.lastLoad}</LastLoad>
    </CardWrapper>
  );
}

export default ExerciseCard;
