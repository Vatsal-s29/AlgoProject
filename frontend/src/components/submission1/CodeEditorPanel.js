import React, { useState } from "react";

const CodeEditorPanel = ({ code, onChange, language, disabled, height }) => {
    const [theme, setTheme] = useState("dark");

    // Language-specific syntax highlighting patterns
    const getSyntaxHighlightedCode = (code, language) => {
        if (!code) return "";

        let highlightedCode = code;

        // Define syntax patterns for different languages
        const syntaxPatterns = {
            javascript: [
                {
                    pattern:
                        /\b(function|const|let|var|if|else|for|while|return|class|extends|import|export|async|await|try|catch|finally)\b/g,
                    className: "keyword",
                },
                {
                    pattern: /\b(true|false|null|undefined)\b/g,
                    className: "boolean",
                },
                { pattern: /\b\d+\b/g, className: "number" },
                { pattern: /"([^"\\]|\\.)*"/g, className: "string" },
                { pattern: /'([^'\\]|\\.)*'/g, className: "string" },
                { pattern: /\/\/.*$/gm, className: "comment" },
                { pattern: /\/\*[\s\S]*?\*\//g, className: "comment" },
            ],
            python: [
                {
                    pattern:
                        /\b(def|class|if|else|elif|for|while|return|import|from|as|try|except|finally|with|pass|break|continue|and|or|not|in|is|lambda|yield|global|nonlocal)\b/g,
                    className: "keyword",
                },
                { pattern: /\b(True|False|None)\b/g, className: "boolean" },
                { pattern: /\b\d+\b/g, className: "number" },
                { pattern: /"([^"\\]|\\.)*"/g, className: "string" },
                { pattern: /'([^'\\]|\\.)*'/g, className: "string" },
                { pattern: /#.*$/gm, className: "comment" },
            ],
            java: [
                {
                    pattern:
                        /\b(public|private|protected|static|final|class|interface|extends|implements|if|else|for|while|do|switch|case|default|return|break|continue|try|catch|finally|throw|throws|new|this|super|void|int|double|float|long|short|char|boolean|byte|String|Object)\b/g,
                    className: "keyword",
                },
                { pattern: /\b(true|false|null)\b/g, className: "boolean" },
                { pattern: /\b\d+\b/g, className: "number" },
                { pattern: /"([^"\\]|\\.)*"/g, className: "string" },
                { pattern: /'([^'\\]|\\.)*'/g, className: "string" },
                { pattern: /\/\/.*$/gm, className: "comment" },
                { pattern: /\/\*[\s\S]*?\*\//g, className: "comment" },
            ],
            cpp: [
                {
                    pattern:
                        /\b(#include|#define|#ifdef|#ifndef|#endif|int|double|float|char|bool|void|class|struct|public|private|protected|static|const|if|else|for|while|do|switch|case|default|return|break|continue|try|catch|throw|new|delete|this|namespace|using|std|cout|cin|endl)\b/g,
                    className: "keyword",
                },
                {
                    pattern: /\b(true|false|nullptr|NULL)\b/g,
                    className: "boolean",
                },
                { pattern: /\b\d+\b/g, className: "number" },
                { pattern: /"([^"\\]|\\.)*"/g, className: "string" },
                { pattern: /'([^'\\]|\\.)*'/g, className: "string" },
                { pattern: /\/\/.*$/gm, className: "comment" },
                { pattern: /\/\*[\s\S]*?\*\//g, className: "comment" },
            ],
            c: [
                {
                    pattern:
                        /\b(#include|#define|#ifdef|#ifndef|#endif|int|double|float|char|void|struct|if|else|for|while|do|switch|case|default|return|break|continue|static|const|printf|scanf|malloc|free|sizeof)\b/g,
                    className: "keyword",
                },
                { pattern: /\b(NULL)\b/g, className: "boolean" },
                { pattern: /\b\d+\b/g, className: "number" },
                { pattern: /"([^"\\]|\\.)*"/g, className: "string" },
                { pattern: /'([^'\\]|\\.)*'/g, className: "string" },
                { pattern: /\/\/.*$/gm, className: "comment" },
                { pattern: /\/\*[\s\S]*?\*\//g, className: "comment" },
            ],
        };

        const patterns = syntaxPatterns[language] || syntaxPatterns.javascript;

        // Apply syntax highlighting
        patterns.forEach(({ pattern, className }) => {
            highlightedCode = highlightedCode.replace(pattern, (match) => {
                return `<span class="syntax-${className}">${match}</span>`;
            });
        });

        return highlightedCode;
    };

    const themeStyles = {
        dark: {
            background: "bg-gray-900",
            text: "text-gray-100",
            syntaxStyles: {
                keyword: "color: #569cd6;",
                boolean: "color: #569cd6;",
                number: "color: #b5cea8;",
                string: "color: #ce9178;",
                comment: "color: #6a9955;",
            },
        },
        light: {
            background: "bg-white",
            text: "text-gray-900",
            syntaxStyles: {
                keyword: "color: #0000ff;",
                boolean: "color: #0000ff;",
                number: "color: #098658;",
                string: "color: #a31515;",
                comment: "color: #008000;",
            },
        },
    };

    const currentTheme = themeStyles[theme];

    return (
        <div
            className={`flex-1 relative ${currentTheme.background} mb-1`}
            style={{
                height: height,
                transition: "height 0.3s ease-out",
            }}
        >
            {/* Theme Toggle */}
            <div className="absolute top-2 right-2 z-10">
                <button
                    onClick={() =>
                        setTheme(theme === "dark" ? "light" : "dark")
                    }
                    className={`px-2 py-1 text-xs rounded transition-colors ${
                        theme === "dark"
                            ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                    disabled={disabled}
                >
                    {theme === "dark" ? "🌞" : "🌙"}
                </button>
            </div>

            {/* Syntax Highlighting Styles */}
            <style jsx>{`
                .syntax-keyword {
                    ${currentTheme.syntaxStyles.keyword} font-weight: bold;
                }
                .syntax-boolean {
                    ${currentTheme.syntaxStyles.boolean} font-weight: bold;
                }
                .syntax-number {
                    ${currentTheme.syntaxStyles.number}
                }
                .syntax-string {
                    ${currentTheme.syntaxStyles.string}
                }
                .syntax-comment {
                    ${currentTheme.syntaxStyles.comment} font-style: italic;
                }
            `}</style>

            <div className="absolute inset-0 overflow-auto">
                {/* Syntax Highlighted Background */}
                <div
                    className={`absolute inset-0 font-mono text-sm p-4 pointer-events-none whitespace-pre overflow-hidden ${currentTheme.text}`}
                    style={{
                        wordWrap: "normal",
                        overflowWrap: "normal",
                        zIndex: 1,
                    }}
                    dangerouslySetInnerHTML={{
                        __html: getSyntaxHighlightedCode(code, language),
                    }}
                />

                {/* Transparent Textarea */}
                <textarea
                    value={code}
                    onChange={(e) => onChange(e.target.value)}
                    className={`block w-full bg-transparent ${currentTheme.text} font-mono text-sm resize-none focus:outline-none border-none p-4 relative z-10`}
                    style={{
                        minHeight: "100%",
                        minWidth: "max-content",
                        whiteSpace: "pre",
                        wordWrap: "normal",
                        overflowWrap: "normal",
                        color: "transparent",
                        caretColor: theme === "dark" ? "white" : "black",
                    }}
                    spellCheck={false}
                    placeholder="Write your code here..."
                    wrap="off"
                    disabled={disabled}
                />
            </div>
        </div>
    );
};

export default CodeEditorPanel;
