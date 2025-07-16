import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import getDifficultyClasses from "../utils/getDifficultyClasses";
import { BACKEND_URL } from "../../config";
import LeetcodeCodeEditor from "../components/LeetcodeCodeEditor"; // adjust path as needed

const ShowQuestion = () => {
    const [question, setQuestion] = useState({});
    const [loading, setLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [activeTab, setActiveTab] = useState("question");
    const { id } = useParams();

    const [leftWidth, setLeftWidth] = useState(50);
    const [isDragging, setIsDragging] = useState(false);

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
            } else {
                setIsLoggedIn(false);
            }
        } catch (error) {
            console.error("Error checking auth status:", error);
            setIsLoggedIn(false);
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
        { id: "hints", label: "Hints", icon: "💡" },
        { id: "discussion", label: "Discussion", icon: "💬" },
        { id: "solutions", label: "Solutions", icon: "✅" },
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
                    <div className="p-4">
                        {/* Your hints content here */}
                        <h1>Hints Content</h1>
                    </div>
                );
            case "discussion":
                return (
                    <div className="p-4">
                        {/* Your discussion content here */}
                        <h1>Discussion Content</h1>
                    </div>
                );
            case "solutions":
                return (
                    <div className="p-4">
                        {/* Your solutions content here */}
                        <h1>Solutions Content</h1>
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

                    {/* Public Test Cases */}
                    {/* {question.publicTestCases?.length > 0 && (
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-gray-700 mb-2">
                                Public Test Cases
                            </h2>
                            <div className="space-y-2 text-sm font-mono text-gray-800">
                                {question.publicTestCases.map((tc, i) => (
                                    <div
                                        key={i}
                                        className="bg-gray-100 p-3 rounded border border-gray-200"
                                    >
                                        <p>
                                            <strong>Input:</strong> {tc.input}
                                        </p>
                                        <p>
                                            <strong>Output:</strong> {tc.output}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )} */}

                    {/* Hidden Test Cases */}
                    {/* hidden hai na bhai..nahi dikhana */}
                    {/* {question.hiddenTestCases?.length > 0 && (
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-gray-700 mb-2">
                                Hidden Test Cases
                            </h2>
                            <div className="space-y-2 text-sm font-mono text-gray-800">
                                {question.hiddenTestCases.map((tc, i) => (
                                    <div
                                        key={i}
                                        className="bg-gray-100 p-3 rounded border border-gray-200"
                                    >
                                        <p>
                                            <strong>Input:</strong> {tc.input}
                                        </p>
                                        <p>
                                            <strong>Output:</strong> {tc.output}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )} */}

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
            {/* Login Toggle Button */}
            {/* <div className="w-full text-right my-2 flex-shrink-0">
                <button
                    onClick={() => setIsLoggedIn(!isLoggedIn)}
                    className={`px-4 py-2 rounded-lg text-white font-medium ${
                        isLoggedIn
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-red-600 hover:bg-red-700"
                    }`}
                >
                    {isLoggedIn ? "Logged In" : "Logged Out"}
                </button>
            </div> */}

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
