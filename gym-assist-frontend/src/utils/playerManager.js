// [FRONTEND] arquivo: src/utils/playerManager.js (NOVO)
import { youtubePlayerStrategy } from "../components/videoplayer/YouTubePlayer";
import { directFilePlayerStrategy } from "../components/videoplayer/DirectFilePlayer";

// Lista de todas as estratégias de player disponíveis
const strategies = [youtubePlayerStrategy, directFilePlayerStrategy];

/**
 * Encontra e retorna o componente de Player correto para uma dada URL.
 * @param {string} url - A URL do vídeo.
 * @returns {React.Component | null} O componente de Player ou null se nenhum for encontrado.
 */
export const getPlayerForUrl = (url) => {
  const strategy = strategies.find((s) => s.canPlay(url));
  return strategy ? strategy.Player : null;
};
