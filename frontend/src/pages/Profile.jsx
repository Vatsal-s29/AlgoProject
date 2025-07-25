import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../../config.js";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [submissionStats, setSubmissionStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await axios.get(
                `${BACKEND_URL}/api/auth/profile`,
                {
                    withCredentials: true,
                }
            );
            setUser(response.data.user);

            // Fetch submission statistics
            const statsResponse = await axios.get(
                `${BACKEND_URL}/api/submissions/stats/user`,
                { withCredentials: true }
            );
            setSubmissionStats(statsResponse.data.data);
        } catch (error) {
            setError("Failed to load profile");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-red-600 text-center">
                    <p className="text-xl">{error}</p>
                    <button
                        onClick={fetchProfile}
                        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-8">
                        <div className="flex items-center space-x-6">
                            <div className="h-24 w-24 bg-white rounded-full flex items-center justify-center">
                                {user?.avatar ? (
                                    <img
                                        src={user.avatar}
                                        alt={user.name}
                                        className="h-24 w-24 rounded-full object-cover"
                                    />
                                ) : (
                                    <span className="text-3xl font-bold text-indigo-600">
                                        {user?.name?.charAt(0)?.toUpperCase()}
                                    </span>
                                )}
                            </div>
                            <div className="text-white">
                                <h1 className="text-3xl font-bold">
                                    {user?.name}
                                </h1>
                                <p className="text-indigo-100">
                                    @{user?.username}
                                </p>
                                <p className="text-indigo-100">{user?.email}</p>
                                {user?.isTeacher && (
                                    <span className="inline-block bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-sm font-semibold mt-2">
                                        Teacher
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Profile Info */}
                            <div className="lg:col-span-2">
                                <div className="mb-6">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                        About
                                    </h2>
                                    <p className="text-gray-600">
                                        {user?.bio || "No bio provided yet."}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="font-semibold text-gray-900">
                                            Problems Solved
                                        </h3>
                                        <p className="text-2xl font-bold text-indigo-600">
                                            {submissionStats?.uniqueProblemsSolved ||
                                                0}
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="font-semibold text-gray-900">
                                            Submissions
                                        </h3>
                                        <p className="text-2xl font-bold text-green-600">
                                            {submissionStats?.total || 0}
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="font-semibold text-gray-900">
                                            Rating
                                        </h3>
                                        <p className="text-2xl font-bold text-purple-600">
                                            {user?.rating || 0}
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="font-semibold text-gray-900">
                                            Member Since
                                        </h3>
                                        <p className="text-lg font-medium text-gray-600">
                                            {new Date(
                                                user?.createdAt
                                            ).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-gray-900 mb-4">
                                        Actions
                                    </h3>
                                    <div className="space-y-3">
                                        <Link
                                            to="/stats"
                                            className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-center block"
                                        >
                                            View Stats
                                        </Link>
                                        <Link
                                            to="/profile/change-password"
                                            className="w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 text-center block"
                                        >
                                            Change Password
                                        </Link>
                                        <Link
                                            to="/profile/edit"
                                            className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-center block"
                                        >
                                            Edit Profile
                                        </Link>
                                        <Link
                                            to="/delete-account"
                                            className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 text-center block"
                                        >
                                            Delete Profile
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;

// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import { BACKEND_URL } from "../../config.js";

// const Profile = () => {
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState("");

//     useEffect(() => {
//         fetchProfile();
//     }, []);

//     const fetchProfile = async () => {
//         try {
//             const response = await axios.get(
//                 `${BACKEND_URL}/api/auth/profile`,
//                 {
//                     withCredentials: true,
//                 }
//             );
//             setUser(response.data.user);
//         } catch (error) {
//             setError("Failed to load profile");
//         } finally {
//             setLoading(false);
//         }
//     };

//     if (loading) {
//         return (
//             <div className="min-h-screen flex items-center justify-center">
//                 <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="min-h-screen flex items-center justify-center">
//                 <div className="text-red-600 text-center">
//                     <p className="text-xl">{error}</p>
//                     <button
//                         onClick={fetchProfile}
//                         className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
//                     >
//                         Retry
//                     </button>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//             <div className="max-w-4xl mx-auto">
//                 <div className="bg-white shadow-lg rounded-lg overflow-hidden">
//                     {/* Header */}
//                     <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-8">
//                         <div className="flex items-center space-x-6">
//                             <div className="h-24 w-24 bg-white rounded-full flex items-center justify-center">
//                                 {user?.avatar ? (
//                                     <img
//                                         src={user.avatar}
//                                         alt={user.name}
//                                         className="h-24 w-24 rounded-full object-cover"
//                                     />
//                                 ) : (
//                                     <span className="text-3xl font-bold text-indigo-600">
//                                         {user?.name?.charAt(0)?.toUpperCase()}
//                                     </span>
//                                 )}
//                             </div>
//                             <div className="text-white">
//                                 <h1 className="text-3xl font-bold">
//                                     {user?.name}
//                                 </h1>
//                                 <p className="text-indigo-100">
//                                     @{user?.username}
//                                 </p>
//                                 <p className="text-indigo-100">{user?.email}</p>
//                                 {user?.isTeacher && (
//                                     <span className="inline-block bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-sm font-semibold mt-2">
//                                         Teacher
//                                     </span>
//                                 )}
//                             </div>
//                         </div>
//                     </div>

//                     {/* Content */}
//                     <div className="p-6">
//                         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                             {/* Profile Info */}
//                             <div className="lg:col-span-2">
//                                 <div className="mb-6">
//                                     <h2 className="text-xl font-semibold text-gray-900 mb-2">
//                                         About
//                                     </h2>
//                                     <p className="text-gray-600">
//                                         {user?.bio || "No bio provided yet."}
//                                     </p>
//                                 </div>

//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                     <div className="bg-gray-50 p-4 rounded-lg">
//                                         <h3 className="font-semibold text-gray-900">
//                                             Problems Solved
//                                         </h3>
//                                         <p className="text-2xl font-bold text-indigo-600">
//                                             {user?.solvedProblems?.length || 0}
//                                         </p>
//                                     </div>
//                                     <div className="bg-gray-50 p-4 rounded-lg">
//                                         <h3 className="font-semibold text-gray-900">
//                                             Submissions
//                                         </h3>
//                                         <p className="text-2xl font-bold text-green-600">
//                                             {user?.submissionsCount || 0}
//                                         </p>
//                                     </div>
//                                     <div className="bg-gray-50 p-4 rounded-lg">
//                                         <h3 className="font-semibold text-gray-900">
//                                             Rating
//                                         </h3>
//                                         <p className="text-2xl font-bold text-purple-600">
//                                             {user?.rating || 0}
//                                         </p>
//                                     </div>
//                                     <div className="bg-gray-50 p-4 rounded-lg">
//                                         <h3 className="font-semibold text-gray-900">
//                                             Member Since
//                                         </h3>
//                                         <p className="text-lg font-medium text-gray-600">
//                                             {new Date(
//                                                 user?.createdAt
//                                             ).toLocaleDateString()}
//                                         </p>
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Actions */}
//                             <div>
//                                 <div className="bg-gray-50 p-4 rounded-lg">
//                                     <h3 className="font-semibold text-gray-900 mb-4">
//                                         Actions
//                                     </h3>
//                                     <div className="space-y-3">
//                                         <Link
//                                             to="/stats"
//                                             className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-center block"
//                                         >
//                                             View Stats
//                                         </Link>
//                                         <Link
//                                             to="/profile/change-password"
//                                             className="w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 text-center block"
//                                         >
//                                             Change Password
//                                         </Link>
//                                         <Link
//                                             to="/profile/edit"
//                                             className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-center block"
//                                         >
//                                             Edit Profile
//                                         </Link>
//                                         <Link
//                                             to="/delete-account"
//                                             className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 text-center block"
//                                         >
//                                             Delete Profile
//                                         </Link>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Profile;
