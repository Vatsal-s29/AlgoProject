import mongoose from "mongoose";

const { Schema, model } = mongoose;

const doubtSchema = new Schema(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        student: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        isAnonymous: { type: Boolean, default: false }, // for anonymous posting (username will be shown anonymous)
        isPublic: { type: Boolean, default: false }, // false = only visible to that particular student and teachers
        isResolved: { type: Boolean, default: false },
        responses: [
            {
                user: { type: Schema.Types.ObjectId, ref: "User" },
                content: { type: String, required: true },
                createdAt: { type: Date, default: Date.now },
            },
        ],
    },
    { timestamps: true }
);

const Doubt = model("Doubt", doubtSchema);

export default Doubt;

// const doubtSchema = new mongoose.Schema(
//     {
//         title: { type: String, required: true },
//         content: { type: String, required: true },
//         student: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "User",
//             required: true,
//         },
//         isAnonymous: { type: Boolean, default: false }, // for anonymous posting (username will be shown anonymous)
//         isPublic: { type: Boolean, default: false }, // false = only visible to that particular student and teachers
//         isResolved: { type: Boolean, default: false },
//         responses: [
//             {
//                 user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//                 content: { type: String, required: true },
//                 createdAt: { type: Date, default: Date.now },
//             },
//         ],
//     },
//     { timestamps: true }
// );
