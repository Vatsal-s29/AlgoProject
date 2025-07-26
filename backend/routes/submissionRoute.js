import express from "express";
import {
    submitCode,
    getUserSubmissions,
    getQuestionSubmissions,
    getSubmission,
    getSubmissionStats,
    getLeaderboard,
} from "../controllers/submissionController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

// Submit code for a question
router.post("/submit", isAuthenticated, submitCode);

// Get all submissions for logged-in user
router.get("/user", isAuthenticated, getUserSubmissions);

// Get submissions for a specific question by logged-in user
router.get("/question/:questionId", isAuthenticated, getQuestionSubmissions);

// Get a specific submission
router.get("/:submissionId", isAuthenticated, getSubmission);

// Get submission statistics for logged-in user
router.get("/stats/user", isAuthenticated, getSubmissionStats);

router.get("/stats/leaderboard", isAuthenticated, getLeaderboard);

export default router;
