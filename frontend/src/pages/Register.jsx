import React, { useState } from "react";

import startImg from '../assets/start.png';
import startInner from '../assets/start_inner.png';
import { ChevronLeft } from 'lucide-react';

import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_URL;

const Register = () => {

    const navigate = useNavigate();

    const goHome = () => { navigate('/') }

    const [formData, setFormData] = useState({
        username: "",
        role: "user",
        email: "",
        password: "",
    });


    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,

        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.username || !formData.email || !formData.password) {
            alert("Please fill all fields");
            return;
        }

        try {
            const res = await axios.post(`${BASE_URL}/api/auth/register`, formData, {
                withCredentials: true
            });
            console.log(res.data);
            alert("User Registered Successfully");

            setFormData({
                username: "",
                role: "user",
                email: "",
                password: ""
            });

            goHome();

        } catch (error) {
            if (error.response) {
                // backend returned error
                console.log(error.response.data.message);
                alert(error.response.data.message);
            } else {
                // network error
                console.log(error.message);
            }

        }
    };

    return (
        <div className="h-screen w-screen flex items-center justify-center relative">
            <div className="absolute overflow-hidden h-full w-full">
                <img src={startImg} className="h-full w-full object-cover " alt="" />
            </div>
            <div className="relative sm:w-155 sm:h-140 w-full h-full  sm:rounded-3xl overflow-hidden shadow-xl">

                {/* background image */}
                <img
                    src={startInner}
                    alt=""
                    className="absolute inset-0 w-full h-full object-none overflow-hidden hidden sm:block z-0"
                />

                <span
                    className="w-20 font-semibold relative flex items-center text-white pl-3 pt-5 cursor-pointer"
                    onClick={goHome
                    }><ChevronLeft /> Back</span>


                <div className="bg-amber-50 w-full h-full relative z-10 sm:mt-20 mt-40 rounded-t-3xl">
                    {/* form content */}
                    <div className="relative z-10 w-full h-full p-6">

                        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
                            Get Started
                        </h2>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                            <div className="flex justify-between gap-5 items-center">
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="Enter Username Name"
                                    className="border rounded-lg p-3 w-full"
                                    onChange={handleChange}
                                />

                                <label htmlFor="role" className="w-full">
                                    <select
                                        name="role"
                                        id="role"
                                        className="w-full border rounded-lg h-12 pl-1"
                                        onChange={handleChange}
                                    >
                                        <option value="user" > User</option>
                                        <option value="artist" > Artist</option>
                                    </select>
                                </label>

                            </div>
                            <div className="flex justify-between gap-5">

                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter Email"
                                    className="border rounded-lg p-3 w-full"
                                    onChange={handleChange}
                                />
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Enter Password"
                                    className="border rounded-lg p-3 w-full"
                                    onChange={handleChange}
                                />
                            </div>


                            <label className="text-sm text-black">
                                <input type="checkbox" className="mr-2" />
                                I agree to the processing of
                                <span className="text-blue-600 font-semibold"> Personal data</span>
                            </label>

                            <button
                                type="submit"
                                className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
                            >
                                Sign Up
                            </button>

                        </form>

                        <div className="relative flex items-center pt-3 gap-1 w-full justify-center">
                            <span className="text-[16px]">Already have an account? </span>
                            <Link
                                to="/api/auth/login"
                                className=" text-center bg-transparent font-semibold relative flex items-center text-blue-600"
                            >
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;