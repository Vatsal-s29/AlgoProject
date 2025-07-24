import React from "react";

const TestCasesTab = ({ testCases, activeTestCase, setActiveTestCase }) => {
    return (
        <div className="p-4">
            {testCases.length > 0 ? (
                <>
                    {/* Test Case Sub-tabs */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {testCases.map((testCase, index) => (
                            <button
                                key={testCase.id}
                                onClick={() => setActiveTestCase(index)}
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
};

export default TestCasesTab;
