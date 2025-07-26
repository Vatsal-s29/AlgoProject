import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { BACKEND_URL } from "../../../config.js";
import DoubtResponse from "../../components/doubts/DoubtResponse";
import Spinner from "../../components/Spinner";
import { GEMINI_API_KEY } from "../../../config.js";

const DoubtDetail = ({ currentUser }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [doubt, setDoubt] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [responseContent, setResponseContent] = useState("");
    const [submittingResponse, setSubmittingResponse] = useState(false);
    const [resolvingDoubt, setResolvingDoubt] = useState(false);
    const [generatingAIResponse, setGeneratingAIResponse] = useState(false);

    useEffect(() => {
        fetchDoubt();
    }, [id]);

    const generateAIResponse = async () => {
        if (!doubt.content) return;

        setGeneratingAIResponse(true);
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
                                        text: `Provide a helpful response to this student's doubt in around 60 words. Be clear, concise, and educational:\n\nDoubt: ${doubt.content}`,
                                    },
                                ],
                            },
                        ],
                    }),
                }
            );

            const data = await response.json();
            if (data.candidates && data.candidates[0]) {
                // Convert markdown to plain text by removing markdown syntax
                const aiResponse = data.candidates[0].content.parts[0].text
                    .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold
                    .replace(/\*(.*?)\*/g, "$1") // Remove italic
                    .replace(/`(.*?)`/g, "$1") // Remove code backticks
                    .replace(/#{1,6}\s/g, "") // Remove headers
                    .replace(/^\s*[-*+]\s/gm, "• ") // Convert bullet points
                    .trim();

                setResponseContent(aiResponse);
            }
        } catch (error) {
            console.error("Error generating AI response:", error);
            setResponseContent(
                "Error generating AI response. Please try again."
            );
        } finally {
            setGeneratingAIResponse(false);
        }
    };

    const fetchDoubt = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${BACKEND_URL}/api/doubts/${id}`,
                {
                    withCredentials: true,
                }
            );

            const data = response.data;
            setDoubt(data.doubt);
            setError("");
        } catch (error) {
            if (error.response) {
                if (error.response.status === 404) {
                    setError("Doubt not found");
                } else if (error.response.status === 403) {
                    setError("You don't have permission to view this doubt");
                } else {
                    setError("Failed to fetch doubt");
                }
            } else {
                setError(error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleAddResponse = async (e) => {
        e.preventDefault();

        if (!responseContent.trim()) {
            return;
        }

        try {
            setSubmittingResponse(true);
            const response = await axios.post(
                `${BACKEND_URL}/api/doubts/${id}/responses`,
                { content: responseContent },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );

            const data = response.data;
            setDoubt(data.doubt);
            setResponseContent("");
        } catch (error) {
            if (error.response && error.response.data?.message) {
                setError(error.response.data.message);
            } else {
                setError(error.message);
            }
        } finally {
            setSubmittingResponse(false);
        }
    };

    const handleMarkAsResolved = async () => {
        try {
            setResolvingDoubt(true);
            const response = await axios.patch(
                `${BACKEND_URL}/api/doubts/${id}/resolve`,
                {},
                {
                    withCredentials: true,
                }
            );

            const data = response.data;
            setDoubt(data.doubt);
        } catch (error) {
            if (error.response && error.response.data?.message) {
                setError(error.response.data.message);
            } else {
                setError(error.message);
            }
        } finally {
            setResolvingDoubt(false);
        }
    };

    if (loading) {
        return <Spinner />;
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
                <button
                    onClick={() => navigate("/doubts")}
                    className="mt-4 text-blue-600 hover:text-blue-800"
                >
                    ← Back to Doubts
                </button>
            </div>
        );
    }

    if (!doubt) {
        return <div>Doubt not found</div>;
    }

    // const isOwnDoubt = currentUser && doubt.student._id === currentUser._id;
    const isOwnDoubt = currentUser && doubt.student._id === currentUser.id;
    const canRespond =
        currentUser &&
        (currentUser.isTeacher ||
            doubt.isPublic ||
            doubt.student._id === currentUser.id ||
            doubt.student._id === currentUser._id);
    const canResolve = currentUser && isOwnDoubt;
    const displayName = doubt.isAnonymous
        ? "Anonymous"
        : doubt.student.username;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-6">
                <Link
                    to="/doubts"
                    className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
                >
                    ← Back to Doubts
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
                {/* Doubt Header */}
                <div className="mb-6">
                    <div className="flex justify-between items-start mb-4">
                        <h1 className="text-3xl font-bold text-gray-800">
                            {doubt.title}
                        </h1>
                        <div className="flex gap-2">
                            <span
                                className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    doubt.isResolved
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                }`}
                            >
                                {doubt.isResolved ? "Resolved" : "Open"}
                            </span>
                            <span
                                className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    doubt.isPublic
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-gray-100 text-gray-800"
                                }`}
                            >
                                {doubt.isPublic ? "Public" : "Private"}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-2">
                            <span>Asked by {displayName}</span>
                            {doubt.student.isTeacher && (
                                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                                    Teacher
                                </span>
                            )}
                            <span>•</span>
                            <span>
                                {formatDistanceToNow(
                                    new Date(doubt.createdAt),
                                    { addSuffix: true }
                                )}
                            </span>
                        </div>

                        <div className="flex gap-2">
                            {isOwnDoubt && (
                                <Link
                                    to={`/doubts/edit/${doubt._id}`}
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    Edit
                                </Link>
                            )}
                            {canResolve && !doubt.isResolved && (
                                <button
                                    onClick={handleMarkAsResolved}
                                    disabled={resolvingDoubt}
                                    className="text-green-600 hover:text-green-800 disabled:text-green-400"
                                >
                                    {resolvingDoubt
                                        ? "Resolving..."
                                        : "Mark as Resolved"}
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="prose max-w-none">
                        <p className="text-gray-700 whitespace-pre-wrap">
                            {doubt.content}
                        </p>
                    </div>
                </div>

                {/* Responses Section */}
                <div className="border-t pt-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Responses ({doubt.responses.length})
                    </h2>

                    {doubt.responses.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">
                            No responses yet. Be the first to help!
                        </p>
                    ) : (
                        <div className="space-y-4 mb-6">
                            {doubt.responses.map((response) => (
                                <DoubtResponse
                                    key={response._id}
                                    response={response}
                                />
                            ))}
                        </div>
                    )}

                    {/* Add Response Form */}
                    {canRespond && (
                        <form onSubmit={handleAddResponse} className="mt-6">
                            <div className="mb-4">
                                <div className="flex justify-between items-center mb-2">
                                    <label
                                        htmlFor="response"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Add your response
                                    </label>
                                    <button
                                        type="button"
                                        onClick={generateAIResponse}
                                        disabled={generatingAIResponse}
                                        className="bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {generatingAIResponse
                                            ? "Generating..."
                                            : "AI Response"}
                                    </button>
                                </div>
                                <textarea
                                    id="response"
                                    value={responseContent}
                                    onChange={(e) =>
                                        setResponseContent(e.target.value)
                                    }
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Type your response here..."
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={
                                    submittingResponse ||
                                    !responseContent.trim()
                                }
                                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-md transition-colors"
                            >
                                {submittingResponse
                                    ? "Posting..."
                                    : "Post Response"}
                            </button>
                        </form>
                    )}

                    {!canRespond && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mt-6">
                            <p className="text-yellow-800">
                                This is a private doubt. Only the author and
                                teachers can respond.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DoubtDetail;
