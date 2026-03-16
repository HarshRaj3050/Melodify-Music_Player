import React from "react";
import { Link } from "react-router-dom";
import startImg from '../assets/start.png';
import startInner from '../assets/start_inner.png';

import axios from "axios";
import { useEffect } from "react";


const Start = () => {

    useEffect(() => {
        axios.get("http://localhost:3000/")
            .then((response) => {
                console.log(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    return (
        <div className="h-screen w-screen flex items-center justify-center relative">
            <div className="absolute overflow h-full w-full">
                <img src={startImg} className="h-full w-full object-cover" alt="" />
            </div>
            <div className="relative sm:w-[620px] sm:h-[560px] w-full h-full md:rounded-3xl  overflow-hidden shadow-xl  text-white">
                <img src={startInner} alt="" className="hidden sm:block " />
                {/* text content */}
                <div className="absolute top-40 px-10 text-center">
                    <h1 className="text-3xl font-bold mb-3">
                        Welcome Back
                    </h1>

                    <p className="text-sm opacity-90">
                        Enter personal details to your employee account
                    </p>
                </div>

                {/* bottom buttons */}
                <div className="absolute bottom-0 w-full flex">

                    <Link
                        to="api/auth/login"
                        className="w-1/2 text-center py-5 bg-transparent font-semibold"
                    >
                        Sign in
                    </Link>

                    <Link
                        to="/api/auth/register"
                        className="w-1/2 text-center py-5 bg-white text-blue-600 font-semibold md:rounded-br-3xl"
                    >
                        Sign up
                    </Link>

                </div>
            </div>
        </div>
    );
};

export default Start;