import React from "react";

const TabContent = ({
    activeTab,
    testCases,
    activeTestCase,
    onTestCaseChange,
    testResults,
    testResultsSummary,
    submissionResults,
    isRunning,
    isSubmitting,
}) => {
    const renderTestCasesTab = () => (
        <div className="p-4">
            {testCases.length > 0 ? (
                <>
                    {/* Test Case Sub-tabs */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {testCases.map((testCase, index) => (
                            <button
                                key={testCase.id}
                                onClick={() => onTestCaseChange(index)}
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
                                    {testCases[activeTestCase].input}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Expected Output:
                                </label>
                                <div className="bg-gray-50 border border-gray-200 rounded p-2 font-mono text-sm whitespace-pre-wrap">
                                    {testCases[activeTestCase].expected}
                                </div>
                            </div>
                            {testCases[activeTestCase].explanation && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Explanation:
                                    </label>
                                    <div className="bg-blue-50 border border-blue-200 rounded p-2 text-sm">
                                        {testCases[activeTestCase].explanation}
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
    );

    const renderTestResultsTab = () => (
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
                                        : result.status === "failed"
                                        ? "border-red-200 bg-red-50"
                                        : "border-yellow-200 bg-yellow-50"
                                }`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium">
                                        {result.description}
                                        {result.type === "hidden" && (
                                            <span className="ml-2 text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                                                Hidden
                                            </span>
                                        )}
                                    </span>
                                    <span
                                        className={`px-2 py-1 rounded text-xs font-semibold ${
                                            result.status === "passed"
                                                ? "bg-green-100 text-green-800"
                                                : result.status === "failed"
                                                ? "bg-red-100 text-red-800"
                                                : "bg-yellow-100 text-yellow-800"
                                        }`}
                                    >
                                        {result.status === "passed"
                                            ? "PASSED"
                                            : result.status === "failed"
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
                                            {result.expectedOutput}
                                        </div>
                                    </div>

                                    {result.actualOutput && (
                                        <div>
                                            <span className="font-medium text-gray-700">
                                                Actual:
                                            </span>
                                            <div
                                                className={`bg-white border rounded p-2 font-mono text-xs mt-1 ${
                                                    result.status === "passed"
                                                        ? "bg-green-50 border-green-200"
                                                        : "bg-red-50 border-red-200"
                                                }`}
                                            >
                                                {result.actualOutput}
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

                                    {result.stderr && (
                                        <div>
                                            <span className="font-medium text-red-700">
                                                Error Details:
                                            </span>
                                            <div className="bg-red-50 border border-red-200 rounded p-2 text-xs mt-1">
                                                {result.stderr}
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex gap-4 text-xs text-gray-600">
                                        <span>
                                            Runtime:{" "}
                                            {result.executionTime
                                                ? `${result.executionTime}ms`
                                                : "N/A"}
                                        </span>
                                        <span>
                                            Memory:{" "}
                                            {result.memoryUsed
                                                ? `${result.memoryUsed}MB`
                                                : "N/A"}
                                        </span>
                                    </div>
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
    );

    const renderSubmissionTab = () => (
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
                                        Visible test cases passed:
                                    </span>
                                    <span
                                        className={`font-mono text-sm ${
                                            submissionResults.visiblePassed ===
                                            submissionResults.visibleTotal
                                                ? "text-green-600"
                                                : "text-red-600"
                                        }`}
                                    >
                                        {submissionResults.visiblePassed}/
                                        {submissionResults.visibleTotal}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">
                                        Hidden test cases passed:
                                    </span>
                                    <span
                                        className={`font-mono text-sm ${
                                            submissionResults.hiddenPassed ===
                                            submissionResults.hiddenTotal
                                                ? "text-green-600"
                                                : "text-red-600"
                                        }`}
                                    >
                                        {submissionResults.hiddenPassed}/
                                        {submissionResults.hiddenTotal}
                                    </span>
                                </div>

                                {submissionResults.totalExecutionTime && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">
                                            Total execution time:
                                        </span>
                                        <span className="font-mono text-sm text-gray-800">
                                            {
                                                submissionResults.totalExecutionTime
                                            }
                                            ms
                                        </span>
                                    </div>
                                )}

                                {submissionResults.maxMemoryUsed && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">
                                            Peak memory usage:
                                        </span>
                                        <span className="font-mono text-sm text-gray-800">
                                            {submissionResults.maxMemoryUsed}MB
                                        </span>
                                    </div>
                                )}
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

                    {submissionResults.failedTestCase && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <h3 className="font-medium text-yellow-800 mb-2">
                                First Failed Test Case
                            </h3>
                            <div className="text-sm space-y-2">
                                <div>
                                    <span className="font-medium text-gray-700">
                                        Input:
                                    </span>
                                    <div className="bg-white border rounded p-2 font-mono text-xs mt-1">
                                        {submissionResults.failedTestCase.input}
                                    </div>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-700">
                                        Expected:
                                    </span>
                                    <div className="bg-white border rounded p-2 font-mono text-xs mt-1">
                                        {
                                            submissionResults.failedTestCase
                                                .expected
                                        }
                                    </div>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-700">
                                        Actual:
                                    </span>
                                    <div className="bg-red-50 border border-red-200 rounded p-2 font-mono text-xs mt-1">
                                        {
                                            submissionResults.failedTestCase
                                                .actual
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center text-gray-500 py-8">
                    {isSubmitting ? (
                        <div className="flex items-center justify-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                            <span>Submitting and evaluating...</span>
                        </div>
                    ) : (
                        'Click "Submit" to evaluate against all test cases'
                    )}
                </div>
            )}
        </div>
    );

    // Main render logic
    switch (activeTab) {
        case "testcases":
            return renderTestCasesTab();
        case "results":
            return renderTestResultsTab();
        case "submission":
            return renderSubmissionTab();
        default:
            return (
                <div className="text-center text-gray-500 py-8">
                    Select a tab to view content
                </div>
            );
    }
};

export default TabContent;
