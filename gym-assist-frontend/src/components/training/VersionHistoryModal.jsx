// [FRONTEND] arquivo: src/components/training/VersionHistoryModal.jsx (VERSÃO 100% COMPLETA)
import React, { useState } from "react";
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
  max-width: 700px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
`;

const ModalTitle = styled.h3`
  margin-top: 0;
  margin-bottom: ${({ theme }) => theme.spacing.large};
  color: ${({ theme }) => theme.colors.primary};
`;

const VersionList = styled.div`
  overflow-y: auto;
  flex: 1;
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.colors.surfaceHover};
    border-radius: 4px;
  }
  &::-webkit-scrollbar-track {
    background-color: ${({ theme }) => theme.colors.background};
  }
`;

const VersionItem = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 4px;
  margin-bottom: ${({ theme }) => theme.spacing.medium};
  overflow: hidden;
`;

const VersionHeader = styled.button`
  background: none;
  border: none;
  padding: ${({ theme }) => theme.spacing.medium};
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text};
  font-weight: bold;
  font-size: 1rem;
  font-family: ${({ theme }) => theme.fonts.body};

  &:hover {
    background-color: ${({ theme }) => theme.colors.surfaceHover};
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.medium};
`;

const RestoreButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: bold;
  padding: 4px 8px;
  &:hover {
    text-decoration: underline;
  }
`;

const ArrowIcon = styled.span`
  transform: ${({ isOpen }) => (isOpen ? "rotate(90deg)" : "rotate(0deg)")};
  transition: transform 0.2s ease-in-out;
  display: inline-block;
`;

const ExerciseListWrapper = styled.div`
  padding: 0 ${({ theme }) => theme.spacing.medium}
    ${({ theme }) => theme.spacing.medium};
`;

const ExerciseList = styled.ul`
  list-style-position: inside;
  padding-left: ${({ theme }) => theme.spacing.small};
  margin: 0;
  color: ${({ theme }) => theme.colors.textSecondary};
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
  &:hover {
    opacity: 0.9;
  }
`;

function VersionHistoryModal({ isOpen, onClose, versions = [], onRestore }) {
  const [expandedVersionId, setExpandedVersionId] = useState(null);

  if (!isOpen) {
    return null;
  }

  const handleToggle = (versionId) => {
    setExpandedVersionId((prevId) => (prevId === versionId ? null : versionId));
  };

  return (
    <Backdrop onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalTitle>Histórico de Versões</ModalTitle>
        <VersionList>
          {versions.length > 0 ? (
            versions.map((version) => {
              const isExpanded = expandedVersionId === version.id;
              return (
                <VersionItem key={version.id}>
                  <VersionHeader onClick={() => handleToggle(version.id)}>
                    <span>
                      Versão {version.version} - Criada em:{" "}
                      {new Date(version.created_at).toLocaleDateString("pt-BR")}
                    </span>
                    <HeaderActions>
                      {onRestore && (
                        <RestoreButton
                          onClick={(e) => {
                            e.stopPropagation();
                            onRestore(version);
                          }}
                        >
                          Restaurar
                        </RestoreButton>
                      )}
                      <ArrowIcon isOpen={isExpanded}>►</ArrowIcon>
                    </HeaderActions>
                  </VersionHeader>
                  {isExpanded && (
                    <ExerciseListWrapper>
                      <ExerciseList>
                        {version.exercises.map((ex, index) => (
                          <li key={index}>
                            {ex.name} ({ex.sets || "_"}x{ex.reps || "_"})
                          </li>
                        ))}
                      </ExerciseList>
                    </ExerciseListWrapper>
                  )}
                </VersionItem>
              );
            })
          ) : (
            <p>Nenhuma versão anterior encontrada.</p>
          )}
        </VersionList>
        <CloseButton onClick={onClose}>Fechar</CloseButton>
      </ModalContent>
    </Backdrop>
  );
}

export default VersionHistoryModal;
