const express = require("express");
const {
  createSession,
  getSessionById,
  getMySessions,
  deleteSession,
} = require("../controllers/sessionController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/create", protect, createSession);
router.get("/my-sessions", protect, getMySessions);
router.get("/:id", protect, getSessionById);       // ✅ define dynamic route last

router.delete("/:id", protect, deleteSession);
// router.delete("/", protect, deleteAllSessions); 



module.exports = router;









