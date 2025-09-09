import { useState, useEffect } from "react";
import styled from "styled-components";
import { getProfile, updateProfile } from "../services/profileService";

const ProfileWrapper = styled.div`
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

const ProfileSection = styled.section`
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing.large};
  border-radius: 8px;
  margin-bottom: ${({ theme }) => theme.spacing.large};
`;

const SectionTitle = styled.h3`
  color: ${({ theme }) => theme.colors.text};
  border-bottom: 1px solid ${({ theme }) => theme.colors.surface};
  padding-bottom: ${({ theme }) => theme.spacing.medium};
  margin-bottom: ${({ theme }) => theme.spacing.medium};
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.small};
  font-size: 1.1rem;
  line-height: 1.5;
`;

const InfoLabel = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
  width: 150px;
  flex-shrink: 0;
`;

const InfoValue = styled.span`
  color: ${({ theme }) => theme.colors.text};
`;

const EditForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const InputRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.medium};
`;

const InputLabel = styled.label`
  color: ${({ theme }) => theme.colors.textSecondary};
  width: 150px;
  flex-shrink: 0;
  font-size: 1.1rem;
`;

const Input = styled.input`
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.surfaceHover};
  color: ${({ theme }) => theme.colors.text};
  border-radius: 4px;
  padding: 8px;
  font-size: 1rem;
  width: 100%;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.medium};
  margin-top: ${({ theme }) => theme.spacing.medium};
`;

const Button = styled.button`
  padding: 10px 20px;
  border-radius: 4px;
  border: none;
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 1rem;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PrimaryButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.background};
`;

const SecondaryButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
`;

const MeasurementInputWrapper = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.medium};
  align-items: center;
  width: 100%;
`;

const SelectUnit = styled.select`
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.surfaceHover};
  color: ${({ theme }) => theme.colors.text};
  border-radius: 4px;
  padding: 8px;
  font-size: 1rem;
  font-family: ${({ theme }) => theme.fonts.body};
`;

const ResetButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0 10px;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

function Profile() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  const initializeFormData = (data) => {
    setFormData({
      name: data.name,
      birth_date: data.birth_date,
      gender: data.gender,
      height: data.measurements?.height?.value || "",
      weight: data.measurements?.weight?.value || "",
      heightUnit: data.measurements?.height?.unit || "cm",
      weightUnit: data.measurements?.weight?.unit || "kg",
    });
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProfile();
      setProfileData(data);
      initializeFormData(data);
    } catch (err) {
      setError(err.message || "Falha ao buscar perfil.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const dataToUpdate = {
        height: formData.height,
        heightUnit: formData.heightUnit,
        weight: formData.weight,
        weightUnit: formData.weightUnit,
      };
      const updatedProfile = await updateProfile(dataToUpdate);
      setProfileData(updatedProfile);
      initializeFormData(updatedProfile);
      setIsEditing(false);
    } catch (err) {
      setError(err.message || "Falha ao salvar o perfil.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    initializeFormData(profileData);
    setIsEditing(false);
  };

  if (loading && !profileData) {
    return (
      <ProfileWrapper>
        <PageTitle>Meu Perfil</PageTitle>
        <p>Carregando perfil...</p>
      </ProfileWrapper>
    );
  }

  if (error) {
    return (
      <ProfileWrapper>
        <PageTitle>Meu Perfil</PageTitle>
        <p style={{ color: "#E53E3E" }}>Erro: {error}</p>
      </ProfileWrapper>
    );
  }

  if (!profileData) {
    return null;
  }

  const formattedBirthDate = profileData.birth_date
    ? new Date(profileData.birth_date).toLocaleDateString("pt-BR", {
        timeZone: "UTC",
      })
    : "Não informado";

  const currentWeight = profileData.measurements?.weight;
  const currentHeight = profileData.measurements?.height;

  return (
    <ProfileWrapper>
      <PageHeader>
        <PageTitle>Meu Perfil</PageTitle>
        {!isEditing && (
          <PrimaryButton onClick={() => setIsEditing(true)}>
            Editar Dados
          </PrimaryButton>
        )}
      </PageHeader>

      {!isEditing ? (
        <>
          <ProfileSection>
            <SectionTitle>Informações da Conta</SectionTitle>
            <InfoRow>
              <InfoLabel>Nome:</InfoLabel>
              <InfoValue>{profileData.name}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Email:</InfoLabel>
              <InfoValue>{profileData.email}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Data de Nasc.:</InfoLabel>
              <InfoValue>{formattedBirthDate}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Sexo:</InfoLabel>
              <InfoValue>{profileData.gender || "Não informado"}</InfoValue>
            </InfoRow>
          </ProfileSection>
          <ProfileSection>
            <SectionTitle>Dados Complementares</SectionTitle>
            <InfoRow>
              <InfoLabel>Altura:</InfoLabel>
              <InfoValue>
                {currentHeight
                  ? `${currentHeight.value} ${currentHeight.unit}`
                  : "Não informado"}
              </InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Peso:</InfoLabel>
              <InfoValue>
                {currentWeight
                  ? `${currentWeight.value} ${currentWeight.unit}`
                  : "Não informado"}
              </InfoValue>
            </InfoRow>
          </ProfileSection>
        </>
      ) : (
        <EditForm onSubmit={handleSave}>
          <ProfileSection>
            <SectionTitle>Informações da Conta</SectionTitle>
            <InputRow>
              <InputLabel htmlFor="name">Nome:</InputLabel>
              <Input
                type="text"
                name="name"
                id="name"
                value={formData.name || ""}
                disabled
              />
            </InputRow>
            <InputRow>
              <InputLabel htmlFor="birth_date">Data de Nasc.:</InputLabel>
              <Input
                type="date"
                name="birth_date"
                id="birth_date"
                value={formData.birth_date?.split("T")[0] || ""}
                disabled
              />
            </InputRow>
            <InputRow>
              <InputLabel htmlFor="gender">Sexo:</InputLabel>
              <Input
                type="text"
                name="gender"
                id="gender"
                value={formData.gender || ""}
                disabled
              />
            </InputRow>
          </ProfileSection>
          <ProfileSection>
            <SectionTitle>Adicionar Dados Complementares</SectionTitle>
            <InputRow>
              <InputLabel htmlFor="height">Nova Altura:</InputLabel>
              <MeasurementInputWrapper>
                <Input
                  type="number"
                  step="0.01"
                  name="height"
                  id="height"
                  value={formData.height}
                  onChange={handleInputChange}
                />
                <SelectUnit
                  name="heightUnit"
                  value={formData.heightUnit}
                  onChange={handleInputChange}
                >
                  <option value="cm">cm</option>
                  <option value="m">m</option>
                  <option value="ft">ft</option>
                </SelectUnit>
                <ResetButton
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      height: profileData.measurements?.height?.value || "",
                      heightUnit:
                        profileData.measurements?.height?.unit || "cm",
                    }))
                  }
                  disabled={!profileData.measurements?.height}
                >
                  ⟲
                </ResetButton>
              </MeasurementInputWrapper>
            </InputRow>
            <InputRow>
              <InputLabel htmlFor="weight">Novo Peso:</InputLabel>
              <MeasurementInputWrapper>
                <Input
                  type="number"
                  step="0.01"
                  name="weight"
                  id="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                />
                <SelectUnit
                  name="weightUnit"
                  value={formData.weightUnit}
                  onChange={handleInputChange}
                >
                  <option value="kg">kg</option>
                  <option value="lbs">lbs</option>
                </SelectUnit>
                <ResetButton
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      weight: profileData.measurements?.weight?.value || "",
                      weightUnit:
                        profileData.measurements?.weight?.unit || "kg",
                    }))
                  }
                  disabled={!profileData.measurements?.weight}
                >
                  ⟲
                </ResetButton>
              </MeasurementInputWrapper>
            </InputRow>
          </ProfileSection>
          <ButtonGroup>
            <SecondaryButton type="button" onClick={handleCancel}>
              Cancelar
            </SecondaryButton>
            <PrimaryButton type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar Alterações"}
            </PrimaryButton>
          </ButtonGroup>
        </EditForm>
      )}
    </ProfileWrapper>
  );
}

export default Profile;
