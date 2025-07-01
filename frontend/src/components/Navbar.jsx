import { useState } from "react";
import { Link } from "react-router-dom";
import { Sun, Moon, User } from "lucide-react";
import blackLogo from "../assets/black-bro-code.svg";

const Navbar = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showSun, setShowSun] = useState(true); // purely visual toggle

    return (
        <div className="w-full h-16 bg-gray-100 px-6 flex items-center justify-between border-b border-gray-200">
            {/* Left side - Logo and Navigation */}
            <div className="flex items-center space-x-8">
                <img
                    src={blackLogo}
                    alt="BroCode Logo"
                    className="h-11 w-auto"
                />
                <nav className="flex items-center space-x-6 text-lg font-medium">
                    <Link
                        to="/"
                        className="hover:text-blue-600 transition-colors"
                    >
                        Home
                    </Link>
                    <Link
                        to="/"
                        className="hover:text-blue-600 transition-colors"
                    >
                        Problems
                    </Link>
                    <Link
                        to="/"
                        className="hover:text-blue-600 transition-colors"
                    >
                        Compiler
                    </Link>
                    <Link
                        to="/"
                        className="hover:text-blue-600 transition-colors"
                    >
                        Ask_Bro
                    </Link>
                </nav>
            </div>

            {/* Right side - Theme toggle and User dropdown */}
            <div className="flex items-center gap-4">
                {/* Static theme toggle icon (no functionality) */}
                <button
                    onClick={() => setShowSun(!showSun)}
                    className="text-gray-700 hover:text-blue-500 transition-colors"
                >
                    {showSun ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                {/* User dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-200 text-gray-800 transition-colors"
                    >
                        <User size={20} />
                        <span>User_Name</span>
                    </button>
                    {dropdownOpen && (
                        <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded shadow-lg z-10 border border-gray-200">
                            <Link
                                to="/"
                                className="block px-4 py-2 hover:bg-gray-100 transition-colors"
                            >
                                Profile
                            </Link>
                            <Link
                                to="/"
                                className="block px-4 py-2 hover:bg-gray-100 transition-colors"
                            >
                                Logout
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
