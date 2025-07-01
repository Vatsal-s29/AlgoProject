import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import BackButton from "../components/BackButton";
import Spinner from "../components/Spinner";
import getDifficultyClasses from "../utils/getDifficultyClasses";
import { BACKEND_URL } from "../../config";

const ShowQuestion = () => {
    const [question, setQuestion] = useState({});
    const [loading, setLoading] = useState(false);
    const { id } = useParams();

    useEffect(() => {
        setLoading(true);
        axios
            .get(`${BACKEND_URL}/questions/${id}`)
            .then((response) => {
                setQuestion(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    }, []);

    return (
        <div className="max-w-5xl mx-auto px-6 py-10 font-sans">
            {loading ? (
                <Spinner />
            ) : (
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 relative">
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
                    {question.publicTestCases?.length > 0 && (
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
                    )}

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
};

export default ShowQuestion;
