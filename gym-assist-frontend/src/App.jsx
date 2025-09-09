import { ThemeProvider } from "styled-components";
import styled from "styled-components";
import { GlobalStyles } from "./styles/GlobalStyles";
import { theme } from "./constants/theme";
import AppRoutes from "./AppRoutes";
import { AuthProvider, useAuth } from "./context/AuthContext";

const AppContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  min-height: 100vh;
`;

const LoadingScreen = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.5rem;
`;

function AppContent() {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingScreen>Carregando Gym Assist...</LoadingScreen>;
  }

  return <AppRoutes />;
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <GlobalStyles />
        <AppContainer>
          <AppContent />
        </AppContainer>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
