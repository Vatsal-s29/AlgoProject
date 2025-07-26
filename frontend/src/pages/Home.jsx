import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
    return (
        <div className="min-h-full bg-gray-50">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-gray-200 to-gray-400 text-gray-800 pt-16 pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-5xl font-bold mb-6">
                            Welcome to Bro-Code
                        </h1>
                        <p className="text-xl mb-8 max-w-3xl mx-auto">
                            Your ultimate destination for coding practice,
                            learning, and community collaboration. Solve
                            problems, share knowledge, and grow together.
                        </p>
                        <button className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors">
                            Get Started
                        </button>
                    </div>
                </div>
            </section>
            {/* Problems Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Practice Problems
                        </h2>
                        <p className="text-lg text-gray-600 mb-8">
                            Challenge yourself with our curated collection of
                            coding problems
                        </p>
                        <div className="grid md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                                <h3 className="text-xl font-semibold text-green-800 mb-2">
                                    Easy
                                </h3>
                                <p className="text-green-600">
                                    Perfect for beginners
                                </p>
                            </div>
                            <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                                <h3 className="text-xl font-semibold text-yellow-800 mb-2">
                                    Medium
                                </h3>
                                <p className="text-yellow-600">
                                    Intermediate challenges
                                </p>
                            </div>
                            <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                                <h3 className="text-xl font-semibold text-red-800 mb-2">
                                    Hard
                                </h3>
                                <p className="text-red-600">
                                    Expert level problems
                                </p>
                            </div>
                        </div>
                        <Link
                            to="/problems"
                            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors inline-block"
                        >
                            Browse Problems
                        </Link>
                    </div>
                </div>
            </section>
            {/* Compiler Section */}
            <section className="py-16 bg-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Online Compiler
                        </h2>
                        <p className="text-lg text-gray-600 mb-8">
                            Write, compile, and run your code instantly in our
                            powerful online editor
                        </p>
                        <div className="bg-gray-900 text-green-400 p-6 rounded-lg max-w-2xl mx-auto mb-8 text-left font-mono">
                            <div className="flex items-center mb-2">
                                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            </div>
                            <pre className="text-sm">
                                {`#include <iostream>
using namespace std;
int main() {
    cout << "Hello Bro-Code!" << endl;
    return 0;
}`}
                            </pre>
                        </div>
                        <Link
                            to="/"
                            className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors inline-block"
                        >
                            Try Compiler
                        </Link>
                    </div>
                </div>
            </section>
            {/* Blogs Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Latest Blogs
                        </h2>
                        <p className="text-lg text-gray-600 mb-8">
                            Stay updated with the latest programming insights
                            and tutorials
                        </p>
                        <div className="grid md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-white p-6 rounded-lg shadow-md border">
                                <h3 className="text-xl font-semibold mb-2">
                                    Getting Started with DSA
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Learn the fundamentals of Data Structures
                                    and Algorithms...
                                </p>
                                <span className="text-sm text-gray-500">
                                    2 days ago
                                </span>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-md border">
                                <h3 className="text-xl font-semibold mb-2">
                                    Advanced C++ Concepts
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Dive deep into advanced C++ programming
                                    techniques...
                                </p>
                                <span className="text-sm text-gray-500">
                                    5 days ago
                                </span>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-md border">
                                <h3 className="text-xl font-semibold mb-2">
                                    Interview Preparation
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Essential tips for cracking technical
                                    interviews...
                                </p>
                                <span className="text-sm text-gray-500">
                                    1 week ago
                                </span>
                            </div>
                        </div>
                        <Link
                            to="/blogs"
                            className="bg-purple-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-purple-700 transition-colors inline-block"
                        >
                            Read All Blogs
                        </Link>
                    </div>
                </div>
            </section>
            {/* Doubts Section */}
            <section className="py-16 bg-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Community Doubts
                        </h2>
                        <p className="text-lg text-gray-600 mb-8">
                            Get help from the community and help others with
                            their coding doubts
                        </p>
                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                            <div className="bg-white p-6 rounded-lg shadow-md border">
                                <h3 className="text-lg font-semibold mb-2">
                                    How to optimize this sorting algorithm?
                                </h3>
                                <p className="text-gray-600 mb-2">
                                    I'm trying to improve the time complexity of
                                    my bubble sort...
                                </p>
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>3 answers</span>
                                    <span>2 hours ago</span>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-md border">
                                <h3 className="text-lg font-semibold mb-2">
                                    Understanding pointers in C++
                                </h3>
                                <p className="text-gray-600 mb-2">
                                    Can someone explain the difference between *
                                    and & operators...
                                </p>
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>5 answers</span>
                                    <span>4 hours ago</span>
                                </div>
                            </div>
                        </div>
                        <Link
                            to="/doubts"
                            className="bg-orange-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-orange-700 transition-colors inline-block"
                        >
                            Browse Doubts
                        </Link>
                    </div>
                </div>
            </section>
            {/* Leaderboard Mention Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Compete & Excel
                        </h2>
                        <p className="text-lg text-gray-600 mb-8">
                            Track your progress, compete with peers, and climb
                            the leaderboard
                        </p>
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-8 rounded-lg max-w-2xl mx-auto mb-8">
                            <h3 className="text-2xl font-bold mb-4">
                                🏆 Leaderboard
                            </h3>
                            <p className="text-lg">
                                See where you stand among the coding champions
                            </p>
                        </div>
                        <Link
                            to="/leaderboard"
                            className="bg-yellow-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-yellow-700 transition-colors inline-block"
                        >
                            View Leaderboard
                        </Link>
                    </div>
                </div>
            </section>
            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h3 className="text-2xl font-bold mb-4">Bro-Code</h3>
                    <p className="text-gray-400 mb-4">
                        Empowering developers, one line of code at a time.
                    </p>
                    <p className="text-gray-500">
                        © 2025 Bro-Code. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
