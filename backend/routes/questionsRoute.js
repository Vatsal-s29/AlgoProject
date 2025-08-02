import express from "express";
import { Question } from "../models/questionModel.js";
import Submission from "../models/submissionModel.js";

const router = express.Router();

// # Create a new question
router.post("/", async (req, res) => {
    const {
        title,
        author,
        problemStatement,
        difficulty,
        topics,
        constraints,
        examples,
        publicTestCases,
        hiddenTestCases,
    } = req.body;

    if (!title || !author || !problemStatement || !difficulty) {
        return res.status(400).json({
            message:
                "Required fields: title, author, problemStatement, difficulty",
        });
    }

    try {
        const newQuestion = new Question({
            title,
            author,
            problemStatement,
            difficulty,
            topics,
            constraints,
            examples,
            publicTestCases,
            hiddenTestCases,
        });

        const savedQuestion = await newQuestion.save();
        res.status(201).json(savedQuestion);
    } catch (err) {
        if (err.code === 11000) {
            return res
                .status(409)
                .json({ message: "Duplicate title or slug exists" });
        }
        res.status(500).json({ message: "Server Error" });
    }
});

// # GET all questions with pagination and search
// # GET all questions with pagination and search
router.get("/", async (req, res) => {
    const {
        page = 1,
        limit = 10,
        search = "",
        difficulty,
        topic,
        status,
    } = req.query;

    const pageNum = Math.max(parseInt(page) || 1, 1);
    const limitNum = Math.min(parseInt(limit) || 10, 100);

    const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escapedSearch, "i");

    try {
        const query = {
            ...(search
                ? {
                      $or: [
                          { title: regex },
                          { topics: regex },
                          { author: regex },
                      ],
                  }
                : {}),
            ...(difficulty && difficulty !== "all" && { difficulty }),
            ...(topic && topic !== "all" && { topics: topic }),
        };

        // Get all matching questions first (without pagination)
        const allQuestions = await Question.find(query).sort({ createdAt: -1 });

        // Exclude hiddenTestCases from list
        let sanitized = allQuestions.map((q) => {
            const { hiddenTestCases, ...rest } = q.toObject();
            return rest;
        });

        // Add user status to each question
        if (req.user) {
            const userId = req.user.id;
            const questionIds = sanitized.map((q) => q._id);
            const submissions = await Submission.find({
                userId,
                questionId: { $in: questionIds },
            });

            const statusMap = {};
            submissions.forEach((submission) => {
                const questionId = submission.questionId.toString();
                if (!statusMap[questionId]) {
                    statusMap[questionId] = "attempted";
                }
                if (submission.status === "accepted") {
                    statusMap[questionId] = "solved";
                }
            });

            sanitized = sanitized.map((question) => ({
                ...question,
                userStatus: statusMap[question._id.toString()] || "unsolved",
            }));
        } else {
            sanitized = sanitized.map((question) => ({
                ...question,
                userStatus: "unsolved",
            }));
        }

        // Filter by status if requested
        if (status && status !== "all") {
            if (!req.user && status !== "unsolved") {
                sanitized = [];
            } else {
                sanitized = sanitized.filter(
                    (question) => question.userStatus === status
                );
            }
        }

        // Apply pagination after filtering
        const total = sanitized.length;
        const totalPages = Math.ceil(total / limitNum);
        const skip = (pageNum - 1) * limitNum;
        const paginatedQuestions = sanitized.slice(skip, skip + limitNum);

        if (paginatedQuestions.length === 0) {
            return res.status(200).json({
                total: 0,
                currentPage: pageNum,
                totalPages: 0,
                data: [],
                message: "No matching questions found.",
            });
        }

        res.status(200).json({
            total,
            currentPage: pageNum,
            totalPages,
            data: paginatedQuestions,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
});

// router.get("/", async (req, res) => {
//     const {
//         page = 1,
//         limit = 10,
//         search = "",
//         difficulty,
//         topic,
//         status,
//     } = req.query;

//     const pageNum = Math.max(parseInt(page) || 1, 1); // Min page 1
//     const limitNum = Math.min(parseInt(limit) || 10, 100); // Max 100 per page
//     const skip = (pageNum - 1) * limitNum;

//     const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // Escape special regex characters: (avoiding mongodb injection)
//     const regex = new RegExp(escapedSearch, "i");

//     try {
//         const query = {
//             ...(search
//                 ? {
//                       $or: [
//                           { title: regex },
//                           { topics: regex },
//                           { author: regex },
//                       ],
//                   }
//                 : {}), // Empty object = no filter = return all documents (just optimisation, minor hi sahi)
//             ...(difficulty && difficulty !== "all" && { difficulty }),
//             ...(topic && topic !== "all" && { topics: topic }),
//         };

//         const total = await Question.countDocuments(query);
//         const questions = await Question.find(query)
//             .sort({ createdAt: -1 })
//             .skip(skip)
//             .limit(limitNum);

//         // Exclude hiddenTestCases from list
//         const sanitized = questions.map((q) => {
//             const { hiddenTestCases, ...rest } = q.toObject();
//             return rest;
//         });

//         // If user is authenticated, get their submission status for each question
//         if (req.user) {
//             const userId = req.user.id;

//             // Get all submissions for this user for the current questions
//             const questionIds = sanitized.map((q) => q._id);
//             const submissions = await Submission.find({
//                 userId,
//                 questionId: { $in: questionIds },
//             });

//             // Create a map of questionId to user status
//             const statusMap = {};

//             submissions.forEach((submission) => {
//                 const questionId = submission.questionId.toString();

//                 if (!statusMap[questionId]) {
//                     statusMap[questionId] = "attempted";
//                 }

//                 // If any submission is accepted, mark as solved
//                 if (submission.status === "accepted") {
//                     statusMap[questionId] = "solved";
//                 }
//             });

//             // Add user status to each question
//             sanitized = sanitized.map((question) => ({
//                 ...question,
//                 userStatus: statusMap[question._id.toString()] || "unsolved",
//             }));

//             // Filter by status if requested
//             if (status && status !== "all") {
//                 sanitized = sanitized.filter(
//                     (question) => question.userStatus === status
//                 );
//             }
//         } else {
//             // For unauthenticated users, all questions are unsolved
//             sanitized = sanitized.map((question) => ({
//                 ...question,
//                 userStatus: "unsolved",
//             }));

//             // If status filter is applied for unauthenticated users
//             if (status && status !== "all" && status !== "unsolved") {
//                 sanitized = [];
//             }
//         }

//         // Recalculate total after status filtering
//         const filteredTotal = sanitized.length;
//         const totalPages = Math.ceil(filteredTotal / limitNum);

//         // a more descriptive message when no questions are found (optional UX)
//         if (sanitized.length === 0) {
//             return res.status(200).json({
//                 total: 0,
//                 currentPage: pageNum,
//                 totalPages: 0,
//                 data: [],
//                 message: "No matching questions found.",
//             });
//         }

//         res.status(200).json({
//             total: filteredTotal,
//             currentPage: pageNum,
//             totalPages,
//             data: sanitized,
//         });

//     } catch (err) {
//         res.status(500).json({ message: "Server Error" });
//     }
// });

// # Get one question by slug (excludes hidden test cases)
router.get("/slug/:slug", async (req, res) => {
    try {
        const question = await Question.findOne({ slug: req.params.slug });

        if (!question)
            return res.status(404).json({ message: "Question not found" });

        const { hiddenTestCases, ...rest } = question.toObject();
        res.status(200).json(rest);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

// # Get one question by ID (includes hidden test cases)
router.get("/:id", async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);
        if (!question)
            return res.status(404).json({ message: "Question not found" });
        res.status(200).json(question);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

// # Update a question by ID
router.put("/:id", async (req, res) => {
    try {
        // 🚫 Prevent title updates (due to slug regenation issues)
        if (req.body.title) {
            return res.status(400).json({
                message:
                    "Title cannot be updated once the question is created.",
            });
        }

        const updated = await Question.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updated)
            return res.status(404).json({ message: "Question not found" });

        res.status(200).json({ message: "Question updated", data: updated });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

// # Delete a question by ID
router.delete("/:id", async (req, res) => {
    try {
        const deleted = await Question.findByIdAndDelete(req.params.id);
        if (!deleted)
            return res.status(404).json({ message: "Question not found" });

        res.status(200).json({ message: "Question deleted" });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

export default router;
