import React from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";


const Layout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-1 p-6 overflow-y-auto">
                <Outlet />
            </div>
        </div>
    );
};

export default Layout;
