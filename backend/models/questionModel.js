import mongoose from "mongoose";

const questionSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        author: {
            type: String,
            required: true,
        },
        problemStatement: {
            type: String,
            required: true,
        },
        topics: {
            type: [String], // arr of strings
            validate: {
                validator: function (arr) {
                    return arr.length <= 3;
                },
                message: "You can specify up to 3 topics only.",
            },
            default: [], // Default to empty array if not provided
        },
        difficulty: {
            type: String,
            required: true,
            enum: ["noob", "easy", "medium", "hard", "god"], // Only these values allowed
            lowercase: true, // Ensures case-insensitive input
            trim: true, // Removes extra whitespace
        },
    },
    {
        timestamps: true,
    }
);

export const Question = mongoose.model("Question", questionSchema);
