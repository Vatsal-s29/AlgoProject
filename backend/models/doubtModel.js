const doubtSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        isAnonymous: { type: Boolean, default: false }, // for anonymous posting
        isPublic: { type: Boolean, default: false }, // false = only visible to student and teachers
        subject: { type: String, required: true },
        tags: [{ type: String }],
        isResolved: { type: Boolean, default: false },
        responses: [
            {
                user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
                content: { type: String, required: true },
                isAnonymous: { type: Boolean, default: false }, // responses can also be anonymous
                createdAt: { type: Date, default: Date.now },
            },
        ],
    },
    { timestamps: true }
);
