// QuestionSingleCard.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineEdit } from "react-icons/ai";
import { MdOutlineDelete } from "react-icons/md";
import QuestionModal from "./QuestionModal";
import getDifficultyClasses from "../../utils/getDifficultyClasses";

const QuestionSingleCard = ({ question, questionNumber, user }) => {
    const [showModal, setShowModal] = useState(false);
    const isTeacher = user?.isTeacher || false;

    return (
        <div
            className={`rounded-xl p-4 shadow hover:bg-gray-50 hover:shadow-lg transition-shadow duration-300 bg-white relative ${
                isTeacher ? "h-40" : "h-36"
            } flex flex-col`}
        >
            {/* Question Number and Title on same line */}
            <div className="flex items-start gap-3 mb-3">
                <button
                    onClick={() => setShowModal(true)}
                    className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer font-bold text-lg flex-shrink-0"
                    title="Quick View"
                >
                    {questionNumber}.
                </button>
                <Link
                    to={`/questions/details/${question._id}`}
                    className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer flex-grow"
                    title="View Details"
                >
                    <h2 className="text-lg font-semibold text-gray-900 line-clamp-2">
                        {question.title}
                    </h2>
                </Link>
            </div>

            {/* Difficulty */}
            <div className="mb-3">
                <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${getDifficultyClasses(
                        question.difficulty
                    )}`}
                >
                    {question.difficulty}
                </span>
            </div>

            {/* Topics */}
            <div className="flex flex-wrap gap-2 mb-2 flex-grow items-start">
                {question.topics?.map((topic, idx) => (
                    <span
                        key={idx}
                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium flex-shrink-0"
                    >
                        {topic}
                    </span>
                ))}
            </div>

            {/* Action icons - only edit/delete for teachers */}
            <div className="flex justify-end gap-2 mt-auto">
                {isTeacher && (
                    <>
                        <Link to={`/questions/edit/${question._id}`}>
                            <AiOutlineEdit
                                className="text-xl text-yellow-600 hover:text-yellow-800"
                                title="Edit"
                            />
                        </Link>
                        <Link to={`/questions/delete/${question._id}`}>
                            <MdOutlineDelete
                                className="text-xl text-red-600 hover:text-red-800"
                                title="Delete"
                            />
                        </Link>
                    </>
                )}
            </div>

            {/* Modal for quick view */}
            {showModal && (
                <QuestionModal
                    question={question}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    );
};

export default QuestionSingleCard;

// import { useState } from "react";
// import { Link } from "react-router-dom";
// import { PiBookOpenTextLight } from "react-icons/pi";
// import { BiShow } from "react-icons/bi";
// import { AiOutlineEdit } from "react-icons/ai";
// import { BsInfoCircle } from "react-icons/bs";
// import { MdOutlineDelete } from "react-icons/md";
// import QuestionModal from "./QuestionModal";
// import getDifficultyClasses from "../../utils/getDifficultyClasses";

// const QuestionSingleCard = ({ question }) => {
//     const [showModal, setShowModal] = useState(false);

//     return (
//         <div className="border border-gray-300 rounded-xl p-3 shadow-sm hover:shadow-lg transition-shadow duration-300 bg-white relative">
//             {/* Title */}
//             <div className="flex items-center gap-2 mb-2">
//                 <PiBookOpenTextLight className="text-red-400 text-xl" />
//                 <h2 className="text-lg font-semibold text-gray-900">
//                     {question.title}
//                 </h2>
//             </div>

//             {/* Difficulty + Topics */}
//             <div className="flex flex-wrap items-center gap-2 mb-4">
//                 <span
//                     className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${getDifficultyClasses(
//                         question.difficulty
//                     )}`}
//                 >
//                     {question.difficulty}
//                 </span>
//                 {question.topics?.map((topic, idx) => (
//                     <span
//                         key={idx}
//                         className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium"
//                     >
//                         {topic}
//                     </span>
//                 ))}
//             </div>

//             {/* Action icons */}
//             <div className="flex justify-end gap-2 mt-2">
//                 <BiShow
//                     className="text-xl text-blue-800 hover:text-black cursor-pointer"
//                     onClick={() => setShowModal(true)}
//                     title="Quick View"
//                 />

//                 <Link to={`/questions/details/${question._id}`}>
//                     <BsInfoCircle
//                         className="text-xl text-green-800 hover:text-black"
//                         title="Details"
//                     />
//                 </Link>

//                 <Link to={`/questions/edit/${question._id}`}>
//                     <AiOutlineEdit
//                         className="text-xl text-yellow-600 hover:text-black"
//                         title="Edit"
//                     />
//                 </Link>

//                 <Link to={`/questions/delete/${question._id}`}>
//                     <MdOutlineDelete
//                         className="text-xl text-red-600 hover:text-black"
//                         title="Delete"
//                     />
//                 </Link>
//             </div>

//             {/* Modal for quick view */}
//             {showModal && (
//                 <QuestionModal
//                     question={question}
//                     onClose={() => setShowModal(false)}
//                 />
//             )}
//         </div>
//     );
// };

// export default QuestionSingleCard;
