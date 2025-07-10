import express from "express";
import {
    register,
    login,
    logout,
    getProfile,
    updateProfile,
    changePassword,
    getUserStats,
    getLeaderboard,
    deleteAccount,
    getAuthStatus,
} from "../controllers/authController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.get("/status", getAuthStatus);
router.get("/leaderboard", getLeaderboard);

// Protected routes (require authentication)
router.post("/logout", isAuthenticated, logout);
router.get("/profile", isAuthenticated, getProfile);
router.put("/profile", isAuthenticated, updateProfile);
router.put("/change-password", isAuthenticated, changePassword);
router.get("/stats", isAuthenticated, getUserStats);
router.delete("/account", isAuthenticated, deleteAccount);

export default router;
