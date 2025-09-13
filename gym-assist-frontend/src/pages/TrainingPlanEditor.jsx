// [FRONTEND] arquivo: src/pages/TrainingPlanEditor.jsx (VERSÃO 100% COMPLETA)
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { DndContext, DragOverlay, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useAuth } from "../context/AuthContext";
import {
  getActivePlan,
  updatePlanSeries,
} from "../services/trainingPlanService";
import { getAllSeries } from "../services/seriesService";
import PlanSeriesItem from "../components/training/PlanSeriesItem";
import WeeklyPlanner from "../components/training/WeeklyPlanner";
import ModeSwitch from "../components/common/ModeSwitch";

const PageWrapper = styled.div`
  width: 100%;
  height: calc(100vh - 120px);
  display: flex;
  flex-direction: column;
`;

const PageHeader = styled.header`
  margin-bottom: ${({ theme }) => theme.spacing.medium};
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.medium};
`;

const PageTitle = styled.h2`
  color: ${({ theme }) => theme.colors.primary};
  margin: 0;
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
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
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

const ModeSelectorContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.medium};
  margin-bottom: ${({ theme }) => theme.spacing.medium};
  padding: ${({ theme }) => theme.spacing.small}
    ${({ theme }) => theme.spacing.medium};
  border-radius: 8px;
`;

const ClearButton = styled.button`
  background: none;
  border: 1px solid ${({ theme }) => theme.colors.surfaceHover};
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  &:hover {
    background-color: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.text};
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.large};
  flex: 1;
  overflow: hidden;
`;

const Panel = styled.div`
  flex: 1;
  min-width: 0;
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing.medium};
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
`;

const PanelTitle = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing.medium} 0;
  padding-bottom: ${({ theme }) => theme.spacing.medium};
  border-bottom: 1px solid ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
`;

const ItemList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  overflow-y: auto;
  padding-right: 8px;
  height: 100%;
`;

const SeriesItem = styled.li`
  padding: 12px;
  background-color: ${({ theme }) => theme.colors.surface};
  margin-bottom: ${({ theme }) => theme.spacing.small};
  border-radius: 4px;
  cursor: pointer;
  border: 1px solid ${({ theme }) => theme.colors.surfaceHover};
  &:hover {
    background-color: ${({ theme }) => theme.colors.surfaceHover};
  }
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

function TrainingPlanEditor() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sequencingMode, setSequencingMode] = useState("loop");
  const [activePlan, setActivePlan] = useState(null);
  const [allSeries, setAllSeries] = useState([]);
  const [planSeries, setPlanSeries] = useState([]);
  const [weeklyPlan, setWeeklyPlan] = useState({
    monday: null,
    tuesday: null,
    wednesday: null,
    thursday: null,
    friday: null,
    saturday: null,
    sunday: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [seriesSearchTerm, setSeriesSearchTerm] = useState("");
  const [activeSeries, setActiveSeries] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const [planData, allSeriesData] = await Promise.all([
          getActivePlan(user.id),
          getAllSeries(),
        ]);
        setActivePlan(planData);
        setAllSeries(allSeriesData);
        if (planData && planData.series) {
          setPlanSeries(planData.series);
        }
      } catch (err) {
        setError("Falha ao carregar dados.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const availableSeries = useMemo(() => {
    const activeIdsInPlan =
      sequencingMode === "loop"
        ? planSeries.map((s) => s.id)
        : Object.values(weeklyPlan)
            .filter(Boolean)
            .map((s) => s.id);
    const activeIdsSet = new Set(activeIdsInPlan);
    const seriesToFilter =
      sequencingMode === "loop"
        ? allSeries.filter((s) => !activeIdsSet.has(s.id))
        : allSeries;
    return seriesToFilter.filter((s) =>
      s.name.toLowerCase().includes(seriesSearchTerm.toLowerCase())
    );
  }, [allSeries, planSeries, weeklyPlan, seriesSearchTerm, sequencingMode]);

  const isPlanDirty = useMemo(() => {
    if (sequencingMode === "loop") return planSeries.length > 0;
    return Object.values(weeklyPlan).some((day) => day !== null);
  }, [sequencingMode, planSeries, weeklyPlan]);

  const handleModeChange = (newMode) => {
    if (isPlanDirty) {
      const confirmSwitch = window.confirm(
        "Você tem alterações não salvas. Deseja limpar o plano atual e trocar de modo?"
      );
      if (confirmSwitch) {
        if (sequencingMode === "loop") setPlanSeries([]);
        else
          setWeeklyPlan({
            monday: null,
            tuesday: null,
            wednesday: null,
            thursday: null,
            friday: null,
            saturday: null,
            sunday: null,
          });
        setSequencingMode(newMode);
      }
    } else {
      setSequencingMode(newMode);
    }
  };

  const handleClearAndSwitch = () => {
    const newMode = sequencingMode === "loop" ? "weekly" : "loop";
    handleModeChange(newMode);
  };

  const handleAddSeries = (seriesToAdd) => {
    if (sequencingMode === "loop") {
      if (!planSeries.some((s) => s.id === seriesToAdd.id)) {
        setPlanSeries((current) => [...current, seriesToAdd]);
      }
    } else {
      const daysOrder = [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ];
      const firstEmptyDay = daysOrder.find((day) => !weeklyPlan[day]);
      if (firstEmptyDay) {
        setWeeklyPlan((current) => ({
          ...current,
          [firstEmptyDay]: seriesToAdd,
        }));
      } else {
        alert("Todos os dias da semana já estão preenchidos.");
      }
    }
  };

  const handleDragStart = (event) => {
    const { active } = event;
    const seriesData =
      weeklyPlan[active.id] || planSeries.find((s) => s.id === active.id);
    if (seriesData) setActiveSeries(seriesData);
  };

  const handleDragEnd = (event) => {
    setActiveSeries(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    if (sequencingMode === "weekly") {
      const sourceDay = active.id;
      const targetDay = over.id;
      setWeeklyPlan((current) => {
        const newPlan = { ...current };
        [newPlan[sourceDay], newPlan[targetDay]] = [
          newPlan[targetDay],
          newPlan[sourceDay],
        ];
        return newPlan;
      });
    } else {
      setPlanSeries((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleRemoveSeriesFromLoop = (seriesToRemove) => {
    setPlanSeries((current) =>
      current.filter((s) => s.id !== seriesToRemove.id)
    );
  };

  const handleRemoveSeriesFromWeekly = (dayId) => {
    setWeeklyPlan((currentPlan) => ({ ...currentPlan, [dayId]: null }));
  };

  const handleSave = async () => {
    if (!activePlan) return alert("Plano de treino não encontrado.");
    setIsSaving(true);
    let planConfig;
    if (sequencingMode === "loop") {
      planConfig = { mode: "loop", data: planSeries.map((s) => s.id) };
    } else {
      planConfig = { mode: "weekly", data: weeklyPlan };
    }
    try {
      await updatePlanSeries(activePlan.id, planConfig);
      alert("Plano de treino salvo com sucesso!");
      navigate("/planejamento");
    } catch (err) {
      alert(err.message || "Não foi possível salvar o plano.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <p>Carregando editor...</p>;
  if (error) return <p>Erro: {error}</p>;

  const modeOptions = [
    { label: "Loop", value: "loop" },
    { label: "Semanal", value: "weekly" },
  ];

  return (
    <PageWrapper>
      <PageHeader>
        <PageTitle>Montar Plano de Treino Ativo</PageTitle>
        <ButtonGroup>
          <BackButton onClick={() => navigate("/planejamento")}>
            Voltar
          </BackButton>
          <SaveButton onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Salvando..." : "Salvar Plano"}
          </SaveButton>
        </ButtonGroup>
      </PageHeader>

      <ModeSelectorContainer>
        <ModeSwitch
          options={modeOptions}
          value={sequencingMode}
          onChange={handleModeChange}
          disabled={isPlanDirty}
        />
        {isPlanDirty && (
          <ClearButton onClick={handleClearAndSwitch}>
            Limpar e Trocar
          </ClearButton>
        )}
      </ModeSelectorContainer>

      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        collisionDetection={closestCenter}
      >
        <ContentWrapper>
          <Panel>
            <PanelTitle>Séries Disponíveis</PanelTitle>
            <FiltersWrapper>
              <SearchInput
                type="text"
                placeholder="Buscar série..."
                value={seriesSearchTerm}
                onChange={(e) => setSeriesSearchTerm(e.target.value)}
              />
            </FiltersWrapper>
            <ItemList>
              {availableSeries.map((series) => (
                <SeriesItem
                  key={series.id}
                  onClick={() => handleAddSeries(series)}
                >
                  {series.name}
                </SeriesItem>
              ))}
            </ItemList>
          </Panel>
          <Panel>
            <PanelTitle>Séries no Plano</PanelTitle>
            {sequencingMode === "loop" ? (
              <SortableContext
                items={planSeries.map((s) => s.id)}
                strategy={verticalListSortingStrategy}
              >
                <ItemList>
                  {planSeries.map((series) => (
                    <PlanSeriesItem
                      key={series.id}
                      series={series}
                      onRemove={handleRemoveSeriesFromLoop}
                    />
                  ))}
                </ItemList>
              </SortableContext>
            ) : (
              <WeeklyPlanner
                planData={weeklyPlan}
                onRemoveSeries={handleRemoveSeriesFromWeekly}
              />
            )}
          </Panel>
        </ContentWrapper>
        <DragOverlay>
          {activeSeries ? (
            <PlanSeriesItem series={activeSeries} isOverlay />
          ) : null}
        </DragOverlay>
      </DndContext>
    </PageWrapper>
  );
}

export default TrainingPlanEditor;
