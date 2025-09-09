const db = require("./index");

const findProfessorStudentLink = async (professorId, studentId) => {
  const { rows } = await db.query(
    "SELECT * FROM professor_alunos WHERE professor_user_id = $1 AND aluno_user_id = $2",
    [professorId, studentId]
  );
  return rows[0];
};

const createProfessorStudentLink = async (professorId, studentId) => {
  const { rows } = await db.query(
    "INSERT INTO professor_alunos (professor_user_id, aluno_user_id) VALUES ($1, $2) RETURNING *",
    [professorId, studentId]
  );
  return rows[0];
};

const findStudentsByProfessorId = async (professorId) => {
  const { rows } = await db.query(
    `SELECT u.id, u.name, u.email FROM users u 
     INNER JOIN professor_alunos pa ON u.id = pa.aluno_user_id 
     WHERE pa.professor_user_id = $1 
     ORDER BY u.name`,
    [professorId]
  );
  return rows;
};

module.exports = {
  findProfessorStudentLink,
  createProfessorStudentLink,
  findStudentsByProfessorId,
};
