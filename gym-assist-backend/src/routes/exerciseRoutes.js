const express = require("express");
const exerciseController = require("../controllers/exerciseController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/custom", authMiddleware, exerciseController.createCustomExercise);
router.get("/", authMiddleware, exerciseController.getAll);
router.put("/custom/:id", authMiddleware, exerciseController.updateCustom);
router.delete("/custom/:id", authMiddleware, exerciseController.deleteCustom);

module.exports = router;
