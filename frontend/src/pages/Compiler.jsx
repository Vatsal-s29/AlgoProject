import React, { useState } from "react";
import { Play, Copy, Trash2, Sun, Moon } from "lucide-react";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/themes/prism.css";

const CompilerPage = () => {
    const [code, setCode] = useState(`#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`);
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState("cpp");
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isRunning, setIsRunning] = useState(false);

    const languageTemplates = {
        cpp: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`,
        c: `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`,
        py: `print("Hello, World!")`,
        java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
        js: `console.log("Hello, World!");`,
    };

    const getLanguageForHighlighting = (lang) => {
        switch (lang) {
            case "cpp":
            case "c":
                return languages.clike;
            case "py":
                return languages.python;
            case "java":
                return languages.java;
            case "js":
                return languages.javascript;
            default:
                return languages.clike;
        }
    };

    const handleLanguageChange = (e) => {
        const newLanguage = e.target.value;
        setSelectedLanguage(newLanguage);
        setCode(languageTemplates[newLanguage]);
    };

    const handleCopyCode = () => {
        navigator.clipboard.writeText(code);
        // You can add a toast notification here
    };

    const handleClearOutput = () => {
        setOutput("");
    };

    const handleSubmit = async () => {
        setIsRunning(true);
        try {
            const response = await fetch("http://localhost:8000/run", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    code,
                    language: selectedLanguage,
                    input,
                }),
            });

            const data = await response.json();

            if (data.success) {
                setOutput(data.output);
            } else {
                setOutput(`Error: ${data.error}\n${data.stderr || ""}`);
            }
        } catch (error) {
            setOutput(`Network Error: ${error.message}`);
        } finally {
            setIsRunning(false);
        }
    };

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    return (
        <div
            className={`h-full flex flex-col overflow-hidden ${
                isDarkMode
                    ? "bg-gray-900 text-white"
                    : "bg-gray-50 text-gray-900"
            }`}
            style={{ overflow: "hidden" }}
        >
            {/* Header */}
            <div
                className={`flex items-center justify-between p-4 border-b flex-shrink-0 ${
                    isDarkMode
                        ? "border-gray-700 bg-gray-800"
                        : "border-gray-200 bg-white"
                }`}
            >
                <h1 className="text-2xl font-bold">Bro-Code Compiler</h1>
                <button
                    onClick={toggleTheme}
                    className={`p-2 rounded-lg transition-colors ${
                        isDarkMode
                            ? "hover:bg-gray-700 text-yellow-500"
                            : "hover:bg-gray-100 text-blue-600"
                    }`}
                >
                    {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
            </div>

            {/* Main Content with gaps */}
            <div
                className="flex flex-1 min-h-0 p-4 gap-4"
                style={{ overflow: "hidden" }}
            >
                {/* Left Panel - Code Editor and Input */}
                <div
                    className="flex-1 flex flex-col gap-4 min-h-0"
                    style={{ overflow: "hidden" }}
                >
                    {/* Code Editor Section */}
                    <div
                        className={`flex-1 flex flex-col rounded-lg shadow-lg overflow-hidden ${
                            isDarkMode ? "bg-gray-800" : "bg-white"
                        }`}
                    >
                        {/* Code Editor Header */}
                        <div
                            className={`flex items-center justify-between p-3 border-b flex-shrink-0 ${
                                isDarkMode
                                    ? "border-gray-700 bg-gray-700"
                                    : "border-gray-200 bg-gray-50"
                            }`}
                        >
                            <select
                                value={selectedLanguage}
                                onChange={handleLanguageChange}
                                className={`px-3 py-2 rounded-md border ${
                                    isDarkMode
                                        ? "bg-gray-600 border-gray-500 text-white"
                                        : "bg-white border-gray-300"
                                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            >
                                <option value="cpp">C++</option>
                                <option value="c">C</option>
                                <option value="py">Python</option>
                                <option value="java">Java</option>
                                <option value="js">JavaScript</option>
                            </select>

                            <button
                                onClick={handleCopyCode}
                                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                                    isDarkMode
                                        ? "hover:bg-gray-600 text-gray-300"
                                        : "hover:bg-gray-200 text-gray-700"
                                }`}
                            >
                                <Copy size={16} />
                                Copy
                            </button>
                        </div>

                        {/* Code Editor */}
                        <div
                            className="flex-1 min-h-0"
                            style={{ overflow: "hidden" }}
                        >
                            <Editor
                                value={code}
                                onValueChange={(code) => setCode(code)}
                                highlight={(code) =>
                                    highlight(
                                        code,
                                        getLanguageForHighlighting(
                                            selectedLanguage
                                        )
                                    )
                                }
                                padding={16}
                                className={`h-full ${
                                    isDarkMode ? "bg-gray-800" : "bg-white"
                                }`}
                                style={{
                                    fontFamily:
                                        '"Fira Code", "Courier New", monospace',
                                    fontSize: 14,
                                    outline: "none",
                                    border: "none",
                                    height: "100%",
                                    lineHeight: "1.5",
                                    overflow: "auto",
                                }}
                            />
                        </div>
                    </div>

                    {/* Input Section */}
                    <div
                        className={`h-32 rounded-lg shadow-lg overflow-hidden ${
                            isDarkMode ? "bg-gray-800" : "bg-white"
                        }`}
                    >
                        <div
                            className={`px-4 py-2 text-sm font-medium border-b ${
                                isDarkMode
                                    ? "bg-gray-700 text-gray-300 border-gray-600"
                                    : "bg-gray-50 text-gray-700 border-gray-200"
                            }`}
                        >
                            Input (optional)
                        </div>
                        <div className="h-24" style={{ overflow: "hidden" }}>
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Enter input for your program..."
                                className={`w-full h-full p-3 font-mono text-sm resize-none focus:outline-none ${
                                    isDarkMode
                                        ? "bg-gray-800 text-white placeholder-gray-500"
                                        : "bg-white text-gray-900 placeholder-gray-400"
                                }`}
                                style={{
                                    fontFamily:
                                        '"Fira Code", "Courier New", monospace',
                                    overflow: "auto",
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Right Panel - Output */}
                <div
                    className={`flex-1 flex flex-col rounded-lg shadow-lg overflow-hidden ${
                        isDarkMode ? "bg-gray-800" : "bg-white"
                    }`}
                >
                    {/* Right Panel Header */}
                    <div
                        className={`flex items-center justify-between p-3 border-b flex-shrink-0 ${
                            isDarkMode
                                ? "border-gray-700 bg-gray-700"
                                : "border-gray-200 bg-gray-50"
                        }`}
                    >
                        <h2 className="text-lg font-semibold">Output</h2>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleClearOutput}
                                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                                    isDarkMode
                                        ? "hover:bg-gray-600 text-gray-300"
                                        : "hover:bg-gray-200 text-gray-700"
                                }`}
                            >
                                <Trash2 size={16} />
                                Clear
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={isRunning}
                                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                                    isRunning
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-green-600 hover:bg-green-700"
                                } text-white`}
                            >
                                <Play size={16} />
                                {isRunning ? "Running..." : "Run"}
                            </button>
                        </div>
                    </div>

                    {/* Output Area */}
                    <div
                        className="flex-1 p-4 min-h-0"
                        style={{ overflow: "auto" }}
                    >
                        {output ? (
                            <pre
                                className={`font-mono text-sm whitespace-pre-wrap ${
                                    isDarkMode
                                        ? "text-green-400"
                                        : "text-gray-900"
                                }`}
                                style={{
                                    fontFamily:
                                        '"Fira Code", "Courier New", monospace',
                                }}
                            >
                                {output}
                            </pre>
                        ) : (
                            <div
                                className={`text-center ${
                                    isDarkMode
                                        ? "text-gray-500"
                                        : "text-gray-500"
                                } mt-8`}
                            >
                                <p>
                                    Click "Run" to execute your code and see the
                                    output here
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompilerPage;
