import React, { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "../components/Spinner";
import { Link } from "react-router-dom";
import { AiOutlineEdit } from "react-icons/ai";
import { BsInfoCircle } from "react-icons/bs";
import { MdOutlineAddBox, MdOutlineDelete } from "react-icons/md";
import QuestionsTable from "../components/home/QuestionsTable";
import QuestionsCard from "../components/home/QuestionsCard";
import { BACKEND_URL } from "../../config";
import { QUESTION_TOPICS } from "../utils/questionTopics";

const Home = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showType, setShowType] = useState("table");

    const [page, setPage] = useState(1);
    const [limit] = useState(10); // ? Setting the number of questions to be displayed per page
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [difficulty, setDifficulty] = useState("all");
    const [status, setStatus] = useState("all"); // curruntly useless
    const [topic, setTopic] = useState("all");

    useEffect(() => {
        setLoading(true);

        axios
            .get(`${BACKEND_URL}/api/questions`, {
                params: {
                    page,
                    limit,
                    search: searchQuery,
                    difficulty: difficulty !== "all" ? difficulty : undefined,
                    topic: topic !== "all" ? topic : undefined,
                },
                withCredentials: true, // ✅ This is the key addition
            })
            .then((res) => {
                setQuestions(res.data.data);
                setTotalPages(res.data.totalPages);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, [page, searchQuery, difficulty, topic]);

    return (
        <div className="p-4">
            {/* Header and Add button */}
            <div className="flex justify-between items-center">
                <h1 className="text-3xl my-8">Questions List</h1>
                <Link to="/questions/create">
                    <MdOutlineAddBox className="text-sky-800 text-4xl" />
                </Link>
            </div>

            {/* Filter/Search Bar + View Toggle */}
            <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                {/* Search */}
                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                        Search Problems
                    </label>
                    <input
                        className="w-full px-4 py-2 rounded-lg border transition-all duration-300 bg-white border-gray-300 text-gray-800 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        placeholder="Problem name or Topic or Author"
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setPage(1);
                        }}
                    />
                </div>

                {/* Difficulty */}
                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                        Difficulty
                    </label>
                    <select
                        value={difficulty}
                        onChange={(e) => {
                            setDifficulty(e.target.value);
                            setPage(1); // reset to page 1 when filters change
                        }}
                        className="w-full px-4 py-2 rounded-lg border transition-all duration-300 bg-white border-gray-300 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    >
                        <option value="all">All Difficulties</option>
                        <option value="noob">Noob</option>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                        <option value="god">God</option>
                    </select>
                </div>

                {/* Status (currently useless) */}
                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                        Status
                    </label>
                    <select className="w-full px-4 py-2 rounded-lg border transition-all duration-300 bg-white border-gray-300 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
                        <option value="all">All Problems</option>
                        <option value="solved">Solved</option>
                        <option value="attempted">Attempted</option>
                        <option value="unsolved">Unsolved</option>
                    </select>
                </div>

                {/* Topic */}
                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                        Topic
                    </label>
                    <select
                        value={topic}
                        onChange={(e) => {
                            setTopic(e.target.value);
                            setPage(1); // reset to page 1 when filters change
                        }}
                        className="w-full px-4 py-2 rounded-lg border transition-all duration-300 bg-white border-gray-300 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    >
                        <option value="all">All Topics</option>
                        {QUESTION_TOPICS.map((topic) => (
                            <option key={topic} value={topic}>
                                {topic.charAt(0).toUpperCase() + topic.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>

                {/* clear filter button and toggle view */}
                <div className="flex justify-between items-end gap-2 w-full">
                    {/* clear filter button */}
                    <div>
                        <button
                            onClick={() => {
                                setSearchQuery("");
                                setDifficulty("all");
                                setTopic("all");
                                setPage(1);
                            }}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                        >
                            Clear Filters
                        </button>
                    </div>

                    {/* View Switch */}
                    <div className="flex gap-2 justify-end">
                        <button
                            className={`p-2 transition-colors duration-200 ${
                                showType === "card"
                                    ? "bg-blue-600 text-gray-800"
                                    : "text-gray-500 hover:text-gray-800"
                            }`}
                            onClick={() => setShowType("card")}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-grid-3x3 w-4 h-4"
                            >
                                <rect
                                    width="18"
                                    height="18"
                                    x="3"
                                    y="3"
                                    rx="2"
                                />
                                <path d="M3 9h18" />
                                <path d="M3 15h18" />
                                <path d="M9 3v18" />
                                <path d="M15 3v18" />
                            </svg>
                        </button>
                        <button
                            className={`p-2 transition-colors duration-200 ${
                                showType === "table"
                                    ? "bg-blue-600 text-gray-800"
                                    : "text-gray-500 hover:text-gray-800"
                            }`}
                            onClick={() => setShowType("table")}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-list w-4 h-4"
                            >
                                <path d="M3 12h.01" />
                                <path d="M3 18h.01" />
                                <path d="M3 6h.01" />
                                <path d="M8 12h13" />
                                <path d="M8 18h13" />
                                <path d="M8 6h13" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {loading ? (
                <Spinner />
            ) : showType === "table" ? (
                <QuestionsTable questions={questions} />
            ) : (
                <QuestionsCard questions={questions} />
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => setPage(i + 1)}
                            className={`px-3 py-1 rounded ${
                                page === i + 1
                                    ? "bg-sky-500 text-white"
                                    : "bg-gray-200 text-gray-700"
                            }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Home;
