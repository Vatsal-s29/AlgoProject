const submissionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        questionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Question",
            required: true,
        },
        code: { type: String, required: true },
        language: { type: String, required: true },
        status: {
            type: String,
            enum: [
                "pending",
                "accepted",
                "wrong_answer",
                "time_limit_exceeded",
                "memory_limit_exceeded",
                "runtime_error",
            ],
            default: "pending",
        },
        executionTime: { type: Number },
        memoryUsed: { type: Number },
        testCasesPassed: { type: Number, default: 0 },
        totalTestCases: { type: Number },
    },
    { timestamps: true }
);
