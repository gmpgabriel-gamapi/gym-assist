// Simula a lista de séries pessoais que a professora criou para si mesma
export const teacherPersonalSeriesMock = [
  {
    id: "teacher_serie_A",
    name: "Prof - Treino de Força Geral",
    exercises: [
      { id: "ex09", name: "Agachamento Livre", sets: 5, reps: "5" },
      { id: "ex01", name: "Supino Reto", sets: 5, reps: "5" },
      { id: "ex06", name: "Remada Curvada", sets: 5, reps: "5" },
    ],
  },
];

// Simula a lista de templates reutilizáveis que a professora criou
export const teacherTemplatesMock = [
  {
    id: "template_iniciante_peito",
    name: "Template - Iniciante Peito",
    exercises: [
      { id: "ex01", name: "Supino Reto", sets: 3, reps: "10" },
      {
        id: "ex02",
        name: "Supino Inclinado com Halteres",
        sets: 3,
        reps: "12",
      },
    ],
  },
  {
    id: "template_avancado_pernas",
    name: "Template - Avançado Pernas",
    exercises: [
      { id: "ex09", name: "Agachamento Livre", sets: 4, reps: "8" },
      { id: "ex10", name: "Leg Press 45", sets: 4, reps: "10" },
      { id: "ex11", name: "Cadeira Extensora", sets: 3, reps: "15" },
    ],
  },
];
