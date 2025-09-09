import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useAuth } from "../context/AuthContext";
import { getSeriesForUser } from "../services/seriesService";
import {
  getActivePlan,
  updatePlanSeries,
} from "../services/trainingPlanService";
import { getProfile } from "../services/profileService";
import DualListbox from "../components/common/DualListbox";

const PageWrapper = styled.div`
  width: 100%;
`;

const PageHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.medium};
`;

const PageTitle = styled.h2`
  color: ${({ theme }) => theme.colors.primary};
  margin: 0;
`;

const PageDescription = styled.p`
  margin-top: 0;
  margin-bottom: ${({ theme }) => theme.spacing.large};
  color: ${({ theme }) => theme.colors.textSecondary};
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

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    opacity: 0.9;
  }
`;

const ListItem = styled.div`
  padding: 10px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 8px;

  &:hover {
    background-color: ${({ theme }) => theme.colors.surfaceHover};
  }
`;

const SortableItemWrapper = styled.div`
  padding: 10px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 4px;
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  touch-action: none; /* Previne scroll em mobile ao arrastar */
`;

const ItemContent = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const DragHandle = styled.div`
  cursor: grab;
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
  font-size: 1.2rem;
  &:hover {
    color: #e53e3e;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.surfaceHover};
  color: ${({ theme }) => theme.colors.text};
  border-radius: 4px;
  padding: 10px;
  font-size: 1rem;
  margin-bottom: ${({ theme }) => theme.spacing.medium};
`;

function SortableSeriesItem({ series, onRemove }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: series.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <SortableItemWrapper ref={setNodeRef} style={style}>
      <ItemContent>
        <DragHandle {...attributes} {...listeners}>
          ⠿
        </DragHandle>
        <span>{series.name}</span>
      </ItemContent>
      <RemoveButton onClick={() => onRemove(series)}>×</RemoveButton>
    </SortableItemWrapper>
  );
}

function StudentHub() {
  const { studentId } = useParams();
  const { user } = useAuth();

  const [studentProfile, setStudentProfile] = useState(null);
  const [studentPlan, setStudentPlan] = useState(null);
  const [teacherSeriesLibrary, setTeacherSeriesLibrary] = useState([]);
  const [planSeries, setPlanSeries] = useState([]);

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [planData, libraryData, studentData] = await Promise.all([
          getActivePlan(studentId),
          getSeriesForUser(),
          getProfile(studentId),
        ]);

        setStudentPlan(planData);
        setPlanSeries(planData.series);
        setTeacherSeriesLibrary(libraryData);
        setStudentProfile(studentData);
      } catch (err) {
        setError("Falha ao carregar dados de planejamento.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (studentId && user) {
      loadData();
    }
  }, [studentId, user]);

  const handleSavePlan = async () => {
    setIsSaving(true);
    try {
      const seriesIds = planSeries.map((s) => s.id);
      await updatePlanSeries(studentPlan.plan_id, seriesIds);
      alert("Plano salvo com sucesso!");
    } catch (err) {
      alert("Erro ao salvar o plano.");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddSeries = (seriesToAdd) => {
    setPlanSeries((current) => [...current, seriesToAdd]);
  };

  const handleRemoveSeries = (seriesToRemove) => {
    setPlanSeries((current) =>
      current.filter((s) => s.id !== seriesToRemove.id)
    );
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!active || !over) return;

    const activeId = active.id;
    const overId = over.id;

    // Verifica se ambos os itens (o que arrasta e o que está por baixo) estão na lista da direita
    const isActiveInPlan = planSeries.some((s) => s.id === activeId);
    const isOverInPlan = planSeries.some((s) => s.id === overId);

    if (isActiveInPlan && isOverInPlan && activeId !== overId) {
      const oldIndex = planSeries.findIndex((item) => item.id === activeId);
      const newIndex = planSeries.findIndex((item) => item.id === overId);
      setPlanSeries((current) => arrayMove(current, oldIndex, newIndex));
    }
  };

  if (loading) return <p>Carregando gerenciador de planos...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  const availableLibrary = teacherSeriesLibrary
    .filter(
      (libSeries) => !planSeries.some((pSeries) => pSeries.id === libSeries.id)
    )
    .filter((libSeries) =>
      libSeries.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <PageWrapper>
      <PageHeader>
        <PageTitle>
          Gerenciando Plano de: {studentProfile?.name || "Aluno"}
        </PageTitle>
        <SaveButton onClick={handleSavePlan} disabled={isSaving}>
          {isSaving ? "Salvando..." : "Salvar Plano"}
        </SaveButton>
      </PageHeader>

      <PageDescription>
        Arraste ou clique nas séries da sua biblioteca para montar o plano de
        treino ativo do aluno.
      </PageDescription>

      <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
        <DualListbox
          titleAvailable="Sua Biblioteca de Séries"
          titleSelected="Plano Ativo do Aluno"
          availableItems={availableLibrary}
          selectedItems={planSeries}
          // A seleção/movimentação agora é controlada pelos cliques e pelo drag-and-drop
          onSelectionChange={() => {}}
          renderAvailableItem={(series) => (
            <ListItem key={series.id} onClick={() => handleAddSeries(series)}>
              {series.name}
            </ListItem>
          )}
          renderSelectedItem={(series) => (
            <SortableSeriesItem
              key={series.id}
              series={series}
              onRemove={handleRemoveSeries}
            />
          )}
        >
          <SearchInput
            type="text"
            placeholder="Buscar série na biblioteca..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </DualListbox>
      </DndContext>
    </PageWrapper>
  );
}

export default StudentHub;
