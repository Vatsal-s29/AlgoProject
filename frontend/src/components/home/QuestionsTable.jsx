import { Link } from "react-router-dom";
import { AiOutlineEdit } from "react-icons/ai";
import { MdOutlineDelete } from "react-icons/md";
import { useState } from "react";
import QuestionModal from "./QuestionModal";

// ✅ Import shared utility function
import getDifficultyClasses from "../../utils/getDifficultyClasses";

const QuestionsTable = ({ questions, user }) => {
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const isTeacher = user?.isTeacher || false;

    return (
        <>
            {/* Questions Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                                    No
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Title
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                                    Difficulty
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider max-md:hidden w-96">
                                    Topics
                                </th>
                                {isTeacher && (
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                                        Actions
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {questions.map((question, index) => (
                                <tr
                                    key={question._id}
                                    className="hover:bg-gray-50"
                                >
                                    {/* Serial Number - with quick view functionality */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() =>
                                                setSelectedQuestion(question)
                                            }
                                            className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer font-medium"
                                            title="Quick View"
                                        >
                                            {index + 1}
                                        </button>
                                    </td>

                                    {/* Title - with show question functionality */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Link
                                            to={`/questions/details/${question._id}`}
                                            className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer font-medium"
                                            title="View Details"
                                        >
                                            {question.title}
                                        </Link>
                                    </td>

                                    {/* Difficulty as pill */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getDifficultyClasses(
                                                question.difficulty
                                            )}`}
                                        >
                                            {question.difficulty}
                                        </span>
                                    </td>

                                    {/* Topics as pills */}
                                    <td className="px-6 py-4 whitespace-nowrap max-md:hidden">
                                        <div className="flex flex-wrap gap-1">
                                            {question.topics &&
                                            question.topics.length > 0 ? (
                                                question.topics.map(
                                                    (topic, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                                                        >
                                                            {topic}
                                                        </span>
                                                    )
                                                )
                                            ) : (
                                                <span className="text-gray-400 italic text-xs">
                                                    None
                                                </span>
                                            )}
                                        </div>
                                    </td>

                                    {/* Action Icons - only for teachers */}
                                    {isTeacher && (
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex space-x-2">
                                                <Link
                                                    to={`/questions/edit/${question._id}`}
                                                    className="text-yellow-600 hover:text-yellow-800"
                                                >
                                                    <AiOutlineEdit
                                                        className="text-xl"
                                                        title="Edit"
                                                    />
                                                </Link>
                                                <Link
                                                    to={`/questions/delete/${question._id}`}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    <MdOutlineDelete
                                                        className="text-xl"
                                                        title="Delete"
                                                    />
                                                </Link>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Preview */}
            {selectedQuestion && (
                <QuestionModal
                    question={selectedQuestion}
                    onClose={() => setSelectedQuestion(null)}
                />
            )}
        </>
    );
};

export default QuestionsTable;

// import { Link } from "react-router-dom";
// import { AiOutlineEdit } from "react-icons/ai";
// import { MdOutlineDelete } from "react-icons/md";
// import { useState } from "react";
// import QuestionModal from "./QuestionModal";

// // ✅ Import shared utility function
// import getDifficultyClasses from "../../utils/getDifficultyClasses";

// const QuestionsTable = ({ questions, user }) => {
//     const [selectedQuestion, setSelectedQuestion] = useState(null);
//     const isTeacher = user?.isTeacher || false;

//     return (
//         <>
//             <table className="w-full text-sm">
//                 {/* Table Headings */}
//                 <thead>
//                     <tr className="bg-gray-100 text-gray-700">
//                         <th className="border border-slate-300 py-2">No</th>
//                         <th className="border border-slate-300 py-2">Title</th>
//                         <th className="border border-slate-300 py-2">
//                             Difficulty
//                         </th>
//                         <th className="border border-slate-300 py-2 max-md:hidden">
//                             Topics
//                         </th>
//                         {isTeacher && (
//                             <th className="border border-slate-300 py-2">
//                                 Actions
//                             </th>
//                         )}
//                     </tr>
//                 </thead>

//                 {/* Table Body */}
//                 <tbody>
//                     {questions.map((question, index) => (
//                         <tr key={question._id} className="even:bg-gray-50">
//                             {/* Serial Number - with quick view functionality */}
//                             <td className="border border-slate-200 text-center px-2 py-2">
//                                 <button
//                                     onClick={() =>
//                                         setSelectedQuestion(question)
//                                     }
//                                     className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer font-medium"
//                                     title="Quick View"
//                                 >
//                                     {index + 1}
//                                 </button>
//                             </td>

//                             {/* Title - with show question functionality */}
//                             <td className="border border-slate-200 text-center px-2 py-2">
//                                 <Link
//                                     to={`/questions/details/${question._id}`}
//                                     className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
//                                     title="View Details"
//                                 >
//                                     {question.title}
//                                 </Link>
//                             </td>

//                             {/* Difficulty as pill */}
//                             <td className="border border-slate-200 text-center px-2 py-2">
//                                 <span
//                                     className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${getDifficultyClasses(
//                                         question.difficulty
//                                     )}`}
//                                 >
//                                     {question.difficulty}
//                                 </span>
//                             </td>

//                             {/* Topics as pills */}
//                             <td className="border border-slate-200 text-center px-2 py-2 max-md:hidden">
//                                 <div className="flex flex-wrap justify-center gap-1">
//                                     {question.topics &&
//                                     question.topics.length > 0 ? (
//                                         question.topics.map((topic, idx) => (
//                                             <span
//                                                 key={idx}
//                                                 className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium"
//                                             >
//                                                 {topic}
//                                             </span>
//                                         ))
//                                     ) : (
//                                         <span className="text-gray-400 italic text-xs">
//                                             None
//                                         </span>
//                                     )}
//                                 </div>
//                             </td>

//                             {/* Action Icons - only for teachers */}
//                             {isTeacher && (
//                                 <td className="border border-slate-200 text-center px-2 py-2">
//                                     <div className="flex justify-center gap-x-3">
//                                         <Link
//                                             to={`/questions/edit/${question._id}`}
//                                         >
//                                             <AiOutlineEdit
//                                                 className="text-xl text-yellow-600 hover:text-black"
//                                                 title="Edit"
//                                             />
//                                         </Link>
//                                         <Link
//                                             to={`/questions/delete/${question._id}`}
//                                         >
//                                             <MdOutlineDelete
//                                                 className="text-xl text-red-600 hover:text-black"
//                                                 title="Delete"
//                                             />
//                                         </Link>
//                                     </div>
//                                 </td>
//                             )}
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>

//             {/* Modal Preview */}
//             {selectedQuestion && (
//                 <QuestionModal
//                     question={selectedQuestion}
//                     onClose={() => setSelectedQuestion(null)}
//                 />
//             )}
//         </>
//     );
// };

// export default QuestionsTable;
