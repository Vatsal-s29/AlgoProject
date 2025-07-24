import mongoose from "mongoose";

const { Schema, model } = mongoose;

const userQuestionSchema = new Schema(
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
        status: {
            type: String,
            enum: ["solved", "attempted", "bookmarked"],
            default: "attempted",
        },
        bestSubmission: {
            type: Schema.Types.ObjectId,
            ref: "Submission",
        },
        attemptsCount: { type: Number, default: 0 },
    },
    { timestamps: true }
);

const UserQuestion = model("UserQuestion", userQuestionSchema);

export default UserQuestion;
