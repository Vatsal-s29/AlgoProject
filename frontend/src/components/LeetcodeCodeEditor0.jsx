import React, { useState, useCallback, useRef } from "react";

const LeetcodeCodeEditor = ({ question = {} }) => {
    const [language, setLanguage] = useState("javascript");
    const [code, setCode] = useState(`function twoSum(nums, target) {
    // Write your solution here
    
}`);
    const [activeBottomTab, setActiveBottomTab] = useState("testcases");
    const [activeTestCase, setActiveTestCase] = useState(0);
    const [bottomPanelHeight, setBottomPanelHeight] = useState(30); // percentage
    const [isDragging, setIsDragging] = useState(false);
    const [testResults, setTestResults] = useState([]);

    const containerRef = useRef(null);

    const languages = [
        { value: "javascript", label: "JavaScript" },
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

    const handleRun = async () => {
        console.log("Running code...");
        // Simulate running code against test cases
        const results = testCases.map((testCase, index) => ({
            id: testCase.id,
            status: Math.random() > 0.3 ? "passed" : "failed", // Random for demo
            runtime: `${Math.floor(Math.random() * 50) + 50}ms`,
            memory: `${(Math.random() * 5 + 40).toFixed(1)}MB`,
            error: Math.random() > 0.7 ? "Wrong Answer" : null,
            actualOutput: testCase.expected, // In real implementation, this would be the actual output
        }));

        setTestResults(results);
        setActiveBottomTab("results");
    };

    const handleSubmit = async () => {
        console.log("Submitting code...");
    };

    const handleReset = () => {
        // Generate template based on language
        const templates = {
            javascript: `function ${
                question.title?.replace(/\s+/g, "_").toLowerCase() || "solution"
            }() {
    // Write your solution here
    
}`,
            python: `def ${
                question.title?.replace(/\s+/g, "_").toLowerCase() || "solution"
            }():
    # Write your solution here`
    ,
            java: `public class Solution {
    public void ${
        question.title?.replace(/\s+/g, "_").toLowerCase() || "solution"
    }() {
        // Write your solution here
        
    }
}`,
            cpp: `class Solution {
public:
    void ${question.title?.replace(/\s+/g, "_").toLowerCase() || "solution"}() {
        // Write your solution here
        
    }
};`,
            c: `#include <stdio.h>

void ${question.title?.replace(/\s+/g, "_").toLowerCase() || "solution"}() {
    // Write your solution here
    
}`,
        };

        setCode(templates[language] || templates.javascript);
    };

    // Reset code template when language changes
    React.useEffect(() => {
        handleReset();
    }, [language, question.title]);

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
                    >
                        Reset
                    </button>
                    <button
                        onClick={handleRun}
                        className="px-4 py-1 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 rounded transition-colors"
                    >
                        Run
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
                    >
                        Submit
                    </button>
                </div>
            </div>

            {/* Code Editor */}
            <div
                className="flex-1 relative bg-gray-900 mb-1"
                style={{ height: `${100 - bottomPanelHeight}%` }}
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
            {/* <div className="ml-1 rounded-2xl shadow-xl border border-gray-200 overflow-hidden"> */}
            <div
                className="bg-white border border-gray-200 flex flex-col mt-1"
                style={{ height: `${bottomPanelHeight}%` }}
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
                                <div className="space-y-3">
                                    {testResults.map((result, index) => (
                                        <div
                                            key={result.id}
                                            className="border border-gray-200 rounded p-3"
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-medium">
                                                    {testCases.find(
                                                        (tc) =>
                                                            tc.id === result.id
                                                    )?.description ||
                                                        `Test Case ${
                                                            index + 1
                                                        }`}
                                                </span>
                                                <span
                                                    className={`px-2 py-1 rounded text-xs font-semibold ${
                                                        result.status ===
                                                        "passed"
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-red-100 text-red-800"
                                                    }`}
                                                >
                                                    {result.status.toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="text-sm text-gray-600 space-y-1">
                                                <p>Runtime: {result.runtime}</p>
                                                <p>Memory: {result.memory}</p>
                                                {result.error && (
                                                    <p className="text-red-600">
                                                        Error: {result.error}
                                                    </p>
                                                )}
                                                {result.actualOutput && (
                                                    <div className="mt-2">
                                                        <p className="font-medium">
                                                            Actual Output:
                                                        </p>
                                                        <div className="bg-gray-50 border rounded p-2 font-mono text-xs mt-1">
                                                            {
                                                                result.actualOutput
                                                            }
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center text-gray-500 py-8">
                                    Click "Run" to see test results
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
