const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

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

                // Now execute with time and memory tracking
                const startTime = process.hrtime.bigint();
                const timeoutMs = 2000; // 2 seconds timeout

                // Use different commands based on platform
                let executeCommand;
                if (process.platform === "win32") {
                    // Windows - simpler approach without memory tracking
                    executeCommand = `cd "${outputPath}" && "${outputFileName}" < "${inputFilePath}"`;
                } else {
                    // Unix/Linux/macOS - use timeout command and try to track memory
                    executeCommand = `cd "${outputPath}" && timeout 2s "./${outputFileName}" < "${inputFilePath}"`;
                }

                const childProcess = exec(
                    executeCommand,
                    { timeout: timeoutMs },
                    (error, stdout, stderr) => {
                        const endTime = process.hrtime.bigint();
                        const executionTime =
                            Number(endTime - startTime) / 1000000; // Convert to milliseconds

                        if (error) {
                            if (error.killed || error.code === 124) {
                                // 124 is timeout exit code
                                // Time limit exceeded
                                return reject({
                                    type: "time_limit_exceeded",
                                    executionTime: timeoutMs,
                                    error: "Time limit exceeded (2 seconds)",
                                });
                            }
                            // Runtime error
                            return reject({
                                type: "runtime_error",
                                executionTime: Math.round(executionTime),
                                error:
                                    error.message || "Runtime error occurred",
                                stderr,
                            });
                        }

                        // For memory tracking, we'll use a simple approach
                        // In production, you might want to use more sophisticated tools
                        let memoryUsed = 0; // Default to 0 for now

                        resolve({
                            output: stdout.trim(),
                            executionTime: Math.round(executionTime),
                            memoryUsed,
                            type: "success",
                        });
                    }
                );
            }
        );
    });
};

module.exports = executeCpp;

// sample service response
// * SUCCESS
// {
//   "success": true,
//   "output": "program output",
//   "executionTime": 150,
//   "memoryUsed": 0,
//   "type": "success"
// }
// ! ERROR
// {
//   "success": false,
//   "error": "error message",
//   "type": "time_limit_exceeded|runtime_error|compilation_error",
//   "executionTime": 2000,
//   "stderr": "error details"
// }