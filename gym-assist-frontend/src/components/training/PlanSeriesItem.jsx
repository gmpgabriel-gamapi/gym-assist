// [FRONTEND] arquivo: src/components/training/PlanSeriesItem.jsx (CORRIGIDO)
import React from "react";
import styled from "styled-components";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const ItemWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};
  padding: 10px 0;
  /* MODIFICAÇÃO: A prop agora usa o prefixo '$' */
  background-color: ${({ theme, $isOverlay }) =>
    $isOverlay ? theme.colors.surfaceHover : theme.colors.surface};
  margin-bottom: ${({ theme }) => theme.spacing.small};
  border-radius: 4px;
  user-select: none;
  border: 1px solid ${({ theme }) => theme.colors.surfaceHover};
`;

const DragHandle = styled.div`
  cursor: grab;
  padding: 0 10px;
  color: ${({ theme }) => theme.colors.textSecondary};
  &:active {
    cursor: grabbing;
  }
`;

const SeriesName = styled.span`
  flex: 1;
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

function PlanSeriesItem({ series, onRemove, isOverlay = false }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: series.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleRemoveClick = (e) => {
    e.stopPropagation();
    onRemove(series);
  };

  return (
    // MODIFICAÇÃO: A prop é passada com o prefixo '$'
    <ItemWrapper
      ref={setNodeRef}
      style={style}
      $isOverlay={isOverlay}
      {...attributes}
    >
      <DragHandle {...listeners}>⠿</DragHandle>
      <SeriesName>{series.name}</SeriesName>
      <RemoveButton onClick={handleRemoveClick}>&times;</RemoveButton>
    </ItemWrapper>
  );
}

export default PlanSeriesItem;
