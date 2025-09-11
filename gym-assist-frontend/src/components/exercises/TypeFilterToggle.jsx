// [FRONTEND] arquivo: src/components/exercises/TypeFilterToggle.jsx (CORRIGIDO)
import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.small};
  align-items: center;
  flex-wrap: wrap;
`;

// MODIFICAÇÃO: A prop 'isSelected' foi renomeada para '$isSelected'
const FilterButton = styled.button`
  padding: 8px 16px;
  border-radius: 20px;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 0.9rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  background-color: ${({ theme, $isSelected }) =>
    $isSelected ? theme.colors.primary : theme.colors.surface};
  color: ${({ theme, $isSelected }) =>
    $isSelected ? theme.colors.background : theme.colors.textSecondary};
  border: 1px solid
    ${({ theme, $isSelected }) =>
      $isSelected ? theme.colors.primary : theme.colors.surfaceHover};

  &:hover {
    opacity: 0.9;
  }
`;

const FilterLabel = styled.span`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text};
  margin-right: ${({ theme }) => theme.spacing.small};
`;

function TypeFilterToggle({ options, selectedTypes, onChange }) {
  const handleToggle = (typeValue) => {
    const newSelection = new Set(selectedTypes);

    if (newSelection.has(typeValue)) {
      newSelection.delete(typeValue);
    } else {
      newSelection.add(typeValue);
    }

    onChange(Array.from(newSelection));
  };

  return (
    <Wrapper>
      <FilterLabel>Exercícios visíveis:</FilterLabel>
      {options.map((option) => (
        <FilterButton
          key={option.value}
          $isSelected={selectedTypes.includes(option.value)} // MODIFICAÇÃO: Prop renomeada
          onClick={() => handleToggle(option.value)}
        >
          {option.label}
        </FilterButton>
      ))}
    </Wrapper>
  );
}

export default TypeFilterToggle;
