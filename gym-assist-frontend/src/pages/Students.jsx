import { useState, useMemo, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { addStudent, getMyStudents } from "../services/associationService";

const PageWrapper = styled.div`
  width: 100%;
`;

const PageHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.large};
`;

const PageTitle = styled.h2`
  color: ${({ theme }) => theme.colors.primary};
  margin: 0;
`;

const AddStudentForm = styled.form`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.medium};
  margin-bottom: ${({ theme }) => theme.spacing.large};
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing.large};
  border-radius: 8px;
`;

const NameInput = styled.input`
  width: 40%;
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.surfaceHover};
  color: ${({ theme }) => theme.colors.text};
  border-radius: 4px;
  padding: 10px;
  font-size: 1rem;
`;

const EmailInput = styled.input`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.surfaceHover};
  color: ${({ theme }) => theme.colors.text};
  border-radius: 4px;
  padding: 10px;
  font-size: 1rem;
`;

const SubmitButton = styled.button`
  padding: 10px 20px;
  border-radius: 4px;
  border: none;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.background};
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 1rem;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    opacity: 0.9;
  }
`;

const ErrorMessage = styled.p`
  color: #e53e3e;
  text-align: center;
  width: 100%;
  margin: 0 0 ${({ theme }) => theme.spacing.medium} 0;
`;

const ListContainer = styled.div`
  background-color: transparent;
  padding: 0;
  border-radius: 8px;
`;

const SearchInput = styled(NameInput)`
  margin-bottom: ${({ theme }) => theme.spacing.medium};
  width: 100%;
`;

const StudentList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.medium};
  justify-content: start;
`;

const StudentCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 8px;
  padding: ${({ theme }) => theme.spacing.medium};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};
  border: 1px solid transparent;
  transition: all 0.2s ease-in-out;
  min-height: 150px;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-4px);
  }
`;

const StudentName = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
`;

const StudentEmail = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.9rem;
  flex: 1;
`;

const CardButton = styled.button`
  margin-top: ${({ theme }) => theme.spacing.medium};
  padding: 8px;
  width: 100%;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  background-color: transparent;
  color: ${({ theme }) => theme.colors.primary};
  font-family: ${({ theme }) => theme.fonts.heading};
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.background};
  }
`;

function Students() {
  const { user, refetchUser } = useAuth();
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      // Evita chamar a API se o usuário não for um professor
      if (user?.role !== "teacher") {
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        const studentData = await getMyStudents();
        setStudents(studentData);
      } catch (err) {
        setError(err.message || "Falha ao buscar alunos.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, [user]);

  const handleAddStudent = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    try {
      const result = await addStudent(studentName, studentEmail);
      alert(result.message || `Aluno ${studentName} adicionado com sucesso!`);
      setStudentName("");
      setStudentEmail("");
      await fetchStudents();
    } catch (err) {
      setError(err.message || "Ocorreu um erro.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewDetails = (studentId) => {
    navigate(`/aluno/${studentId}`);
  };

  const filteredStudents = useMemo(() => {
    return students.filter((student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [students, searchTerm]);

  if (isLoading) {
    return <p>Carregando alunos...</p>;
  }

  return (
    <PageWrapper>
      <PageHeader>
        <PageTitle>Meus Alunos</PageTitle>
      </PageHeader>

      <AddStudentForm onSubmit={handleAddStudent}>
        <NameInput
          type="text"
          placeholder="Nome completo do aluno"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          required
        />
        <EmailInput
          type="email"
          placeholder="E-mail do aluno"
          value={studentEmail}
          onChange={(e) => setStudentEmail(e.target.value)}
          required
        />
        <SubmitButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adicionando..." : "Adicionar Aluno"}
        </SubmitButton>
      </AddStudentForm>
      {error && <ErrorMessage>{error}</ErrorMessage>}

      <ListContainer>
        <SearchInput
          type="text"
          placeholder="Buscar aluno por nome..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <StudentList>
          {filteredStudents.map((student) => (
            <StudentCard key={student.id}>
              <StudentName>{student.name}</StudentName>
              <StudentEmail>{student.email}</StudentEmail>
              <CardButton onClick={() => handleViewDetails(student.id)}>
                Ver Detalhes
              </CardButton>
            </StudentCard>
          ))}
        </StudentList>
      </ListContainer>
    </PageWrapper>
  );
}

export default Students;
