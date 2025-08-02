import React, { useState, useEffect } from "react";
import Spinner from "../components/Spinner";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { QUESTION_TOPICS } from "../utils/questionTopics";
import { BACKEND_URL } from "../../config";

const EditQuestion = () => {
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [problemStatement, setProblemStatement] = useState("");
    const [difficulty, setDifficulty] = useState("easy");
    const [topics, setTopics] = useState([]);
    const [constraints, setConstraints] = useState("");
    const [examples, setExamples] = useState([]);
    const [publicTestCases, setPublicTestCases] = useState([]);
    const [hiddenTestCases, setHiddenTestCases] = useState([]);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { id } = useParams();
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        setLoading(true);
        axios
            .get(`${BACKEND_URL}/api/questions/${id}`)
            .then((res) => {
                const data = res.data;
                setTitle(data.title);
                setAuthor(data.author || "");
                setProblemStatement(data.problemStatement || "");
                setDifficulty(data.difficulty || "easy");
                setTopics(data.topics || []);
                setConstraints(data.constraints || "");
                setExamples(data.examples || []);
                setPublicTestCases(data.publicTestCases || []);
                setHiddenTestCases(data.hiddenTestCases || []);
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
                enqueueSnackbar("Failed to load question.", {
                    variant: "error",
                });
                console.error(err);
            });
    }, [id]);

    const handleUpdate = async () => {
        if (topics.length > 3) {
            enqueueSnackbar("You can only select up to 3 topics", {
                variant: "error",
            });
            return;
        }

        if (!author.trim() || !problemStatement.trim()) {
            enqueueSnackbar("Author and Problem Statement are required.", {
                variant: "error",
            });
            return;
        }

        if (constraints && !constraints.trim()) {
            enqueueSnackbar("Constraints cannot be just whitespace.", {
                variant: "error",
            });
            return;
        }

        if (examples.length > 4) {
            enqueueSnackbar("Maximum 4 examples allowed.", {
                variant: "error",
            });
            return;
        }

        for (const [i, ex] of examples.entries()) {
            if (
                !ex.input.trim() ||
                !ex.output.trim() ||
                !ex.explanation.trim()
            ) {
                enqueueSnackbar(`Example ${i + 1} is incomplete.`, {
                    variant: "error",
                });
                return;
            }
        }

        if (publicTestCases.length < 1 || publicTestCases.length > 5) {
            enqueueSnackbar("Public test cases must be between 1 and 5.", {
                variant: "error",
            });
            return;
        }

        for (const [i, tc] of publicTestCases.entries()) {
            if (!tc.input.trim() || !tc.output.trim()) {
                enqueueSnackbar(`Public Test Case ${i + 1} is incomplete.`, {
                    variant: "error",
                });
                return;
            }
        }

        for (const [i, tc] of hiddenTestCases.entries()) {
            if (!tc.input.trim() || !tc.output.trim()) {
                enqueueSnackbar(`Hidden Test Case ${i + 1} is incomplete.`, {
                    variant: "error",
                });
                return;
            }
        }

        const data = {
            author,
            problemStatement,
            difficulty,
            topics,
            constraints,
            examples,
            publicTestCases,
            hiddenTestCases,
        };

        try {
            setLoading(true);
            await axios.put(`${BACKEND_URL}/api/questions/${id}`, data);
            enqueueSnackbar("Question updated successfully!", {
                variant: "success",
            });
            navigate("/");
        } catch (err) {
            enqueueSnackbar(err?.response?.data?.message || "Update failed.", {
                variant: "error",
            });
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    const renderTestCasesAndExamples = (
        labelPrefix,
        cases,
        setCases,
        maxCount,
        labelFields = ["input", "output"]
    ) => {
        const handleDelete = (indexToDelete) => {
            setCases(cases.filter((_, i) => i !== indexToDelete));
        };

        return (
            <div className="space-y-4">
                {cases.map((tc, index) => (
                    <div
                        key={index}
                        className="relative bg-gray-50 border border-gray-200 rounded-md p-4 space-y-4"
                    >
                        <div className="flex justify-between items-center">
                            <p className="font-medium text-gray-700">
                                {labelPrefix} {index + 1}
                            </p>
                            <button
                                className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 text-sm rounded-md transition-colors"
                                onClick={() => handleDelete(index)}
                                type="button"
                            >
                                Delete
                            </button>
                        </div>

                        {labelFields.map((field) => (
                            <div key={field}>
                                <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                                    {field}
                                </label>
                                <textarea
                                    value={tc[field]}
                                    onChange={(e) => {
                                        const updated = [...cases];
                                        updated[index][field] = e.target.value;
                                        setCases(updated);
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y min-h-[80px] font-mono"
                                />
                            </div>
                        ))}
                    </div>
                ))}

                {cases.length < maxCount && (
                    <button
                        onClick={() =>
                            setCases([
                                ...cases,
                                labelFields.reduce((obj, field) => {
                                    obj[field] = "";
                                    return obj;
                                }, {}),
                            ])
                        }
                        className="bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded-md transition-colors"
                        type="button"
                    >
                        + Add {labelPrefix}
                    </button>
                )}
            </div>
        );
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-md p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">
                    Edit Question
                </h1>

                {loading && (
                    <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-6">
                        Loading...
                    </div>
                )}

                <form className="space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Title
                        </label>
                        <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600">
                            {title}
                            <span className="text-sm italic ml-2">
                                (cannot be edited)
                            </span>
                        </div>
                    </div>

                    {/* Author */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Author *
                        </label>
                        <input
                            type="text"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter author name"
                            required
                        />
                    </div>

                    {/* Problem Statement */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Problem Statement *
                        </label>
                        <textarea
                            value={problemStatement}
                            onChange={(e) =>
                                setProblemStatement(e.target.value)
                            }
                            rows={6}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter the problem statement here..."
                            required
                        />
                    </div>

                    {/* Constraints */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Constraints
                        </label>
                        <textarea
                            value={constraints}
                            onChange={(e) => setConstraints(e.target.value)}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., 1 ≤ n ≤ 10⁹"
                        />
                    </div>

                    {/* Difficulty */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Difficulty *
                        </label>
                        <select
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            {["basic", "easy", "medium", "hard", "god"].map(
                                (d) => (
                                    <option key={d} value={d}>
                                        {d.charAt(0).toUpperCase() + d.slice(1)}
                                    </option>
                                )
                            )}
                        </select>
                    </div>

                    {/* Topics */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Topics (max 3) *
                        </label>
                        <div className="flex flex-wrap gap-4 mt-2">
                            {QUESTION_TOPICS.map((topic) => {
                                const disabled =
                                    !topics.includes(topic) &&
                                    topics.length >= 3;
                                return (
                                    <label
                                        key={topic}
                                        className={`flex items-center space-x-2 ${
                                            disabled
                                                ? "opacity-50 cursor-not-allowed"
                                                : "cursor-pointer"
                                        }`}
                                    >
                                        <input
                                            type="checkbox"
                                            value={topic}
                                            checked={topics.includes(topic)}
                                            disabled={disabled}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    if (topics.length < 3) {
                                                        setTopics([
                                                            ...topics,
                                                            topic,
                                                        ]);
                                                    }
                                                } else {
                                                    setTopics(
                                                        topics.filter(
                                                            (t) => t !== topic
                                                        )
                                                    );
                                                }
                                            }}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <span className="text-sm text-gray-700">
                                            {topic}
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    {/* Examples */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-4">
                            Examples
                        </label>
                        {renderTestCasesAndExamples(
                            "Example",
                            examples,
                            setExamples,
                            4,
                            ["input", "output", "explanation"]
                        )}
                    </div>

                    {/* Public Test Cases */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-4">
                            Public Test Cases
                        </label>
                        {renderTestCasesAndExamples(
                            "Public Test Case",
                            publicTestCases,
                            setPublicTestCases,
                            5
                        )}
                    </div>

                    {/* Hidden Test Cases */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-4">
                            Hidden Test Cases
                        </label>
                        {renderTestCasesAndExamples(
                            "Hidden Test Case",
                            hiddenTestCases,
                            setHiddenTestCases,
                            Infinity
                        )}
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                        <h3 className="font-medium text-blue-800 mb-2">
                            Question Guidelines:
                        </h3>
                        <ul className="text-sm text-blue-700 space-y-1">
                            <li>
                                • Provide clear and detailed problem statements
                            </li>
                            <li>• Include relevant constraints and examples</li>
                            <li>
                                • Select appropriate difficulty level and topics
                            </li>
                            <li>
                                • Add sufficient test cases for proper
                                evaluation
                            </li>
                        </ul>
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={handleUpdate}
                            disabled={loading}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 px-4 rounded-md transition-colors"
                        >
                            {loading ? "Saving..." : "Update Question"}
                        </button>
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditQuestion;
