import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import BackButton from "../components/BackButton";
import Spinner from "../components/Spinner";
import getDifficultyClasses from "../utils/getDifficultyClasses";

const ShowQuestion = () => {
    const [question, setQuestion] = useState({});
    const [loading, setLoading] = useState(false);
    const { id } = useParams();

    useEffect(() => {
        setLoading(true);
        axios
            .get(`http://localhost:5555/questions/${id}`)
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
            <BackButton />
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
                    <div className="mb-10">
                        <h2 className="text-lg font-semibold text-gray-700 mb-2">
                            Problem Statement
                        </h2>
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 whitespace-pre-line text-gray-800 font-mono text-sm leading-relaxed">
                            {question.problemStatement}
                        </div>
                    </div>

                    {/* Footer Metadata (bottom right, but within flow) */}
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
