import React from "react";
import {useNavigate} from "react-router-dom";
import '/src/WelcomePage.css'



const WelcomePage: React.FC = () => {
    const navigate = useNavigate();

    const handleAnyClick = () => {
        navigate('/app');
    }

    return (
        <>
            <div
                className="Welcome-page h-screen w-full flex flex-col items-center justify-center bg-cover bg-center"
                style={{backgroundImage: `url(public/pictures/main.webp)`}}
                onClick={handleAnyClick}
            >
                <h1 className="text-black text-4xl font-bold mb-4">Welcome Dr.</h1>
                <p className="text-black text-xl font-bold blinking">Click anywhere to continue</p>
            </div>
        </>
    );
};

export default WelcomePage;