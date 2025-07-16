// backend/index.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "./middleware/authMiddleware.js";
import { PORT, mongoDBURL } from "./config.js";

// Import routes
import questionsRoute from "./routes/questionsRoute.js";
import authRoute from "./routes/authRoute.js";
import blogRoutes from './routes/blogRoute.js';
const app = express();

// Middleware for parsing request body
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // ✅ Add this line

// CORS middleware
app.use(
    cors({
        origin: "http://localhost:5173", // ✅ Must be exact, not *
        credentials: true,
    })
);

// Session middleware (must be before passport middleware)
app.use(
    session({
        secret: process.env.SESSION_SECRET || "your-secret-key",
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: mongoDBURL,
            touchAfter: 24 * 3600, // lazy session update
        }),
        cookie: {
            secure: process.env.NODE_ENV === "production", // HTTPS in production
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        },
    })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/questions", questionsRoute);
app.use("/api/auth", authRoute);
app.use('/api/blogs', blogRoutes);

app.get("/", (request, response) => {
    console.log(request);
    return response.status(234).send("Welcome To Bro Code");
});

mongoose
    .connect(mongoDBURL)
    .then(() => {
        console.log("App connected to database");
        app.listen(PORT, () => {
            console.log(`App is listening to port: ${PORT}`);
        });
    })
    .catch((error) => {
        console.log(error);
    });
