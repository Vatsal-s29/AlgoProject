import React, { useState, useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../config.js";
import { User, TrendingUp, Code, Target } from "lucide-react";
import Podium from "../components/Podium";

const Leaderboard = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchLeaderboard();
    }, [currentPage]);

    const fetchLeaderboard = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${BACKEND_URL}/api/submissions/stats/leaderboard?page=${currentPage}&limit=23`,
                {
                    withCredentials: true,
                }
            );
            setLeaderboard(response.data.data?.slice(3) || []);
            setTotalPages(response.data.pagination?.totalPages || 1);
        } catch (err) {
            setError("Failed to load leaderboard");
        } finally {
            setLoading(false);
        }
    };

    const calculateRating = (stats) => {
        const points = {
            basic: 1,
            easy: 2,
            medium: 5,
            hard: 10,
            god: 20,
        };

        return (
            (stats?.basic || 0) * points.basic +
            (stats?.easy || 0) * points.easy +
            (stats?.medium || 0) * points.medium +
            (stats?.hard || 0) * points.hard +
            (stats?.god || 0) * points.god
        );
    };

    const getRankBadge = (rank) => {
        return "bg-gray-50 text-gray-700";
    };

    // Get users from rank 4 onwards
    const displayUsers = leaderboard;

    if (loading) {
        return (
            <div className="min-h-full bg-gray-50 p-4">
                <div className="max-w-6xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
                        {[...Array(10)].map((_, i) => (
                            <div
                                key={i}
                                className="bg-white rounded-lg p-4 mb-4 shadow-sm"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                                    <div className="flex-1">
                                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                    </div>
                                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-full bg-gray-50 p-4">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                        <p className="text-red-800">{error}</p>
                        <button
                            onClick={fetchLeaderboard}
                            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-full bg-gray-50 p-4 pt-12">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Leaderboard
                    </h1>
                    <p className="text-gray-600">
                        Top performers in our coding community
                    </p>
                </div>

                {/* Podium Component */}
                <Podium />

                {/* Leaderboard Table for Rank 4+ */}
                {displayUsers.length > 0 && (
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Rank
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            User
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Rating
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Problems Solved
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Submissions
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Success Rate
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {displayUsers.map((user, index) => {
                                        const rank =
                                            (currentPage - 1) * 20 + index + 4;
                                        const rating = calculateRating(user);
                                        const successRate =
                                            user.total > 0
                                                ? (
                                                      (user.accepted /
                                                          user.total) *
                                                      100
                                                  ).toFixed(1)
                                                : "0";

                                        return (
                                            <tr
                                                key={user._id}
                                                className="hover:bg-gray-50"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div
                                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRankBadge(
                                                            rank
                                                        )}`}
                                                    >
                                                        <span>#{rank}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            {user.avatar ? (
                                                                <img
                                                                    className="h-10 w-10 rounded-full"
                                                                    src={
                                                                        user.avatar
                                                                    }
                                                                    alt={
                                                                        user.name
                                                                    }
                                                                />
                                                            ) : (
                                                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                                    <User className="h-5 w-5 text-gray-500" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {user.name}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                @{user.username}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <TrendingUp className="h-4 w-4 text-blue-500 mr-1" />
                                                        <span className="text-sm font-medium text-gray-900">
                                                            {rating}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <Target className="h-4 w-4 text-green-500 mr-1" />
                                                        <span className="text-sm text-gray-900">
                                                            {user.uniqueProblemsSolved ||
                                                                0}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <Code className="h-4 w-4 text-purple-500 mr-1" />
                                                        <span className="text-sm text-gray-900">
                                                            {user.total || 0}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                            parseFloat(
                                                                successRate
                                                            ) >= 80
                                                                ? "bg-green-100 text-green-800"
                                                                : parseFloat(
                                                                      successRate
                                                                  ) >= 50
                                                                ? "bg-yellow-100 text-yellow-800"
                                                                : "bg-red-100 text-red-800"
                                                        }`}
                                                    >
                                                        {successRate}%
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-6 flex justify-center space-x-2">
                        <button
                            onClick={() =>
                                setCurrentPage((prev) => Math.max(prev - 1, 1))
                            }
                            disabled={currentPage === 1}
                            className={`px-3 py-2 rounded-md text-sm font-medium ${
                                currentPage === 1
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                            }`}
                        >
                            Previous
                        </button>

                        {[...Array(Math.min(5, totalPages))].map((_, i) => {
                            const pageNum = Math.max(
                                1,
                                Math.min(
                                    currentPage - 2 + i,
                                    totalPages - 4 + i
                                )
                            );
                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => setCurrentPage(pageNum)}
                                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                                        currentPage === pageNum
                                            ? "bg-blue-600 text-white"
                                            : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                                    }`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}

                        <button
                            onClick={() =>
                                setCurrentPage((prev) =>
                                    Math.min(prev + 1, totalPages)
                                )
                            }
                            disabled={currentPage === totalPages}
                            className={`px-3 py-2 rounded-md text-sm font-medium ${
                                currentPage === totalPages
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                            }`}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Leaderboard;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { BACKEND_URL } from "../../config.js";
// import {
//     Trophy,
//     Medal,
//     Award,
//     User,
//     TrendingUp,
//     Code,
//     Target,
// } from "lucide-react";

// const Leaderboard = () => {
//     const [leaderboard, setLeaderboard] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState("");
//     const [currentPage, setCurrentPage] = useState(1);
//     const [totalPages, setTotalPages] = useState(1);

//     useEffect(() => {
//         fetchLeaderboard();
//     }, [currentPage]);

//     const fetchLeaderboard = async () => {
//         try {
//             setLoading(true);
//             const response = await axios.get(
//                 `${BACKEND_URL}/api/submissions/stats/leaderboard?page=${currentPage}&limit=20`,
//                 {
//                     withCredentials: true,
//                 }
//             );
//             setLeaderboard(response.data.data || []);
//             setTotalPages(response.data.pagination?.totalPages || 1);
//         } catch (err) {
//             setError("Failed to load leaderboard");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const calculateRating = (stats) => {
//         const points = {
//             basic: 1,
//             easy: 2,
//             medium: 5,
//             hard: 10,
//             god: 20,
//         };

//         return (
//             (stats?.basic || 0) * points.basic +
//             (stats?.easy || 0) * points.easy +
//             (stats?.medium || 0) * points.medium +
//             (stats?.hard || 0) * points.hard +
//             (stats?.god || 0) * points.god
//         );
//     };

//     const getRankIcon = (rank) => {
//         switch (rank) {
//             case 1:
//                 return <Trophy className="w-6 h-6 text-yellow-500" />;
//             case 2:
//                 return <Medal className="w-6 h-6 text-gray-400" />;
//             case 3:
//                 return <Award className="w-6 h-6 text-amber-600" />;
//             default:
//                 return null;
//         }
//     };

//     const getRankBadge = (rank) => {
//         if (rank <= 3) {
//             const colors = [
//                 "bg-yellow-100 text-yellow-800",
//                 "bg-gray-100 text-gray-800",
//                 "bg-amber-100 text-amber-800",
//             ];
//             return colors[rank - 1];
//         }
//         return "bg-gray-50 text-gray-700";
//     };

//     const getPodiumHeight = (rank) => {
//         switch (rank) {
//             case 1:
//                 return "h-32";
//             case 2:
//                 return "h-24";
//             case 3:
//                 return "h-20";
//             default:
//                 return "h-16";
//         }
//     };

//     const getPodiumOrder = (rank) => {
//         // Display order: 2nd, 1st, 3rd
//         switch (rank) {
//             case 1:
//                 return 2;
//             case 2:
//                 return 1;
//             case 3:
//                 return 3;
//             default:
//                 return rank;
//         }
//     };

//     // Get top 3 and remaining users
//     const topThree = leaderboard.slice(0, 3);
//     const remainingUsers = leaderboard.slice(3);

//     if (loading) {
//         return (
//             <div className="min-h-full bg-gray-50 p-4">
//                 <div className="max-w-6xl mx-auto">
//                     <div className="animate-pulse">
//                         <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
//                         {[...Array(10)].map((_, i) => (
//                             <div
//                                 key={i}
//                                 className="bg-white rounded-lg p-4 mb-4 shadow-sm"
//                             >
//                                 <div className="flex items-center space-x-4">
//                                     <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
//                                     <div className="flex-1">
//                                         <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
//                                         <div className="h-3 bg-gray-200 rounded w-1/2"></div>
//                                     </div>
//                                     <div className="h-4 bg-gray-200 rounded w-16"></div>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="min-h-full bg-gray-50 p-4">
//                 <div className="max-w-6xl mx-auto">
//                     <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
//                         <p className="text-red-800">{error}</p>
//                         <button
//                             onClick={fetchLeaderboard}
//                             className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
//                         >
//                             Try Again
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-full bg-gray-50 p-4 pt-12">
//             <div className="max-w-6xl mx-auto">
//                 {/* Header */}
//                 <div className="mb-8">
//                     <h1 className="text-3xl font-bold text-gray-900 mb-2">
//                         Leaderboard
//                     </h1>
//                     <p className="text-gray-600">
//                         Top performers in our coding community
//                     </p>
//                 </div>

//                 {/* Podium for Top 3 */}
//                 {topThree.length > 0 && (
//                     <div className="mb-12">
//                         <div className="flex justify-center items-end space-x-8 mb-8">
//                             {topThree
//                                 .sort(
//                                     (a, b) =>
//                                         getPodiumOrder(
//                                             topThree.indexOf(a) + 1
//                                         ) -
//                                         getPodiumOrder(topThree.indexOf(b) + 1)
//                                 )
//                                 .map((user, sortedIndex) => {
//                                     const originalRank =
//                                         topThree.indexOf(user) + 1;
//                                     const rating = calculateRating(user);
//                                     const successRate =
//                                         user.total > 0
//                                             ? (
//                                                   (user.accepted / user.total) *
//                                                   100
//                                               ).toFixed(1)
//                                             : "0";

//                                     return (
//                                         <div
//                                             key={user._id}
//                                             className="flex flex-col items-center"
//                                         >
//                                             {/* User Card */}
//                                             <div
//                                                 className={`bg-white rounded-lg shadow-lg p-6 mb-4 w-48 text-center border-4 ${
//                                                     originalRank === 1
//                                                         ? "border-yellow-400"
//                                                         : originalRank === 2
//                                                         ? "border-gray-400"
//                                                         : "border-amber-600"
//                                                 }`}
//                                             >
//                                                 <div className="flex justify-center mb-4">
//                                                     {getRankIcon(originalRank)}
//                                                 </div>
//                                                 <div className="mb-4">
//                                                     {user.avatar ? (
//                                                         <img
//                                                             className="h-16 w-16 rounded-full mx-auto"
//                                                             src={user.avatar}
//                                                             alt={user.name}
//                                                         />
//                                                     ) : (
//                                                         <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center mx-auto">
//                                                             <User className="h-8 w-8 text-gray-500" />
//                                                         </div>
//                                                     )}
//                                                 </div>
//                                                 <h3 className="text-lg font-bold text-gray-900 mb-1">
//                                                     {user.name}
//                                                 </h3>
//                                                 <p className="text-sm text-gray-500 mb-3">
//                                                     @{user.username}
//                                                 </p>
//                                                 <div className="space-y-2">
//                                                     <div className="flex items-center justify-center">
//                                                         <TrendingUp className="h-4 w-4 text-blue-500 mr-1" />
//                                                         <span className="text-sm font-medium">
//                                                             {rating}
//                                                         </span>
//                                                     </div>
//                                                     <div className="flex items-center justify-center">
//                                                         <Target className="h-4 w-4 text-green-500 mr-1" />
//                                                         <span className="text-sm">
//                                                             {user.uniqueProblemsSolved ||
//                                                                 0}
//                                                         </span>
//                                                     </div>
//                                                     <div className="flex justify-center">
//                                                         <span
//                                                             className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
//                                                                 parseFloat(
//                                                                     successRate
//                                                                 ) >= 80
//                                                                     ? "bg-green-100 text-green-800"
//                                                                     : parseFloat(
//                                                                           successRate
//                                                                       ) >= 50
//                                                                     ? "bg-yellow-100 text-yellow-800"
//                                                                     : "bg-red-100 text-red-800"
//                                                             }`}
//                                                         >
//                                                             {successRate}%
//                                                         </span>
//                                                     </div>
//                                                 </div>
//                                             </div>

//                                             {/* Podium Base */}
//                                             <div
//                                                 className={`w-32 ${getPodiumHeight(
//                                                     originalRank
//                                                 )} ${
//                                                     originalRank === 1
//                                                         ? "bg-gradient-to-t from-yellow-400 to-yellow-300"
//                                                         : originalRank === 2
//                                                         ? "bg-gradient-to-t from-gray-400 to-gray-300"
//                                                         : "bg-gradient-to-t from-amber-600 to-amber-500"
//                                                 } rounded-t-lg flex items-center justify-center`}
//                                             >
//                                                 <span className="text-white font-bold text-xl">
//                                                     #{originalRank}
//                                                 </span>
//                                             </div>
//                                         </div>
//                                     );
//                                 })}
//                         </div>
//                     </div>
//                 )}

//                 {/* Leaderboard Table for Rank 4+ */}
//                 {remainingUsers.length > 0 && (
//                     <div className="bg-white rounded-lg shadow-sm overflow-hidden">
//                         <div className="overflow-x-auto">
//                             <table className="w-full">
//                                 <thead className="bg-gray-50">
//                                     <tr>
//                                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                             Rank
//                                         </th>
//                                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                             User
//                                         </th>
//                                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                             Rating
//                                         </th>
//                                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                             Problems Solved
//                                         </th>
//                                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                             Submissions
//                                         </th>
//                                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                             Success Rate
//                                         </th>
//                                     </tr>
//                                 </thead>
//                                 <tbody className="bg-white divide-y divide-gray-200">
//                                     {remainingUsers.map((user, index) => {
//                                         const rank =
//                                             (currentPage - 1) * 20 + index + 4;
//                                         const rating = calculateRating(user);
//                                         const successRate =
//                                             user.total > 0
//                                                 ? (
//                                                       (user.accepted /
//                                                           user.total) *
//                                                       100
//                                                   ).toFixed(1)
//                                                 : "0";

//                                         return (
//                                             <tr
//                                                 key={user._id}
//                                                 className="hover:bg-gray-50"
//                                             >
//                                                 <td className="px-6 py-4 whitespace-nowrap">
//                                                     <div
//                                                         className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRankBadge(
//                                                             rank
//                                                         )}`}
//                                                     >
//                                                         <span>#{rank}</span>
//                                                     </div>
//                                                 </td>
//                                                 <td className="px-6 py-4 whitespace-nowrap">
//                                                     <div className="flex items-center">
//                                                         <div className="flex-shrink-0 h-10 w-10">
//                                                             {user.avatar ? (
//                                                                 <img
//                                                                     className="h-10 w-10 rounded-full"
//                                                                     src={
//                                                                         user.avatar
//                                                                     }
//                                                                     alt={
//                                                                         user.name
//                                                                     }
//                                                                 />
//                                                             ) : (
//                                                                 <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
//                                                                     <User className="h-5 w-5 text-gray-500" />
//                                                                 </div>
//                                                             )}
//                                                         </div>
//                                                         <div className="ml-4">
//                                                             <div className="text-sm font-medium text-gray-900">
//                                                                 {user.name}
//                                                             </div>
//                                                             <div className="text-sm text-gray-500">
//                                                                 @{user.username}
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 </td>
//                                                 <td className="px-6 py-4 whitespace-nowrap">
//                                                     <div className="flex items-center">
//                                                         <TrendingUp className="h-4 w-4 text-blue-500 mr-1" />
//                                                         <span className="text-sm font-medium text-gray-900">
//                                                             {rating}
//                                                         </span>
//                                                     </div>
//                                                 </td>
//                                                 <td className="px-6 py-4 whitespace-nowrap">
//                                                     <div className="flex items-center">
//                                                         <Target className="h-4 w-4 text-green-500 mr-1" />
//                                                         <span className="text-sm text-gray-900">
//                                                             {user.uniqueProblemsSolved ||
//                                                                 0}
//                                                         </span>
//                                                     </div>
//                                                 </td>
//                                                 <td className="px-6 py-4 whitespace-nowrap">
//                                                     <div className="flex items-center">
//                                                         <Code className="h-4 w-4 text-purple-500 mr-1" />
//                                                         <span className="text-sm text-gray-900">
//                                                             {user.total || 0}
//                                                         </span>
//                                                     </div>
//                                                 </td>
//                                                 <td className="px-6 py-4 whitespace-nowrap">
//                                                     <span
//                                                         className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                                                             parseFloat(
//                                                                 successRate
//                                                             ) >= 80
//                                                                 ? "bg-green-100 text-green-800"
//                                                                 : parseFloat(
//                                                                       successRate
//                                                                   ) >= 50
//                                                                 ? "bg-yellow-100 text-yellow-800"
//                                                                 : "bg-red-100 text-red-800"
//                                                         }`}
//                                                     >
//                                                         {successRate}%
//                                                     </span>
//                                                 </td>
//                                             </tr>
//                                         );
//                                     })}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </div>
//                 )}

//                 {/* Pagination */}
//                 {totalPages > 1 && (
//                     <div className="mt-6 flex justify-center space-x-2">
//                         <button
//                             onClick={() =>
//                                 setCurrentPage((prev) => Math.max(prev - 1, 1))
//                             }
//                             disabled={currentPage === 1}
//                             className={`px-3 py-2 rounded-md text-sm font-medium ${
//                                 currentPage === 1
//                                     ? "bg-gray-100 text-gray-400 cursor-not-allowed"
//                                     : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
//                             }`}
//                         >
//                             Previous
//                         </button>

//                         {[...Array(Math.min(5, totalPages))].map((_, i) => {
//                             const pageNum = Math.max(
//                                 1,
//                                 Math.min(
//                                     currentPage - 2 + i,
//                                     totalPages - 4 + i
//                                 )
//                             );
//                             return (
//                                 <button
//                                     key={pageNum}
//                                     onClick={() => setCurrentPage(pageNum)}
//                                     className={`px-3 py-2 rounded-md text-sm font-medium ${
//                                         currentPage === pageNum
//                                             ? "bg-blue-600 text-white"
//                                             : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
//                                     }`}
//                                 >
//                                     {pageNum}
//                                 </button>
//                             );
//                         })}

//                         <button
//                             onClick={() =>
//                                 setCurrentPage((prev) =>
//                                     Math.min(prev + 1, totalPages)
//                                 )
//                             }
//                             disabled={currentPage === totalPages}
//                             className={`px-3 py-2 rounded-md text-sm font-medium ${
//                                 currentPage === totalPages
//                                     ? "bg-gray-100 text-gray-400 cursor-not-allowed"
//                                     : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
//                             }`}
//                         >
//                             Next
//                         </button>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default Leaderboard;
