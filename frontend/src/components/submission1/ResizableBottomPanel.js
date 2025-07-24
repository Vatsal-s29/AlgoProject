import React from "react";

const ResizableBottomPanel = ({
    height,
    activeTab,
    onTabChange,
    testCases,
    testResultsSummary,
    submissionResults,
    children,
}) => {
    const tabs = [
        {
            id: "testcases",
            label: `Test Cases (${testCases.length})`,
            content: children,
        },
        {
            id: "results",
            label: "Test Results",
            badge: testResultsSummary
                ? {
                      text: `${testResultsSummary.passed}/${testResultsSummary.total}`,
                      className: testResultsSummary.allPassed
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800",
                  }
                : null,
            content: children,
        },
        {
            id: "submission",
            label: "Submission Results",
            badge: submissionResults
                ? {
                      text: submissionResults.allPassed ? "PASSED" : "FAILED",
                      className: submissionResults.allPassed
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800",
                  }
                : null,
            content: children,
        },
    ];

    return (
        <div
            className="bg-white border border-gray-200 flex flex-col mt-1"
            style={{
                height: height,
                transition: "height 0.3s ease-out",
            }}
        >
            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200 bg-gray-50 flex-shrink-0">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                            activeTab === tab.id
                                ? "border-blue-500 text-blue-600 bg-white"
                                : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        {tab.label}
                        {tab.badge && (
                            <span
                                className={`ml-2 px-2 py-1 rounded text-xs ${tab.badge.className}`}
                            >
                                {tab.badge.text}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto">{children}</div>
        </div>
    );
};

export default ResizableBottomPanel;
