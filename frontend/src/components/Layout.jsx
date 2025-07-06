import React from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

const Layout = () => {
    return (
        <div className="flex flex-col h-screen pb-3">
            <Navbar />
            <div className="flex-1 px-3 min-h-0">
                <Outlet />
            </div>
        </div>
    );
};

export default Layout;
