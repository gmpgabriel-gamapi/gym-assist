// [FRONTEND] arquivo: gym-assist-frontend/src/pages/Register.jsx (NOVO)
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  AuthWrapper,
  AuthForm,
  AuthTitle,
  AuthInput,
  AuthButton,
  AuthErrorMessage,
  AuthLink,
} from "../components/auth/AuthStyles"; // Importando do novo local

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      await register(name, email, password);
      // Futuramente, podemos adicionar uma mensagem de sucesso aqui.
      navigate("/login");
    } catch (err) {
      setError(err.message || "Falha ao criar a conta.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthWrapper>
      <AuthForm onSubmit={handleSubmit}>
        <AuthTitle>Criar Conta</AuthTitle>
        <AuthInput
          type="text"
          placeholder="Nome completo"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <AuthInput
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <AuthInput
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <AuthInput
          type="password"
          placeholder="Confirmar Senha"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        {error && <AuthErrorMessage>{error}</AuthErrorMessage>}
        <AuthButton type="submit" disabled={isLoading}>
          {isLoading ? "Criando..." : "Criar Conta"}
        </AuthButton>
        <div style={{ textAlign: "center", marginTop: "8px" }}>
          <AuthLink to="/login">Já tem uma conta? Faça login</AuthLink>
        </div>
      </AuthForm>
    </AuthWrapper>
  );
}

export default Register;
