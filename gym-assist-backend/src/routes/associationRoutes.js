const express = require("express");
const associationController = require("../controllers/associationController");
const authMiddleware = require("../middleware/authMiddleware");
const roleCheckMiddleware = require("../middleware/roleCheckMiddleware");

const router = express.Router();
const teacherOnly = roleCheckMiddleware("teacher");

router.post(
  "/student",
  authMiddleware,
  teacherOnly,
  associationController.addStudent
);
router.get(
  "/students",
  authMiddleware,
  teacherOnly,
  associationController.getStudents
);

module.exports = router;
