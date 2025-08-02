import Submission from "../models/submissionModel.js";
import { Question } from "../models/questionModel.js";
import mongoose from "mongoose";
import axios from "axios";

// Submit code for a question
export const submitCode = async (req, res) => {
    try {
        const { questionId, code, language = "cpp" } = req.body;
        const userId = req.user.id;

        if (!questionId || !code) {
            return res.status(400).json({
                success: false,
                message: "Question ID and code are required",
            });
        }

        // Get the question with test cases
        const question = await Question.findById(questionId);
        if (!question) {
            return res.status(404).json({
                success: false,
                message: "Question not found",
            });
        }

        // Combine public and hidden test cases
        const allTestCases = [
            ...question.publicTestCases,
            ...question.hiddenTestCases,
        ];
        const totalTestCases = allTestCases.length;

        // Create submission record
        const submission = new Submission({
            userId,
            questionId,
            code,
            language,
            status: "pending",
            totalTestCases,
        });

        await submission.save();

        // Test the code against all test cases
        let testCasesPassed = 0;
        let maxExecutionTime = 0;
        let maxMemoryUsed = 0;
        let finalStatus = "accepted";

        for (let i = 0; i < allTestCases.length; i++) {
            const testCase = allTestCases[i];

            try {
                // Call the compiler service
                const compilerResponse = await axios.post(
                    "http://localhost:8000/run",
                    {
                        code,
                        language,
                        input: testCase.input,
                    }
                );

                const result = compilerResponse.data;

                // Check if output matches expected output
                const actualOutput = result.output?.trim() || "";
                const expectedOutput = testCase.output.trim();

                if (actualOutput === expectedOutput) {
                    testCasesPassed++;

                    // Track max execution time and memory
                    if (result.executionTime) {
                        maxExecutionTime = Math.max(
                            maxExecutionTime,
                            result.executionTime
                        );
                    }
                    if (result.memoryUsed) {
                        maxMemoryUsed = Math.max(
                            maxMemoryUsed,
                            result.memoryUsed
                        );
                    }
                } else {
                    finalStatus = "wrong_answer";
                    break; // Stop at first wrong answer
                }
            } catch (error) {
                // Handle different types of errors from compiler microservice
                const errorData = error.response?.data || {};

                if (errorData.type === "time_limit_exceeded") {
                    finalStatus = "time_limit_exceeded";
                    maxExecutionTime = errorData.executionTime || 2000;
                } else if (errorData.type === "runtime_error") {
                    finalStatus = "runtime_error";
                    if (errorData.executionTime) {
                        maxExecutionTime = Math.max(
                            maxExecutionTime,
                            errorData.executionTime
                        );
                    }
                } else if (errorData.type === "compilation_error") {
                    finalStatus = "runtime_error"; // Treat compilation errors as runtime errors
                } else {
                    finalStatus = "runtime_error";
                }
                break; // Stop execution on error
            }
        }

        // Update submission with results
        submission.status = finalStatus;
        submission.testCasesPassed = testCasesPassed;
        submission.executionTime = maxExecutionTime;
        submission.memoryUsed = maxMemoryUsed;

        await submission.save();

        res.status(200).json({
            success: true,
            message: "Code submitted successfully",
            data: {
                submissionId: submission._id,
                status: finalStatus,
                testCasesPassed,
                totalTestCases,
                executionTime: maxExecutionTime,
                memoryUsed: maxMemoryUsed,
            },
        });
    } catch (error) {
        console.error("Submit code error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

// Get all submissions for a user
export const getUserSubmissions = async (req, res) => {
    try {
        const userId = req.user.id;
        const { page = 1, limit = 10 } = req.query;

        const submissions = await Submission.find({ userId })
            .populate("questionId", "title slug difficulty")
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Submission.countDocuments({ userId });

        res.status(200).json({
            success: true,
            data: {
                submissions,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / limit),
                },
            },
        });
    } catch (error) {
        console.error("Get user submissions error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

// Get submissions for a specific question
export const getQuestionSubmissions = async (req, res) => {
    try {
        const { questionId } = req.params;
        const userId = req.user.id;
        const { page = 1, limit = 10 } = req.query;

        const submissions = await Submission.find({
            userId,
            questionId,
        })
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Submission.countDocuments({ userId, questionId });

        res.status(200).json({
            success: true,
            data: {
                submissions,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / limit),
                },
            },
        });
    } catch (error) {
        console.error("Get question submissions error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

// Get a specific submission
export const getSubmission = async (req, res) => {
    try {
        const { submissionId } = req.params;
        const userId = req.user.id;

        const submission = await Submission.findOne({
            _id: submissionId,
            userId,
        }).populate("questionId", "title slug difficulty");

        if (!submission) {
            return res.status(404).json({
                success: false,
                message: "Submission not found",
            });
        }

        res.status(200).json({
            success: true,
            data: submission,
        });
    } catch (error) {
        console.error("Get submission error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

// Get submission statistics for a user
export const getSubmissionStats = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user.id);

        const stats = await Submission.aggregate([
            { $match: { userId: userId } },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                },
            },
        ]);

        // Get unique problems solved (distinct questions with accepted status)
        const uniqueProblemsSolved = await Submission.aggregate([
            {
                $match: {
                    userId: userId,
                    status: "accepted",
                },
            },
            {
                $group: {
                    _id: "$questionId",
                },
            },
            {
                $count: "uniqueProblems",
            },
        ]);

        // Get problems solved by difficulty level
        const problemsByDifficulty = await Submission.aggregate([
            {
                $match: {
                    userId: userId,
                    status: "accepted",
                },
            },
            {
                $lookup: {
                    from: "questions",
                    localField: "questionId",
                    foreignField: "_id",
                    as: "question",
                },
            },
            {
                $unwind: "$question",
            },
            {
                $group: {
                    _id: {
                        questionId: "$questionId",
                        difficulty: "$question.difficulty",
                    },
                },
            },
            {
                $group: {
                    _id: "$_id.difficulty",
                    count: { $sum: 1 },
                },
            },
        ]);

        const total = await Submission.countDocuments({ userId });

        // Format stats
        const formattedStats = {
            total,
            accepted: 0,
            wrong_answer: 0,
            time_limit_exceeded: 0,
            runtime_error: 0,
            memory_limit_exceeded: 0,
            uniqueProblemsSolved: uniqueProblemsSolved[0]?.uniqueProblems || 0,
            basic: 0,
            easy: 0,
            medium: 0,
            hard: 0,
            god: 0,
        };

        stats.forEach((stat) => {
            if (formattedStats.hasOwnProperty(stat._id)) {
                formattedStats[stat._id] = stat.count;
            }
        });

        // difficulty-wise solved problems
        problemsByDifficulty.forEach((difficulty) => {
            if (formattedStats.hasOwnProperty(difficulty._id)) {
                formattedStats[difficulty._id] = difficulty.count;
            }
        });

        res.status(200).json({
            success: true,
            data: formattedStats,
        });
    } catch (error) {
        console.error("Get submission stats error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};
export const getLeaderboard = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        // // Get all users who have made submissions
        // const usersWithSubmissions = await Submission.aggregate([
        //     {
        //         $group: {
        //             _id: "$userId",
        //         },
        //     },
        // ]);
        // Get all users who have made submissions (excluding teachers)
        const usersWithSubmissions = await Submission.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user",
                },
            },
            {
                $unwind: "$user",
            },
            {
                $match: {
                    "user.isTeacher": { $ne: true }, // Exclude teachers
                },
            },
            {
                $group: {
                    _id: "$userId",
                },
            },
        ]);

        const leaderboardData = [];

        // Calculate stats for each user
        for (const userDoc of usersWithSubmissions) {
            const userId = userDoc._id;

            // Get user details using lookup in aggregation
            const userResult = await Submission.aggregate([
                { $match: { userId: userId } },
                {
                    $lookup: {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "user",
                    },
                },
                {
                    $unwind: "$user",
                },
                {
                    $group: {
                        _id: "$userId",
                        user: { $first: "$user" },
                    },
                },
            ]);

            if (!userResult.length) continue;
            const user = userResult[0].user;

            // Get submission statistics by status
            const stats = await Submission.aggregate([
                { $match: { userId: userId } },
                {
                    $group: {
                        _id: "$status",
                        count: { $sum: 1 },
                    },
                },
            ]);

            // Get unique problems solved (distinct questions with accepted status)
            const uniqueProblemsSolved = await Submission.aggregate([
                {
                    $match: {
                        userId: userId,
                        status: "accepted",
                    },
                },
                {
                    $group: {
                        _id: "$questionId",
                    },
                },
                {
                    $count: "uniqueProblems",
                },
            ]);

            // Get problems solved by difficulty level
            const problemsByDifficulty = await Submission.aggregate([
                {
                    $match: {
                        userId: userId,
                        status: "accepted",
                    },
                },
                {
                    $lookup: {
                        from: "questions",
                        localField: "questionId",
                        foreignField: "_id",
                        as: "question",
                    },
                },
                {
                    $unwind: "$question",
                },
                {
                    $group: {
                        _id: {
                            questionId: "$questionId",
                            difficulty: "$question.difficulty",
                        },
                    },
                },
                {
                    $group: {
                        _id: "$_id.difficulty",
                        count: { $sum: 1 },
                    },
                },
            ]);

            const total = await Submission.countDocuments({ userId });

            // Format stats
            const formattedStats = {
                _id: user._id,
                name: user.name,
                username: user.username,
                avatar: user.avatar,
                total,
                accepted: 0,
                uniqueProblemsSolved:
                    uniqueProblemsSolved[0]?.uniqueProblems || 0,
                basic: 0,
                easy: 0,
                medium: 0,
                hard: 0,
                god: 0,
                rating: 0,
            };

            // Fill in submission stats by status
            stats.forEach((stat) => {
                if (stat._id === "accepted") {
                    formattedStats.accepted = stat.count;
                }
            });

            // Fill in difficulty-wise solved problems
            problemsByDifficulty.forEach((difficulty) => {
                if (formattedStats.hasOwnProperty(difficulty._id)) {
                    formattedStats[difficulty._id] = difficulty.count;
                }
            });

            // Calculate rating
            formattedStats.rating =
                formattedStats.basic * 1 +
                formattedStats.easy * 2 +
                formattedStats.medium * 5 +
                formattedStats.hard * 10 +
                formattedStats.god * 20;

            leaderboardData.push(formattedStats);
        }

        // Sort leaderboard
        leaderboardData.sort((a, b) => {
            if (a.rating !== b.rating) return b.rating - a.rating;
            if (a.uniqueProblemsSolved !== b.uniqueProblemsSolved)
                return b.uniqueProblemsSolved - a.uniqueProblemsSolved;
            return b.accepted - a.accepted;
        });

        // Apply pagination
        const totalUsers = leaderboardData.length;
        const totalPages = Math.ceil(totalUsers / limit);
        const paginatedData = leaderboardData.slice(skip, skip + limit);

        res.status(200).json({
            success: true,
            data: paginatedData,
            pagination: {
                currentPage: page,
                totalPages,
                totalUsers,
                hasNext: page < totalPages,
                hasPrev: page > 1,
            },
        });
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
