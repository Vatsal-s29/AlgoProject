import React from "react";

const CodeEditor = ({
    code,
    setCode,
    bottomPanelHeight,
    isRunning,
    isSubmitting,
}) => {
    return (
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
    );
};

export default CodeEditor;
