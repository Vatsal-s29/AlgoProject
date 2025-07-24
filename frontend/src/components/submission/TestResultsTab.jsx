import React from "react";

const TestResultsTab = ({ testResults, testResultsSummary, isRunning }) => {
    return (
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
};

export default TestResultsTab;
