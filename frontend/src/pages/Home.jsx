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
            {/* Ask-Bro Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <div className="text-center mb-12">
                            <h1
                                className="text-[40px] font-bold text-gray-900 mb-2"
                                style={{ fontFamily: "Poppins, sans-serif" }}
                            >
                                Ask-Bro!
                            </h1>
                            <p className="text-lg text-gray-600 mb-8 w-[1000px] mx-auto text-center">
                                Stuck on a problem? Your coding bro is here to
                                help! Ask any programming question and get
                                instant, personalized assistance from our AI
                                companion.
                            </p>

                            {/* Chat Interface Preview */}
                            <div className="bg-gray-50 border rounded-lg max-w-3xl mx-auto mb-8 overflow-hidden">
                                {/* Chat Header */}
                                <div className="bg-gray-800 text-white p-4 flex items-center">
                                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                                        <span className="text-sm font-bold">
                                            B
                                        </span>
                                    </div>
                                    <span
                                        className="font-semibold"
                                        style={{
                                            fontFamily: "Poppins, sans-serif",
                                        }}
                                    >
                                        Bro Assistant
                                    </span>
                                    <div className="ml-auto flex space-x-1">
                                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    </div>
                                </div>

                                {/* Chat Messages */}
                                <div className="p-6 space-y-4 text-left">
                                    <div className="flex justify-end">
                                        <div className="bg-blue-500 text-white p-3 rounded-lg max-w-xs">
                                            <p className="text-sm">
                                                How do I reverse a linked list?
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex justify-start">
                                        <div className="bg-gray-200 text-gray-800 p-3 rounded-lg max-w-md">
                                            <p className="text-sm">
                                                Great question, bro! To reverse
                                                a linked list, you'll need to
                                                use three pointers: prev,
                                                current, and next. Here's the
                                                approach...
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        <div className="bg-blue-500 text-white p-3 rounded-lg max-w-xs">
                                            <p className="text-sm">
                                                Can you show me the code?
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex justify-start">
                                        <div className="bg-gray-200 text-gray-800 p-3 rounded-lg max-w-md">
                                            <p className="text-sm">
                                                Absolutely! Let me write that
                                                out for you... 💻
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Chat Input */}
                                <div className="bg-white border-t p-4">
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="text"
                                            placeholder="Ask your coding question..."
                                            className="flex-1 p-2 border rounded-lg bg-gray-50"
                                            disabled
                                        />
                                        <button
                                            className="bg-blue-500 text-white p-2 rounded-lg"
                                            disabled
                                        >
                                            <span className="text-sm">
                                                Send
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <Link
                                to="/AskBro"
                                className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors inline-block mt-4"
                                style={{ fontFamily: "Poppins, sans-serif" }}
                            >
                                Start Chatting with Bro
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
                                to="/compiler"
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
                                to="/blogs"
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
                                Doubt Resoultion
                            </h1>
                            <p className="text-lg text-gray-600 mb-8 w-[1000px] mx-auto text-center">
                                Get help from the community and help others with
                                their coding doubts
                            </p>

                            {/* Forum-style Interface Preview */}
                            <div className="bg-gray-50 border rounded-lg max-w-4xl mx-auto mb-8 overflow-hidden">
                                {/* Forum Header */}
                                <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4">
                                    <div className="flex items-center justify-between">
                                        <h3
                                            className="text-lg font-semibold"
                                            style={{
                                                fontFamily:
                                                    "Poppins, sans-serif",
                                            }}
                                        >
                                            💬 Doubts
                                        </h3>
                                        <div className="flex items-center space-x-4 text-sm">
                                            <span>🔥 248 Active</span>
                                            <span>❓ 1.2k Questions</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Forum Posts */}
                                <div className="divide-y divide-gray-200">
                                    <div className="p-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-start space-x-3">
                                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                                                A
                                            </div>
                                            <div className="flex-1 text-left">
                                                <h4
                                                    className="font-semibold text-gray-900 mb-1"
                                                    style={{
                                                        fontFamily:
                                                            "Poppins, sans-serif",
                                                    }}
                                                >
                                                    How to optimize this sorting
                                                    algorithm? 🚀
                                                </h4>
                                                <p className="text-gray-600 text-sm mb-2">
                                                    I'm trying to improve the
                                                    time complexity of my bubble
                                                    sort implementation...
                                                </p>
                                                <div className="flex items-center space-x-4 text-xs text-gray-500">
                                                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                                                        Algorithm
                                                    </span>
                                                    <span>👥 3 answers</span>
                                                    <span>⏰ 2 hours ago</span>
                                                    <span>👍 12 likes</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-start space-x-3">
                                            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                                                M
                                            </div>
                                            <div className="flex-1 text-left">
                                                <h4
                                                    className="font-semibold text-gray-900 mb-1"
                                                    style={{
                                                        fontFamily:
                                                            "Poppins, sans-serif",
                                                    }}
                                                >
                                                    Understanding pointers in
                                                    C++ 🎯
                                                </h4>
                                                <p className="text-gray-600 text-sm mb-2">
                                                    Can someone explain the
                                                    difference between * and &
                                                    operators with examples...
                                                </p>
                                                <div className="flex items-center space-x-4 text-xs text-gray-500">
                                                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                        C++
                                                    </span>
                                                    <span>👥 5 answers</span>
                                                    <span>⏰ 4 hours ago</span>
                                                    <span>👍 8 likes</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-start space-x-3">
                                            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold">
                                                S
                                            </div>
                                            <div className="flex-1 text-left">
                                                <h4
                                                    className="font-semibold text-gray-900 mb-1"
                                                    style={{
                                                        fontFamily:
                                                            "Poppins, sans-serif",
                                                    }}
                                                >
                                                    Dynamic Programming approach
                                                    needed 🧠
                                                </h4>
                                                <p className="text-gray-600 text-sm mb-2">
                                                    Looking for an efficient DP
                                                    solution for the coin change
                                                    problem...
                                                </p>
                                                <div className="flex items-center space-x-4 text-xs text-gray-500">
                                                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                                                        DP
                                                    </span>
                                                    <span>👥 2 answers</span>
                                                    <span>⏰ 6 hours ago</span>
                                                    <span>👍 15 likes</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                <div className="bg-white border-t p-4">
                                    <div className="flex items-center justify-between">
                                        <button
                                            className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors"
                                            disabled
                                        >
                                            ❓ Ask Question
                                        </button>
                                        <div className="flex items-center space-x-3 text-sm text-gray-500">
                                            <span>🔍 Search doubts</span>
                                            <span>📊 Browse by tags</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Link
                                to="/doubts"
                                className="bg-purple-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-purple-700 transition-colors inline-block mt-4"
                                style={{ fontFamily: "Poppins, sans-serif" }}
                            >
                                Browse Doubts
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Doubts Section
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
            </section> */}

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
