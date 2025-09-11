// [FRONTEND] arquivo: src/components/exercises/ExerciseFormModal.jsx (VERSÃO FINAL COMPLETA E SEM ABREVIAÇÕES)
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
  border: 1px solid
    ${({ theme, hasError }) =>
      hasError ? "#E53E3E" : theme.colors.surfaceHover};
  color: ${({ theme }) => theme.colors.text};
  border-radius: 4px;
  padding: 12px;
  font-size: 1rem;
  width: 100%;
  transition: border-color 0.2s;
`;

const Textarea = styled.textarea`
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid
    ${({ theme, hasError }) =>
      hasError ? "#E53E3E" : theme.colors.surfaceHover};
  color: ${({ theme }) => theme.colors.text};
  border-radius: 4px;
  padding: 12px;
  font-size: 1rem;
  font-family: ${({ theme }) => theme.fonts.body};
  width: 100%;
  min-height: 100px;
  resize: vertical;
  transition: border-color 0.2s;
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
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SecondaryButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.surfaceHover};
  color: ${({ theme }) => theme.colors.text};
`;

const FormControl = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const FieldError = styled.span`
  color: #e53e3e;
  font-size: 0.85rem;
  padding-left: 4px;
`;

function ExerciseFormModal({ isOpen, onClose, onSubmit, initialData }) {
  const [name, setName] = useState("");
  const [muscleGroupId, setMuscleGroupId] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [muscleGroups, setMuscleGroups] = useState([]);
  const [errors, setErrors] = useState({});

  const isEditMode = Boolean(initialData);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const data = await getMuscleGroups();
        const options = data.map((group) => ({
          value: group.id,
          label: group.name,
        }));
        setMuscleGroups(options);
      } catch (error) {
        console.error("Falha ao buscar grupos musculares", error);
      }
    };

    if (isOpen) {
      fetchGroups();
      if (isEditMode) {
        setName(initialData.name);
        setMuscleGroupId(initialData.primary_muscle_group_id);
        setDescription(initialData.description || "");
        setVideoUrl(initialData.video_url || "");
      }
    } else {
      setName("");
      setMuscleGroupId("");
      setDescription("");
      setVideoUrl("");
      setErrors({});
    }
  }, [isOpen, initialData, isEditMode]);

  if (!isOpen) {
    return null;
  }

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "O nome é obrigatório.";
    if (!muscleGroupId)
      newErrors.muscleGroupId = "Selecione um grupo muscular.";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    setErrors({});
    onSubmit({ name, muscleGroupId, description, videoUrl });
  };

  const isFormInvalid = !name || !muscleGroupId;

  return (
    <ModalBackdrop onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalTitle>
          {isEditMode ? "Editar Exercício" : "Adicionar Novo Exercício"}
        </ModalTitle>
        <Form onSubmit={handleSubmit}>
          <FormControl>
            <Input
              type="text"
              placeholder="Nome do exercício"
              value={name}
              onChange={(e) => setName(e.target.value)}
              hasError={!!errors.name}
            />
            {errors.name && <FieldError>{errors.name}</FieldError>}
          </FormControl>

          <FormControl>
            <CustomDropdown
              options={muscleGroups}
              value={muscleGroupId}
              onChange={(option) => setMuscleGroupId(option.value)}
              placeholder="Grupo Muscular Principal"
              hasError={!!errors.muscleGroupId}
            />
            {errors.muscleGroupId && (
              <FieldError>{errors.muscleGroupId}</FieldError>
            )}
          </FormControl>

          <FormControl>
            <Textarea
              placeholder="Descrição / Instruções de execução (opcional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormControl>

          <FormControl>
            <Input
              type="url"
              placeholder="URL do vídeo (opcional)"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
            />
          </FormControl>

          <ButtonGroup>
            <SecondaryButton type="button" onClick={onClose}>
              Cancelar
            </SecondaryButton>
            <PrimaryButton type="submit" disabled={isFormInvalid}>
              Salvar
            </PrimaryButton>
          </ButtonGroup>
        </Form>
      </ModalContent>
    </ModalBackdrop>
  );
}

export default ExerciseFormModal;
