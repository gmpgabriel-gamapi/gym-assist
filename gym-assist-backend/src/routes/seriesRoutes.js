const express = require("express");
const seriesController = require("../controllers/seriesController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.post("/", seriesController.create);
router.get("/", seriesController.getAll);
router.get("/:id", seriesController.getById);

module.exports = router;
