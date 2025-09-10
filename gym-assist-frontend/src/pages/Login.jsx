// [FRONTEND] arquivo: src/pages/Login.jsx (VERSÃO FINAL CORRIGIDA)
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // ADIÇÃO: Importa o Link
import styled from "styled-components";
import { useAuth } from "../context/AuthContext";

const LoginWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
`;

const LoginForm = styled.form`
  width: 100%;
  max-width: 400px;
  padding: ${({ theme }) => theme.spacing.large};
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.medium};
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.medium};
  color: ${({ theme }) => theme.colors.primary};
`;

const Input = styled.input`
  padding: 12px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colors.background};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 1rem;

  &:focus {
    outline: 1px solid ${({ theme }) => theme.colors.primary};
  }
`;

const Button = styled.button`
  padding: 12px;
  border-radius: 4px;
  border: none;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.surface};
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 1.1rem;
  cursor: pointer;
  transition: opacity 0.2s;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    opacity: 0.9;
  }
`;

const ErrorMessage = styled.p`
  color: #e53e3e; /* Vermelho para erros */
  text-align: center;
  font-size: 0.9rem;
  margin: 0;
`;

// --- ADIÇÃO INICIA ---
// Componente estilizado para agrupar os links de navegação
const LinksWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.spacing.small};

  a {
    color: ${({ theme }) => theme.colors.textSecondary};
    text-decoration: none;
    font-size: 0.9rem;

    &:hover {
      color: ${({ theme }) => theme.colors.primary};
    }
  }
`;
// --- ADIÇÃO TERMINA ---

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message || "Falha ao fazer login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginWrapper>
      <LoginForm onSubmit={handleSubmit}>
        <Title>Gym Assist</Title>
        <Input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Entrando..." : "Entrar"}
        </Button>
        {/* --- ADIÇÃO: Links de navegação --- */}
        <LinksWrapper>
          <Link to="/register">Criar uma conta</Link>
          <Link to="/forgot-password">Esqueceu a senha?</Link>
        </LinksWrapper>
      </LoginForm>
    </LoginWrapper>
  );
}

export default Login;
