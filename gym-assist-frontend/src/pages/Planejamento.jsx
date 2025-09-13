// [FRONTEND] arquivo: src/pages/Planejamento.jsx (MODIFICADO)
import React, { useEffect } from "react"; // Adicionado useEffect
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Adicionado useAuth
import { getActivePlan } from "../services/trainingPlanService"; // Adicionado serviço

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
  border: 1px solid transparent;

  &:hover {
    transform: translateY(-5px);
    border-color: ${({ theme }) => theme.colors.primary};
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
  const { user } = useAuth();

  // Garante que o plano de treino ativo exista ao visitar esta página
  useEffect(() => {
    if (user?.id) {
      getActivePlan(user.id).catch((err) => {
        console.error("Falha ao verificar/criar plano de treino ativo:", err);
      });
    }
  }, [user]);

  return (
    <PageWrapper>
      <PageTitle>Central de Planejamento</PageTitle>
      <PlanningGrid>
        <PlanningCard to="/exercicios">
          <h3>Gerenciar Exercícios</h3>
          <p>Visualize, crie, edite e delete exercícios da sua biblioteca.</p>
        </PlanningCard>

        <PlanningCard to="/series">
          <h3>Gerenciar Séries</h3>
          <p>Crie e edite suas séries de treino para montar seus planos.</p>
        </PlanningCard>

        {/* --- ADIÇÃO DO NOVO CARD --- */}
        <PlanningCard to="/plano-de-treino/editor">
          <h3>Montar Plano de Treino</h3>
          <p>Organize suas séries em um plano de treino ativo.</p>
        </PlanningCard>
      </PlanningGrid>
    </PageWrapper>
  );
}

export default Planejamento;
