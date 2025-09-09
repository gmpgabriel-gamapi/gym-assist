const express = require("express");
const trainingPlanController = require("../controllers/trainingPlanController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.get("/active/:userId", trainingPlanController.getActivePlan);
router.put("/:planId/series", trainingPlanController.updatePlanSeries);

module.exports = router;
