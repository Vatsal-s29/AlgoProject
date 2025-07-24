import React, { useState, useCallback, useRef } from "react";

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
        if (isSubmitting || allTestCases.length === 0) return;

        setIsSubmitting(true);
        setActiveBottomTab("submission");
        setBottomPanelHeight(60); // for auto panning up on run/submit
        setSubmissionResults(null);

        try {
            let visiblePassed = 0;
            let hiddenPassed = 0;
            let visibleTotal = testCases.length;
            let hiddenTotal = allTestCases.length - testCases.length;
            let failed = false;

            // First run visible test cases
            for (const testCase of testCases) {
                const result = await runCodeAgainstTestCase(testCase);

                if (result.status === "passed") {
                    visiblePassed++;
                } else {
                    // If any visible test case fails, stop immediately
                    failed = true;
                    break;
                }
            }

            // Only run hidden test cases if all visible ones passed
            if (!failed && hiddenTotal > 0) {
                const hiddenTestCases = allTestCases.filter(
                    (tc) => tc.type === "hidden"
                );

                for (const testCase of hiddenTestCases) {
                    const result = await runCodeAgainstTestCase(testCase);

                    if (result.status === "passed") {
                        hiddenPassed++;
                    } else {
                        // If any hidden test case fails, stop immediately
                        break;
                    }
                }
            }

            setSubmissionResults({
                visiblePassed,
                visibleTotal,
                hiddenPassed,
                hiddenTotal,
                allPassed:
                    visiblePassed === visibleTotal &&
                    hiddenPassed === hiddenTotal,
            });
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
            <div
                className="flex-1 relative bg-gray-900 mb-1"
                style={{
                    height: `${100 - bottomPanelHeight}%`,
                    transition: "height 0.3s ease-out", // for smooth panning
                }}
            >
                <div className="absolute inset-0 overflow-auto">
                    <textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="block w-full bg-gray-900 text-gray-100 font-mono text-sm resize-none focus:outline-none border-none p-4"
                        style={{
                            minHeight: "100%",
                            minWidth: "max-content",
                            whiteSpace: "pre",
                            wordWrap: "normal",
                            overflowWrap: "normal",
                        }}
                        spellCheck={false}
                        placeholder="Write your code here..."
                        wrap="off"
                        disabled={isRunning || isSubmitting}
                    />
                </div>
            </div>

            {/* Horizontal Resize Handle */}
            <div
                className={`h-1 bg-gray-300 hover:bg-blue-400 cursor-row-resize flex-shrink-0 transition-colors ${
                    isDragging ? "bg-blue-500" : ""
                }`}
                onMouseDown={handleMouseDown}
            />

            {/* Bottom Panel */}
            <div
                className="bg-white border border-gray-200 flex flex-col mt-1"
                style={{
                    height: `${bottomPanelHeight}%`,
                    transition: "height 0.3s ease-out", // for smooth panning
                }}
            >
                {/* Bottom Tabs */}
                <div className="flex border-b border-gray-200 bg-gray-50 flex-shrink-0">
                    <button
                        onClick={() => setActiveBottomTab("testcases")}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                            activeBottomTab === "testcases"
                                ? "border-blue-500 text-blue-600 bg-white"
                                : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        Test Cases ({testCases.length})
                    </button>
                    <button
                        onClick={() => setActiveBottomTab("results")}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                            activeBottomTab === "results"
                                ? "border-blue-500 text-blue-600 bg-white"
                                : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        Test Results
                        {testResultsSummary && (
                            <span
                                className={`ml-2 px-2 py-1 rounded text-xs ${
                                    testResultsSummary.allPassed
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                }`}
                            >
                                {testResultsSummary.passed}/
                                {testResultsSummary.total}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveBottomTab("submission")}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                            activeBottomTab === "submission"
                                ? "border-blue-500 text-blue-600 bg-white"
                                : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        Submission Results
                        {submissionResults && (
                            <span
                                className={`ml-2 px-2 py-1 rounded text-xs ${
                                    submissionResults.allPassed
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                }`}
                            >
                                {submissionResults.allPassed
                                    ? "PASSED"
                                    : "FAILED"}
                            </span>
                        )}
                    </button>
                </div>

                {/* Bottom Content */}
                <div className="flex-1 overflow-y-auto">
                    {activeBottomTab === "testcases" && (
                        <div className="p-4">
                            {testCases.length > 0 ? (
                                <>
                                    {/* Test Case Sub-tabs */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {testCases.map((testCase, index) => (
                                            <button
                                                key={testCase.id}
                                                onClick={() =>
                                                    setActiveTestCase(index)
                                                }
                                                className={`px-3 py-1 text-sm rounded transition-colors ${
                                                    activeTestCase === index
                                                        ? "bg-blue-100 text-blue-700 border border-blue-300"
                                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                }`}
                                            >
                                                {testCase.description}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Active Test Case Content */}
                                    {testCases[activeTestCase] && (
                                        <div className="space-y-3">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Input:
                                                </label>
                                                <div className="bg-gray-50 border border-gray-200 rounded p-2 font-mono text-sm whitespace-pre-wrap">
                                                    {
                                                        testCases[
                                                            activeTestCase
                                                        ].input
                                                    }
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Expected Output:
                                                </label>
                                                <div className="bg-gray-50 border border-gray-200 rounded p-2 font-mono text-sm whitespace-pre-wrap">
                                                    {
                                                        testCases[
                                                            activeTestCase
                                                        ].expected
                                                    }
                                                </div>
                                            </div>
                                            {testCases[activeTestCase]
                                                .explanation && (
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Explanation:
                                                    </label>
                                                    <div className="bg-blue-50 border border-blue-200 rounded p-2 text-sm">
                                                        {
                                                            testCases[
                                                                activeTestCase
                                                            ].explanation
                                                        }
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-center text-gray-500 py-8">
                                    No test cases available
                                </div>
                            )}
                        </div>
                    )}

                    {activeBottomTab === "results" && (
                        <div className="p-4">
                            {testResults.length > 0 ? (
                                <>
                                    {/* Results Summary */}
                                    {testResultsSummary && (
                                        <div
                                            className={`mb-4 p-3 rounded-lg ${
                                                testResultsSummary.allPassed
                                                    ? "bg-green-50 border border-green-200"
                                                    : "bg-red-50 border border-red-200"
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span
                                                    className={`font-medium ${
                                                        testResultsSummary.allPassed
                                                            ? "text-green-800"
                                                            : "text-red-800"
                                                    }`}
                                                >
                                                    {testResultsSummary.allPassed
                                                        ? "✓ All tests passed!"
                                                        : `✗ ${testResultsSummary.passed}/${testResultsSummary.total} tests passed`}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Individual Test Results */}
                                    <div className="space-y-3">
                                        {testResults.map((result, index) => (
                                            <div
                                                key={result.id}
                                                className={`border rounded p-3 ${
                                                    result.status === "passed"
                                                        ? "border-green-200 bg-green-50"
                                                        : result.status ===
                                                          "failed"
                                                        ? "border-red-200 bg-red-50"
                                                        : "border-yellow-200 bg-yellow-50"
                                                }`}
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="font-medium">
                                                        {result.description}
                                                        {result.type ===
                                                            "hidden" && (
                                                            <span className="ml-2 text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                                                                Hidden
                                                            </span>
                                                        )}
                                                    </span>
                                                    <span
                                                        className={`px-2 py-1 rounded text-xs font-semibold ${
                                                            result.status ===
                                                            "passed"
                                                                ? "bg-green-100 text-green-800"
                                                                : result.status ===
                                                                  "failed"
                                                                ? "bg-red-100 text-red-800"
                                                                : "bg-yellow-100 text-yellow-800"
                                                        }`}
                                                    >
                                                        {result.status ===
                                                        "passed"
                                                            ? "PASSED"
                                                            : result.status ===
                                                              "failed"
                                                            ? "FAILED"
                                                            : "ERROR"}
                                                    </span>
                                                </div>

                                                <div className="text-sm space-y-2">
                                                    <div>
                                                        <span className="font-medium text-gray-700">
                                                            Input:
                                                        </span>
                                                        <div className="bg-white border rounded p-2 font-mono text-xs mt-1">
                                                            {result.input}
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <span className="font-medium text-gray-700">
                                                            Expected:
                                                        </span>
                                                        <div className="bg-white border rounded p-2 font-mono text-xs mt-1">
                                                            {
                                                                result.expectedOutput
                                                            }
                                                        </div>
                                                    </div>

                                                    {result.actualOutput && (
                                                        <div>
                                                            <span className="font-medium text-gray-700">
                                                                Actual:
                                                            </span>
                                                            <div
                                                                className={`bg-white border rounded p-2 font-mono text-xs mt-1 ${
                                                                    result.status ===
                                                                    "passed"
                                                                        ? "bg-green-50 border-green-200"
                                                                        : "bg-red-50 border-red-200"
                                                                }`}
                                                            >
                                                                {
                                                                    result.actualOutput
                                                                }
                                                            </div>
                                                        </div>
                                                    )}

                                                    {result.error && (
                                                        <div>
                                                            <span className="font-medium text-red-700">
                                                                Error:
                                                            </span>
                                                            <div className="bg-red-50 border border-red-200 rounded p-2 text-xs mt-1">
                                                                {result.error}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* <div className="flex gap-4 text-xs text-gray-600">
                                                        <span>
                                                            Runtime:{" "}
                                                            {result.runtime}
                                                        </span>
                                                        <span>
                                                            Memory:{" "}
                                                            {result.memory}
                                                        </span>
                                                    </div> */}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className="text-center text-gray-500 py-8">
                                    {isRunning ? (
                                        <div className="flex items-center justify-center space-x-2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                                            <span>Running tests...</span>
                                        </div>
                                    ) : (
                                        'Click "Run" to test against visible cases'
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {activeBottomTab === "submission" && (
                        <div className="p-4">
                            {submissionResults ? (
                                <div className="space-y-4">
                                    {/* Overall Status */}
                                    <div
                                        className={`p-4 rounded-lg ${
                                            submissionResults.allPassed
                                                ? "bg-green-50 border border-green-200"
                                                : "bg-red-50 border border-red-200"
                                        }`}
                                    >
                                        <div className="flex items-center justify-center">
                                            <span
                                                className={`text-xl font-bold ${
                                                    submissionResults.allPassed
                                                        ? "text-green-800"
                                                        : "text-red-800"
                                                }`}
                                            >
                                                {submissionResults.allPassed
                                                    ? "✓ ACCEPTED"
                                                    : "✗ WRONG ANSWER"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Test Results Summary */}
                                    <div className="space-y-3">
                                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                            <h3 className="font-medium text-gray-800 mb-3">
                                                Test Results Summary
                                            </h3>

                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-gray-600">
                                                        Last visible test case
                                                        passed:
                                                    </span>
                                                    <span
                                                        className={`font-mono text-sm ${
                                                            submissionResults.visiblePassed ===
                                                            submissionResults.visibleTotal
                                                                ? "text-green-600"
                                                                : "text-red-600"
                                                        }`}
                                                    >
                                                        {
                                                            submissionResults.visiblePassed
                                                        }
                                                        /
                                                        {
                                                            submissionResults.visibleTotal
                                                        }
                                                    </span>
                                                </div>

                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-gray-600">
                                                        Last hidden test case
                                                        passed:
                                                    </span>
                                                    <span
                                                        className={`font-mono text-sm ${
                                                            submissionResults.hiddenPassed ===
                                                            submissionResults.hiddenTotal
                                                                ? "text-green-600"
                                                                : "text-red-600"
                                                        }`}
                                                    >
                                                        {
                                                            submissionResults.hiddenPassed
                                                        }
                                                        /
                                                        {
                                                            submissionResults.hiddenTotal
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {submissionResults.error && (
                                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                            <h3 className="font-medium text-red-800 mb-2">
                                                Error
                                            </h3>
                                            <p className="text-sm text-red-700">
                                                {submissionResults.error}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center text-gray-500 py-8">
                                    {isSubmitting ? (
                                        <div className="flex items-center justify-center space-x-2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                                            <span>
                                                Submitting and evaluating...
                                            </span>
                                        </div>
                                    ) : (
                                        'Click "Submit" to evaluate against all test cases'
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LeetcodeCodeEditor;
