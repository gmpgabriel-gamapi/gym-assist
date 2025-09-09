import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.large};
  height: 100%;
`;

const Column = styled.div`
  width: 50%;
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing.medium};
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
`;

const ColumnTitle = styled.h3`
  margin-bottom: ${({ theme }) => theme.spacing.medium};
  padding-bottom: ${({ theme }) => theme.spacing.medium};
  border-bottom: 1px solid ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
`;

const ItemList = styled.ul`
  list-style: none;
  overflow-y: auto;
  padding-right: 8px;
  height: 100%;
`;

function DualListbox({
  availableItems,
  selectedItems,
  onSelectionChange,
  renderAvailableItem,
  renderSelectedItem,
  titleAvailable,
  titleSelected,
  children, // Para os filtros
}) {
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      const oldIndex = selectedItems.findIndex((item) => item.id === active.id);
      const newIndex = selectedItems.findIndex((item) => item.id === over.id);
      const newSelectedItems = arrayMove(selectedItems, oldIndex, newIndex);
      onSelectionChange(newSelectedItems);
    }
  };

  return (
    <Wrapper>
      <Column>
        <ColumnTitle>{titleAvailable}</ColumnTitle>
        {children} {/* Onde os filtros serão inseridos */}
        <ItemList>
          {availableItems.map((item) => renderAvailableItem(item))}
        </ItemList>
      </Column>

      <Column>
        <ColumnTitle>{titleSelected}</ColumnTitle>
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={selectedItems}
            strategy={verticalListSortingStrategy}
          >
            <ItemList>
              {selectedItems.map((item) => renderSelectedItem(item))}
            </ItemList>
          </SortableContext>
        </DndContext>
      </Column>
    </Wrapper>
  );
}

export default DualListbox;
