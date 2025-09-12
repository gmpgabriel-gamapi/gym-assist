// [BACKEND] arquivo: src/routes/seriesRoutes.js (MODIFICADO)
const express = require("express");
const seriesController = require("../controllers/seriesController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.post("/", seriesController.create);
router.get("/", seriesController.getAll);
router.get("/archived", seriesController.getArchived); // Nova rota
router.get("/:id", seriesController.getById);
router.put("/:id", seriesController.update);
router.delete("/:id", seriesController.delete);
router.get("/:id/versions", seriesController.getVersions);

module.exports = router;
