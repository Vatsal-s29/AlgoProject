import React from "react";

const SubmissionTab = ({ submissionResults, isSubmitting }) => {
    return (
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
                                        Last visible test case passed:
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
                                        Last hidden test case passed:
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
                            <span>Submitting and evaluating...</span>
                        </div>
                    ) : (
                        'Click "Submit" to evaluate against all test cases'
                    )}
                </div>
            )}
        </div>
    );
};

export default SubmissionTab;
