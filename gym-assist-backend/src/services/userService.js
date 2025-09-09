const userQueries = require("../db/userQueries");
const measurementQueries = require("../db/measurementQueries");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (name, email, password) => {
  const existingUser = await userQueries.findUserByEmail(email);
  if (existingUser) {
    throw new Error("Este e-mail já está em uso.");
  }
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  // CORREÇÃO: Os argumentos agora são passados dentro de um único objeto
  const newUser = await userQueries.createUser({
    name,
    email,
    passwordHash,
    status: "active",
  });

  return newUser;
};

const loginUser = async (email, password) => {
  const user = await userQueries.findUserByEmail(email);
  if (!user) {
    throw new Error("Credenciais inválidas.");
  }
  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordValid) {
    throw new Error("Credenciais inválidas.");
  }
  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }
  );
  delete user.password_hash;
  return { user, token };
};

const getUserProfile = async (userId) => {
  const user = await userQueries.findUserById(userId);
  if (!user) {
    throw new Error("Usuário não encontrado.");
  }
  const measurements = await measurementQueries.findLatestMeasurementsByUserId(
    userId
  );

  const profile = { ...user, measurements: {} };
  measurements.forEach((m) => {
    profile.measurements[m.measurement_type] = { value: m.value, unit: m.unit };
  });

  return profile;
};

const addProfileMeasurements = async (userId, data) => {
  const latestMeasurements =
    await measurementQueries.findLatestMeasurementsByUserId(userId);

  const addMeasurementIfChanged = async (type, unit, newValue) => {
    const numericNewValue = parseFloat(newValue);
    const existing = latestMeasurements.find(
      (m) => m.measurement_type === type
    );

    if (!existing || parseFloat(existing.value) !== numericNewValue) {
      await measurementQueries.addMeasurement({
        userId,
        type,
        value: numericNewValue,
        unit,
      });
    } else {
      console.log(`Medição de '${type}' não alterada. Inserção pulada.`);
    }
  };

  if (data.height && data.heightUnit) {
    await addMeasurementIfChanged("height", data.heightUnit, data.height);
  }
  if (data.weight && data.weightUnit) {
    await addMeasurementIfChanged("weight", data.weightUnit, data.weight);
  }

  return getUserProfile(userId);
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  addProfileMeasurements,
};
