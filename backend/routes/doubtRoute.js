import express from "express";
import {
    createDoubt,
    getDoubts,
    getDoubtById,
    updateDoubt,
    deleteDoubt,
    addResponse,
    markAsResolved,
    getMyDoubts,
} from "../controllers/doubtController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(isAuthenticated);

// CRUD operations for doubts
router.post("/", createDoubt); // Create a new doubt
router.get("/", getDoubts); // Get all doubts (filtered by visibility)
router.get("/my-doubts", getMyDoubts); // Get user's own doubts
router.get("/:id", getDoubtById); // Get a specific doubt
router.put("/:id", updateDoubt); // Update a doubt
router.delete("/:id", deleteDoubt); // Delete a doubt

// Response operations
router.post("/:id/responses", addResponse); // Add a response to a doubt

// Status operations
router.patch("/:id/resolve", markAsResolved); // Mark doubt as resolved

export default router;
