import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const HeaderWrapper = styled.header`
  width: 100%;
  padding-bottom: ${({ theme }) => theme.spacing.large};
  margin-bottom: ${({ theme }) => theme.spacing.large};
  border-bottom: 1px solid ${({ theme }) => theme.colors.surface};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const UserInfo = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  font-size: 0.9rem;
  font-family: ${({ theme }) => theme.fonts.body};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <HeaderWrapper>
      <UserInfo>
        Logado como: <strong>{user.name}</strong>
      </UserInfo>
      <LogoutButton onClick={handleLogout}>Sair</LogoutButton>
    </HeaderWrapper>
  );
}

export default Header;
