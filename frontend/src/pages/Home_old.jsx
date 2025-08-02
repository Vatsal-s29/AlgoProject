import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Podium from "../components/Podium";

// Add Google Fonts
const fontLink = document.createElement("link");
fontLink.href =
    "https://fonts.googleapis.com/css2?family=Bitcount+Prop+Single:wght@100..900&family=Handlee&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Rouge+Script&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

const LandingPage = () => {
    const [currentText, setCurrentText] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [textIndex, setTextIndex] = useState(0);

    const texts = [
        "Your all-in-one coding companion",
        "Tackle top questions from curated lists",
        "Minimal, fast compiler for quick testing",
        "Got a question? Just ask, bro!",
        "Share your knowledge through blogs",
        "Ask doubts—public, private, or anonymous",
    ];

    useEffect(() => {
        const timeout = setTimeout(
            () => {
                const currentFullText = texts[textIndex];

                if (!isDeleting) {
                    if (currentIndex < currentFullText.length) {
                        setCurrentText(
                            currentFullText.substring(0, currentIndex + 1)
                        );
                        setCurrentIndex(currentIndex + 1);
                    } else {
                        setTimeout(() => setIsDeleting(true), 2000);
                    }
                } else {
                    if (currentIndex > 0) {
                        setCurrentText(
                            currentFullText.substring(0, currentIndex - 1)
                        );
                        setCurrentIndex(currentIndex - 1);
                    } else {
                        setIsDeleting(false);
                        setTextIndex((textIndex + 1) % texts.length);
                    }
                }
            },
            isDeleting ? 50 : 100
        );

        return () => clearTimeout(timeout);
    }, [currentText, currentIndex, isDeleting, textIndex, texts]);

    return (
        <div className="min-h-full bg-gray-50">
            {/* Hero Section */}
            <section className="bg-gradient-to-b from-gray-600 via-gray-300 to-gray-50 text-gray-800 pt-16 pb-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1
                            className="text-[50px] font-bold mb-8 mt-16"
                            style={{ fontFamily: "Poppins, sans-serif" }}
                        >
                            Welcome to :
                        </h1>

                        {/* Large Bro Code SVG */}
                        <div className="mb-8">
                            <img
                                src="/src/assets/black-bro-code.svg"
                                alt="Bro Code"
                                className="mx-auto w-[40rem] h-[] object-contain"
                            />
                        </div>

                        {/* Typewriter Effect */}
                        <div className="h-16 flex items-center justify-center mb-6">
                            <p
                                className="text-[28px] max-w-4xl mx-auto"
                                style={{ fontFamily: "Poppins, sans-serif" }}
                            >
                                {currentText}
                                <span className="animate-pulse">|</span>
                            </p>
                        </div>

                        <p className="text-[20px] text-gray-900 mb-8 w-[60rem] mx-auto text-center">
                            No matter what anyone says, the best way to code is
                            with that one friend — your coding bro. Competing,
                            building, and having fun together. At Bro-Code,
                            we've recreated that same vibe — a place where you
                            can learn, grow, and level up your coding skills
                            with your virtual coding buddy.
                        </p>

                        {/* <button
                            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors mt-8"
                            style={{ fontFamily: "Poppins, sans-serif" }}
                        >
                            Get Started
                        </button> */}
                    </div>
                </div>
            </section>

            {/* Problems Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-3xl shadow-lg p-4">
                        <div className="text-center mb-12 mt-6">
                            <h1
                                className="text-[40px] font-bold text-gray-900 mb-2"
                                style={{ fontFamily: "Poppins, sans-serif" }}
                            >
                                Curated Problems List
                            </h1>
                            <p className="text-lg text-gray-600 mb-8 w-[1000px] mx-auto text-center">
                                Struggling to figure out what to practice? We’ve
                                handpicked the best coding questions across
                                topics to help you level up fast. Start solving,
                                track your progress, and get interview-ready—one
                                question at a time.
                            </p>
                            <div className="flex items-center justify-between max-w-6xl mx-auto">
                                {/* Left side - Image */}
                                <div className="w-[60%] flex justify-center mx-2 rounded-3xl">
                                    <img
                                        src="/src/assets/Difficulty.png"
                                        alt="Difficulty"
                                        className="w-[35rem] object-contain"
                                    />
                                </div>

                                {/* Right side - Stacked Difficulty Boxes */}
                                <div className="w-[40%] space-y-3 mx-2 flex flex-col">
                                    <div className="bg-sky-100 p-4 rounded-lg border border-sky-200 flex items-center justify-between w-96">
                                        <span
                                            className="text-lg font-semibold text-sky-800"
                                            style={{
                                                fontFamily:
                                                    "Poppins, sans-serif",
                                            }}
                                        >
                                            Basic
                                        </span>
                                        <span className="text-sky-600">
                                            Grants 1pt
                                        </span>
                                    </div>
                                    <div className="bg-green-50 p-4 rounded-lg border border-green-200 flex items-center justify-between w-96">
                                        <span
                                            className="text-lg font-semibold text-green-800"
                                            style={{
                                                fontFamily:
                                                    "Poppins, sans-serif",
                                            }}
                                        >
                                            Easy
                                        </span>
                                        <span className="text-green-600">
                                            Grants 2pts
                                        </span>
                                    </div>
                                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 flex items-center justify-between w-96">
                                        <span
                                            className="text-lg font-semibold text-yellow-800"
                                            style={{
                                                fontFamily:
                                                    "Poppins, sans-serif",
                                            }}
                                        >
                                            Medium
                                        </span>
                                        <span className="text-yellow-600">
                                            Grants 5pts
                                        </span>
                                    </div>
                                    <div className="bg-red-50 p-4 rounded-lg border border-red-200 flex items-center justify-between w-96">
                                        <span
                                            className="text-lg font-semibold text-red-800"
                                            style={{
                                                fontFamily:
                                                    "Poppins, sans-serif",
                                            }}
                                        >
                                            Hard
                                        </span>
                                        <span className="text-red-600">
                                            Grants 10pts
                                        </span>
                                    </div>
                                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 flex items-center justify-between w-96">
                                        <span
                                            className="text-lg font-semibold text-purple-800"
                                            style={{
                                                fontFamily:
                                                    "Poppins, sans-serif",
                                            }}
                                        >
                                            God
                                        </span>
                                        <span className="text-purple-600">
                                            Grants 20pts
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <Link
                                to="/problems"
                                className="bg-gray-800 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-600 transition-colors inline-block mt-10"
                                style={{ fontFamily: "Poppins, sans-serif" }}
                            >
                                Browse Problems
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Compiler Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <div className="text-center mb-12">
                            <h1
                                className="text-[40px] font-bold text-gray-900 mb-2"
                                style={{ fontFamily: "Poppins, sans-serif" }}
                            >
                                Online Compiler
                            </h1>
                            <p className="text-lg text-gray-600 mb-8 w-[1000px] mx-auto text-center">
                                Write, compile, and run your code instantly in
                                our powerful online editor
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
                                to="/problems"
                                className="bg-gray-800 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-600 transition-colors inline-block mt-10"
                                style={{ fontFamily: "Poppins, sans-serif" }}
                            >
                                Try Compiler
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Blogs Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <div className="text-center mb-12">
                            <h1
                                className="text-[40px] font-bold text-gray-900 mb-2"
                                style={{ fontFamily: "Poppins, sans-serif" }}
                            >
                                Latest Blogs
                            </h1>
                            <p className="text-lg text-gray-600 mb-8 w-[1000px] mx-auto text-center">
                                Stay updated with the latest programming
                                insights and tutorials
                            </p>
                            <div className="grid md:grid-cols-3 gap-6 mb-8">
                                <div className="bg-white p-6 rounded-lg shadow-md border">
                                    <h3
                                        className="text-xl font-semibold mb-2"
                                        style={{
                                            fontFamily: "Poppins, sans-serif",
                                        }}
                                    >
                                        Getting Started with DSA
                                    </h3>
                                    <p className="text-gray-600 mb-4">
                                        Learn the fundamentals of Data
                                        Structures and Algorithms...
                                    </p>
                                    <span className="text-sm text-gray-500">
                                        2 days ago
                                    </span>
                                </div>
                                <div className="bg-white p-6 rounded-lg shadow-md border">
                                    <h3
                                        className="text-xl font-semibold mb-2"
                                        style={{
                                            fontFamily: "Poppins, sans-serif",
                                        }}
                                    >
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
                                    <h3
                                        className="text-xl font-semibold mb-2"
                                        style={{
                                            fontFamily: "Poppins, sans-serif",
                                        }}
                                    >
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
                                to="/problems"
                                className="bg-gray-800 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-600 transition-colors inline-block mt-10"
                                style={{ fontFamily: "Poppins, sans-serif" }}
                            >
                                Read All Blogs
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Doubts Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <div className="text-center mb-12">
                            <h1
                                className="text-[40px] font-bold text-gray-900 mb-2"
                                style={{ fontFamily: "Poppins, sans-serif" }}
                            >
                                Community Doubts
                            </h1>
                            <p className="text-lg text-gray-600 mb-8 w-[1000px] mx-auto text-center">
                                Get help from the community and help others with
                                their coding doubts
                            </p>
                            <div className="grid md:grid-cols-2 gap-6 mb-8">
                                <div className="bg-white p-6 rounded-lg shadow-md border">
                                    <h3
                                        className="text-lg font-semibold mb-2"
                                        style={{
                                            fontFamily: "Poppins, sans-serif",
                                        }}
                                    >
                                        How to optimize this sorting algorithm?
                                    </h3>
                                    <p className="text-gray-600 mb-2">
                                        I'm trying to improve the time
                                        complexity of my bubble sort...
                                    </p>
                                    <div className="flex justify-between text-sm text-gray-500">
                                        <span>3 answers</span>
                                        <span>2 hours ago</span>
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-lg shadow-md border">
                                    <h3
                                        className="text-lg font-semibold mb-2"
                                        style={{
                                            fontFamily: "Poppins, sans-serif",
                                        }}
                                    >
                                        Understanding pointers in C++
                                    </h3>
                                    <p className="text-gray-600 mb-2">
                                        Can someone explain the difference
                                        between * and & operators...
                                    </p>
                                    <div className="flex justify-between text-sm text-gray-500">
                                        <span>5 answers</span>
                                        <span>4 hours ago</span>
                                    </div>
                                </div>
                            </div>
                            <Link
                                to="/problems"
                                className="bg-gray-800 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-600 transition-colors inline-block mt-10"
                                style={{ fontFamily: "Poppins, sans-serif" }}
                            >
                                Browse Doubts
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Leaderboard Mention Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <div className="text-center">
                            <h1
                                className="text-[40px] font-bold text-gray-900 mb-2"
                                style={{ fontFamily: "Poppins, sans-serif" }}
                            >
                                Compete & Excel
                            </h1>
                            <div className="scale-75 -mt-12">
                                <Podium />
                            </div>
                            <p className="text-lg text-gray-600 mb-8 w-[1000px] mx-auto text-center">
                                Track your progress, compete with peers, and
                                climb the leaderboard
                            </p>
                            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-8 rounded-lg max-w-2xl mx-auto mb-8">
                                <h3
                                    className="text-2xl font-bold mb-4"
                                    style={{
                                        fontFamily: "Poppins, sans-serif",
                                    }}
                                >
                                    🏆 Leaderboard
                                </h3>
                                <p
                                    className="text-lg"
                                    style={{
                                        fontFamily: "Poppins, sans-serif",
                                    }}
                                >
                                    See where you stand among the coding
                                    champions
                                </p>
                            </div>
                            <Link
                                to="/leaderboard"
                                className="bg-yellow-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-yellow-700 transition-colors inline-block"
                                style={{ fontFamily: "Poppins, sans-serif" }}
                            >
                                View Leaderboard
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h3
                        className="text-2xl font-bold mb-4"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                        Bro-Code
                    </h3>
                    <p className="text-gray-400 mb-4">Made with ❤️ by Vatsal</p>
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
