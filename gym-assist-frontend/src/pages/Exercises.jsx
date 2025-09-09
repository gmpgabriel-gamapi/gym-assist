import { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import {
  getAllExercises,
  createCustomExercise,
  updateCustomExercise,
  deleteCustomExercise,
} from "../services/exerciseService";
import { getMuscleGroups } from "../services/muscleGroupService";
import ExerciseFormModal from "../components/exercises/ExerciseFormModal";
import CustomDropdown from "../components/common/CustomDropdown";

const PageWrapper = styled.div`
  width: 100%;
`;

const PageHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.large};
`;

const PageTitle = styled.h2`
  color: ${({ theme }) => theme.colors.primary};
  margin: 0;
`;

const PrimaryButton = styled.button`
  padding: 10px 20px;
  border-radius: 4px;
  border: none;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.background};
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 1rem;
  cursor: pointer;
  transition: opacity 0.2s;
  &:hover {
    opacity: 0.9;
  }
`;

const FiltersWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.medium};
  margin-bottom: ${({ theme }) => theme.spacing.large};
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing.large};
  border-radius: 8px;
  align-items: center;
`;

const SearchInput = styled.input`
  flex: 1 1 200px;
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.surfaceHover};
  color: ${({ theme }) => theme.colors.text};
  border-radius: 4px;
  padding: 10px;
  font-size: 1rem;
  min-width: 200px;
`;

const ExerciseList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.medium};
  justify-content: start; /* Garante alinhamento à esquerda em telas largas */
`;

const ExerciseCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing.medium};
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  transition: all 0.2s ease-in-out;
  border: 1px solid transparent;
  min-height: 120px;

  &:hover {
    transform: translateY(-4px);
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.small};
  flex: 1;
`;

const ExerciseName = styled.strong`
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.1rem;
  padding-right: 10px;
`;

const TypeTag = styled.span`
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: bold;
  background-color: ${({ theme, type }) =>
    type === "base" ? theme.colors.primary : theme.colors.textSecondary};
  color: ${({ theme }) => theme.colors.background};
  white-space: nowrap;
  height: fit-content;
`;

const ActionButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.medium};
  align-items: center;
  padding-top: ${({ theme }) => theme.spacing.medium};
  border-top: 1px solid ${({ theme }) => theme.colors.surfaceHover};
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  font-size: 0.9rem;
  font-family: ${({ theme }) => theme.fonts.body};
  padding: 0;
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

function Exercises() {
  const [allExercises, setAllExercises] = useState([]);
  const [muscleGroups, setMuscleGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [muscleGroupFilter, setMuscleGroupFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [exercisesData, muscleGroupsData] = await Promise.all([
          getAllExercises(),
          getMuscleGroups(),
        ]);
        setAllExercises(exercisesData);
        const groupOptions = [
          { value: "all", label: "Todos os Grupos" },
          ...muscleGroupsData.map((g) => ({ value: g.id, label: g.name })),
        ];
        setMuscleGroups(groupOptions);
      } catch (err) {
        setError(err.message || "Falha ao buscar dados");
      } finally {
        setLoading(false);
      }
    };
    fetchPageData();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingExercise(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (exercise) => {
    setEditingExercise(exercise);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingExercise(null);
  };

  const handleDelete = async (exerciseId) => {
    if (
      window.confirm(
        "Tem certeza que deseja excluir este exercício? Esta ação não pode ser desfeita."
      )
    ) {
      try {
        await deleteCustomExercise(exerciseId);
        fetchPageData();
      } catch (err) {
        console.error("Falha ao deletar exercício", err);
        alert(err.message);
      }
    }
  };

  const handleFormSubmit = async (exerciseData) => {
    try {
      if (editingExercise) {
        await updateCustomExercise(editingExercise.id, exerciseData);
      } else {
        await createCustomExercise(exerciseData);
      }
      handleCloseModal();
      fetchPageData();
    } catch (err) {
      console.error("Falha ao salvar exercício", err);
      alert(err.message);
    }
  };

  const filteredExercises = useMemo(() => {
    return allExercises
      .filter((ex) => typeFilter === "all" || ex.type === typeFilter)
      .filter((ex) => {
        if (muscleGroupFilter === "all") return true;
        return (
          ex.muscle_group_ids && ex.muscle_group_ids.includes(muscleGroupFilter)
        );
      })
      .filter((ex) => ex.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [allExercises, searchTerm, muscleGroupFilter, typeFilter]);

  if (loading) {
    return (
      <PageWrapper>
        <PageHeader>
          <PageTitle>Gerenciar Exercícios</PageTitle>
        </PageHeader>
        <p>Carregando exercícios...</p>
      </PageWrapper>
    );
  }

  if (error) {
    return (
      <PageWrapper>
        <PageHeader>
          <PageTitle>Gerenciar Exercícios</PageTitle>
        </PageHeader>
        <p style={{ color: "#E53E3E" }}>Erro: {error}</p>
      </PageWrapper>
    );
  }

  const typeOptions = [
    { value: "all", label: "Todos os Tipos" },
    { value: "base", label: "Sistema" },
    { value: "custom", label: "Customizado" },
  ];

  return (
    <PageWrapper>
      <PageHeader>
        <PageTitle>Gerenciar Exercícios</PageTitle>
        <PrimaryButton onClick={handleOpenCreateModal}>
          + Adicionar Exercício
        </PrimaryButton>
      </PageHeader>

      <FiltersWrapper>
        <SearchInput
          placeholder="Buscar por nome..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <CustomDropdown
          options={muscleGroups}
          value={muscleGroupFilter}
          onChange={(option) => setMuscleGroupFilter(option.value)}
          placeholder="Filtrar por Grupo"
        />
        <CustomDropdown
          options={typeOptions}
          value={typeFilter}
          onChange={(option) => setTypeFilter(option.value)}
          placeholder="Filtrar por Tipo"
        />
      </FiltersWrapper>

      <ExerciseList>
        {filteredExercises.map((ex) => (
          <ExerciseCard key={ex.id}>
            <CardHeader>
              <ExerciseName>{ex.name}</ExerciseName>
              <TypeTag type={ex.type}>
                {ex.type === "base" ? "Sistema" : "Customizado"}
              </TypeTag>
            </CardHeader>
            {ex.type === "custom" && (
              <ActionButtonGroup>
                <ActionButton onClick={() => handleOpenEditModal(ex)}>
                  Editar
                </ActionButton>
                <ActionButton onClick={() => handleDelete(ex.id)}>
                  Excluir
                </ActionButton>
              </ActionButtonGroup>
            )}
          </ExerciseCard>
        ))}
      </ExerciseList>

      <ExerciseFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
        initialData={editingExercise}
      />
    </PageWrapper>
  );
}

export default Exercises;
