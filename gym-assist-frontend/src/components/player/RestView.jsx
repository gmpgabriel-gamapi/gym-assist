import React from "react";
import styled from "styled-components";
import Timer from "../common/Timer";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: ${({ theme }) => theme.spacing.large};
`;

const ExerciseName = styled.p`
  font-size: 1.2rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
`;

const VolumeControl = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const VolumeSlider = styled.input`
  width: 200px;
`;

function RestView({
  exerciseName,
  duration,
  onComplete,
  volume,
  onVolumeChange,
}) {
  return (
    <Wrapper>
      <ExerciseName>{exerciseName}</ExerciseName>
      <Timer action={duration} onComplete={onComplete} />
      <VolumeControl>
        <label>Volume</label>
        <VolumeSlider
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
        />
      </VolumeControl>
    </Wrapper>
  );
}

export default RestView;
