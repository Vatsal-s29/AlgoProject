import React, { useState } from "react";
import BackButton from "../components/BackButton";
import Spinner from "../components/Spinner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { QUESTION_TOPICS } from "../utils/questionTopics";

const CreateQuestions = () => {
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [problemStatement, setProblemStatement] = useState("");
    const [difficulty, setDifficulty] = useState("easy");
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const handleSaveQuestion = () => {
        if (topics.length > 3) {
            enqueueSnackbar("You can only select up to 3 topics", {
                variant: "warning",
            });
            return;
        }

        const data = {
            title,
            author,
            problemStatement,
            difficulty,
            topics,
        };

        setLoading(true);
        axios
            .post("http://localhost:5555/questions", data)
            .then(() => {
                setLoading(false);
                enqueueSnackbar("Question Created successfully", {
                    variant: "success",
                });
                navigate("/");
            })
            .catch((error) => {
                setLoading(false);
                // alert('An error happened. Please Chack console');
                enqueueSnackbar("Error", { variant: "error" });
                console.log(error);
            });
    };

    return (
        <div className="p-4">
            <BackButton />
            <h1 className="text-3xl my-4">Create Question</h1>
            {loading ? <Spinner /> : ""}
            <div className="flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto">
                <div className="my-4">
                    <label className="text-xl mr-4 text-gray-500">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="border-2 border-gray-500 px-4 py-2 w-full"
                    />
                </div>
                <div className="my-4">
                    <label className="text-xl mr-4 text-gray-500">Author</label>
                    <input
                        type="text"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        className="border-2 border-gray-500 px-4 py-2  w-full "
                    />
                </div>
                <div className="my-4">
                    <label className="text-xl mr-4 text-gray-500">
                        Problem Statement
                    </label>
                    <input
                        type="text"
                        value={problemStatement}
                        onChange={(e) => setProblemStatement(e.target.value)}
                        className="border-2 border-gray-500 px-4 py-2  w-full "
                    />
                </div>
                <div className="my-4">
                    <label className="text-xl mr-4 text-gray-500">
                        Difficulty
                    </label>
                    <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                        className="border-2 border-gray-500 px-4 py-2 w-full"
                    >
                        {["noob", "easy", "medium", "hard", "god"].map(
                            (level) => (
                                <option key={level} value={level}>
                                    {level}
                                </option>
                            )
                        )}
                    </select>
                </div>
                <div className="my-4">
                    <label className="text-xl mr-4 text-gray-500">
                        Topics (max 3)
                    </label>
                    <div className="flex flex-wrap gap-4 mt-2">
                        {QUESTION_TOPICS.map((topic) => (
                            <label
                                key={topic}
                                className="flex items-center space-x-2"
                            >
                                <input
                                    type="checkbox"
                                    value={topic}
                                    checked={topics.includes(topic)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            if (topics.length < 3) {
                                                setTopics([...topics, topic]);
                                            } else {
                                                enqueueSnackbar(
                                                    "You can only select up to 3 topics",
                                                    {
                                                        variant: "warning",
                                                    }
                                                );
                                            }
                                        } else {
                                            setTopics(
                                                topics.filter(
                                                    (t) => t !== topic
                                                )
                                            );
                                        }
                                    }}
                                />
                                <span>{topic}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <button
                    className="p-2 bg-sky-300 m-8"
                    onClick={handleSaveQuestion}
                >
                    Save
                </button>
            </div>
        </div>
    );
};

export default CreateQuestions;
