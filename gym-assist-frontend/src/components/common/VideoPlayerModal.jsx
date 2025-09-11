// [FRONTEND] arquivo: src/components/common/VideoPlayerModal.jsx (REFATORADO)
import React from "react";
import styled from "styled-components";
import { getPlayerForUrl } from "../../utils/playerManager";

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 900px;
`;

const PlayerWrapper = styled.div`
  position: relative;
  padding-top: 56.25%; /* Proporção 16:9 */
  width: 100%;
  background-color: #000;
  border-radius: 8px;
  overflow: hidden;
`;

const CloseButton = styled.button`
  position: absolute;
  top: -30px;
  right: -10px;
  background: none;
  border: none;
  color: white;
  font-size: 2.5rem;
  cursor: pointer;
  line-height: 1;
  padding: 0;
`;

const UnsupportedMessage = styled.div`
  color: white;
  padding: 20px;
  text-align: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

function VideoPlayerModal({ isOpen, onClose, videoUrl }) {
  if (!isOpen) {
    return null;
  }

  const PlayerComponent = getPlayerForUrl(videoUrl);

  return (
    <Backdrop onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>×</CloseButton>
        <PlayerWrapper>
          {PlayerComponent ? (
            <PlayerComponent url={videoUrl} />
          ) : (
            <UnsupportedMessage>
              URL de vídeo inválida ou não suportada.
            </UnsupportedMessage>
          )}
        </PlayerWrapper>
      </ModalContainer>
    </Backdrop>
  );
}

export default VideoPlayerModal;
