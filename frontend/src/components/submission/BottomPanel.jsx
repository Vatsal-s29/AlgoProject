import React from "react";
import TestCasesTab from "./TestCasesTab";
import TestResultsTab from "./TestResultsTab";
import SubmissionTab from "./SubmissionTab";

const BottomPanel = ({
    bottomPanelHeight,
    activeBottomTab,
    setActiveBottomTab,
    testCases,
    testResults,
    testResultsSummary,
    submissionResults,
    activeTestCase,
    setActiveTestCase,
    isRunning,
    isSubmitting,
}) => {
    return (
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
                            {submissionResults.allPassed ? "PASSED" : "FAILED"}
                        </span>
                    )}
                </button>
            </div>

            {/* Bottom Content */}
            <div className="flex-1 overflow-y-auto">
                {activeBottomTab === "testcases" && (
                    <TestCasesTab
                        testCases={testCases}
                        activeTestCase={activeTestCase}
                        setActiveTestCase={setActiveTestCase}
                    />
                )}

                {activeBottomTab === "results" && (
                    <TestResultsTab
                        testResults={testResults}
                        testResultsSummary={testResultsSummary}
                        isRunning={isRunning}
                    />
                )}

                {activeBottomTab === "submission" && (
                    <SubmissionTab
                        submissionResults={submissionResults}
                        isSubmitting={isSubmitting}
                    />
                )}
            </div>
        </div>
    );
};

export default BottomPanel;
