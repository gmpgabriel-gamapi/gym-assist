// [FRONTEND] arquivo: src/pages/SeriesEditor.jsx (MODIFICADO)
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../context/AuthContext";
import { getMuscleGroups } from "../services/muscleGroupService";
import { getAllExercises } from "../services/exerciseService";
import {
  getSeriesById,
  createSeries,
  updateSeries,
  getSeriesVersions,
} from "../services/seriesService";
import DualListbox from "../components/common/DualListbox";
import SeriesExerciseItem from "../components/training/SeriesExerciseItem";
import CustomDropdown from "../components/common/CustomDropdown";
import VersionHistoryModal from "../components/training/VersionHistoryModal";

const PageHeader = styled.header`
  margin-bottom: ${({ theme }) => theme.spacing.large};
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.medium};
`;

const PageTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.medium};
  flex-wrap: wrap;
`;

const PageTitle = styled.h2`
  color: ${({ theme }) => theme.colors.primary};
  margin: 0;
`;

const VersionBadge = styled.span`
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: bold;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.medium};
`;

const SaveButton = styled.button`
  padding: 10px 20px;
  border-radius: 4px;
  border: none;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.background};
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 1.1rem;
  cursor: pointer;
  &:hover {
    opacity: 0.9;
  }
`;

const BackButton = styled.button`
  padding: 10px 20px;
  border-radius: 4px;
  border: none;
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 1.1rem;
  cursor: pointer;
  &:hover {
    opacity: 0.9;
  }
`;

const SeriesNameInput = styled.input`
  width: 100%;
  font-size: 1.2rem;
  padding: 8px;
  margin-bottom: ${({ theme }) => theme.spacing.medium};
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colors.surface};
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
`;

const TemplateWrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 8px;
  padding: ${({ theme }) => theme.spacing.medium};
  margin-bottom: ${({ theme }) => theme.spacing.large};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.medium};
`;

const FiltersWrapper = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.medium};
  margin-bottom: ${({ theme }) => theme.spacing.medium};
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 8px;
  border-radius: 4px;
  border: none;
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.fonts.body};
`;

const ExerciseItem = styled.li`
  padding: 10px;
  background-color: ${({ theme }) => theme.colors.surface};
  margin-bottom: ${({ theme }) => theme.spacing.small};
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => theme.colors.surfaceHover};
  }
`;

const TemplateFilterIndicator = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing.small}
    ${({ theme }) => theme.spacing.medium};
  border-radius: 4px;
  margin-bottom: ${({ theme }) => theme.spacing.medium};
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
`;

const ClearButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

function SeriesEditor() {
  const { seriesId } = useParams();
  const isEditMode = Boolean(seriesId);
  const { user, viewingProfile } = useAuth();
  const navigate = useNavigate();

  const [seriesName, setSeriesName] = useState("");
  const [currentSeries, setCurrentSeries] = useState(null);
  const [seriesExercises, setSeriesExercises] = useState([]);
  const [exerciseLibrary, setExerciseLibrary] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [muscleGroupFilter, setMuscleGroupFilter] = useState("all");
  const [muscleGroups, setMuscleGroups] = useState([]);
  const [templateSource, setTemplateSource] = useState("none");
  const [templateOptions, setTemplateOptions] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [versionHistory, setVersionHistory] = useState([]);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [exercisesData, muscleGroupsData] = await Promise.all([
          getAllExercises(),
          getMuscleGroups(),
        ]);
        exercisesData.sort((a, b) => a.name.localeCompare(b.name));
        setExerciseLibrary(exercisesData);
        const groupOptions = [
          { value: "all", label: "Todos os Grupos" },
          ...muscleGroupsData.map((g) => ({ value: g.id, label: g.name })),
        ];
        setMuscleGroups(groupOptions);
        if (isEditMode && seriesId) {
          const seriesToEdit = await getSeriesById(seriesId);
          if (seriesToEdit) {
            setSeriesName(seriesToEdit.name);
            setCurrentSeries(seriesToEdit);
            const exercisesWithConfig = seriesToEdit.exercises.map((ex) => ({
              ...ex,
              sets: ex.sets || "",
              reps: ex.reps || "",
            }));
            setSeriesExercises(exercisesWithConfig);
          }
        }
      } catch (err) {
        setError("Falha ao carregar dados da página.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, [seriesId, isEditMode]);

  useEffect(() => {
    let options = [];
    if (templateSource === "student") {
    } else if (templateSource === "personal") {
    }
    setTemplateOptions(options);
    setSelectedTemplate(null);
  }, [templateSource, user]);

  const currentProfile = viewingProfile || user;

  const sourceOptions = (() => {
    let options = [{ value: "none", label: "Nenhuma" }];
    if (user && user.role === "teacher") {
      if (viewingProfile) {
        options.push({
          value: "student",
          label: `Séries de ${currentProfile.name}`,
        });
      }
      options.push({ value: "personal", label: "Minhas Séries Pessoais" });
      options.push({ value: "templates", label: "Meus Templates" });
    } else if (user && user.role === "student") {
      options.push({ value: "own_series", label: "Minhas Séries" });
    }
    return options;
  })();

  const availableExercises = exerciseLibrary
    .filter((ex) => {
      if (selectedTemplate) {
        return false;
      }
      return true;
    })
    .filter((ex) => !seriesExercises.some((seriesEx) => seriesEx.id === ex.id))
    .filter((ex) => {
      if (muscleGroupFilter === "all") return true;
      return (
        ex.muscle_group_ids && ex.muscle_group_ids.includes(muscleGroupFilter)
      );
    })
    .filter((ex) => ex.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleAddExercise = (exercise) => {
    const newExercise = { ...exercise, sets: "", reps: "" };
    setSeriesExercises((current) => [...current, newExercise]);
  };

  const handleRemoveExercise = (exerciseToRemove) => {
    setSeriesExercises((current) =>
      current.filter((ex) => ex.id !== exerciseToRemove.id)
    );
  };

  const handleTemplateSelect = (option) => {
    setSelectedTemplate(option);
  };

  const clearTemplateFilter = () => {
    setTemplateSource("none");
    setSelectedTemplate(null);
  };

  const handleConfigChange = (id, field, value) => {
    setSeriesExercises((current) =>
      current.map((ex) => (ex.id === id ? { ...ex, [field]: value } : ex))
    );
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      const oldIndex = seriesExercises.findIndex(
        (item) => item.id === active.id
      );
      const newIndex = seriesExercises.findIndex((item) => item.id === over.id);
      setSeriesExercises((items) => arrayMove(items, oldIndex, newIndex));
    }
  };

  const handleSaveSeries = async () => {
    if (!seriesName.trim()) {
      alert("O nome da série é obrigatório.");
      return;
    }
    const seriesData = {
      name: seriesName,
      exercises: seriesExercises.map((ex, index) => ({
        id: ex.id,
        type: ex.type,
        sets: ex.sets || null,
        reps: ex.reps || null,
        order: index,
      })),
    };
    try {
      if (isEditMode) {
        await updateSeries(seriesId, seriesData);
      } else {
        await createSeries(seriesData);
      }
      alert("Série salva com sucesso!");
      navigate("/series");
    } catch (err) {
      console.error("Falha ao salvar a série:", err);
      alert(err.message || "Não foi possível salvar a série.");
    }
  };

  const handleOpenHistory = async () => {
    if (!seriesId) return;
    try {
      const versions = await getSeriesVersions(seriesId);
      setVersionHistory(versions);
      setIsHistoryOpen(true);
    } catch (err) {
      alert(err.message || "Não foi possível carregar o histórico.");
    }
  };

  const title = isEditMode
    ? `Editando Série`
    : `Criar Nova Série para ${currentProfile?.name}`;

  if (loading) {
    return <div>Carregando editor de séries...</div>;
  }
  if (error) {
    return <div>Erro: {error}</div>;
  }

  return (
    <div
      style={{
        height: "calc(100vh - 120px)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <PageHeader>
        <PageTitleWrapper>
          <PageTitle>{title}</PageTitle>
          {isEditMode && currentSeries && (
            <VersionBadge>Versão: {currentSeries.version}</VersionBadge>
          )}
        </PageTitleWrapper>
        <ButtonGroup>
          {isEditMode &&
            currentSeries &&
            (currentSeries.version > 1 || currentSeries.parent_series_id) && (
              <BackButton onClick={handleOpenHistory}>
                Versões Anteriores
              </BackButton>
            )}
          {/* --- MODIFICAÇÃO: O botão Voltar agora sempre leva para /series --- */}
          <BackButton onClick={() => navigate("/series")}>Voltar</BackButton>
          <SaveButton onClick={handleSaveSeries}>Salvar Série</SaveButton>
        </ButtonGroup>
      </PageHeader>

      {!isEditMode && (
        <TemplateWrapper>
          <span>Usar como modelo:</span>
          <CustomDropdown
            options={sourceOptions}
            value={templateSource}
            onChange={(option) => setTemplateSource(option.value)}
          />
          <CustomDropdown
            options={templateOptions}
            value={selectedTemplate?.value}
            onChange={handleTemplateSelect}
            placeholder="Selecione um modelo..."
            disabled={templateSource === "none" || templateOptions.length === 0}
          />
        </TemplateWrapper>
      )}

      <SeriesNameInput
        type="text"
        placeholder={`Dê um nome para a série...`}
        value={seriesName}
        onChange={(e) => setSeriesName(e.target.value)}
      />
      <DualListbox
        titleAvailable="Exercícios Disponíveis"
        titleSelected="Exercícios na Série Atual"
        availableItems={availableExercises}
        selectedItems={seriesExercises}
        onSelectionChange={setSeriesExercises}
        renderAvailableItem={(exercise) => (
          <ExerciseItem
            key={exercise.id}
            onClick={() => handleAddExercise(exercise)}
          >
            {exercise.name}
          </ExerciseItem>
        )}
        renderSelectedItem={(exercise) => (
          <SeriesExerciseItem
            key={exercise.id}
            exercise={exercise}
            onRemove={handleRemoveExercise}
            onConfigChange={handleConfigChange}
          />
        )}
      >
        {selectedTemplate && (
          <TemplateFilterIndicator>
            <span>
              Mostrando exercícios de: <strong>{selectedTemplate.label}</strong>
            </span>
            <ClearButton onClick={clearTemplateFilter}>Limpar</ClearButton>
          </TemplateFilterIndicator>
        )}
        <FiltersWrapper>
          <CustomDropdown
            options={muscleGroups}
            value={muscleGroupFilter}
            onChange={(option) => setMuscleGroupFilter(option.value)}
          />
          <SearchInput
            type="text"
            placeholder="Buscar exercício..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </FiltersWrapper>
      </DualListbox>

      <VersionHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        versions={versionHistory}
      />
    </div>
  );
}

export default SeriesEditor;
