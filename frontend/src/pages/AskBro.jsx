import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { GEMINI_API_KEY2 } from "../../config";

const AskBro = () => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Hey! What's up? Want my help again huh? 🤙",
            sender: "ai",
            timestamp: new Date(),
        },
    ]);
    const [inputMessage, setInputMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const getContextMessages = () => {
        // Get last 10 messages (5 user + 5 AI pairs max)
        const recentMessages = messages.slice(-10);

        return recentMessages
            .map((msg) => {
                const role = msg.sender === "user" ? "You" : "Bro";
                return `${role}: ${msg.text}`;
            })
            .join("\n");
    };

    const generateBroResponse = async (userMessage) => {
        const context = getContextMessages();

        try {
            const response = await fetch(
                "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-goog-api-key": `${GEMINI_API_KEY2}`, // Replace with your actual API key
                    },
                    body: JSON.stringify({
                        contents: [
                            {
                                parts: [
                                    {
                                        text: `You are my friend - casual, friendly, supportive, and speak like a close friend. Use casual language (but not too casual), and be encouraging. Keep responses conversational. Use emojis when appropriate. Remember to give short and crisp answers. Remember to give answers for gender neutral user.

Previous conversation context:
${context}

Current question: ${userMessage}

Respond as my friend would - be helpful but keep it real. Format your response in markdown if needed for better readability.`,
                                    },
                                ],
                            },
                        ],
                    }),
                }
            );

            const data = await response.json();
            if (data.candidates && data.candidates[0]) {
                return data.candidates[0].content.parts[0].text;
            } else {
                return "Yo bro, something went wrong on my end. Can you try asking again? 😅";
            }
        } catch (error) {
            console.error("Error generating bro response:", error);
            return "Dude, I'm having some technical difficulties right now. Mind trying again? 🤷‍♂️";
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputMessage.trim() || isLoading) return;

        const userMessage = inputMessage.trim();
        setInputMessage("");

        // Add user message
        const newUserMessage = {
            id: Date.now(),
            text: userMessage,
            sender: "user",
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, newUserMessage]);
        setIsLoading(true);

        // Generate AI response
        const broResponse = await generateBroResponse(userMessage);

        // Add AI response
        const newAIMessage = {
            id: Date.now() + 1,
            text: broResponse,
            sender: "ai",
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, newAIMessage]);
        setIsLoading(false);
    };

    const formatTime = (timestamp) => {
        return timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="flex flex-col h-full bg-gray-50 pt-4">
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4">
                <div className="max-w-4xl mx-auto space-y-4">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${
                                message.sender === "user"
                                    ? "justify-end"
                                    : "justify-start"
                            }`}
                        >
                            <div
                                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow ${
                                    message.sender === "user"
                                        ? "bg-blue-500 text-white"
                                        : "bg-white text-gray-800 border"
                                }`}
                            >
                                {message.sender === "ai" ? (
                                    <div className="prose prose-sm max-w-none">
                                        <ReactMarkdown
                                            components={{
                                                p: ({ children }) => (
                                                    <p className="mb-2 last:mb-0">
                                                        {children}
                                                    </p>
                                                ),
                                                strong: ({ children }) => (
                                                    <strong className="font-semibold">
                                                        {children}
                                                    </strong>
                                                ),
                                                em: ({ children }) => (
                                                    <em className="italic">
                                                        {children}
                                                    </em>
                                                ),
                                                code: ({ children }) => (
                                                    <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">
                                                        {children}
                                                    </code>
                                                ),
                                                ul: ({ children }) => (
                                                    <ul className="list-disc ml-4 mb-2">
                                                        {children}
                                                    </ul>
                                                ),
                                                ol: ({ children }) => (
                                                    <ol className="list-decimal ml-4 mb-2">
                                                        {children}
                                                    </ol>
                                                ),
                                                li: ({ children }) => (
                                                    <li className="mb-1">
                                                        {children}
                                                    </li>
                                                ),
                                            }}
                                        >
                                            {message.text}
                                        </ReactMarkdown>
                                    </div>
                                ) : (
                                    <p className="whitespace-pre-wrap">
                                        {message.text}
                                    </p>
                                )}
                                <div
                                    className={`text-xs mt-1 ${
                                        message.sender === "user"
                                            ? "text-blue-100"
                                            : "text-gray-500"
                                    }`}
                                >
                                    {formatTime(message.timestamp)}
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Loading indicator */}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-white text-gray-800 border max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow">
                                <div className="flex items-center space-x-2">
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                        <div
                                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                            style={{ animationDelay: "0.1s" }}
                                        ></div>
                                        <div
                                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                            style={{ animationDelay: "0.2s" }}
                                        ></div>
                                    </div>
                                    <span className="text-sm text-gray-500">
                                        Bro is thinking...
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Form */}
            <div className="bg-white border-t p-4">
                <div className="max-w-4xl mx-auto">
                    <form
                        onSubmit={handleSendMessage}
                        className="flex space-x-2"
                    >
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            placeholder="Ask your bro anything..."
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={!inputMessage.trim() || isLoading}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isLoading ? "Sending..." : "Send"}
                        </button>
                    </form>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                        Bro's got a short memory and can only remember the last
                        10 messages from current conversation.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AskBro;
