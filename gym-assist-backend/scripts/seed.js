const db = require("../src/db");

// Estrutura hierárquica completa
const data = {
  muscleHierarchy: [
    {
      group: "Peitoral",
      subgroups: [
        {
          name: "Peitoral Maior",
          muscles: [
            "Parte Clavicular (Superior)",
            "Parte Esternal (Médio)",
            "Parte Costal (Inferior)",
          ],
        },
        { name: "Peitoral Menor", muscles: ["Peitoral Menor"] },
      ],
    },
    {
      group: "Costas (Dorsais)",
      subgroups: [
        { name: "Dorsal", muscles: ["Grande Dorsal"] },
        {
          name: "Trapézio",
          muscles: ["Trapézio Superior", "Trapézio Médio", "Trapézio Inferior"],
        },
        { name: "Romboides", muscles: ["Romboide Maior", "Romboide Menor"] },
        {
          name: "Eretores da Espinha",
          muscles: ["Iliocostal", "Longuíssimo", "Espinhal"],
        },
      ],
    },
    {
      group: "Ombros (Deltoides)",
      subgroups: [
        {
          name: "Deltoide",
          muscles: [
            "Deltoide Anterior",
            "Deltoide Lateral",
            "Deltoide Posterior",
          ],
        },
      ],
    },
    {
      group: "Braços",
      subgroups: [
        {
          name: "Bíceps",
          muscles: ["Bíceps Braquial", "Braquial", "Braquiorradial"],
        },
        { name: "Tríceps", muscles: ["Tríceps Braquial"] },
        {
          name: "Antebraço",
          muscles: ["Flexores do Punho", "Extensores do Punho"],
        },
      ],
    },
    {
      group: "Pernas",
      subgroups: [
        {
          name: "Quadríceps",
          muscles: [
            "Reto Femoral",
            "Vasto Lateral",
            "Vasto Medial",
            "Vasto Intermédio",
          ],
        },
        {
          name: "Isquiotibiais",
          muscles: ["Bíceps Femoral", "Semitendíneo", "Semimembranoso"],
        },
        {
          name: "Glúteos",
          muscles: ["Glúteo Máximo", "Glúteo Médio", "Glúteo Mínimo"],
        },
        { name: "Panturrilhas", muscles: ["Gastrocnêmio", "Sóleo"] },
      ],
    },
    {
      group: "Abdômen",
      subgroups: [
        {
          name: "Abdômen",
          muscles: ["Reto Abdominal", "Oblíquos", "Transverso Abdominal"],
        },
      ],
    },
  ],
  movements: [
    "Adução Horizontal de Ombro",
    "Extensão de Cotovelo",
    "Flexão de Cotovelo",
    "Extensão de Ombro",
    "Flexão de Ombro",
    "Extensão de Quadril",
    "Extensão de Joelho",
    "Flexão de Joelho",
  ],
  baseExercises: [
    {
      name: "Supino Reto",
      movements: ["Adução Horizontal de Ombro", "Extensão de Cotovelo"],
    },
    {
      name: "Agachamento Livre",
      movements: ["Extensão de Quadril", "Extensão de Joelho"],
    },
    { name: "Rosca Direta", movements: ["Flexão de Cotovelo"] },
  ],
  // O "Cérebro": Mapeamento de Movimentos para Músculos
  movementMuscleMap: [
    {
      movement: "Adução Horizontal de Ombro",
      muscle: "Parte Esternal (Médio)",
      role: "agonista",
    },
    {
      movement: "Adução Horizontal de Ombro",
      muscle: "Deltoide Anterior",
      role: "sinergista",
    },
    {
      movement: "Extensão de Cotovelo",
      muscle: "Tríceps Braquial",
      role: "agonista",
    },
    {
      movement: "Extensão de Quadril",
      muscle: "Glúteo Máximo",
      role: "agonista",
    },
    {
      movement: "Extensão de Quadril",
      muscle: "Isquiotibiais",
      role: "sinergista",
    },
    { movement: "Extensão de Joelho", muscle: "Quadríceps", role: "agonista" },
    {
      movement: "Flexão de Cotovelo",
      muscle: "Bíceps Braquial",
      role: "agonista",
    },
    { movement: "Flexão de Cotovelo", muscle: "Braquial", role: "sinergista" },
  ],
};

async function seedDatabase() {
  console.log("Iniciando seeding do banco de dados...");

  try {
    console.log("Limpando tabelas existentes...");
    // O CASCADE apaga os dados em todas as tabelas que dependem destas, em ordem
    await db.query(
      "TRUNCATE muscle_groups, movements, base_exercises RESTART IDENTITY CASCADE"
    );

    const inserted = {
      groups: {},
      subgroups: {},
      muscles: {},
      movements: {},
      baseExercises: {},
    };

    console.log("Populando hierarquia muscular...");
    for (const { group, subgroups } of data.muscleHierarchy) {
      const groupRes = await db.query(
        "INSERT INTO muscle_groups (name) VALUES ($1) RETURNING id",
        [group]
      );
      inserted.groups[group] = groupRes.rows[0].id;
      for (const { name, muscles } of subgroups) {
        const subGroupRes = await db.query(
          "INSERT INTO muscle_subgroups (name, muscle_group_id) VALUES ($1, $2) RETURNING id",
          [name, inserted.groups[group]]
        );
        inserted.subgroups[name] = subGroupRes.rows[0].id;
        for (const muscle of muscles) {
          const muscleRes = await db.query(
            "INSERT INTO muscles (name, muscle_subgroup_id) VALUES ($1, $2) RETURNING id",
            [muscle, inserted.subgroups[name]]
          );
          inserted.muscles[muscle] = muscleRes.rows[0].id;
        }
      }
    }

    console.log("Populando movimentos...");
    for (const movement of data.movements) {
      const res = await db.query(
        "INSERT INTO movements (name) VALUES ($1) RETURNING id",
        [movement]
      );
      inserted.movements[movement] = res.rows[0].id;
    }

    console.log("Populando exercícios base...");
    for (const exercise of data.baseExercises) {
      const res = await db.query(
        "INSERT INTO base_exercises (name) VALUES ($1) RETURNING id",
        [exercise.name]
      );
      inserted.baseExercises[exercise.name] = res.rows[0].id;
      for (const movement of exercise.movements) {
        await db.query(
          "INSERT INTO base_exercise_movements (base_exercise_id, movement_id) VALUES ($1, $2)",
          [inserted.baseExercises[exercise.name], inserted.movements[movement]]
        );
      }
    }

    console.log('Populando o "cérebro" (movement_to_muscle)...');
    for (const { movement, muscle, role } of data.movementMuscleMap) {
      if (inserted.movements[movement] && inserted.muscles[muscle]) {
        await db.query(
          "INSERT INTO movement_to_muscle (movement_id, muscle_id, role) VALUES ($1, $2, $3)",
          [inserted.movements[movement], inserted.muscles[muscle], role]
        );
      }
    }

    console.log("\nSeeding concluído com sucesso!");
  } catch (error) {
    console.error("\nErro durante o seeding:", error);
  } finally {
    await db.pool.end();
    console.log("Conexão com o banco de dados encerrada.");
  }
}

seedDatabase();
