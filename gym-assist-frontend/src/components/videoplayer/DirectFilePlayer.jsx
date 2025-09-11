// [FRONTEND] arquivo: src/components/player/DirectFilePlayer.jsx (NOVO)
import React from "react";
import styled from "styled-components";

const StyledVideo = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const Player = ({ url }) => {
  return (
    <StyledVideo src={url} controls autoPlay>
      Seu navegador não suporta a tag de vídeo.
    </StyledVideo>
  );
};

export const directFilePlayerStrategy = {
  canPlay: (url) => /\.(mp4|webm|ogv)$/i.test(url),
  Player,
};
