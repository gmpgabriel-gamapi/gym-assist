import styled from "styled-components";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const SidebarContainer = styled.aside`
  width: 240px;
  height: 100%;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing.large};
  display: flex;
  flex-direction: column;
  border-right: 1px solid ${({ theme }) => theme.colors.background};
`;

const Logo = styled(Link)`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 48px;
  text-decoration: none;
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NavItem = styled.li`
  margin-bottom: ${({ theme }) => theme.spacing.small};

  a {
    display: block;
    padding: ${({ theme }) => theme.spacing.medium};
    border-radius: 4px;
    color: ${({ theme, $isActive }) =>
      $isActive ? theme.colors.primary : theme.colors.text};
    font-weight: ${({ $isActive }) => ($isActive ? "bold" : "normal")};
    background-color: ${({ theme, $isActive }) =>
      $isActive ? theme.colors.background : "transparent"};
    text-decoration: none;
    transition: all 0.2s ease-in-out;

    &:hover {
      background-color: ${({ theme }) => theme.colors.background};
    }
  }
`;

function Sidebar() {
  const location = useLocation();
  const { user } = useAuth();

  // Ordem dos menus ajustada conforme sua solicitação
  let menuItems = [
    { path: "/", label: "Dashboard" },
    { path: "/perfil", label: "Meu Perfil" },
    { path: "/meu-treino", label: "Meu Treino" },
    { path: "/planejamento", label: "Planejamento" },
  ];

  if (user && user.role === "teacher") {
    menuItems.push({ path: "/meus-alunos", label: "Meus Alunos" });
  }

  return (
    <SidebarContainer>
      <Logo to="/">Gym Assist</Logo>
      <nav>
        <NavList>
          {menuItems.map((item) => (
            <NavItem
              key={item.path}
              $isActive={
                (item.path !== "/" &&
                  location.pathname.startsWith(item.path)) ||
                (item.path === "/" && location.pathname === "/")
              }
            >
              <Link to={item.path}>{item.label}</Link>
            </NavItem>
          ))}
        </NavList>
      </nav>
    </SidebarContainer>
  );
}

export default Sidebar;
