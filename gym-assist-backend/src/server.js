require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const exerciseRoutes = require("./routes/exerciseRoutes");
const muscleGroupRoutes = require("./routes/muscleGroupRoutes");
const associationRoutes = require("./routes/associationRoutes");
const seriesRoutes = require("./routes/seriesRoutes");
const trainingPlanRoutes = require("./routes/trainingPlanRoutes"); // 1. Importa

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API do Gym Assist está no ar!" });
});

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/exercises", exerciseRoutes);
app.use("/api/muscle-groups", muscleGroupRoutes);
app.use("/api/associations", associationRoutes);
app.use("/api/series", seriesRoutes);
app.use("/api/training-plans", trainingPlanRoutes); // 2. Usa

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
