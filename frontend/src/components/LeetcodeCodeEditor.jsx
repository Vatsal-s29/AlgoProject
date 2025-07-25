import React, { useState, useCallback, useRef } from "react";
import TopBar from "./submission/TopBar";
import CodeEditor from "./submission/CodeEditor";
import ResizeHandle from "./submission/ResizeHandle";
import BottomPanel from "./submission/BottomPanel";
import axios from "axios";

const LeetcodeCodeEditor = ({ question = {} }) => {
    const [language, setLanguage] = useState("cpp");
    const [code, setCode] = useState(`function twoSum(nums, target) {
    // Write your solution here
    
}`);
    const [activeBottomTab, setActiveBottomTab] = useState("testcases");
    const [activeTestCase, setActiveTestCase] = useState(0);
    const [bottomPanelHeight, setBottomPanelHeight] = useState(30); // percentage
    const [isDragging, setIsDragging] = useState(false);
    const [testResults, setTestResults] = useState([]);
    const [submissionResults, setSubmissionResults] = useState(null);
    const [isRunning, setIsRunning] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const containerRef = useRef(null);

    const languages = [
        { value: "js", label: "JavaScript" },
        { value: "python", label: "Python" },
        { value: "java", label: "Java" },
        { value: "cpp", label: "C++" },
        { value: "c", label: "C" },
    ];

    // Use backend data for test cases
    const testCases = React.useMemo(() => {
        const cases = [];

        // Add public test cases from backend
        if (question.publicTestCases?.length > 0) {
            question.publicTestCases.forEach((testCase, index) => {
                cases.push({
                    id: `public-${index}`,
                    type: "public",
                    input: testCase.input,
                    expected: testCase.output,
                    description: `Visible Test Case ${index + 1}`,
                });
            });
        }

        return cases;
    }, [question]);

    // All test cases (public + hidden) for submission
    const allTestCases = React.useMemo(() => {
        const cases = [];

        // Add public test cases
        if (question.publicTestCases?.length > 0) {
            question.publicTestCases.forEach((testCase, index) => {
                cases.push({
                    id: `public-${index}`,
                    type: "public",
                    input: testCase.input,
                    expected: testCase.output,
                    description: `Visible Test Case ${index + 1}`,
                });
            });
        }

        // Add hidden test cases
        if (question.hiddenTestCases?.length > 0) {
            question.hiddenTestCases.forEach((testCase, index) => {
                cases.push({
                    id: `hidden-${index}`,
                    type: "hidden",
                    input: testCase.input,
                    expected: testCase.output,
                    description: `Hidden Test Case ${index + 1}`,
                });
            });
        }

        return cases;
    }, [question]);

    const handleMouseDown = (e) => {
        setIsDragging(true);
        e.preventDefault();
    };

    const handleMouseMove = useCallback(
        (e) => {
            if (!isDragging || !containerRef.current) return;

            const containerRect = containerRef.current.getBoundingClientRect();
            const newHeight =
                ((containerRect.bottom - e.clientY) / containerRect.height) *
                100;
            const constrainedHeight = Math.min(Math.max(newHeight, 20), 60);
            setBottomPanelHeight(constrainedHeight);
        },
        [isDragging]
    );

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    React.useEffect(() => {
        if (isDragging) {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
            return () => {
                document.removeEventListener("mousemove", handleMouseMove);
                document.removeEventListener("mouseup", handleMouseUp);
            };
        }
    }, [isDragging, handleMouseMove, handleMouseUp]);

    const runCodeAgainstTestCase = async (testCase) => {
        try {
            const response = await fetch("http://localhost:8000/run", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    language,
                    code,
                    input: testCase.input,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Runtime error");
            }

            const actualOutput = result.output?.toString().trim();
            const expectedOutput = testCase.expected?.toString().trim();
            const passed = actualOutput === expectedOutput;

            return {
                id: testCase.id,
                type: testCase.type,
                description: testCase.description,
                status: passed ? "passed" : "failed",
                actualOutput,
                expectedOutput,
                input: testCase.input,
                error: null,
                runtime: result.runtime || "N/A",
                memory: result.memory || "N/A",
            };
        } catch (error) {
            return {
                id: testCase.id,
                type: testCase.type,
                description: testCase.description,
                status: "error",
                actualOutput: null,
                expectedOutput: testCase.expected,
                input: testCase.input,
                error: error.message,
                runtime: "N/A",
                memory: "N/A",
            };
        }
    };

    const handleRun = async () => {
        if (isRunning || testCases.length === 0) return;

        setIsRunning(true);
        setActiveBottomTab("results");
        setBottomPanelHeight(60); // for auto panning up on run/submit
        setTestResults([]);

        try {
            const results = [];

            // Run against visible test cases only
            for (const testCase of testCases) {
                const result = await runCodeAgainstTestCase(testCase);
                results.push(result);
                setTestResults([...results]); // Update UI progressively
            }
        } catch (error) {
            console.error("Error running tests:", error);
        } finally {
            setIsRunning(false);
        }
    };

    const handleSubmit = async () => {
        if (isSubmitting || !question._id || !code.trim()) {
            if (!code.trim()) {
                alert("Please write some code before submitting!");
            }
            return;
        }

        setIsSubmitting(true);
        setActiveBottomTab("submission");
        setBottomPanelHeight(60);
        setSubmissionResults(null);

        try {
            // Submit code to backend (using session-based auth)
            const response = await axios.post(
                "http://localhost:5555/api/submissions/submit",
                {
                    questionId: question._id,
                    code: code,
                    language: language,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true, // Important for session-based auth
                }
            );

            const backendResult = response.data;

            if (backendResult.success) {
                // Display submission results from backend
                setSubmissionResults({
                    status: backendResult.data.status,
                    testCasesPassed: backendResult.data.testCasesPassed,
                    totalTestCases: backendResult.data.totalTestCases,
                    executionTime: backendResult.data.executionTime,
                    memoryUsed: backendResult.data.memoryUsed,
                    submissionId: backendResult.data.submissionId,
                    allPassed: backendResult.data.status === "accepted",
                    visiblePassed: Math.min(
                        backendResult.data.testCasesPassed,
                        testCases.length
                    ),
                    visibleTotal: testCases.length,
                    hiddenPassed: Math.max(
                        0,
                        backendResult.data.testCasesPassed - testCases.length
                    ),
                    hiddenTotal: Math.max(
                        0,
                        backendResult.data.totalTestCases - testCases.length
                    ),
                });

                // Show success message
                if (backendResult.data.status === "accepted") {
                    alert(
                        "🎉 Congratulations! Your solution has been accepted!"
                    );
                } else {
                    const statusMessages = {
                        wrong_answer: "❌ Wrong Answer",
                        time_limit_exceeded: "⏱️ Time Limit Exceeded",
                        runtime_error: "💥 Runtime Error",
                        memory_limit_exceeded: "💾 Memory Limit Exceeded",
                    };
                    alert(
                        statusMessages[backendResult.data.status] ||
                            "Submission failed"
                    );
                }
            } else {
                throw new Error(backendResult.message || "Submission failed");
            }
        } catch (error) {
            console.error("Error submitting:", error);

            let errorMessage = "Submission failed. Please try again.";
            if (error.response?.status === 401) {
                errorMessage = "Please login to submit code";
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }

            alert(errorMessage);

            setSubmissionResults({
                status: "error",
                testCasesPassed: 0,
                totalTestCases: allTestCases.length,
                allPassed: false,
                error: errorMessage,
                visiblePassed: 0,
                visibleTotal: testCases.length,
                hiddenPassed: 0,
                hiddenTotal: allTestCases.length - testCases.length,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReset = () => {
        // Generate template based on language
        const templates = {
            javascript: `// Start coding from here
`,
            python: `# Start coding from here
`,
            java: `public class Main {
    public static void main(String[] args) {
        // Start coding from here
    }
}`,
            cpp: `#include <iostream>
using namespace std;

int main() {
    // Start coding from here
    return 0;
}`,
            c: `#include <stdio.h>

int main() {
    // Start coding from here
    return 0;
}`,
        };

        setCode(templates[language] || templates.javascript);
        setTestResults([]);
    };

    // Reset code template when language changes
    React.useEffect(() => {
        handleReset();
    }, [language, question.title]);

    // Calculate test results summary
    const testResultsSummary = React.useMemo(() => {
        if (testResults.length === 0) return null;

        const passed = testResults.filter((r) => r.status === "passed").length;
        const total = testResults.length;
        const allPassed = passed === total;

        return { passed, total, allPassed };
    }, [testResults]);

    return (
        <div
            ref={containerRef}
            className="code-editor-container h-full flex flex-col bg-white"
        >
            <TopBar
                language={language}
                setLanguage={setLanguage}
                languages={languages}
                handleReset={handleReset}
                handleRun={handleRun}
                handleSubmit={handleSubmit}
                isRunning={isRunning}
                isSubmitting={isSubmitting}
                testCases={testCases}
                allTestCases={allTestCases}
            />

            <CodeEditor
                code={code}
                setCode={setCode}
                bottomPanelHeight={bottomPanelHeight}
                isRunning={isRunning}
                isSubmitting={isSubmitting}
            />

            <ResizeHandle
                isDragging={isDragging}
                handleMouseDown={handleMouseDown}
            />

            <BottomPanel
                bottomPanelHeight={bottomPanelHeight}
                activeBottomTab={activeBottomTab}
                setActiveBottomTab={setActiveBottomTab}
                testCases={testCases}
                testResults={testResults}
                testResultsSummary={testResultsSummary}
                submissionResults={submissionResults}
                activeTestCase={activeTestCase}
                setActiveTestCase={setActiveTestCase}
                isRunning={isRunning}
                isSubmitting={isSubmitting}
            />
        </div>
    );
};

export default LeetcodeCodeEditor;

// import React, { useState, useCallback, useRef } from "react";
// import TopBar from "./submission/TopBar";
// import CodeEditor from "./submission/CodeEditor";
// import ResizeHandle from "./submission/ResizeHandle";
// import BottomPanel from "./submission/BottomPanel";

// const LeetcodeCodeEditor = ({ question = {} }) => {
//     const [language, setLanguage] = useState("cpp");
//     const [code, setCode] = useState(`function twoSum(nums, target) {
//     // Write your solution here

// }`);
//     const [activeBottomTab, setActiveBottomTab] = useState("testcases");
//     const [activeTestCase, setActiveTestCase] = useState(0);
//     const [bottomPanelHeight, setBottomPanelHeight] = useState(30); // percentage
//     const [isDragging, setIsDragging] = useState(false);
//     const [testResults, setTestResults] = useState([]);
//     const [submissionResults, setSubmissionResults] = useState(null);
//     const [isRunning, setIsRunning] = useState(false);
//     const [isSubmitting, setIsSubmitting] = useState(false);

//     const containerRef = useRef(null);

//     const languages = [
//         { value: "js", label: "JavaScript" },
//         { value: "python", label: "Python" },
//         { value: "java", label: "Java" },
//         { value: "cpp", label: "C++" },
//         { value: "c", label: "C" },
//     ];

//     // Use backend data for test cases
//     const testCases = React.useMemo(() => {
//         const cases = [];

//         // Add public test cases from backend
//         if (question.publicTestCases?.length > 0) {
//             question.publicTestCases.forEach((testCase, index) => {
//                 cases.push({
//                     id: `public-${index}`,
//                     type: "public",
//                     input: testCase.input,
//                     expected: testCase.output,
//                     description: `Visible Test Case ${index + 1}`,
//                 });
//             });
//         }

//         return cases;
//     }, [question]);

//     // All test cases (public + hidden) for submission
//     const allTestCases = React.useMemo(() => {
//         const cases = [];

//         // Add public test cases
//         if (question.publicTestCases?.length > 0) {
//             question.publicTestCases.forEach((testCase, index) => {
//                 cases.push({
//                     id: `public-${index}`,
//                     type: "public",
//                     input: testCase.input,
//                     expected: testCase.output,
//                     description: `Visible Test Case ${index + 1}`,
//                 });
//             });
//         }

//         // Add hidden test cases
//         if (question.hiddenTestCases?.length > 0) {
//             question.hiddenTestCases.forEach((testCase, index) => {
//                 cases.push({
//                     id: `hidden-${index}`,
//                     type: "hidden",
//                     input: testCase.input,
//                     expected: testCase.output,
//                     description: `Hidden Test Case ${index + 1}`,
//                 });
//             });
//         }

//         return cases;
//     }, [question]);

//     const handleMouseDown = (e) => {
//         setIsDragging(true);
//         e.preventDefault();
//     };

//     const handleMouseMove = useCallback(
//         (e) => {
//             if (!isDragging || !containerRef.current) return;

//             const containerRect = containerRef.current.getBoundingClientRect();
//             const newHeight =
//                 ((containerRect.bottom - e.clientY) / containerRect.height) *
//                 100;
//             const constrainedHeight = Math.min(Math.max(newHeight, 20), 60);
//             setBottomPanelHeight(constrainedHeight);
//         },
//         [isDragging]
//     );

//     const handleMouseUp = useCallback(() => {
//         setIsDragging(false);
//     }, []);

//     React.useEffect(() => {
//         if (isDragging) {
//             document.addEventListener("mousemove", handleMouseMove);
//             document.addEventListener("mouseup", handleMouseUp);
//             return () => {
//                 document.removeEventListener("mousemove", handleMouseMove);
//                 document.removeEventListener("mouseup", handleMouseUp);
//             };
//         }
//     }, [isDragging, handleMouseMove, handleMouseUp]);

//     const runCodeAgainstTestCase = async (testCase) => {
//         try {
//             const response = await fetch("http://localhost:8000/run", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({
//                     language,
//                     code,
//                     input: testCase.input,
//                 }),
//             });

//             const result = await response.json();

//             if (!response.ok) {
//                 throw new Error(result.error || "Runtime error");
//             }

//             const actualOutput = result.output?.toString().trim();
//             const expectedOutput = testCase.expected?.toString().trim();
//             const passed = actualOutput === expectedOutput;

//             return {
//                 id: testCase.id,
//                 type: testCase.type,
//                 description: testCase.description,
//                 status: passed ? "passed" : "failed",
//                 actualOutput,
//                 expectedOutput,
//                 input: testCase.input,
//                 error: null,
//                 runtime: result.runtime || "N/A",
//                 memory: result.memory || "N/A",
//             };
//         } catch (error) {
//             return {
//                 id: testCase.id,
//                 type: testCase.type,
//                 description: testCase.description,
//                 status: "error",
//                 actualOutput: null,
//                 expectedOutput: testCase.expected,
//                 input: testCase.input,
//                 error: error.message,
//                 runtime: "N/A",
//                 memory: "N/A",
//             };
//         }
//     };

//     const handleRun = async () => {
//         if (isRunning || testCases.length === 0) return;

//         setIsRunning(true);
//         setActiveBottomTab("results");
//         setBottomPanelHeight(60); // for auto panning up on run/submit
//         setTestResults([]);

//         try {
//             const results = [];

//             // Run against visible test cases only
//             for (const testCase of testCases) {
//                 const result = await runCodeAgainstTestCase(testCase);
//                 results.push(result);
//                 setTestResults([...results]); // Update UI progressively
//             }
//         } catch (error) {
//             console.error("Error running tests:", error);
//         } finally {
//             setIsRunning(false);
//         }
//     };

//     const handleSubmit = async () => {
//         if (isSubmitting || allTestCases.length === 0) return;

//         setIsSubmitting(true);
//         setActiveBottomTab("submission");
//         setBottomPanelHeight(60); // for auto panning up on run/submit
//         setSubmissionResults(null);

//         try {
//             let visiblePassed = 0;
//             let hiddenPassed = 0;
//             let visibleTotal = testCases.length;
//             let hiddenTotal = allTestCases.length - testCases.length;
//             let failed = false;

//             // First run visible test cases
//             for (const testCase of testCases) {
//                 const result = await runCodeAgainstTestCase(testCase);

//                 if (result.status === "passed") {
//                     visiblePassed++;
//                 } else {
//                     // If any visible test case fails, stop immediately
//                     failed = true;
//                     break;
//                 }
//             }

//             // Only run hidden test cases if all visible ones passed
//             if (!failed && hiddenTotal > 0) {
//                 const hiddenTestCases = allTestCases.filter(
//                     (tc) => tc.type === "hidden"
//                 );

//                 for (const testCase of hiddenTestCases) {
//                     const result = await runCodeAgainstTestCase(testCase);

//                     if (result.status === "passed") {
//                         hiddenPassed++;
//                     } else {
//                         // If any hidden test case fails, stop immediately
//                         break;
//                     }
//                 }
//             }

//             setSubmissionResults({
//                 visiblePassed,
//                 visibleTotal,
//                 hiddenPassed,
//                 hiddenTotal,
//                 allPassed:
//                     visiblePassed === visibleTotal &&
//                     hiddenPassed === hiddenTotal,
//             });
//         } catch (error) {
//             console.error("Error submitting:", error);
//             setSubmissionResults({
//                 visiblePassed: 0,
//                 visibleTotal: testCases.length,
//                 hiddenPassed: 0,
//                 hiddenTotal: allTestCases.length - testCases.length,
//                 allPassed: false,
//                 error: error.message,
//             });
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     const handleReset = () => {
//         // Generate template based on language
//         const templates = {
//             javascript: `// Start coding from here
// `,
//             python: `# Start coding from here
// `,
//             java: `public class Main {
//     public static void main(String[] args) {
//         // Start coding from here
//     }
// }`,
//             cpp: `#include <iostream>
// using namespace std;

// int main() {
//     // Start coding from here
//     return 0;
// }`,
//             c: `#include <stdio.h>

// int main() {
//     // Start coding from here
//     return 0;
// }`,
//         };

//         setCode(templates[language] || templates.javascript);
//         setTestResults([]);
//     };

//     // Reset code template when language changes
//     React.useEffect(() => {
//         handleReset();
//     }, [language, question.title]);

//     // Calculate test results summary
//     const testResultsSummary = React.useMemo(() => {
//         if (testResults.length === 0) return null;

//         const passed = testResults.filter((r) => r.status === "passed").length;
//         const total = testResults.length;
//         const allPassed = passed === total;

//         return { passed, total, allPassed };
//     }, [testResults]);

//     return (
//         <div
//             ref={containerRef}
//             className="code-editor-container h-full flex flex-col bg-white"
//         >
//             <TopBar
//                 language={language}
//                 setLanguage={setLanguage}
//                 languages={languages}
//                 handleReset={handleReset}
//                 handleRun={handleRun}
//                 handleSubmit={handleSubmit}
//                 isRunning={isRunning}
//                 isSubmitting={isSubmitting}
//                 testCases={testCases}
//                 allTestCases={allTestCases}
//             />

//             <CodeEditor
//                 code={code}
//                 setCode={setCode}
//                 bottomPanelHeight={bottomPanelHeight}
//                 isRunning={isRunning}
//                 isSubmitting={isSubmitting}
//             />

//             <ResizeHandle
//                 isDragging={isDragging}
//                 handleMouseDown={handleMouseDown}
//             />

//             <BottomPanel
//                 bottomPanelHeight={bottomPanelHeight}
//                 activeBottomTab={activeBottomTab}
//                 setActiveBottomTab={setActiveBottomTab}
//                 testCases={testCases}
//                 testResults={testResults}
//                 testResultsSummary={testResultsSummary}
//                 submissionResults={submissionResults}
//                 activeTestCase={activeTestCase}
//                 setActiveTestCase={setActiveTestCase}
//                 isRunning={isRunning}
//                 isSubmitting={isSubmitting}
//             />
//         </div>
//     );
// };

// export default LeetcodeCodeEditor;
