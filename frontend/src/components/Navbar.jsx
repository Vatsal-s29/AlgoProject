import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sun, Moon, User } from "lucide-react";
import blackLogo from "../assets/black-bro-code.svg";
import { BACKEND_URL } from "../../config.js";

const Navbar = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showSun, setShowSun] = useState(true); // purely visual toggle
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const location = useLocation(); // Add this line

    // Check authentication status on component mount
    useEffect(() => {
        checkAuthStatus();
    }, [location.pathname]);

    const checkAuthStatus = async () => {
        try {
            const response = await fetch(`${BACKEND_URL}/api/auth/status`, {
                credentials: "include",
            });
            const data = await response.json();

            if (response.ok && data.authenticated) {
                setIsAuthenticated(true);
                setUser(data.user);
            } else {
                setIsAuthenticated(false);
                setUser(null);
            }
        } catch (error) {
            setIsAuthenticated(false);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownOpen && !event.target.closest(".user-dropdown")) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [dropdownOpen]);

    return (
        <div className="w-full h-12 bg-gray-100 px-6 flex items-center justify-between border-b border-gray-200">
            {/* Left side - Logo and Navigation  */}
            <div className="flex items-center space-x-8">
                <nav className="flex items-center space-x-6 font-medium">
                    <Link
                        to="/"
                        className="hover:text-blue-600 transition-colors"
                    >
                        <img
                            src={blackLogo}
                            alt="BroCode Logo"
                            className="h-9 w-auto"
                        />
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
                        Ask-Bro😎
                    </Link>
                    <Link
                        to="/leaderboard"
                        className="hover:text-blue-600 transition-colors"
                    >
                        Leaderboard
                    </Link>
                    <Link to="/blogs" className="nav-link">
                        Blogs
                    </Link>
                </nav>
            </div>

            {/* Right side - Theme toggle and User section */}
            <div className="flex items-center gap-4">
                {/* Static theme toggle icon (no functionality) */}
                <button
                    onClick={() => setShowSun(!showSun)}
                    className="text-gray-700 hover:text-blue-500 transition-colors"
                >
                    {showSun ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                {/* User section */}
                {loading ? (
                    <div className="flex items-center gap-2 px-4 py-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                    </div>
                ) : isAuthenticated ? (
                    /* Authenticated user dropdown */
                    <div className="relative user-dropdown">
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-200 text-gray-800 transition-colors"
                        >
                            <User size={20} />
                            <span>{user?.username || "User"}</span>
                        </button>
                        {dropdownOpen && (
                            <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded shadow-lg z-10 border border-gray-200">
                                <Link
                                    to="/profile"
                                    className="block px-4 py-2 hover:bg-gray-100 transition-colors"
                                    onClick={() => setDropdownOpen(false)}
                                >
                                    Profile
                                </Link>
                                <Link
                                    to="/stats"
                                    className="block px-4 py-2 hover:bg-gray-100 transition-colors"
                                    onClick={() => setDropdownOpen(false)}
                                >
                                    My Stats
                                </Link>
                                <Link
                                    to="/logout"
                                    className="block px-4 py-2 hover:bg-gray-100 transition-colors"
                                    onClick={() => setDropdownOpen(false)}
                                >
                                    Logout
                                </Link>
                            </div>
                        )}
                    </div>
                ) : (
                    /* Not authenticated - show login button */
                    <Link
                        to="/login"
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                        Login
                    </Link>
                )}
            </div>
        </div>
    );
};

export default Navbar;
