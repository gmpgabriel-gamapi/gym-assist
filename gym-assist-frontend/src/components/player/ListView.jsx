import React from "react";
import styled, { css } from "styled-components";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: ${({ theme }) => theme.spacing.medium};
`;

const Title = styled.h3`
  color: ${({ theme }) => theme.colors.text};
`;

const CloseButton = styled.button`
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

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  overflow-y: auto;
  flex: 1;
  padding-right: 8px;
`;

const ItemWrapper = styled.li`
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

function SortableItem({ exercise, onSelect, isCurrent, isDragging }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: exercise.id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  const isSkipped = exercise.status === "skipped";
  const isDone = isSkipped || exercise.status === "completed";

  return (
    <ItemWrapper
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
    </ItemWrapper>
  );
}

function ListView({
  exercises,
  currentIndex,
  onReorder,
  onSelect,
  onClose,
  isDragging,
  onDragStart,
  onDragEnd,
}) {
  return (
    <Wrapper>
      <Header>
        <Title>Ordem do Treino</Title>
        <CloseButton onClick={onClose}>Retornar ao Exercício</CloseButton>
      </Header>
      <DndContext
        collisionDetection={closestCenter}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <SortableContext
          items={exercises.map((e) => e.id)}
          strategy={verticalListSortingStrategy}
        >
          <List>
            {exercises.map((exercise, index) => (
              <SortableItem
                key={exercise.id}
                exercise={exercise}
                onSelect={() => onSelect(index)}
                isCurrent={index === currentIndex}
                isDragging={isDragging}
              />
            ))}
          </List>
        </SortableContext>
      </DndContext>
    </Wrapper>
  );
}

export default ListView;
