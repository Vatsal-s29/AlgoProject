import Doubt from "../models/doubtModel.js";
import { User } from "../models/userModel.js";

// cleanup after 100 doubts stagnant
const cleanupOldResolvedDoubts = async () => {
    try {
        const totalDoubts = await Doubt.countDocuments();

        if (totalDoubts > 100) {
            const doubtsToDelete = totalDoubts - 100;

            // Find oldest resolved doubts
            const oldResolvedDoubts = await Doubt.find({ isResolved: true })
                .sort({ createdAt: 1 })
                .limit(doubtsToDelete)
                .select("_id");

            if (oldResolvedDoubts.length > 0) {
                const idsToDelete = oldResolvedDoubts.map((doubt) => doubt._id);
                await Doubt.deleteMany({ _id: { $in: idsToDelete } });
                console.log(
                    `Deleted ${idsToDelete.length} old resolved doubts`
                );
            }
        }
    } catch (error) {
        console.error("Error cleaning up old doubts:", error);
    }
};

// Create a new doubt
export const createDoubt = async (req, res) => {
    try {
        const {
            title,
            content,
            isAnonymous = false,
            isPublic = false,
        } = req.body;
        const studentId = req.user.id;

        // Validate required fields
        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: "Title and content are required",
            });
        }

        // Create new doubt
        const doubt = new Doubt({
            title,
            content,
            student: studentId,
            isAnonymous,
            isPublic,
        });

        await doubt.save();

        // Calling the cleanup
        await cleanupOldResolvedDoubts();

        // Populate student info for response
        await doubt.populate("student", "username email isTeacher");

        res.status(201).json({
            success: true,
            message: "Doubt created successfully",
            doubt,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error creating doubt",
            error: error.message,
        });
    }
};

// Get all doubts (filtered based on user role and visibility)
export const getDoubts = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        let query = {};

        if (user.isTeacher) {
            // Teachers can see all doubts
            query = {};
        } else {
            // Students can only see:
            // 1. Their own doubts (regardless of isPublic)
            // 2. Public doubts from other students
            query = {
                $or: [
                    { student: userId }, // Their own doubts
                    { isPublic: true }, // Public doubts from others
                ],
            };
        }

        const doubts = await Doubt.find(query)
            .populate("student", "username email isTeacher")
            .populate("responses.user", "username email isTeacher")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: doubts.length,
            doubts,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching doubts",
            error: error.message,
        });
    }
};

// Get a specific doubt by ID
export const getDoubtById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const user = await User.findById(userId);

        const doubt = await Doubt.findById(id)
            .populate("student", "username email isTeacher")
            .populate("responses.user", "username email isTeacher");

        if (!doubt) {
            return res.status(404).json({
                success: false,
                message: "Doubt not found",
            });
        }

        // Check if user has permission to view this doubt
        if (
            !user.isTeacher &&
            doubt.student._id.toString() !== userId &&
            !doubt.isPublic
        ) {
            return res.status(403).json({
                success: false,
                message: "You don't have permission to view this doubt",
            });
        }

        res.status(200).json({
            success: true,
            doubt,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching doubt",
            error: error.message,
        });
    }
};

// Update a doubt (only by the student who created it)
export const updateDoubt = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, isAnonymous, isPublic } = req.body;
        const userId = req.user.id;

        const doubt = await Doubt.findById(id);

        if (!doubt) {
            return res.status(404).json({
                success: false,
                message: "Doubt not found",
            });
        }

        // Check if user is the owner of the doubt
        if (doubt.student.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "You can only update your own doubts",
            });
        }

        // Update doubt
        const updatedDoubt = await Doubt.findByIdAndUpdate(
            id,
            {
                ...(title && { title }),
                ...(content && { content }),
                ...(isAnonymous !== undefined && { isAnonymous }),
                ...(isPublic !== undefined && { isPublic }),
            },
            { new: true }
        )
            .populate("student", "username email isTeacher")
            .populate("responses.user", "username email isTeacher");

        res.status(200).json({
            success: true,
            message: "Doubt updated successfully",
            doubt: updatedDoubt,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating doubt",
            error: error.message,
        });
    }
};

// Delete a doubt (only by the student who created it)
export const deleteDoubt = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const doubt = await Doubt.findById(id);

        if (!doubt) {
            return res.status(404).json({
                success: false,
                message: "Doubt not found",
            });
        }

        // Check if user is the owner of the doubt
        if (doubt.student.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "You can only delete your own doubts",
            });
        }

        await Doubt.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Doubt deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting doubt",
            error: error.message,
        });
    }
};

// Add a response to a doubt
export const addResponse = async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!content) {
            return res.status(400).json({
                success: false,
                message: "Response content is required",
            });
        }

        const doubt = await Doubt.findById(id);

        if (!doubt) {
            return res.status(404).json({
                success: false,
                message: "Doubt not found",
            });
        }

        // Check if user has permission to respond to this doubt
        if (
            !user.isTeacher &&
            doubt.student.toString() !== userId &&
            !doubt.isPublic
        ) {
            return res.status(403).json({
                success: false,
                message: "You don't have permission to respond to this doubt",
            });
        }

        // Add response
        doubt.responses.push({
            user: userId,
            content,
        });

        await doubt.save();

        // Populate the newly added response
        await doubt.populate("responses.user", "username email isTeacher");

        res.status(201).json({
            success: true,
            message: "Response added successfully",
            doubt,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error adding response",
            error: error.message,
        });
    }
};

// Mark doubt as resolved (only by the student who created it or teachers)
export const markAsResolved = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const user = await User.findById(userId);

        const doubt = await Doubt.findById(id);

        if (!doubt) {
            return res.status(404).json({
                success: false,
                message: "Doubt not found",
            });
        }

        // Check if user has permission to mark as resolved (only creater has the right)
        if (doubt.student.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "You can only mark your own doubts as resolved",
            });
        }

        doubt.isResolved = true;
        await doubt.save();

        res.status(200).json({
            success: true,
            message: "Doubt marked as resolved",
            doubt,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error marking doubt as resolved",
            error: error.message,
        });
    }
};

// Get user's own doubts
export const getMyDoubts = async (req, res) => {
    try {
        const userId = req.user.id;

        const doubts = await Doubt.find({ student: userId })
            .populate("student", "username email isTeacher")
            .populate("responses.user", "username email isTeacher")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: doubts.length,
            doubts,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching your doubts",
            error: error.message,
        });
    }
};
