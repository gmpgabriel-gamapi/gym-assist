// [FRONTEND] arquivo: src/pages/ArchivedSeriesList.jsx (MODIFICADO)
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
// 1. Importa as funções 'createSeries' e 'getSeriesVersions'
import {
  getArchivedSeries,
  createSeries,
  getSeriesVersions,
} from "../services/seriesService";
import VersionHistoryModal from "../components/training/VersionHistoryModal";

const PageWrapper = styled.div`
  width: 100%;
`;

const PageHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.large};
`;

const PageTitle = styled.h2`
  color: ${({ theme }) => theme.colors.primary};
  margin: 0;
`;

const BackButton = styled.button`
  padding: 10px 20px;
  border-radius: 4px;
  border: none;
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 1rem;
  cursor: pointer;
  &:hover {
    opacity: 0.9;
  }
`;

const SeriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.medium};
`;

const SeriesCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing.medium};
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid ${({ theme }) => theme.colors.surfaceHover};
`;

const CardHeader = styled.div`
  flex: 1;
`;

const SeriesName = styled.strong`
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.2rem;
`;

const SeriesInfo = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.9rem;
  margin: ${({ theme }) => theme.spacing.small} 0;
`;

const ActionButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.medium};
  align-items: center;
  padding-top: ${({ theme }) => theme.spacing.medium};
  border-top: 1px solid ${({ theme }) => theme.colors.surfaceHover};
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  font-size: 0.9rem;
  font-family: ${({ theme }) => theme.fonts.body};
  padding: 0;
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

function ArchivedSeriesList() {
  const [archivedSeries, setArchivedSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [versionHistory, setVersionHistory] = useState([]);

  const fetchArchived = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getArchivedSeries();
      setArchivedSeries(data);
    } catch (err) {
      setError(err.message || "Falha ao buscar séries arquivadas.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArchived();
  }, [fetchArchived]);

  const handleViewHistory = async (series) => {
    try {
      const versions = await getSeriesVersions(series.id);
      setVersionHistory(versions);
      setIsHistoryOpen(true);
    } catch (err) {
      alert(err.message);
    }
  };

  // 2. Adiciona a função de restaurar
  const handleRestore = async (seriesToRestore) => {
    if (
      !window.confirm(
        `Deseja restaurar a série "${seriesToRestore.name}"? Uma nova cópia ativa será criada.`
      )
    ) {
      return;
    }
    try {
      // A lógica de formatação de dados é a mesma da outra página
      const seriesData = {
        name: `${seriesToRestore.name} (Restaurada v${seriesToRestore.version})`,
        exercises: seriesToRestore.exercises.map((ex, index) => ({
          id: ex.id,
          type: ex.type,
          sets: ex.sets || null,
          reps: ex.reps || null,
          order: index,
        })),
      };
      const newSeries = await createSeries(seriesData);
      alert(
        "Série restaurada com sucesso! Você será redirecionado para editá-la."
      );
      navigate(`/series/editor/${newSeries.id}`); // Redireciona para o editor da nova série
    } catch (err) {
      alert(err.message || "Não foi possível restaurar a série.");
    }
  };

  if (loading) return <p>Carregando séries arquivadas...</p>;
  if (error) return <p style={{ color: "#E53E3E" }}>Erro: {error}</p>;

  return (
    <PageWrapper>
      <PageHeader>
        <PageTitle>Séries Arquivadas</PageTitle>
        <BackButton onClick={() => navigate("/series")}>
          Voltar para Séries Ativas
        </BackButton>
      </PageHeader>

      {archivedSeries.length === 0 ? (
        <p>Nenhuma série arquivada encontrada.</p>
      ) : (
        <SeriesGrid>
          {archivedSeries.map((s) => (
            <SeriesCard key={s.id}>
              <CardHeader>
                <SeriesName>{s.name}</SeriesName>
                <SeriesInfo>Última versão inativa: {s.version}</SeriesInfo>
              </CardHeader>
              <ActionButtonGroup>
                <ActionButton onClick={() => handleRestore(s)}>
                  Restaurar
                </ActionButton>
                <ActionButton onClick={() => handleViewHistory(s)}>
                  Versões Anteriores
                </ActionButton>
              </ActionButtonGroup>
            </SeriesCard>
          ))}
        </SeriesGrid>
      )}

      <VersionHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        versions={versionHistory}
        onRestore={handleRestore} // 3. Passa a função para o modal
      />
    </PageWrapper>
  );
}

export default ArchivedSeriesList;
