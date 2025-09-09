const userService = require("../services/userService");

const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Todos os campos são obrigatórios." });
  }
  try {
    const newUser = await userService.registerUser(name, email, password);
    res.status(201).json(newUser);
  } catch (error) {
    if (error.message === "Este e-mail já está em uso.") {
      return res.status(409).json({ message: error.message });
    }
    console.error(error);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "E-mail e senha são obrigatórios." });
  }
  try {
    const result = await userService.loginUser(email, password);
    res.status(200).json(result);
  } catch (error) {
    if (error.message === "Credenciais inválidas.") {
      return res.status(401).json({ message: error.message });
    }
    console.error(error);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
};

const getProfile = async (req, res) => {
  try {
    const userProfile = await userService.getUserProfile(req.user.id);
    res.status(200).json(userProfile);
  } catch (error) {
    console.error(error);
    res
      .status(404)
      .json({ message: error.message || "Perfil não encontrado." });
  }
};

const updateProfile = async (req, res) => {
  try {
    const updatedProfile = await userService.addProfileMeasurements(
      req.user.id,
      req.body
    );
    res.status(200).json(updatedProfile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao atualizar o perfil." });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
};
