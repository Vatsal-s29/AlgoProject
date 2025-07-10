const blogSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        tags: [{ type: String }],
        likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        comments: [
            {
                user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
                content: { type: String, required: true },
            },
        ],
    },
    { timestamps: true }
);
