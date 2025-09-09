import { useState, useRef, useEffect } from "react";
import styled, { css } from "styled-components";

const DropdownWrapper = styled.div`
  position: relative;
  width: 250px;
  font-family: ${({ theme }) => theme.fonts.body};
`;

// O Header agora reage à prop 'disabled'
const DropdownHeader = styled.div`
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colors.surface};
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: opacity 0.2s;

  /* Estilos aplicados quando o componente está desabilitado */
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`;

const DropdownList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  list-style: none;
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.background};
  border-radius: 4px;
  margin-top: 4px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
  padding: 4px 0;
`;

const SearchInput = styled.input`
  width: calc(100% - 8px);
  margin: 4px;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colors.background};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.fonts.body};

  &:focus {
    outline: 1px solid ${({ theme }) => theme.colors.primary};
  }
`;

const DropdownItem = styled.li`
  padding: 10px 12px;
  cursor: pointer;
  margin: 0 4px;
  border-radius: 4px;
  transition: all 0.2s ease-in-out;

  background-color: ${({ theme, $isSpecial }) =>
    $isSpecial ? theme.colors.background : "transparent"};

  color: ${({ theme, $isSelected }) =>
    $isSelected ? theme.colors.primary : theme.colors.text};
  font-weight: ${({ $isSelected }) => ($isSelected ? "bold" : "normal")};

  &:hover {
    ${({ $isSelected }) =>
      !$isSelected &&
      css`
        background-color: ${({ theme }) => theme.colors.surfaceHover};
        color: ${({ theme }) => theme.colors.text};
        font-weight: normal;
      `}
  }
`;

// A função agora aceita e utiliza a prop 'disabled'
function CustomDropdown({
  options,
  value,
  onChange,
  placeholder = "Selecione...",
  filterType = "startsWithWord",
  disabled = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleToggle = () => {
    if (disabled) return; // Impede qualquer ação se estiver desabilitado
    if (isOpen) {
      setSearchTerm("");
    }
    setIsOpen(!isOpen);
  };

  const handleSelectOption = (option) => {
    onChange(option);
    setIsOpen(false);
    setSearchTerm("");
  };

  const selectedOption = options.find((opt) => opt.value === value);

  const filteredOptions = options.filter((option) => {
    if (option.$isSpecial) return true;
    if (!searchTerm) return true;

    const searchTermLower = searchTerm.toLowerCase();
    const labelLower = option.label.toLowerCase();

    if (filterType === "contains") {
      return labelLower.includes(searchTermLower);
    }

    const startsWithTerm = labelLower.startsWith(searchTermLower);
    const wordStartsWithTerm = labelLower
      .split(" ")
      .some((word) => word.startsWith(searchTermLower));
    return startsWithTerm || wordStartsWithTerm;
  });

  return (
    <DropdownWrapper ref={dropdownRef}>
      <DropdownHeader onClick={handleToggle} disabled={disabled}>
        {selectedOption ? selectedOption.label : placeholder}
        <span>{isOpen && !disabled ? "▲" : "▼"}</span>
      </DropdownHeader>

      {/* A lista só abre se não estiver desabilitado */}
      {isOpen && !disabled && (
        <DropdownList>
          <SearchInput
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            autoFocus
          />
          {filteredOptions.map((option) => (
            <DropdownItem
              key={option.value}
              onClick={() => handleSelectOption(option)}
              $isSpecial={option.$isSpecial}
              $isSelected={option.value === value}
            >
              {option.label}
            </DropdownItem>
          ))}
        </DropdownList>
      )}
    </DropdownWrapper>
  );
}

export default CustomDropdown;
