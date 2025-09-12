import { useMemo, useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getAllSeries } from "../services/seriesService";
import SeriesCard from "../components/training/SeriesCard";

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

const StartWorkoutButton = styled.button`
  padding: 10px 15px;
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

function MyTraining() {
  const { user, viewingProfile } = useAuth();
  const navigate = useNavigate();

  const [activePlan, setActivePlan] = useState({ series: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const profileToView = viewingProfile || user;

  useEffect(() => {
    if (!profileToView) return;

    const fetchSeries = async () => {
      try {
        setLoading(true);
        const seriesData = await getAllSeries(profileToView.id);
        setActivePlan({
          series: seriesData,
          sequencingMode: "loop",
          lastCompletedSeriesId: null, // Mock por enquanto
        });
      } catch (err) {
        setError("Falha ao buscar o plano de treino.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSeries();
  }, [profileToView]);

  const workoutOfTheDayId = useMemo(() => {
    const { series, sequencingMode, lastCompletedSeriesId } = activePlan;
    if (sequencingMode === "loop" && series?.length > 0) {
      const lastIndex = series.findIndex((s) => s.id === lastCompletedSeriesId);
      const nextIndex =
        lastIndex === -1 || lastIndex === series.length - 1 ? 0 : lastIndex + 1;
      return series[nextIndex].id;
    }
    return series?.[0]?.id || null;
  }, [activePlan]);

  const title = `Plano de Treino Ativo: ${profileToView?.name}`;

  if (loading) return <p>Carregando plano de treino...</p>;
  if (error) return <p style={{ color: "#E53E3E" }}>Erro: {error}</p>;

  return (
    <PageWrapper>
      <PageHeader>
        <PageTitle>{title}</PageTitle>
        {workoutOfTheDayId && (
          <StartWorkoutButton
            onClick={() => navigate(`/treino/player/${workoutOfTheDayId}`)}
          >
            Iniciar Treino Sugerido
          </StartWorkoutButton>
        )}
      </PageHeader>

      {(activePlan.series || []).map((s) => (
        <SeriesCard
          key={s.id}
          series={s}
          isSuggested={s.id === workoutOfTheDayId}
        />
      ))}
    </PageWrapper>
  );
}

export default MyTraining;
