import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../../config.js";
import DoubtList from "../../components/doubts/DoubtList";
import Spinner from "../../components/Spinner";

const Doubts = ({ isAuthenticated, user }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuthentication();
    }, [isAuthenticated]);

    const checkAuthentication = async () => {
        if (!isAuthenticated) {
            navigate("/login");
            return;
        }
        setLoading(false);
    };

    if (loading) {
        return <Spinner />;
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-full bg-gray-50">
            <DoubtList currentUser={user} />
        </div>
    );
};

export default Doubts;
