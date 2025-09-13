// [FRONTEND] arquivo: src/components/common/ModeSwitch.jsx (CORRIGIDO)
import React from "react";
import styled from "styled-components";

const SwitchWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.medium};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  transition: opacity 0.2s;
`;

const SwitchContainer = styled.div`
  position: relative;
  width: 50px;
  height: 26px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 13px;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  transition: background-color 0.2s;
`;

const SwitchThumb = styled.div`
  position: absolute;
  top: 3px;
  left: 3px;
  width: 20px;
  height: 20px;
  background-color: ${({ theme }) => theme.colors.text};
  border-radius: 50%;
  transition: transform 0.2s ease-in-out;
  /* MODIFICAÇÃO: Usa props transientes ($) */
  transform: ${({ $value, $options }) =>
    $value === $options[1].value ? "translateX(24px)" : "translateX(0)"};
`;

const Label = styled.span`
  /* MODIFICAÇÃO: Usa prop transiente ($) */
  color: ${({ theme, $isActive }) =>
    $isActive ? theme.colors.primary : theme.colors.textSecondary};
  font-weight: ${({ $isActive }) => ($isActive ? "bold" : "normal")};
  transition: color 0.2s;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
`;

function ModeSwitch({ options, value, onChange, disabled = false }) {
  const handleClick = () => {
    if (disabled) return;
    const newValue =
      value === options[0].value ? options[1].value : options[0].value;
    onChange(newValue);
  };

  return (
    <SwitchWrapper disabled={disabled}>
      <Label
        /* MODIFICAÇÃO: Passa a prop como transiente ($) */
        $isActive={value === options[0].value}
        disabled={disabled}
        onClick={handleClick}
      >
        {options[0].label}
      </Label>
      <SwitchContainer onClick={handleClick} disabled={disabled}>
        {/* MODIFICAÇÃO: Passa as props como transientes ($) */}
        <SwitchThumb $value={value} $options={options} />
      </SwitchContainer>
      <Label
        /* MODIFICAÇÃO: Passa a prop como transiente ($) */
        $isActive={value === options[1].value}
        disabled={disabled}
        onClick={handleClick}
      >
        {options[1].label}
      </Label>
    </SwitchWrapper>
  );
}

export default ModeSwitch;
