import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CreateQuestion from "./pages/CreateQuestions";
import ShowQuestion from "./pages/ShowQuestion";
import EditQuestion from "./pages/EditQuestion";
import DeleteQuestion from "./pages/DeleteQuestion";
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
            </Route>
        </Routes>
    );
};

export default App;
