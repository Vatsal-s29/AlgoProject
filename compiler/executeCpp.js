// ! FOR MAC

const fs = require("fs");
const path = require("path");
const { exec, spawn } = require("child_process");

const outputPath = path.join(__dirname, "compiled_outputs");

if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
}

const executeCpp = async (filePath, inputFilePath) => {
    const jobId = path.basename(filePath).split(".")[0];
    const outputFileName = `${jobId}.out`;
    const outPath = path.join(outputPath, outputFileName);

    return new Promise((resolve, reject) => {
        // First compile the C++ code
        exec(
            `g++ "${filePath}" -o "${outPath}"`,
            (compileError, compileStdout, compileStderr) => {
                if (compileError || compileStderr) {
                    return reject({
                        error:
                            compileStderr ||
                            compileError?.message ||
                            "Compilation failed",
                        stderr: compileStderr,
                        type: "compilation_error",
                    });
                }

                // Now execute with proper timeout handling using spawn
                const startTime = process.hrtime.bigint();
                const timeoutMs = 2000; // 2 seconds timeout

                // Read input file
                const inputData = fs.readFileSync(inputFilePath, "utf8");

                // Use spawn for better control
                const child = spawn(outPath, [], {
                    cwd: outputPath,
                    stdio: ["pipe", "pipe", "pipe"],
                });

                let stdout = "";
                let stderr = "";
                let isTimedOut = false;

                // Set timeout
                const timer = setTimeout(() => {
                    isTimedOut = true;
                    child.kill("SIGKILL");
                }, timeoutMs);

                // Handle stdout
                child.stdout.on("data", (data) => {
                    stdout += data.toString();
                });

                // Handle stderr
                child.stderr.on("data", (data) => {
                    stderr += data.toString();
                });

                // Handle process exit
                child.on("close", (code, signal) => {
                    clearTimeout(timer);
                    const endTime = process.hrtime.bigint();
                    const executionTime = Number(endTime - startTime) / 1000000; // Convert to milliseconds

                    if (isTimedOut) {
                        return reject({
                            type: "time_limit_exceeded",
                            executionTime: timeoutMs,
                            error: "Time limit exceeded (2 seconds)",
                        });
                    }

                    if (code !== 0) {
                        return reject({
                            type: "runtime_error",
                            executionTime: Math.round(executionTime),
                            error: `Process exited with code ${code}`,
                            stderr: stderr.trim(),
                        });
                    }

                    // Success
                    resolve({
                        output: stdout.trim(),
                        executionTime: Math.round(executionTime),
                        memoryUsed: 0, // You can implement memory tracking later if needed
                        type: "success",
                    });
                });

                // Handle process error
                child.on("error", (error) => {
                    clearTimeout(timer);
                    const endTime = process.hrtime.bigint();
                    const executionTime = Number(endTime - startTime) / 1000000;

                    reject({
                        type: "runtime_error",
                        executionTime: Math.round(executionTime),
                        error: error.message,
                        stderr: stderr.trim(),
                    });
                });

                // Send input to the process
                if (inputData) {
                    child.stdin.write(inputData);
                }
                child.stdin.end();
            }
        );
    });
};

module.exports = executeCpp;

// ! FOR LINUX

// const fs = require("fs");
// const path = require("path");
// const { exec } = require("child_process");

// const outputPath = path.join(__dirname, "compiled_outputs");

// if (!fs.existsSync(outputPath)) {
//     fs.mkdirSync(outputPath, { recursive: true });
// }

// const executeCpp = async (filePath, inputFilePath) => {
//     const jobId = path.basename(filePath).split(".")[0];
//     const outputFileName = `${jobId}.out`;
//     const outPath = path.join(outputPath, outputFileName);

//     return new Promise((resolve, reject) => {
//         // First compile the C++ code
//         exec(
//             `g++ "${filePath}" -o "${outPath}"`,
//             (compileError, compileStdout, compileStderr) => {
//                 if (compileError || compileStderr) {
//                     return reject({
//                         error:
//                             compileStderr ||
//                             compileError?.message ||
//                             "Compilation failed",
//                         stderr: compileStderr,
//                         type: "compilation_error",
//                     });
//                 }

//                 // Now execute with time and memory tracking
//                 const startTime = process.hrtime.bigint();
//                 const timeoutMs = 2000; // 2 seconds timeout

//                 // Use different commands based on platform
//                 let executeCommand;
//                 if (process.platform === "win32") {
//                     // Windows - simpler approach without memory tracking
//                     executeCommand = `cd "${outputPath}" && "${outputFileName}" < "${inputFilePath}"`;
//                 } else {
//                     // Unix/Linux/macOS - use timeout command and try to track memory
//                     executeCommand = `cd "${outputPath}" && timeout 2s "./${outputFileName}" < "${inputFilePath}"`;
//                 }

//                 const childProcess = exec(
//                     executeCommand,
//                     { timeout: timeoutMs },
//                     (error, stdout, stderr) => {
//                         const endTime = process.hrtime.bigint();
//                         const executionTime =
//                             Number(endTime - startTime) / 1000000; // Convert to milliseconds

//                         if (error) {
//                             if (error.killed || error.code === 124) {
//                                 // 124 is timeout exit code
//                                 // Time limit exceeded
//                                 return reject({
//                                     type: "time_limit_exceeded",
//                                     executionTime: timeoutMs,
//                                     error: "Time limit exceeded (2 seconds)",
//                                 });
//                             }
//                             // Runtime error
//                             return reject({
//                                 type: "runtime_error",
//                                 executionTime: Math.round(executionTime),
//                                 error:
//                                     error.message || "Runtime error occurred",
//                                 stderr,
//                             });
//                         }

//                         // For memory tracking, we'll use a simple approach
//                         // In production, you might want to use more sophisticated tools
//                         let memoryUsed = 0; // Default to 0 for now

//                         resolve({
//                             output: stdout.trim(),
//                             executionTime: Math.round(executionTime),
//                             memoryUsed,
//                             type: "success",
//                         });
//                     }
//                 );
//             }
//         );
//     });
// };

// module.exports = executeCpp;

// // sample service response
// // * SUCCESS
// // {
// //   "success": true,
// //   "output": "program output",
// //   "executionTime": 150,
// //   "memoryUsed": 0,
// //   "type": "success"
// // }
// // ! ERROR
// // {
// //   "success": false,
// //   "error": "error message",
// //   "type": "time_limit_exceeded|runtime_error|compilation_error",
// //   "executionTime": 2000,
// //   "stderr": "error details"
// // }
