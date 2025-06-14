import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/Store";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
    const user = useSelector((state: RootState) => state.user);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || !user.id) {
            navigate("/login");
        }
    }, [user, navigate]);

    

    return (
        <>
            {/* Conteúdo da Home */}
        </>
    );
};

export default Home;