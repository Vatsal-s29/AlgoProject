import mongoose from "mongoose";

const { Schema, model } = mongoose;

const submissionSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        questionId: {
            type: Schema.Types.ObjectId,
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

const Submission = model("Submission", submissionSchema);

export default Submission;
