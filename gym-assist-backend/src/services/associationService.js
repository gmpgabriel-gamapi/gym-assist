const userQueries = require("../db/userQueries");
const associationQueries = require("../db/associationQueries");

const addStudentToProfessor = async ({
  professorId,
  studentEmail,
  studentName,
}) => {
  let student = await userQueries.findUserByEmail(studentEmail);

  if (!student) {
    console.log(
      `Aluno com email ${studentEmail} não encontrado. Criando usuário provisionado...`
    );
    student = await userQueries.createUser({
      name: studentName,
      email: studentEmail,
      passwordHash: null,
      status: "provisioned",
    });
  }

  if (student.role !== "student") {
    throw {
      status: 400,
      message: "O e-mail fornecido não pertence a uma conta de aluno.",
    };
  }

  const existingLink = await associationQueries.findProfessorStudentLink(
    professorId,
    student.id
  );
  if (existingLink) {
    throw { status: 409, message: "Este aluno já está associado a você." };
  }

  const newAssociation = await associationQueries.createProfessorStudentLink(
    professorId,
    student.id
  );
  return { student, association: newAssociation };
};

const getStudentsForProfessor = async (professorId) => {
  const students = await associationQueries.findStudentsByProfessorId(
    professorId
  );
  return students;
};

module.exports = {
  addStudentToProfessor,
  getStudentsForProfessor,
};
