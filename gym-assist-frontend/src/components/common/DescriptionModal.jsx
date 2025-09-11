// [FRONTEND] arquivo: src/components/common/DescriptionModal.jsx (NOVO)
import React from "react";
import styled from "styled-components";

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing.large};
  border-radius: 8px;
  width: 100%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
`;

const ModalTitle = styled.h3`
  margin-top: 0;
  margin-bottom: ${({ theme }) => theme.spacing.medium};
  color: ${({ theme }) => theme.colors.primary};
`;

const DescriptionText = styled.p`
  color: ${({ theme }) => theme.colors.text};
  white-space: pre-wrap; /* Preserva quebras de linha e espaços */
  line-height: 1.6;
`;

const CloseButton = styled.button`
  display: block;
  margin-left: auto;
  margin-top: ${({ theme }) => theme.spacing.large};
  padding: 10px 20px;
  border-radius: 4px;
  border: none;
  background-color: ${({ theme }) => theme.colors.surfaceHover};
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 1rem;
  cursor: pointer;
  transition: opacity 0.2s;
  &:hover {
    opacity: 0.9;
  }
`;

function DescriptionModal({ isOpen, onClose, content }) {
  if (!isOpen) {
    return null;
  }

  return (
    <Backdrop onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalTitle>{content?.title || "Descrição"}</ModalTitle>
        <DescriptionText>
          {content?.text || "Nenhuma descrição fornecida."}
        </DescriptionText>
        <CloseButton onClick={onClose}>Fechar</CloseButton>
      </ModalContent>
    </Backdrop>
  );
}

export default DescriptionModal;
