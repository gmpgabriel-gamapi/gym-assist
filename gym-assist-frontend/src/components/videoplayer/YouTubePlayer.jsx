// [FRONTEND] arquivo: src/components/player/YouTubePlayer.jsx (NOVO)
import React from "react";
import styled from "styled-components";

const getYouTubeEmbedUrl = (url) => {
  if (!url) return "";
  let videoId = null;
  const youtubeRegex =
    /(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com|youtu\.be|googleusercontent\.com\/youtube\.com)\/(?:watch\?v=|embed\/|v\/|shorts\/|.+\?v=)?([^"&?\/ ]{11})/;
  const match = url.match(youtubeRegex);
  if (match && match[1]) {
    videoId = match[1];
  }
  if (videoId) {
    return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0`;
  }
  return "";
};

const StyledIframe = styled.iframe`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 0;
`;

const Player = ({ url }) => {
  const embedUrl = getYouTubeEmbedUrl(url);

  if (!embedUrl) {
    return (
      <div style={{ color: "white", padding: "20px" }}>
        URL do YouTube inválida.
      </div>
    );
  }

  return (
    <StyledIframe
      src={embedUrl}
      title="Player de Vídeo do YouTube"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  );
};

export const youtubePlayerStrategy = {
  canPlay: (url) => youtubeRegex.test(url),
  Player,
};

// Exportando a RegEx para que a estratégia possa usá-la
const youtubeRegex =
  /(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com|youtu\.be|googleusercontent\.com\/youtube\.com)\/(?:watch\?v=|embed\/|v\/|shorts\/|.+\?v=)?([^"&?\/ ]{11})/;
