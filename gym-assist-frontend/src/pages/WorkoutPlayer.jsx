import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";
import { getSeriesById } from "../services/seriesService";
import Timer from "../components/common/Timer";
import { useAuth } from "../context/AuthContext";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const PlayerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 150px);
`;

const SeriesTitle = styled.h4`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: normal;
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.small};
`;

const ProgressBarContainer = styled.div`
  display: flex;
  gap: 4px;
  height: 8px;
  width: 100%;
  max-width: 500px;
  margin: 0 auto ${({ theme }) => theme.spacing.medium};
`;

const ProgressBarSegment = styled.div`
  flex: 1;
  height: 100%;
  border-radius: 4px;
  background-color: ${({ theme, status }) => {
    if (status === "completed") return theme.colors.primary;
    if (status === "skipped") return theme.colors.textSecondary;
    return theme.colors.surface;
  }};
  border: 2px solid
    ${({ theme, $isCurrent }) =>
      $isCurrent ? theme.colors.primary : "transparent"};
  transition: all 0.3s ease-in-out;
`;

const MainContent = styled.div`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 8px;
  padding: ${({ theme }) => theme.spacing.large};
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
`;

const RestViewWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: ${({ theme }) => theme.spacing.large};
`;

const RestExerciseName = styled.p`
  font-size: 1.2rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
`;

const VolumeControlWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const VolumeSlider = styled.input`
  width: 200px;
`;

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

const UpNextWrapper = styled.div`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.medium};
  margin-top: ${({ theme }) => theme.spacing.large};
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 8px;
  text-align: center;
`;

const CenteredMessage = styled.div`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ListViewWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const ListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: ${({ theme }) => theme.spacing.medium};
`;

const ListTitle = styled.h3`
  color: ${({ theme }) => theme.colors.text};
`;

const CloseListButton = styled(ControlButton)``;

const SortableList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  overflow-y: auto;
  flex: 1;
  padding-right: 8px;
`;

const SortableItemWrapper = styled.li`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.medium};
  padding: ${({ theme }) => theme.spacing.medium};
  background-color: ${({ theme, $isCurrent }) =>
    $isCurrent ? theme.colors.surfaceHover : theme.colors.surface};
  margin-bottom: ${({ theme }) => theme.spacing.small};
  border-radius: 4px;
  cursor: pointer;
  border: 1px solid
    ${({ theme, $isCurrent }) =>
      $isCurrent ? theme.colors.primary : "transparent"};

  &:hover {
    ${({ $isDragging }) =>
      !$isDragging &&
      css`
        background-color: ${({ theme }) => theme.colors.surfaceHover};
      `}
  }
`;

const ItemName = styled.span`
  flex: 1;
  color: ${({ theme, $isDone }) =>
    $isDone ? theme.colors.textSecondary : theme.colors.text};
  text-decoration: ${({ $isSkipped }) =>
    $isSkipped ? "line-through" : "none"};
`;

const StatusTag = styled.span`
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: bold;
  background-color: ${({ theme, status }) => {
    if (status === "completed") return theme.colors.primary;
    if (status === "skipped") return theme.colors.textSecondary;
    return "transparent";
  }};
  color: ${({ theme }) => theme.colors.background};
`;

const DragHandle = styled.div`
  cursor: grab;
  color: ${({ theme }) => theme.colors.textSecondary};
  &:active {
    cursor: grabbing;
  }
`;

function SortableExerciseItem({ exercise, onSelect, isCurrent, isDragging }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: exercise.id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  const isSkipped = exercise.status === "skipped";
  const isDone = isSkipped || exercise.status === "completed";

  return (
    <SortableItemWrapper
      ref={setNodeRef}
      style={style}
      $isCurrent={isCurrent}
      $isDragging={isDragging}
      onClick={() => onSelect()}
    >
      <DragHandle {...attributes} {...listeners}>
        ⠿
      </DragHandle>
      <ItemName $isDone={isDone} $isSkipped={isSkipped}>
        {exercise.name}
      </ItemName>
      {isDone && (
        <StatusTag status={exercise.status}>
          {isSkipped ? "Pulado" : "Concluído"}
        </StatusTag>
      )}
    </SortableItemWrapper>
  );
}

function WorkoutPlayer() {
  const { seriesId } = useParams();
  const { volume, setVolume } = useAuth();
  const navigate = useNavigate();

  const [liveWorkout, setLiveWorkout] = useState(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentSetData, setCurrentSetData] = useState({
    weight: "",
    reps: "",
  });
  const [isResting, setIsResting] = useState(false);
  const [restDuration, setRestDuration] = useState(90);
  const [viewMode, setViewMode] = useState("player");
  const [draggingItemId, setDraggingItemId] = useState(null);
  const isFinishing = useRef(false);

  useEffect(() => {
    const fetchSeriesForPlayer = async () => {
      if (!seriesId) return;
      setLoading(true);
      setError(null);
      isFinishing.current = false;

      try {
        const seriesToLoad = await getSeriesById(seriesId);

        const preparedExercises = (seriesToLoad.exercises || []).map((ex) => ({
          ...ex,
          status: "pending",
          performedSets: [],
        }));
        setLiveWorkout({ ...seriesToLoad, exercises: preparedExercises });
      } catch (err) {
        setError(err.message || `Série com ID "${seriesId}" não encontrada.`);
      } finally {
        setLoading(false);
      }
    };

    fetchSeriesForPlayer();
  }, [seriesId]);

  const findNextPendingExercise = (exerciseList) => {
    return (exerciseList || liveWorkout.exercises).findIndex(
      (ex) => ex.status === "pending"
    );
  };

  const handleGoToNextExercise = (currentExercises) => {
    const nextIndex = findNextPendingExercise(currentExercises);
    if (nextIndex !== -1) {
      setCurrentExerciseIndex(nextIndex);
    } else {
      if (isFinishing.current) return;
      isFinishing.current = true;
      console.log("Treino finalizado!", liveWorkout);
      alert("Parabéns, você finalizou o treino!");
      setTimeout(() => navigate("/meu-treino"), 0);
    }
  };

  const updateExerciseStatus = (index, status, callback) => {
    setLiveWorkout((prevWorkout) => {
      const updatedExercises = [...prevWorkout.exercises];
      updatedExercises[index] = { ...updatedExercises[index], status };
      const newWorkoutState = { ...prevWorkout, exercises: updatedExercises };
      if (callback) callback(newWorkoutState.exercises);
      return newWorkoutState;
    });
  };

  const handleSkipExercise = () => {
    const confirmation = window.confirm(
      "Tem certeza que deseja pular este exercício? Ele será desconsiderado do treino de hoje."
    );
    if (confirmation) {
      updateExerciseStatus(
        currentExerciseIndex,
        "skipped",
        (updatedExercises) => {
          handleGoToNextExercise(updatedExercises);
        }
      );
    }
  };

  const handleLogSet = () => {
    const currentExercise = liveWorkout.exercises[currentExerciseIndex];
    const performedSetsCount = currentExercise.performedSets.length;
    const newSet = {
      setNumber: performedSetsCount + 1,
      weight: currentSetData.weight || "0",
      reps: currentSetData.reps || "0",
    };

    let isLastSet =
      performedSetsCount + 1 >= parseInt(currentExercise.sets, 10);

    setLiveWorkout((prevWorkout) => {
      const updatedExercises = [...prevWorkout.exercises];
      const exerciseToUpdate = { ...updatedExercises[currentExerciseIndex] };
      exerciseToUpdate.performedSets = [
        ...exerciseToUpdate.performedSets,
        newSet,
      ];
      if (isLastSet) {
        exerciseToUpdate.status = "completed";
      }
      updatedExercises[currentExerciseIndex] = exerciseToUpdate;
      return { ...prevWorkout, exercises: updatedExercises };
    });

    setCurrentSetData({ weight: "", reps: "" });
    console.log("Salvamento automático disparado para a série:", newSet);
    setIsResting(true);
  };

  const handleTimerComplete = () => {
    if (liveWorkout.exercises[currentExerciseIndex].status === "completed") {
      handleGoToNextExercise();
    }
    setIsResting(false);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setDraggingItemId(null);
    if (active && over && active.id !== over.id) {
      const currentId = liveWorkout.exercises[currentExerciseIndex].id;
      setLiveWorkout((prevWorkout) => {
        const oldIndex = prevWorkout.exercises.findIndex(
          (item) => item.id === active.id
        );
        const newIndex = prevWorkout.exercises.findIndex(
          (item) => item.id === over.id
        );
        const newExercises = arrayMove(
          prevWorkout.exercises,
          oldIndex,
          newIndex
        );
        const newCurrentIndex = newExercises.findIndex(
          (item) => item.id === currentId
        );
        setCurrentExerciseIndex(newCurrentIndex);
        return { ...prevWorkout, exercises: newExercises };
      });
    }
  };

  const handleSelectExerciseFromList = (index) => {
    setCurrentExerciseIndex(index);
    setViewMode("player");
  };

  if (loading) {
    return (
      <PlayerWrapper>
        <MainContent>
          <CenteredMessage>Carregando treino...</CenteredMessage>
        </MainContent>
      </PlayerWrapper>
    );
  }
  if (error) {
    return (
      <PlayerWrapper>
        <MainContent>
          <CenteredMessage>Erro: {error}</CenteredMessage>
        </MainContent>
      </PlayerWrapper>
    );
  }
  if (!liveWorkout) {
    return (
      <PlayerWrapper>
        <MainContent>
          <CenteredMessage>Nenhum treino para carregar.</CenteredMessage>
        </MainContent>
      </PlayerWrapper>
    );
  }

  const currentExercise = liveWorkout.exercises[currentExerciseIndex];
  const nextExercise = liveWorkout.exercises.find(
    (ex) => ex.status === "pending" && ex.id !== currentExercise.id
  );

  if (!currentExercise) {
    return (
      <PlayerWrapper>
        <MainContent>
          <CenteredMessage>Série sem exercícios.</CenteredMessage>
        </MainContent>
      </PlayerWrapper>
    );
  }

  const performedSetsCount = currentExercise.performedSets.length;
  const isExerciseDone =
    currentExercise.status === "completed" ||
    currentExercise.status === "skipped";

  const getSetRowLabel = (status) => {
    if (status === "completed") return "Concluído";
    if (status === "skipped") return "Pulado";
    return "Aguardando";
  };

  const renderPlayerView = () => (
    <>
      <ExerciseName>{currentExercise.name}</ExerciseName>
      <ExerciseInfo>
        {currentExercise.sets} séries de {currentExercise.reps} (Última carga:{" "}
        {currentExercise.lastLoad})
      </ExerciseInfo>
      <SetsTrackerWrapper>
        {Array.from(
          { length: parseInt(currentExercise.sets, 10) },
          (_, index) => {
            const setNumber = index + 1;
            const performedSet = currentExercise.performedSets.find(
              (s) => s.setNumber === setNumber
            );
            const isCompleted = !!performedSet;
            const isCurrent = performedSetsCount === index && !isExerciseDone;
            return (
              <SetRow key={setNumber} $isCompleted={isCompleted}>
                <SetLabel $isCompleted={isCompleted}>
                  Série {setNumber}
                </SetLabel>
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
                        setCurrentSetData({
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
                        setCurrentSetData({
                          ...currentSetData,
                          reps: e.target.value,
                        })
                      }
                    />
                    <CompleteSetButton onClick={handleLogSet}>
                      Concluir
                    </CompleteSetButton>
                  </>
                ) : (
                  <span>{getSetRowLabel(currentExercise.status)}</span>
                )}
              </SetRow>
            );
          }
        )}
      </SetsTrackerWrapper>
      <ControlsWrapper>
        <ControlButton onClick={() => setViewMode("list")}>
          Ver Lista Completa
        </ControlButton>
        <ControlButton onClick={handleSkipExercise} disabled={isExerciseDone}>
          Pular Exercício
        </ControlButton>
      </ControlsWrapper>
    </>
  );

  const renderListView = () => (
    <ListViewWrapper>
      <ListHeader>
        <ListTitle>Ordem do Treino</ListTitle>
        <CloseListButton onClick={() => setViewMode("player")}>
          Retornar ao Exercício
        </CloseListButton>
      </ListHeader>
      <DndContext
        collisionDetection={closestCenter}
        onDragStart={(event) => setDraggingItemId(event.active.id)}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={liveWorkout.exercises.map((e) => e.id)}
          strategy={verticalListSortingStrategy}
        >
          <SortableList>
            {liveWorkout.exercises.map((exercise, index) => (
              <SortableExerciseItem
                key={exercise.id}
                exercise={exercise}
                onSelect={() => handleSelectExerciseFromList(index)}
                isCurrent={index === currentExerciseIndex}
                isDragging={!!draggingItemId}
              />
            ))}
          </SortableList>
        </SortableContext>
      </DndContext>
    </ListViewWrapper>
  );

  return (
    <PlayerWrapper>
      <SeriesTitle>{liveWorkout.name}</SeriesTitle>
      <ProgressBarContainer>
        {liveWorkout.exercises.map((exercise, index) => (
          <ProgressBarSegment
            key={exercise.id}
            status={exercise.status}
            $isCurrent={index === currentExerciseIndex && viewMode === "player"}
          />
        ))}
      </ProgressBarContainer>
      <MainContent>
        {viewMode === "player" ? (
          isResting ? (
            <RestViewWrapper>
              <RestExerciseName>{currentExercise.name}</RestExerciseName>
              <Timer action={restDuration} onComplete={handleTimerComplete} />
              <VolumeControlWrapper>
                <label>Volume</label>
                <VolumeSlider
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                />
              </VolumeControlWrapper>
            </RestViewWrapper>
          ) : (
            renderPlayerView()
          )
        ) : (
          renderListView()
        )}
      </MainContent>
      <UpNextWrapper>
        {nextExercise ? (
          <span>
            A seguir: <strong>{nextExercise.name}</strong>
          </span>
        ) : (
          <span>Último exercício ou todos pulados/concluídos!</span>
        )}
      </UpNextWrapper>
    </PlayerWrapper>
  );
}

export default WorkoutPlayer;
