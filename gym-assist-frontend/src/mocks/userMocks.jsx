import {
  teacherPersonalSeriesMock,
  teacherTemplatesMock,
} from "./teacherMocks";

export const studentUserMock = {
  id: "user123",
  name: "Fulano Silva",
  email: "fulano.silva@email.com",
  role: "student",
};

export const teacherUserMock = {
  id: "teacher456",
  name: "Professora Ana Souza",
  email: "ana.souza@email.com",
  role: "teacher",
  students: [
    { id: "user123", name: "Fulano Silva", email: "fulano.silva@email.com" },
    {
      id: "user789",
      name: "Beltrana Oliveira",
      email: "beltrana.oliveira@email.com",
    },
    {
      id: "user101",
      name: "Carlos Pereira",
      email: "carlos.pereira@email.com",
    },
    { id: "user102", name: "Daniela Costa", email: "daniela.costa@email.com" },
    {
      id: "user103",
      name: "Eduardo Martins",
      email: "eduardo.martins@email.com",
    },
    { id: "user104", name: "Fernanda Lima", email: "fernanda.lima@email.com" },
    {
      id: "user105",
      name: "Gabriel Almeida",
      email: "gabriel.almeida@email.com",
    },
    { id: "user106", name: "Helena Santos", email: "helena.santos@email.com" },
  ],
  personalSeries: teacherPersonalSeriesMock,
  seriesTemplates: teacherTemplatesMock,
};
