import styled from "styled-components";
import Sidebar from "./Sidebar";
import Header from "./Header";

const AppWrapper = styled.div`
  display: flex;
  min-height: 100vh; /* Garante que o wrapper ocupe no mínimo a altura da tela */
`;

const ContentWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.background};
`;

const MainContent = styled.main`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.large};
  overflow-y: auto;
`;

function Layout({ children }) {
  return (
    <AppWrapper>
      <Sidebar />
      <ContentWrapper>
        <MainContent>
          <Header />
          {children}
        </MainContent>
      </ContentWrapper>
    </AppWrapper>
  );
}

export default Layout;
