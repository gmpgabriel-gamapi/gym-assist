// [BACKEND] arquivo: src/controllers/exerciseController.js (MODIFICADO)
const exerciseService = require("../services/exerciseService");

const createCustomExercise = async (req, res) => {
  // --- MODIFICAÇÃO: Extrai os novos campos do body ---
  const { name, muscleGroupId, description, videoUrl } = req.body;
  const ownerId = req.user.id;

  if (!name || !muscleGroupId) {
    return res.status(400).json({
      message: "Nome do exercício e grupo muscular são obrigatórios.",
    });
  }

  try {
    const newExercise = await exerciseService.createCustomExercise({
      name,
      ownerId,
      muscleGroupId,
      description, // Passa o novo campo
      videoUrl, // Passa o novo campo
    });
    res.status(201).json(newExercise);
  } catch (error) {
    console.error("Erro ao criar exercício customizado:", error);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
};

const getAll = async (req, res) => {
  try {
    const exercises = await exerciseService.getAllExercisesForUser(req.user.id);
    res.status(200).json(exercises);
  } catch (error) {
    console.error("Erro ao buscar exercícios:", error);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
};

const updateCustom = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  // --- MODIFICAÇÃO: Extrai os novos campos do body ---
  const { name, muscleGroupId, description, videoUrl } = req.body;

  if (!name || !muscleGroupId) {
    return res
      .status(400)
      .json({ message: "Nome e grupo muscular são obrigatórios." });
  }

  try {
    const updatedExercise = await exerciseService.updateCustomExercise(
      id,
      userId,
      // --- MODIFICAÇÃO: Inclui os novos campos no objeto de atualização ---
      { name, muscleGroupId, description, videoUrl }
    );
    res.status(200).json(updatedExercise);
  } catch (error) {
    console.error("Erro ao atualizar exercício:", error);
    res
      .status(error.status || 500)
      .json({ message: error.message || "Erro interno do servidor." });
  }
};

const deleteCustom = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    await exerciseService.deleteCustomExercise(id, userId);
    res.status(204).send();
  } catch (error) {
    console.error("Erro ao deletar exercício:", error);
    res
      .status(error.status || 500)
      .json({ message: error.message || "Erro interno do servidor." });
  }
};

module.exports = {
  createCustomExercise,
  getAll,
  updateCustom,
  deleteCustom,
};
