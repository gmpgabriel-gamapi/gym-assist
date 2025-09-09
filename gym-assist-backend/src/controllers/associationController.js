const associationService = require("../services/associationService");

const addStudent = async (req, res) => {
  const { studentEmail, studentName } = req.body;
  const professorId = req.user.id;

  if (!studentEmail || !studentName) {
    return res
      .status(400)
      .json({ message: "O nome e o e-mail do aluno são obrigatórios." });
  }

  try {
    const result = await associationService.addStudentToProfessor({
      professorId,
      studentEmail,
      studentName,
    });
    res
      .status(201)
      .json({
        message: `Aluno ${result.student.name} associado com sucesso.`,
        data: result,
      });
  } catch (error) {
    console.error("Erro ao associar aluno:", error);
    res
      .status(error.status || 500)
      .json({ message: error.message || "Erro interno do servidor." });
  }
};

const getStudents = async (req, res) => {
  const professorId = req.user.id;
  try {
    const students = await associationService.getStudentsForProfessor(
      professorId
    );
    res.status(200).json(students);
  } catch (error) {
    console.error("Erro ao buscar alunos:", error);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
};

module.exports = {
  addStudent,
  getStudents,
};
