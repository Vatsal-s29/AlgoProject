import React from "react";

const ResizeHandle = ({ isDragging, handleMouseDown }) => {
    return (
        <div
            className={`h-1 bg-gray-300 hover:bg-blue-400 cursor-row-resize flex-shrink-0 transition-colors ${
                isDragging ? "bg-blue-500" : ""
            }`}
            onMouseDown={handleMouseDown}
        />
    );
};

export default ResizeHandle;
