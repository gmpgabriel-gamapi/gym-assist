import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom"; // Usaremos Link para navegação interna

const PageWrapper = styled.div`
  width: 100%;
`;

const PageTitle = styled.h2`
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.large};
`;

const PlanningGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.medium};
`;

const PlanningCard = styled(Link)`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 8px;
  padding: ${({ theme }) => theme.spacing.large};
  text-decoration: none;
  color: ${({ theme }) => theme.colors.text};
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: translateY(-5px);
    border: 1px solid ${({ theme }) => theme.colors.primary};
  }

  h3 {
    margin-top: 0;
    color: ${({ theme }) => theme.colors.primary};
  }

  p {
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

function Planejamento() {
  return (
    <PageWrapper>
      <PageTitle>Central de Planejamento</PageTitle>
      <PlanningGrid>
        <PlanningCard to="/exercicios">
          <h3>Gerenciar Exercícios</h3>
          <p>Visualize, crie, edite e delete exercícios da sua biblioteca.</p>
        </PlanningCard>

        <PlanningCard to="/series/nova">
          <h3>Gerenciar Séries</h3>
          <p>Crie e edite suas séries de treino para montar seus planos.</p>
        </PlanningCard>

        {/* Futuramente, um card para "Montar Plano de Treino" */}
      </PlanningGrid>
    </PageWrapper>
  );
}

export default Planejamento;
