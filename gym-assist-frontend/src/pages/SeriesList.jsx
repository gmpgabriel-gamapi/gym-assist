// [FRONTEND] arquivo: src/pages/SeriesList.jsx (VERSÃO 100% COMPLETA)
import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  getAllSeries,
  deleteSeries,
  getSeriesVersions,
  createSeries,
} from "../services/seriesService";
import { useAuth } from "../context/AuthContext";
import TypeFilterToggle from "../components/exercises/TypeFilterToggle";
import VersionHistoryModal from "../components/training/VersionHistoryModal";

const PageWrapper = styled.div`
  width: 100%;
`;

const PageHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.large};
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.medium};
`;

const PageTitle = styled.h2`
  color: ${({ theme }) => theme.colors.primary};
  margin: 0;
`;

const HeaderButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.medium};
`;

const PrimaryButton = styled.button`
  padding: 10px 20px;
  border-radius: 4px;
  border: none;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.background};
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 1rem;
  cursor: pointer;
  transition: opacity 0.2s;
  &:hover {
    opacity: 0.9;
  }
`;

const SecondaryButton = styled(PrimaryButton)`
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
`;

const FiltersWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.medium};
  margin-bottom: ${({ theme }) => theme.spacing.large};
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing.large};
  border-radius: 8px;
  align-items: stretch;
`;

const SearchInput = styled.input`
  flex: 1;
  max-width: 450px;
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.surfaceHover};
  color: ${({ theme }) => theme.colors.text};
  border-radius: 4px;
  padding: 10px;
  font-size: 1rem;
  min-width: 200px;
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
  border: 1px solid transparent;
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: translateY(-4px);
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const CardHeader = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.small};
`;

const SeriesName = styled.strong`
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.2rem;
  padding-right: 10px;
`;

const SeriesInfo = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.9rem;
  margin: ${({ theme }) => theme.spacing.small} 0;
`;

const OriginTag = styled.span`
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: bold;
  background-color: ${({ theme, origin }) =>
    origin === "teacher" ? theme.colors.primary : theme.colors.textSecondary};
  color: ${({ theme }) => theme.colors.background};
  white-space: nowrap;
  height: fit-content;
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

function SeriesList() {
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  const [selectedOrigins, setSelectedOrigins] = useState(() => {
    try {
      const saved = localStorage.getItem("seriesOriginFilter");
      return saved ? JSON.parse(saved) : ["personal", "teacher"];
    } catch (error) {
      return ["personal", "teacher"];
    }
  });

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [versionHistory, setVersionHistory] = useState([]);

  useEffect(() => {
    localStorage.setItem("seriesOriginFilter", JSON.stringify(selectedOrigins));
  }, [selectedOrigins]);

  const fetchSeries = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllSeries();
      setSeries(data);
    } catch (err) {
      setError(err.message || "Falha ao buscar séries.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSeries();
  }, [fetchSeries]);

  const handleCreate = () => navigate("/series/nova");
  const handleEdit = (seriesId) => navigate(`/series/editor/${seriesId}`);
  const handleDelete = async (seriesId) => {
    if (window.confirm("Tem certeza que deseja excluir esta série?")) {
      try {
        await deleteSeries(seriesId);
        fetchSeries();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleViewHistory = async (series) => {
    try {
      const versions = await getSeriesVersions(series.id);
      setVersionHistory(versions);
      setIsHistoryOpen(true);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRestore = async (seriesToRestore) => {
    if (
      !window.confirm(
        `Deseja restaurar a série "${seriesToRestore.name}"? Uma nova cópia ativa será criada.`
      )
    )
      return;
    try {
      const seriesData = {
        name: `${seriesToRestore.name} (Restaurada v${seriesToRestore.version})`,
        exercises: seriesToRestore.exercises.map((ex, index) => ({
          id: ex.id,
          type: ex.type,
          sets: ex.sets,
          reps: ex.reps,
          order: index,
        })),
      };
      await createSeries(seriesData);
      alert("Série restaurada com sucesso!");
      setIsHistoryOpen(false);
      fetchSeries();
    } catch (err) {
      alert(err.message);
    }
  };

  const filteredSeries = useMemo(() => {
    if (!user || !user.id) {
      return [];
    }
    return series
      .filter((s) => {
        const isPersonal = s.owner_id === user.id;
        if (selectedOrigins.length === 0) return false;
        if (isPersonal && selectedOrigins.includes("personal")) return true;
        if (!isPersonal && selectedOrigins.includes("teacher")) return true;
        return false;
      })
      .filter((s) => s.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [series, searchTerm, selectedOrigins, user]);

  if (loading) return <p>Carregando séries...</p>;
  if (error) return <p style={{ color: "#E53E3E" }}>Erro: {error}</p>;

  const originOptions = [
    { value: "personal", label: "Pessoal" },
    { value: "teacher", label: "Professor" },
  ];

  return (
    <PageWrapper>
      <PageHeader>
        <PageTitle>Gerenciar Séries</PageTitle>
        <HeaderButtons>
          <SecondaryButton onClick={() => navigate("/series/arquivadas")}>
            Ver Arquivadas
          </SecondaryButton>
          <PrimaryButton onClick={handleCreate}>
            + Criar Nova Série
          </PrimaryButton>
        </HeaderButtons>
      </PageHeader>

      <FiltersWrapper>
        <SearchInput
          placeholder="Buscar por nome da série..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <TypeFilterToggle
          options={originOptions}
          selectedTypes={selectedOrigins}
          onChange={setSelectedOrigins}
          label="Séries visíveis:"
        />
      </FiltersWrapper>

      <SeriesGrid>
        {filteredSeries.map((s) => {
          const isPersonal = s.owner_id === user.id;
          const hasHistory = s.version > 1 || s.parent_series_id;
          return (
            <SeriesCard key={s.id}>
              <CardHeader>
                <SeriesName title={s.name}>{s.name}</SeriesName>
                <OriginTag origin={isPersonal ? "personal" : "teacher"}>
                  {isPersonal ? "Pessoal" : "Professor"}
                </OriginTag>
              </CardHeader>
              <SeriesInfo>
                {s.exercises.length}{" "}
                {s.exercises.length === 1 ? "exercício" : "exercícios"}
              </SeriesInfo>
              <ActionButtonGroup>
                {hasHistory && (
                  <ActionButton onClick={() => handleViewHistory(s)}>
                    Histórico
                  </ActionButton>
                )}
                <ActionButton onClick={() => handleEdit(s.id)}>
                  Editar
                </ActionButton>
                <ActionButton onClick={() => handleDelete(s.id)}>
                  Excluir
                </ActionButton>
              </ActionButtonGroup>
            </SeriesCard>
          );
        })}
      </SeriesGrid>

      <VersionHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        versions={versionHistory}
        onRestore={handleRestore}
      />
    </PageWrapper>
  );
}

export default SeriesList;
