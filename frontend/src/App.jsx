import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CreateQuestion from "./pages/CreateQuestions";
import ShowQuestion from "./pages/ShowQuestion";
import EditQuestion from "./pages/EditQuestion";
import DeleteQuestion from "./pages/DeleteQuestion";
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

const App = () => {
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
                <Route path="/change-password" element={<ChangePassword />} />
                <Route path="/stats" element={<UserStats />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/delete-account" element={<DeleteAccount />} />
                <Route path="/logout" element={<Logout />} />
            </Route>
        </Routes>
    );
};

export default App;
