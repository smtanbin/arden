import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthProvider";

const LoadingPage: React.FC = () => {
    const navigate = useNavigate();
    const { sessionID } = useAuth()

    useEffect(() => {

        if (sessionID !== undefined || null) {
            const timeout = setTimeout(() => {
                console.log("Navigate to home");
                navigate("/");
            }, 500);
            return () => clearTimeout(timeout);
        } else {
            const timeout = setTimeout(() => {
                console.log("Navigate to home");
                navigate("/login")
            }, 500);
            return () => clearTimeout(timeout);
        }
    }, []);

    return (
        <div className="card" aria-hidden="true">
            <img src="..." className="card-img-top" alt="..." />
            <div className="card-body">
                <h5 className="card-title placeholder-glow">
                    <span className="placeholder col-6"></span>
                </h5>
                <p className="card-text placeholder-glow">
                    <span className="placeholder col-7"></span>
                    <span className="placeholder col-4"></span>
                    <span className="placeholder col-4"></span>
                    <span className="placeholder col-6"></span>
                    <span className="placeholder col-8"></span>
                </p>
                <a className="btn btn-primary disabled placeholder col-6" aria-disabled="true"></a>
            </div>
        </div>
    );
};

export default LoadingPage;