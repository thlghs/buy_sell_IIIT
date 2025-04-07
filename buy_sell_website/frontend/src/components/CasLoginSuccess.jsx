import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CasLoginSuccess = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("token");

        if (token) {
            console.log("Token received from CAS:", token);
            localStorage.setItem("token", token);
            navigate("/profile");  
        }
        else {
            console.log("No token received, redirecting to login.");
            navigate("/profile");  
        }
    }, [navigate]);

    return <div>Logging you in...</div>;
};

export default CasLoginSuccess;
