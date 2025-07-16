import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { BACKEND_URL } from "../config.js";

// Questions
import Home from "./pages/Home";
import CreateQuestion from "./pages/CreateQuestions";
import ShowQuestion from "./pages/ShowQuestion";
import EditQuestion from "./pages/EditQuestion";
import DeleteQuestion from "./pages/DeleteQuestion";

// Auth / User
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import ChangePassword from "./pages/ChangePassword";
import UserStats from "./pages/UserStats";
import Leaderboard from "./pages/Leaderboard";
import DeleteAccount from "./pages/DeleteAccount";
import Logout from "./pages/Logout";
import Layout from "./components/Layout";

// Blogs
import Blogs from "./pages/Blogs";
import CreateBlog from "./pages/CreateBlog";
import EditBlog from "./pages/EditBlog";
import BlogDetail from "./components/BlogDetail";

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

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

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
            </div>
        );
    }

    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/questions/create" element={<CreateQuestion />} />
                <Route
                    path="/questions/details/:id"
                    element={<ShowQuestion />}
                />
                <Route path="/questions/edit/:id" element={<EditQuestion />} />
                <Route
                    path="/questions/delete/:id"
                    element={<DeleteQuestion />}
                />
                {/* Auth routes */}
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/profile/edit" element={<EditProfile />} />
                <Route
                    path="/profile/change-password"
                    element={<ChangePassword />}
                />
                <Route path="/stats" element={<UserStats />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/delete-account" element={<DeleteAccount />} />
                <Route path="/logout" element={<Logout />} />

                {/* Blog routes */}
                <Route
                    path="/blogs"
                    element={
                        <Blogs isAuthenticated={isAuthenticated} user={user} />
                    }
                />
                <Route
                    path="/blog/:id"
                    element={
                        <BlogDetail
                            isAuthenticated={isAuthenticated}
                            user={user}
                        />
                    }
                />
                <Route
                    path="/create-blog"
                    element={<CreateBlog isAuthenticated={isAuthenticated} />}
                />
                <Route
                    path="/edit-blog/:id"
                    element={
                        <EditBlog
                            isAuthenticated={isAuthenticated}
                            user={user}
                        />
                    }
                />
            </Route>
        </Routes>
    );
};

export default App;
