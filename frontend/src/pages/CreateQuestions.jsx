import React, { useState } from "react";
import Spinner from "../components/Spinner";
import axios from "axios";
import slugify from "slugify";

import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { QUESTION_TOPICS } from "../utils/questionTopics";
import { BACKEND_URL } from "../../config";

// Placing it outside keeps the component clean and prevents it from being redefined on every render.
// It's a utility function that does not depend on any component state or hooks.
const checkTitleExists = async (title) => {
    try {
        const slug = slugify(title, { lower: true, strict: true });
        const res = await axios.get(
            `${BACKEND_URL}/api/questions/slug/${slug}`
        );
        return !!res?.data?.slug; // true → already exists
    } catch (err) {
        if (err.response?.status === 404) {
            // Slug not found = title available
            console.log(
                "✅ Do not worry about the above 404 err. Title is available. No existing question with this title."
            );
            return false;
        }

        // For other unexpected errors, fail safely but quietly
        console.warn("Could not verify title uniqueness due to an error.");
        return true; // assume taken to be safe
    }
};

// Validation function extracted for better readability
const validateFormData = async (formData, enqueueSnackbar) => {
    const {
        title,
        author,
        problemStatement,
        difficulty,
        constraints,
        examples,
        publicTestCases,
        hiddenTestCases,
    } = formData;

    // Check title
    if (!title.trim()) {
        enqueueSnackbar("Title is required.", { variant: "error" });
        return false;
    }

    // Check if title already exists
    const alreadyExists = await checkTitleExists(title);
    if (alreadyExists) {
        enqueueSnackbar("Title already exists. Choose a different one.", {
            variant: "error",
        });
        return false;
    }

    // checking author
    if (!author.trim()) {
        enqueueSnackbar("Author is required.", { variant: "error" });
        return false;
    }

    // checking problem statement
    if (!problemStatement.trim()) {
        enqueueSnackbar("Problem Statement is required.", { variant: "error" });
        return false;
    }

    // Check difficulty value is valid
    const validDifficulties = ["noob", "easy", "medium", "hard", "god"];
    if (!validDifficulties.includes(difficulty)) {
        enqueueSnackbar("Invalid difficulty level selected.", {
            variant: "error",
        });
        return false;
    }

    // Check constraints field (optional, but non-empty if filled)
    if (constraints && !constraints.trim()) {
        enqueueSnackbar("Constraints field cannot be just whitespace.", {
            variant: "error",
        });
        return false;
    }

    // Check examples count
    if (examples.length > 4) {
        enqueueSnackbar("You can provide maximum of 4 examples", {
            variant: "error",
        });
        return false;
    }

    // Check example fields are all filled
    for (const [i, ex] of examples.entries()) {
        if (!ex.input.trim() || !ex.output.trim() || !ex.explanation.trim()) {
            enqueueSnackbar(`Example ${i + 1} has empty fields.`, {
                variant: "error",
            });
            return false;
        }
    }

    // Check public test cases: 1–5 count
    if (publicTestCases.length < 1 || publicTestCases.length > 5) {
        enqueueSnackbar("You must provide between 1 and 5 public test cases.", {
            variant: "error",
        });
        return false;
    }

    // Check public test case fields
    for (const [i, tc] of publicTestCases.entries()) {
        if (!tc.input.trim() || !tc.output.trim()) {
            enqueueSnackbar(`Public Test Case ${i + 1} is incomplete.`, {
                variant: "error",
            });
            return false;
        }
    }

    // Check hidden test case fields
    for (const [i, tc] of hiddenTestCases.entries()) {
        if (!tc.input.trim() || !tc.output.trim()) {
            enqueueSnackbar(`Hidden Test Case ${i + 1} is incomplete.`, {
                variant: "error",
            });
            return false;
        }
    }

    return true;
};

// Error Boundary Component (by claude)
// * learn more about it.
class FormErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Form error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-4 text-center">
                    <h2 className="text-xl text-red-600 mb-2">
                        Something went wrong
                    </h2>
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                        onClick={() => this.setState({ hasError: false })}
                    >
                        Try again
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

// This component is responsible for creating a new coding question.
const CreateQuestions = () => {
    // Basic form fields
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [problemStatement, setProblemStatement] = useState("");
    const [difficulty, setDifficulty] = useState("easy");
    const [topics, setTopics] = useState([]);

    // New fields added to match the Mongoose model
    const [examples, setExamples] = useState([]); // no example by default
    const [publicTestCases, setPublicTestCases] = useState([
        { input: "", output: "" },
    ]);
    const [hiddenTestCases, setHiddenTestCases] = useState([]); // empty initially
    const [constraints, setConstraints] = useState("");

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    // Handler to save the question (triggered on submit)
    const handleSaveQuestion = async () => {
        if (loading) return; // prevent duplicate triggers

        const formData = {
            title,
            author,
            problemStatement,
            difficulty,
            constraints,
            examples,
            publicTestCases,
            hiddenTestCases,
            topics,
        };

        // Validate form data
        const isValid = await validateFormData(formData, enqueueSnackbar);
        if (!isValid) return;

        setLoading(true); // after all validations are done, then only do this

        // All checks passed, send request
        const data = {
            title,
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
            await axios.post(`${BACKEND_URL}/api/questions`, data);
            enqueueSnackbar("Question Created successfully", {
                variant: "success",
            });
            navigate("/");
        } catch (error) {
            const msg =
                error?.response?.data?.message ||
                "An error occurred while creating the question.";
            enqueueSnackbar(msg, { variant: "error" });
            console.error(error);
        } finally {
            setLoading(false); // always unset
        }
    };

    // Render labeled test cases dynamically with optional max count
    const renderTestCasesAndExamples = (
        labelPrefix,
        cases,
        setCases,
        maxCount,
        labelFields = ["input", "output"]
    ) => {
        const handleDelete = (indexToDelete) => {
            const updated = cases.filter((_, i) => i !== indexToDelete);
            setCases(updated);
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
                                <label
                                    htmlFor={`${labelPrefix}-${field}-${index}`}
                                    className="block text-sm font-medium text-gray-700 mb-2 capitalize"
                                >
                                    {field}
                                </label>
                                <textarea
                                    id={`${labelPrefix}-${field}-${index}`}
                                    placeholder={`Enter ${field}`}
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
        <FormErrorBoundary>
            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-white rounded-lg shadow-md p-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">
                        Create Question
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
                                Title *
                            </label>
                            <input
                                type="text"
                                placeholder="Enter title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        {/* Author */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Author *
                            </label>
                            <input
                                type="text"
                                placeholder="Can write 'Anonymous' or a different 'Pen Name'"
                                value={author}
                                onChange={(e) => setAuthor(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        {/* Problem Statement */}
                        <div>
                            <label
                                htmlFor="problem-statement"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Problem Statement *
                            </label>
                            <textarea
                                id="problem-statement"
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
                            <label
                                htmlFor="constraints"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Constraints
                            </label>
                            <textarea
                                id="constraints"
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
                                {["noob", "easy", "medium", "hard", "god"].map(
                                    (level) => (
                                        <option key={level} value={level}>
                                            {level.charAt(0).toUpperCase() +
                                                level.slice(1)}
                                        </option>
                                    )
                                )}
                            </select>
                        </div>

                        {/* Topics Selection (Max 3) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Topics (max 3) *
                            </label>
                            <div className="flex flex-wrap gap-4 mt-2">
                                {QUESTION_TOPICS.map((topic) => {
                                    const inputId = `topic-${topic}`;
                                    const isDisabled =
                                        !topics.includes(topic) &&
                                        topics.length >= 3;

                                    return (
                                        <label
                                            key={topic}
                                            className={`flex items-center space-x-2 ${
                                                isDisabled
                                                    ? "opacity-50 cursor-not-allowed"
                                                    : "cursor-pointer"
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                id={inputId}
                                                value={topic}
                                                checked={topics.includes(topic)}
                                                disabled={isDisabled}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        if (topics.length < 3) {
                                                            setTopics([
                                                                ...topics,
                                                                topic,
                                                            ]);
                                                        } else {
                                                            enqueueSnackbar(
                                                                "You can only select up to 3 topics",
                                                                {
                                                                    variant:
                                                                        "warning",
                                                                }
                                                            );
                                                        }
                                                    } else {
                                                        setTopics(
                                                            topics.filter(
                                                                (t) =>
                                                                    t !== topic
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
                                    • Provide clear and detailed problem
                                    statements
                                </li>
                                <li>
                                    • Include relevant constraints and examples
                                </li>
                                <li>
                                    • Select appropriate difficulty level and
                                    topics
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
                                onClick={handleSaveQuestion}
                                disabled={loading}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 px-4 rounded-md transition-colors"
                            >
                                {loading ? "Saving..." : "Create Question"}
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
        </FormErrorBoundary>
    );
};

export default CreateQuestions;
