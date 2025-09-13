// [FRONTEND] arquivo: src/components/training/DaySlot.jsx (CORRIGIDO)
import React from "react";
import styled from "styled-components";
import { useDroppable, useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

const SlotWrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 8px;
  padding: 12px;
  min-height: 54px;
  /* MODIFICAÇÃO: A prop agora usa o prefixo '$' */
  border: 2px dashed
    ${({ theme, $isOver }) =>
      $isOver ? theme.colors.primary : theme.colors.surface};
  display: flex;
  align-items: center;
  transition: border-color 0.2s;
`;

const DayName = styled.h4`
  margin: 0;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: bold;
  width: 120px;
  flex-shrink: 0;
`;

const Placeholder = styled.div`
  flex: 1;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-style: italic;
  font-size: 0.9rem;
  text-align: center;
`;

const DroppedItemWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};
  padding: 10px 0;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colors.surfaceHover};
  user-select: none;
  cursor: grab;
  &:active {
    cursor: grabbing;
  }
`;

const SeriesName = styled.span`
  flex: 1;
  padding-left: 10px;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: bold;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  padding: 0 10px;
  font-size: 1.2rem;
  &:hover {
    color: #e53e3e;
  }
`;

function DraggableDroppedItem({ dayId, series, onRemove }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: dayId,
    data: { series },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <DroppedItemWrapper
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
    >
      <SeriesName>{series.name}</SeriesName>
      <RemoveButton onClick={() => onRemove(dayId)}>&times;</RemoveButton>
    </DroppedItemWrapper>
  );
}

function DaySlot({ day, series, onRemove }) {
  const { isOver, setNodeRef } = useDroppable({
    id: day.id,
  });

  return (
    // MODIFICAÇÃO: A prop agora é passada com o prefixo '$'
    <SlotWrapper ref={setNodeRef} $isOver={isOver}>
      <DayName>{day.name}</DayName>
      {series ? (
        <DraggableDroppedItem
          dayId={day.id}
          series={series}
          onRemove={onRemove}
        />
      ) : (
        <Placeholder>Clique para adicionar uma série</Placeholder>
      )}
    </SlotWrapper>
  );
}

export default DaySlot;
