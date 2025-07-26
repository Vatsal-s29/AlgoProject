import React from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

const Layout = () => {
    return (
        <div className="flex flex-col h-screen">
            <Navbar />
            <div className="flex-1 min-h-0  pt-12">
                <Outlet />
            </div>
        </div>
    );
};

// const Layout = () => {
//     return (
//         <div className="min-h-screen flex flex-col pb-3 bg-gray-50">
//             <Navbar />
//             <div className="flex-1 px-3 pt-12">
//                 <Outlet />
//             </div>
//         </div>
//     );
// };

export default Layout;
