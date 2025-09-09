import styled from "styled-components";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const DragHandle = styled.div`
  cursor: grab;
  padding: 0 10px;
  color: ${({ theme }) => theme.colors.textSecondary};
  &:active {
    cursor: grabbing;
  }
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  padding: 0 10px;
  font-size: 1.2rem;

  &:hover {
    color: #e53e3e; /* Um tom de vermelho para o hover */
  }
`;

const ItemWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};
  padding: 10px 0;
  background-color: ${({ theme }) => theme.colors.surface};
  margin-bottom: ${({ theme }) => theme.spacing.small};
  border-radius: 4px;
`;

const ExerciseName = styled.span`
  flex: 1;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: bold;
`;

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};
`;

const Input = styled.input`
  width: 65px;
  padding: 4px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colors.background};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
`;

// O componente agora recebe props para controlar os inputs e a remoção
function SeriesExerciseItem({ exercise, onRemove, onConfigChange }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: exercise.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onConfigChange(exercise.id, name, value);
  };

  const handleRemoveClick = (e) => {
    e.stopPropagation(); // Impede que o evento acione o D&D
    onRemove(exercise);
  };

  return (
    <ItemWrapper ref={setNodeRef} style={style}>
      <DragHandle {...attributes} {...listeners}>
        ⠿
      </DragHandle>
      <ExerciseName>{exercise.name}</ExerciseName>
      <InputGroup>
        <Input
          type="number"
          placeholder="Séries"
          name="sets"
          value={exercise.sets}
          onChange={handleInputChange}
        />
        <span>x</span>
        <Input
          type="text"
          placeholder="Reps"
          name="reps"
          value={exercise.reps}
          onChange={handleInputChange}
        />
      </InputGroup>
      <RemoveButton onClick={handleRemoveClick}>&times;</RemoveButton>
    </ItemWrapper>
  );
}

export default SeriesExerciseItem;
