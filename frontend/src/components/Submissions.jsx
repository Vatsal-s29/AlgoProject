import React, { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../config.js";
import Spinner from "./Spinner";

const Submissions = ({ questionId, currentUser, isActive }) => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState("all");
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        pages: 0,
    });

    useEffect(() => {
        if (questionId && currentUser) {
            fetchSubmissions();
        }
    }, [questionId, currentUser, pagination.page, filter]);

    // Refetch submissions when tab becomes active
    useEffect(() => {
        if (isActive && questionId && currentUser) {
            fetchSubmissions();
        }
    }, [isActive]);

    const fetchSubmissions = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `${BACKEND_URL}/api/submissions/question/${questionId}`,
                {
                    withCredentials: true,
                    params: {
                        page: pagination.page,
                        limit: pagination.limit,
                    },
                }
            );

            if (response.data.success) {
                setSubmissions(response.data.data.submissions);
                setPagination(response.data.data.pagination);
            }
        } catch (error) {
            console.error("Error fetching submissions:", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "accepted":
                return "text-green-600 bg-green-50 border-green-200";
            case "wrong_answer":
                return "text-red-600 bg-red-50 border-red-200";
            case "time_limit_exceeded":
                return "text-yellow-600 bg-yellow-50 border-yellow-200";
            case "memory_limit_exceeded":
                return "text-purple-600 bg-purple-50 border-purple-200";
            case "runtime_error":
                return "text-orange-600 bg-orange-50 border-orange-200";
            case "pending":
                return "text-blue-600 bg-blue-50 border-blue-200";
            default:
                return "text-gray-600 bg-gray-50 border-gray-200";
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case "accepted":
                return "Accepted";
            case "wrong_answer":
                return "Wrong Answer";
            case "time_limit_exceeded":
                return "Time Limit Exceeded";
            case "memory_limit_exceeded":
                return "Memory Limit Exceeded";
            case "runtime_error":
                return "Runtime Error";
            case "pending":
                return "Pending";
            default:
                return status;
        }
    };

    const filteredSubmissions = submissions.filter((submission) => {
        if (filter === "all") return true;
        if (filter === "successful") return submission.status === "accepted";
        if (filter === "unsuccessful") return submission.status !== "accepted";
        return true;
    });

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    const handlePageChange = (newPage) => {
        setPagination((prev) => ({ ...prev, page: newPage }));
    };

    if (!currentUser) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500">
                    Please log in to view submissions.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Filter Options */}
            <div className="flex space-x-2 border-b border-gray-200 pb-4">
                <button
                    onClick={() => setFilter("all")}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        filter === "all"
                            ? "bg-blue-100 text-blue-700 border border-blue-300"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                >
                    All
                </button>
                <button
                    onClick={() => setFilter("successful")}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        filter === "successful"
                            ? "bg-green-100 text-green-700 border border-green-300"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                >
                    Successful
                </button>
                <button
                    onClick={() => setFilter("unsuccessful")}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        filter === "unsuccessful"
                            ? "bg-red-100 text-red-700 border border-red-300"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                >
                    Unsuccessful
                </button>
            </div>

            {/* Loading State */}
            {loading ? (
                <div className="flex justify-center py-8">
                    <Spinner />
                </div>
            ) : (
                <>
                    {/* Submissions List */}
                    {filteredSubmissions.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500">
                                {filter === "all"
                                    ? "No submissions found for this question."
                                    : `No ${filter} submissions found.`}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredSubmissions.map((submission) => (
                                <div
                                    key={submission._id}
                                    className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center space-x-3">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                                                    submission.status
                                                )}`}
                                            >
                                                {getStatusText(
                                                    submission.status
                                                )}
                                            </span>
                                            <span className="text-sm text-gray-600 font-mono">
                                                {submission.language.toUpperCase()}
                                            </span>
                                        </div>
                                        <span className="text-sm text-gray-500">
                                            {formatDate(submission.createdAt)}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-2 gap-1 text-sm place-items-center">
                                        <div className="text-center">
                                            <span className="text-gray-600 text-sm mr-2">
                                                Test Cases:
                                            </span>
                                            <span className="font-bold text-green-600 text-lg">
                                                {submission.testCasesPassed}/
                                                {submission.totalTestCases}
                                            </span>
                                        </div>
                                        {submission.executionTime &&
                                            submission.executionTime > 0 && (
                                                <div className="text-center">
                                                    <span className="text-gray-600 text-sm mr-2">
                                                        Runtime:
                                                    </span>
                                                    <span className="font-bold text-black text-lg">
                                                        {
                                                            submission.executionTime
                                                        }
                                                        ms
                                                    </span>
                                                </div>
                                            )}

                                        {/* memory portion to be implemented later */}

                                        {/* {submission.memoryUsed &&
                                            submission.memoryUsed > 0 && (
                                                <div>
                                                    <span className="text-gray-600">
                                                        Memory:
                                                    </span>
                                                    <div className="font-medium">
                                                        {submission.memoryUsed}
                                                        KB
                                                    </div>
                                                </div>
                                            )} */}
                                    </div>

                                    {/* Code Preview */}
                                    <div className="mt-3 pt-3 border-t border-gray-100">
                                        <details className="group">
                                            <summary className="cursor-pointer text-sm text-blue-600 hover:text-blue-800 font-medium">
                                                View Code
                                            </summary>
                                            <div className="mt-2 bg-gray-50 border border-gray-200 rounded p-3">
                                                <pre className="text-xs font-mono text-gray-800 whitespace-pre-wrap overflow-x-auto">
                                                    {submission.code}
                                                </pre>
                                            </div>
                                        </details>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {pagination.pages > 1 && (
                        <div className="flex justify-center items-center space-x-2 mt-6">
                            <button
                                onClick={() =>
                                    handlePageChange(pagination.page - 1)
                                }
                                disabled={pagination.page === 1}
                                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>

                            <span className="text-sm text-gray-600">
                                Page {pagination.page} of {pagination.pages}
                            </span>

                            <button
                                onClick={() =>
                                    handlePageChange(pagination.page + 1)
                                }
                                disabled={pagination.page === pagination.pages}
                                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Submissions;
