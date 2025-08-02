const express = require("express");
const cors = require("cors");
const generateFile = require("./generateFile");
const generateInputFile = require("./generateInputFile");
const executeCpp = require("./executeCpp");
const app = express();
const fs = require("fs");
const path = require("path");
require("dotenv").config();

app.use(
    cors({
        origin: [process.env.FRONTEND_URL, "http://localhost:3000"], // Add backend URL
        credentials: true,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("Code Compiler Service");
});

app.post("/run", async (req, res) => {
    const { code, language = "cpp", input } = req.body;
    if (code === undefined) {
        return res.status(400).json({
            success: false,
            error: "empty code body",
            type: "invalid_input",
        });
    }
    const filePath = generateFile(language, code);
    const inputFilePath = generateInputFile(input || "");
    const outputFilePath = filePath
        .replace("codes/", "compiled_outputs/")
        .replace(/\.cpp$/, ".out");
    try {
        const result = await executeCpp(filePath, inputFilePath);
        // Return enhanced response with metrics
        res.json({
            success: true,
            output: result.output,
            executionTime: result.executionTime,
            memoryUsed: result.memoryUsed,
            type: result.type,
        });
    } catch (err) {
        // Handle different types of errors
        let errorResponse = {
            success: false,
            error: err.error || err.message || "Unknown error",
            type: err.type || "runtime_error",
        };
        // Add execution time if available
        if (err.executionTime) {
            errorResponse.executionTime = err.executionTime;
        }
        // Add stderr if available
        if (err.stderr) {
            errorResponse.stderr = err.stderr;
        }
        // Set appropriate status code based on error type
        let statusCode = 500;
        if (err.type === "compilation_error") {
            statusCode = 400;
        } else if (err.type === "time_limit_exceeded") {
            statusCode = 408; // Request timeout
        }
        res.status(statusCode).json(errorResponse);
    } finally {
        // Delayed cleanup to avoid race conditions
        setTimeout(() => {
            try {
                if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                if (fs.existsSync(inputFilePath)) fs.unlinkSync(inputFilePath);
                if (fs.existsSync(outputFilePath))
                    fs.unlinkSync(outputFilePath);
            } catch (cleanupErr) {
                console.error("Cleanup error:", cleanupErr.message);
            }
        }, 1000); // 1 second delay
    }
});

// // Enhanced /run endpoint with execution metrics
// app.post("/run", async (req, res) => {
//     const { code, language = "cpp", input } = req.body;

//     if (code === undefined) {
//         return res.status(400).json({
//             success: false,
//             error: "empty code body",
//             type: "invalid_input",
//         });
//     }

//     const filePath = generateFile(language, code);
//     const inputFilePath = generateInputFile(input || "");
//     const outputFilePath = filePath
//         .replace("codes/", "compiled_outputs/")
//         .replace(/\.cpp$/, ".out");

//     try {
//         const result = await executeCpp(filePath, inputFilePath);

//         // Return enhanced response with metrics
//         res.json({
//             success: true,
//             output: result.output,
//             executionTime: result.executionTime,
//             memoryUsed: result.memoryUsed,
//             type: result.type,
//         });
//     } catch (err) {
//         // Handle different types of errors
//         let errorResponse = {
//             success: false,
//             error: err.error || err.message || "Unknown error",
//             type: err.type || "runtime_error",
//         };

//         // Add execution time if available
//         if (err.executionTime) {
//             errorResponse.executionTime = err.executionTime;
//         }

//         // Add stderr if available
//         if (err.stderr) {
//             errorResponse.stderr = err.stderr;
//         }

//         // Set appropriate status code based on error type
//         let statusCode = 500;
//         if (err.type === "compilation_error") {
//             statusCode = 400;
//         } else if (err.type === "time_limit_exceeded") {
//             statusCode = 408; // Request timeout
//         }

//         res.status(statusCode).json(errorResponse);
//     } finally {
//         // Cleanup generated files
//         try {
//             if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
//             if (fs.existsSync(inputFilePath)) fs.unlinkSync(inputFilePath);
//             if (fs.existsSync(outputFilePath)) fs.unlinkSync(outputFilePath);
//         } catch (cleanupErr) {
//             console.error("Cleanup error:", cleanupErr.message);
//         }
//     }
// });

// Health check endpoint
app.get("/health", (req, res) => {
    res.json({
        success: true,
        message: "Compiler service is running",
        timestamp: new Date().toISOString(),
    });
});

app.listen(8000, () => {
    console.log("Compiler service is running on port 8000");
});
