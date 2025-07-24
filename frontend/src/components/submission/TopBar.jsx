import React from "react";

const TopBar = ({
    language,
    setLanguage,
    languages,
    handleReset,
    handleRun,
    handleSubmit,
    isRunning,
    isSubmitting,
    testCases,
    allTestCases,
}) => {
    return (
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
                        isRunning || isSubmitting || allTestCases.length === 0
                    }
                    className="px-4 py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? "Submitting..." : "Submit"}
                </button>
            </div>
        </div>
    );
};

export default TopBar;
