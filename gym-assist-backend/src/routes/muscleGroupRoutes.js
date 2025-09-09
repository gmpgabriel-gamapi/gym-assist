const express = require("express");
const muscleGroupController = require("../controllers/muscleGroupController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Protegida, pois apenas usuários logados podem ver os grupos musculares
router.get("/", authMiddleware, muscleGroupController.getAll);

module.exports = router;
