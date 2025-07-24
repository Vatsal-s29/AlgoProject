import React, { useState, useCallback, useRef } from "react";
import CodeEditorPanel from "./CodeEditorPanel";
import ResizableBottomPanel from "./ResizableBottomPanel";
import TabContent from "./TabContent";

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

            if (result.success) {
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
                    runtime: result.executionTime || "N/A",
                    memory: result.memoryUsed || "N/A",
                };
            } else {
                return {
                    id: testCase.id,
                    type: testCase.type,
                    description: testCase.description,
                    status: "error",
                    actualOutput: null,
                    expectedOutput: testCase.expected,
                    input: testCase.input,
                    error: result.error || "Unknown error",
                    runtime: "N/A",
                    memory: "N/A",
                };
            }
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
        if (isSubmitting || allTestCases.length === 0) return;

        setIsSubmitting(true);
        setActiveBottomTab("submission");
        setBottomPanelHeight(60); // for auto panning up on run/submit
        setSubmissionResults(null);

        try {
            // Submit code to backend
            const response = await fetch("http://localhost:8000/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    language,
                    code,
                    testCases: allTestCases,
                }),
            });

            const result = await response.json();

            if (result.success) {
                setSubmissionResults({
                    visiblePassed: result.visiblePassed || 0,
                    visibleTotal: result.visibleTotal || testCases.length,
                    hiddenPassed: result.hiddenPassed || 0,
                    hiddenTotal:
                        result.hiddenTotal ||
                        allTestCases.length - testCases.length,
                    allPassed: result.allPassed || false,
                    executionTime: result.executionTime,
                    memoryUsed: result.memoryUsed,
                });
            } else {
                setSubmissionResults({
                    visiblePassed: 0,
                    visibleTotal: testCases.length,
                    hiddenPassed: 0,
                    hiddenTotal: allTestCases.length - testCases.length,
                    allPassed: false,
                    error: result.error || "Submission failed",
                    type: result.type,
                });
            }
        } catch (error) {
            console.error("Error submitting:", error);
            setSubmissionResults({
                visiblePassed: 0,
                visibleTotal: testCases.length,
                hiddenPassed: 0,
                hiddenTotal: allTestCases.length - testCases.length,
                allPassed: false,
                error: error.message,
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
            {/* Top Bar */}
            <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50 flex-shrink-0">
                <div className="flex items-center space-x-3">
                    {/* Language Selector */}
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isRunning || isSubmitting}
                    >
                        {languages.map((lang) => (
                            <option key={lang.value} value={lang.value}>
                                {lang.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center space-x-2">
                    <button
                        onClick={handleReset}
                        className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors"
                        disabled={isRunning || isSubmitting}
                    >
                        Reset
                    </button>
                    <button
                        onClick={handleRun}
                        disabled={
                            isRunning || isSubmitting || testCases.length === 0
                        }
                        className="px-4 py-1 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isRunning ? "Running..." : "Run"}
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={
                            isRunning ||
                            isSubmitting ||
                            allTestCases.length === 0
                        }
                        className="px-4 py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? "Submitting..." : "Submit"}
                    </button>
                </div>
            </div>

            {/* Code Editor */}
            <CodeEditorPanel
                code={code}
                onChange={setCode}
                language={language}
                disabled={isRunning || isSubmitting}
                height={`${100 - bottomPanelHeight}%`}
            />

            {/* Horizontal Resize Handle */}
            <div
                className={`h-1 bg-gray-300 hover:bg-blue-400 cursor-row-resize flex-shrink-0 transition-colors ${
                    isDragging ? "bg-blue-500" : ""
                }`}
                onMouseDown={handleMouseDown}
            />

            {/* Bottom Panel */}
            <ResizableBottomPanel
                height={`${bottomPanelHeight}%`}
                activeTab={activeBottomTab}
                onTabChange={setActiveBottomTab}
                testCases={testCases}
                testResultsSummary={testResultsSummary}
                submissionResults={submissionResults}
            >
                <TabContent
                    activeTab={activeBottomTab}
                    testCases={testCases}
                    activeTestCase={activeTestCase}
                    onTestCaseChange={setActiveTestCase}
                    testResults={testResults}
                    testResultsSummary={testResultsSummary}
                    submissionResults={submissionResults}
                    isRunning={isRunning}
                    isSubmitting={isSubmitting}
                />
            </ResizableBottomPanel>
        </div>
    );
};

export default LeetcodeCodeEditor;
