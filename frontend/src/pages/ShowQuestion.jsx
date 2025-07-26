import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import getDifficultyClasses from "../utils/getDifficultyClasses";
import { BACKEND_URL } from "../../config";
import LeetcodeCodeEditor from "../components/LeetcodeCodeEditor";
import Discussion from "../components/discussion/Discussion";
import Submissions from "../components/Submissions";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import { GEMINI_API_KEY } from "../../config";

const ShowQuestion = () => {
    const [question, setQuestion] = useState({});
    const [loading, setLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [activeTab, setActiveTab] = useState("question");
    const { id } = useParams();

    const [leftWidth, setLeftWidth] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const [user, setUser] = useState(null);

    const [hints, setHints] = useState("");
    const [loadingHints, setLoadingHints] = useState(false);
    const [bestApproach, setBestApproach] = useState("");
    const [loadingBestApproach, setLoadingBestApproach] = useState(false);

    const generateHints = async () => {
        if (!question.problemStatement) return;

        setLoadingHints(true);
        try {
            const response = await fetch(
                "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-goog-api-key": `${GEMINI_API_KEY}`, // Replace with your actual API key
                    },
                    body: JSON.stringify({
                        contents: [
                            {
                                parts: [
                                    {
                                        text: `Generate progressive hints for solving this programming problem. Follow this exact markdown template:

## Hint 1: Understanding the Problem
[First hint - help understand what the problem is asking]

## Hint 2: Approach Direction
[Second hint - point towards the right approach/data structure]

## Hint 3: Key Insight
[Third hint - reveal a key insight or pattern]

## Hint 4: Implementation Detail
[Fourth hint - specific implementation detail without giving away the complete solution]

## Edge Cases to Consider
- [Edge case 1]
- [Edge case 2]
- [Edge case 3]

---

**Problem:** ${question.problemStatement}`,
                                    },
                                ],
                            },
                        ],
                    }),
                }
            );

            const data = await response.json();
            if (data.candidates && data.candidates[0]) {
                setHints(data.candidates[0].content.parts[0].text);
            }
        } catch (error) {
            console.error("Error generating hints:", error);
            setHints("Error generating hints. Please try again.");
        } finally {
            setLoadingHints(false);
        }
    };

    const generateBestApproach = async () => {
        if (!question.problemStatement) return;

        setLoadingBestApproach(true);
        try {
            const response = await fetch(
                "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-goog-api-key": `${GEMINI_API_KEY}`, // Replace with your actual API key
                    },
                    body: JSON.stringify({
                        contents: [
                            {
                                parts: [
                                    {
                                        text: `Analyze this programming problem and provide the best approach solution. Follow this exact markdown template:

## Optimal Approach

[Brief explanation of the optimal approach and why it's the best]

## Algorithm Steps

1. [Step 1]
2. [Step 2]
3. [Step 3]
...

## Pseudocode

\`\`\`
[Language-independent pseudocode here]
\`\`\`

## Complexity Analysis

**Time Complexity:** O(?) - [Explanation]

**Space Complexity:** O(?) - [Explanation]

## Key Insights

- [Key insight 1]
- [Key insight 2]
- [Key insight 3]

---

**Problem:** ${question.problemStatement}`,
                                    },
                                ],
                            },
                        ],
                    }),
                }
            );

            const data = await response.json();
            if (data.candidates && data.candidates[0]) {
                setBestApproach(data.candidates[0].content.parts[0].text);
            }
        } catch (error) {
            console.error("Error generating best approach:", error);
            setBestApproach(
                "Error generating best approach. Please try again."
            );
        } finally {
            setLoadingBestApproach(false);
        }
    };

    const handleMouseDown = (e) => {
        setIsDragging(true);
        e.preventDefault();
    };

    const handleMouseMove = useCallback(
        (e) => {
            if (!isDragging) return;
            const windowWidth = window.innerWidth;
            const newLeftWidth = (e.clientX / windowWidth) * 100;
            const constrainedWidth = Math.min(Math.max(newLeftWidth, 20), 80);
            setLeftWidth(constrainedWidth);
        },
        [isDragging]
    );

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    React.useEffect(() => {
        if (isDragging) {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
            return () => {
                document.removeEventListener("mousemove", handleMouseMove);
                document.removeEventListener("mouseup", handleMouseUp);
            };
        }
    }, [isDragging, handleMouseMove]);

    const checkAuthStatus = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/api/auth/status`, {
                withCredentials: true, // send cookies/session
            });

            if (response.status === 200 && response.data.authenticated) {
                setIsLoggedIn(true);
                setUser(response.data.user); // Add this line
            } else {
                setIsLoggedIn(false);
                setUser(null); // Add this line
            }
        } catch (error) {
            console.error("Error checking auth status:", error);
            setIsLoggedIn(false);
            setUser(null); // Add this line
        }
    };

    useEffect(() => {
        setLoading(true);

        // ✅ Check auth status first
        checkAuthStatus();

        axios
            .get(`${BACKEND_URL}/api/questions/${id}`, {
                withCredentials: true,
            })
            .then((response) => {
                setQuestion(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    }, [id]); // ✅ keep id here

    // Define your tabs here
    const tabs = [
        { id: "question", label: "Question", icon: "❓" },
        { id: "discussion", label: "Discussion", icon: "💬" },
        { id: "submissions", label: "Submissions", icon: "✅" },
        { id: "hints", label: "Hints", icon: "💡" },
        { id: "bestapproach", label: "Best Approach", icon: "🎯" },
    ];

    // Tab content function - customize with your content
    const getTabContent = (tabId) => {
        switch (tabId) {
            case "question":
                return (
                    <div className="p-4">
                        {/* Your question content here */}
                        {questionContent}
                    </div>
                );
            case "hints":
                return (
                    <div className="p-4 h-full flex flex-col">
                        <div className="mb-4 flex-shrink-0">
                            <button
                                onClick={generateHints}
                                disabled={
                                    loadingHints || !question.problemStatement
                                }
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loadingHints
                                    ? "Bro's Thinking..."
                                    : "Bro! I Need Hints"}
                            </button>
                        </div>
                        {loadingHints && <Spinner />}
                        {hints && (
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex-1 overflow-y-auto">
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                                    Here You Go!
                                </h3>
                                <div className="text-gray-800 text-sm leading-relaxed break-words">
                                    <ReactMarkdown
                                        remarkPlugins={[remarkBreaks]}
                                        components={{
                                            h1: ({ children }) => (
                                                <h1 className="text-xl font-bold mb-3">
                                                    {children}
                                                </h1>
                                            ),
                                            h2: ({ children }) => (
                                                <h2 className="text-lg font-semibold mb-2">
                                                    {children}
                                                </h2>
                                            ),
                                            h3: ({ children }) => (
                                                <h3 className="text-md font-medium mb-2">
                                                    {children}
                                                </h3>
                                            ),
                                            p: ({ children }) => (
                                                <p className="mb-2">
                                                    {children}
                                                </p>
                                            ),
                                            ul: ({ children }) => (
                                                <ul className="list-disc ml-4 mb-2">
                                                    {children}
                                                </ul>
                                            ),
                                            ol: ({ children }) => (
                                                <ol className="list-decimal ml-4 mb-2">
                                                    {children}
                                                </ol>
                                            ),
                                            li: ({ children }) => (
                                                <li className="mb-1">
                                                    {children}
                                                </li>
                                            ),
                                            code: ({ children }) => (
                                                <code className="bg-gray-200 px-1 py-0.5 rounded text-xs font-mono">
                                                    {children}
                                                </code>
                                            ),
                                            pre: ({ children }) => (
                                                <pre className="bg-gray-200 p-2 rounded overflow-x-auto text-xs font-mono mb-2">
                                                    {children}
                                                </pre>
                                            ),
                                            br: () => <br />,
                                        }}
                                    >
                                        {hints}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        )}
                    </div>
                );
            case "discussion":
                return (
                    <div className="p-4">
                        <Discussion questionId={id} currentUser={user} />
                    </div>
                );
            case "submissions":
                return (
                    <div className="p-4">
                        <Submissions
                            questionId={id}
                            currentUser={user}
                            isActive={activeTab === "submissions"}
                        />
                    </div>
                );
            case "bestapproach":
                return (
                    <div className="p-4 h-full flex flex-col">
                        <div className="mb-4 flex-shrink-0">
                            <button
                                onClick={generateBestApproach}
                                disabled={
                                    loadingBestApproach ||
                                    !question.problemStatement
                                }
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loadingBestApproach
                                    ? "Bro's Thinking..."
                                    : "Bro! What's the Best Approach?"}
                            </button>
                        </div>
                        {loadingBestApproach && <Spinner />}
                        {bestApproach && (
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex-1 overflow-y-auto">
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                                    Here You Go!
                                </h3>
                                <div className="text-gray-800 text-sm leading-relaxed max-w-none break-words">
                                    <ReactMarkdown
                                        remarkPlugins={[remarkBreaks]}
                                        components={{
                                            h1: ({ children }) => (
                                                <h1 className="text-xl font-bold mb-3">
                                                    {children}
                                                </h1>
                                            ),
                                            h2: ({ children }) => (
                                                <h2 className="text-lg font-semibold mb-2">
                                                    {children}
                                                </h2>
                                            ),
                                            h3: ({ children }) => (
                                                <h3 className="text-md font-medium mb-2">
                                                    {children}
                                                </h3>
                                            ),
                                            p: ({ children }) => (
                                                <p className="mb-2">
                                                    {children}
                                                </p>
                                            ),
                                            ul: ({ children }) => (
                                                <ul className="list-disc ml-4 mb-2">
                                                    {children}
                                                </ul>
                                            ),
                                            ol: ({ children }) => (
                                                <ol className="list-decimal ml-4 mb-2">
                                                    {children}
                                                </ol>
                                            ),
                                            li: ({ children }) => (
                                                <li className="mb-1">
                                                    {children}
                                                </li>
                                            ),
                                            code: ({ children }) => (
                                                <code className="bg-gray-200 px-1 py-0.5 rounded text-xs font-mono">
                                                    {children}
                                                </code>
                                            ),
                                            pre: ({ children }) => (
                                                <pre className="bg-gray-200 p-2 rounded overflow-x-auto text-xs font-mono mb-2">
                                                    {children}
                                                </pre>
                                            ),
                                            br: () => <br />,
                                        }}
                                    >
                                        {bestApproach}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        )}
                    </div>
                );
            default:
                return <div className="p-4">Select a tab</div>;
        }
    };

    const questionContent = (
        // <div className="max-w-5xl mx-auto px-6 py-10 font-sans">
        <div className="max-w-5xl mx-auto px-2 py-2 font-sans">
            {loading ? (
                <Spinner />
            ) : (
                // <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 relative">
                <div>
                    {/* Title */}
                    <h1 className="text-3xl font-bold text-gray-900 mb-3">
                        {question.title}
                    </h1>

                    {/* Difficulty Pill */}
                    <div className="mb-4">
                        <span
                            className={`inline-block px-4 py-1 rounded-full text-sm font-semibold capitalize ${getDifficultyClasses(
                                question.difficulty
                            )}`}
                        >
                            {question.difficulty} level
                        </span>
                    </div>

                    {/* Topics */}
                    {question.topics?.length > 0 && (
                        <div className="mb-3">
                            <h2 className="text-lg font-semibold text-gray-700 mb-2">
                                Topics
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {question.topics.map((topic, idx) => (
                                    <span
                                        key={idx}
                                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium"
                                    >
                                        {topic}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Problem Statement */}
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-gray-700 mb-2">
                            Problem Statement
                        </h2>
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 whitespace-pre-line text-gray-800 font-mono text-sm leading-relaxed">
                            {question.problemStatement}
                        </div>
                    </div>

                    {/* Constraints */}
                    {question.constraints && (
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-gray-700 mb-2">
                                Constraints
                            </h2>
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 whitespace-pre-line text-gray-800 font-mono text-sm">
                                {question.constraints}
                            </div>
                        </div>
                    )}

                    {/* Examples */}
                    {question.examples?.length > 0 && (
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-gray-700 mb-2">
                                Examples
                            </h2>
                            <div className="space-y-4">
                                {question.examples.map((ex, i) => (
                                    <div
                                        key={i}
                                        className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-800 font-mono"
                                    >
                                        <p>
                                            <strong>Input:</strong> {ex.input}
                                        </p>
                                        <p>
                                            <strong>Output:</strong> {ex.output}
                                        </p>
                                        {ex.explanation && (
                                            <p>
                                                <strong>Explanation:</strong>{" "}
                                                {ex.explanation}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Footer Metadata */}
                    <div className="mt-10 flex justify-end">
                        <div className="text-sm text-gray-500 text-right space-y-1">
                            <p>
                                <span className="font-medium text-gray-600">
                                    Contributed by:
                                </span>{" "}
                                {question.author}
                            </p>
                            <p>
                                Created:{" "}
                                {new Date(question.createdAt).toLocaleString()}
                            </p>
                            <p>
                                Updated:{" "}
                                {new Date(question.updatedAt).toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div className="h-full flex flex-col">
            {/* Main Content */}
            {isLoggedIn ? (
                <div className="flex flex-1 min-h-0 mt-2">
                    {/* Left Half - Question Content (Individually Scrollable) */}

                    {/* <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-0 relative"> */}
                    {/* Guide div for perfect rrounder corner and shadows */}
                    {/* <div className="w-1/2 border-r border-gray-300 flex flex-col"> */}
                    <div
                        className="mr-1 rounded-2xl shadow-xl border border-gray-200 overflow-hidden flex flex-col"
                        style={{ width: `${leftWidth}%` }}
                    >
                        {/* Tab Navigation */}
                        <div className="flex border-b border-gray-200 bg-white flex-shrink-0">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                                        activeTab === tab.id
                                            ? "border-blue-500 text-blue-600 bg-blue-50"
                                            : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                                    }`}
                                >
                                    <span className="mr-2">{tab.icon}</span>
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content (Scrollable) */}
                        <div className="flex-1 overflow-y-auto">
                            {getTabContent(activeTab)}
                        </div>
                    </div>

                    {/* Resize Handle */}
                    <div
                        className={`w-1 bg-gray-300 hover:bg-blue-400 cursor-col-resize flex-shrink-0 ${
                            isDragging ? "bg-blue-500" : ""
                        }`}
                        onMouseDown={handleMouseDown}
                    />

                    {/* Right Half - Code Editor */}
                    <div
                        className="ml-1 rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
                        style={{ width: `${100 - leftWidth}%` }}
                    >
                        <LeetcodeCodeEditor question={question} />
                    </div>
                </div>
            ) : (
                <div className="flex-1 overflow-y-auto">
                    {getTabContent("question")}
                </div>
            )}
        </div>
    );
};

export default ShowQuestion;
