import React, { useState, useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../config.js";
import { Trophy, Medal, Award, User, TrendingUp, Target } from "lucide-react";

const Podium = () => {
    const [topThree, setTopThree] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchTopThree();
    }, []);

    const fetchTopThree = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${BACKEND_URL}/api/submissions/stats/leaderboard?page=1&limit=3`,
                {
                    withCredentials: true,
                }
            );
            setTopThree(response.data.data || []);
        } catch (err) {
            setError("Failed to load top performers");
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

    const getRankIcon = (rank) => {
        switch (rank) {
            case 1:
                return <Trophy className="w-6 h-6 text-yellow-500" />;
            case 2:
                return <Medal className="w-6 h-6 text-gray-400" />;
            case 3:
                return <Award className="w-6 h-6 text-amber-600" />;
            default:
                return null;
        }
    };

    const getPodiumHeight = (rank) => {
        switch (rank) {
            case 1:
                return "h-32";
            case 2:
                return "h-24";
            case 3:
                return "h-20";
            default:
                return "h-16";
        }
    };

    const getPodiumOrder = (rank) => {
        // Display order: 2nd, 1st, 3rd
        switch (rank) {
            case 1:
                return 2;
            case 2:
                return 1;
            case 3:
                return 3;
            default:
                return rank;
        }
    };

    if (loading) {
        return (
            <div className="mb-12">
                <div className="flex justify-center items-end space-x-8 mb-8">
                    {[...Array(3)].map((_, i) => (
                        <div
                            key={i}
                            className="flex flex-col items-center animate-pulse"
                        >
                            <div className="bg-gray-200 rounded-lg p-6 mb-4 w-48 h-64"></div>
                            <div className="w-32 h-24 bg-gray-200 rounded-t-lg"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mb-12">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                    <p className="text-red-800">{error}</p>
                    <button
                        onClick={fetchTopThree}
                        className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (topThree.length === 0) {
        return null;
    }

    return (
        <div className="mb-12">
            <div className="flex justify-center items-end space-x-8 mb-8">
                {topThree
                    .sort(
                        (a, b) =>
                            getPodiumOrder(topThree.indexOf(a) + 1) -
                            getPodiumOrder(topThree.indexOf(b) + 1)
                    )
                    .map((user, sortedIndex) => {
                        const originalRank = topThree.indexOf(user) + 1;
                        const rating = calculateRating(user);
                        const successRate =
                            user.total > 0
                                ? ((user.accepted / user.total) * 100).toFixed(
                                      1
                                  )
                                : "0";

                        return (
                            <div
                                key={user._id}
                                className="flex flex-col items-center"
                            >
                                {/* User Card */}
                                <div
                                    className={`bg-white rounded-[100px] shadow-lg p-6 mb-4 w-48 text-center border-4 ${
                                        originalRank === 1
                                            ? "border-yellow-400"
                                            : originalRank === 2
                                            ? "border-gray-400"
                                            : "border-amber-600"
                                    }`}
                                >
                                    <div className="flex justify-center mb-4">
                                        {getRankIcon(originalRank)}
                                    </div>
                                    <div className="mb-4">
                                        {user.avatar ? (
                                            <img
                                                className="h-16 w-16 rounded-full mx-auto"
                                                src={user.avatar}
                                                alt={user.name}
                                            />
                                        ) : (
                                            <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center mx-auto">
                                                <User className="h-8 w-8 text-gray-500" />
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                                        {user.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 mb-3">
                                        @{user.username}
                                    </p>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-center">
                                            <TrendingUp className="h-4 w-4 text-blue-500 mr-1" />
                                            <span className="text-sm font-medium">
                                                {rating}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-center">
                                            <Target className="h-4 w-4 text-green-500 mr-1" />
                                            <span className="text-sm">
                                                {user.uniqueProblemsSolved || 0}
                                            </span>
                                        </div>
                                        <div className="flex justify-center">
                                            <span
                                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                    parseFloat(successRate) >=
                                                    80
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
                                        </div>
                                    </div>
                                </div>

                                {/* Podium Base */}
                                <div
                                    className={`w-32 ${getPodiumHeight(
                                        originalRank
                                    )} ${
                                        originalRank === 1
                                            ? "bg-gradient-to-t from-yellow-400 to-yellow-300"
                                            : originalRank === 2
                                            ? "bg-gradient-to-t from-gray-400 to-gray-300"
                                            : "bg-gradient-to-t from-amber-600 to-amber-500"
                                    } rounded-t-lg flex items-center justify-center`}
                                >
                                    <span className="text-white font-bold text-xl">
                                        #{originalRank}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};

export default Podium;
