import { useState, useEffect } from "react";
import styled from "styled-components";
import { getMuscleGroups } from "../../services/muscleGroupService";
import CustomDropdown from "../common/CustomDropdown";

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

const ModalContent = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing.large};
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
`;

const ModalTitle = styled.h3`
  margin-top: 0;
  margin-bottom: ${({ theme }) => theme.spacing.large};
  color: ${({ theme }) => theme.colors.primary};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.medium};
`;

const Input = styled.input`
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.surfaceHover};
  color: ${({ theme }) => theme.colors.text};
  border-radius: 4px;
  padding: 12px;
  font-size: 1rem;
  width: 100%;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.medium};
  margin-top: ${({ theme }) => theme.spacing.medium};
  justify-content: flex-end;
`;

const Button = styled.button`
  padding: 10px 20px;
  border-radius: 4px;
  border: none;
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 1rem;
  cursor: pointer;
  transition: opacity 0.2s;
  &:hover {
    opacity: 0.9;
  }
`;

const PrimaryButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.background};
`;

const SecondaryButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.surfaceHover};
  color: ${({ theme }) => theme.colors.text};
`;

function ExerciseFormModal({ isOpen, onClose, onSubmit, initialData }) {
  const [name, setName] = useState("");
  const [muscleGroupId, setMuscleGroupId] = useState("");
  const [muscleGroups, setMuscleGroups] = useState([]);

  const isEditMode = Boolean(initialData);

  useEffect(() => {
    if (isOpen) {
      // Busca os grupos musculares para o dropdown
      getMuscleGroups().then((data) => {
        const options = data.map((group) => ({
          value: group.id,
          label: group.name,
        }));
        setMuscleGroups(options);
      });

      // Se estiver em modo de edição, preenche o formulário
      if (isEditMode) {
        setName(initialData.name);
        setMuscleGroupId(initialData.primary_muscle_group_id);
      }
    } else {
      setName("");
      setMuscleGroupId("");
    }
  }, [isOpen, initialData, isEditMode]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, muscleGroupId });
  };

  return (
    <ModalBackdrop onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalTitle>
          {isEditMode ? "Editar Exercício" : "Adicionar Novo Exercício"}
        </ModalTitle>
        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Nome do exercício"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <CustomDropdown
            options={muscleGroups}
            value={muscleGroupId}
            onChange={(option) => setMuscleGroupId(option.value)}
            placeholder="Grupo Muscular Principal"
          />
          <ButtonGroup>
            <SecondaryButton type="button" onClick={onClose}>
              Cancelar
            </SecondaryButton>
            <PrimaryButton type="submit">Salvar</PrimaryButton>
          </ButtonGroup>
        </Form>
      </ModalContent>
    </ModalBackdrop>
  );
}

export default ExerciseFormModal;
