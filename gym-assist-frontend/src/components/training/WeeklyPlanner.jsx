// [FRONTEND] arquivo: src/components/training/WeeklyPlanner.jsx (CORRIGIDO)
import React from "react";
import styled from "styled-components";
import DaySlot from "./DaySlot";

const PlannerGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.medium};
  height: 100%;
  overflow-y: auto;
  padding-right: 8px;
`;

const daysOfWeek = [
  { id: "monday", name: "Segunda" },
  { id: "tuesday", name: "Terça" },
  { id: "wednesday", name: "Quarta" },
  { id: "thursday", name: "Quinta" },
  { id: "friday", name: "Sexta" },
  { id: "saturday", name: "Sábado" },
  { id: "sunday", name: "Domingo" },
];

function WeeklyPlanner({ planData, onRemoveSeries }) {
  // A lógica de estado foi removida. Agora usamos as props diretamente.

  return (
    <PlannerGrid>
      {daysOfWeek.map((day) => (
        <DaySlot
          key={day.id}
          day={day}
          series={planData[day.id]} // Usa a prop 'planData' diretamente
          onRemove={onRemoveSeries} // Usa a prop 'onRemoveSeries'
        />
      ))}
    </PlannerGrid>
  );
}

export default WeeklyPlanner;
