import React from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";

const PageWrapper = styled.div`
  width: 100%;
`;

const PageTitle = styled.h2`
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.large};
`;

// Precisamos buscar o nome do aluno no futuro, por enquanto usamos o ID
function StudentHub() {
  const { studentId } = useParams();

  return (
    <PageWrapper>
      <PageTitle>Hub de Gerenciamento do Aluno</PageTitle>
      <p>Você está gerenciando o aluno com ID: {studentId}</p>
      <p>
        Em breve, aqui teremos o menu de contexto com "Plano de Treino",
        "Relatórios", etc.
      </p>
    </PageWrapper>
  );
}

export default StudentHub;
