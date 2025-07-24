const express = require("express");
const cors = require("cors");
const generateFile = require("./generateFile");
const generateInputFile = require("./generateInputFile");
const executeCpp = require("./executeCpp");
const app = express();
const fs = require("fs"); // for auto clean purposes
const path = require("path"); // for auto clean purposes
require("dotenv").config();

app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    })
);

app.use(express.json()); // not sure why this is used
app.use(express.urlencoded({ extended: true })); // not sure why this is used

app.get("/", (req, res) => {
    res.send("hello world");
});

// # no outo clearing of folders wala version
// // andar kahi bhi await kiya hai to yaha async hi hona chahiye
// app.post("/run", async (req, res) => {
//     // const code = req.body.code;
//     // const language = req.body.language;
//     const { code, language = "cpp", input } = req.body; // + default language to cpp (if no value of language is provided by the user)
//     if (code === undefined) {
//         return res
//             .status(400)
//             .json({ success: false, error: "empty code body" });
//     }

//     try {
//         const filePath = generateFile(language, code);
//         const inputFilePath = generateInputFile(input || ""); // + to handle no input cases

//         const output = await executeCpp(filePath, inputFilePath); // we can use if else orswitch case and have separate function for each codeing language

//         res.json({ output });
//     } catch (err) {
//         res.status(500).json({ success: false, error: err.message });
//     }
// });

// # this is the updated part to auto delete the contents of codes, compiled_outputs and inputs folders
// andar kahi bhi await kiya hai to yaha async hi hona chahiye
app.post("/run", async (req, res) => {
    // const code = req.body.code;
    // const language = req.body.language;
    const { code, language = "cpp", input } = req.body; // + default language to cpp (if no value of language is provided by the user)
    if (code === undefined) {
        return res
            .status(400)
            .json({ success: false, error: "empty code body" });
    }

    const filePath = generateFile(language, code);
    const inputFilePath = generateInputFile(input || ""); // + to handle no input cases

    // we can use if else or switch case and have separate function for each codeing language
    const outputFilePath = filePath
        .replace("codes/", "compiled_outputs/")
        .replace(/\.cpp$/, ".out"); // * This line is a quick way to get the path of the compiled executable by replacing .cpp with .out, assuming the output file uses the same base name and location as the source.

    try {
        const output = await executeCpp(filePath, inputFilePath);
        res.json({ output });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    } finally {
        // Cleanup generated files
        try {
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath); // delete code file
            if (fs.existsSync(inputFilePath)) fs.unlinkSync(inputFilePath); // delete input file
            if (fs.existsSync(outputFilePath)) fs.unlinkSync(outputFilePath); // delete compiled output (for C++)
        } catch (cleanupErr) {
            console.error("Cleanup error:", cleanupErr.message);
        }
    }
});

app.listen(8000, () => {
    console.log("Server is running on port 8000");
});
