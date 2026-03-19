import React, { useState } from "react";
import startImg from '../assets/start.png';
import startInner from '../assets/start_inner.png';
import { ChevronLeft } from 'lucide-react';

const BASE_URL = import.meta.env.VITE_API_URL;

import axios from "axios";

import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Login = () => {

    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const goHome = () => { navigate('/') }


    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,

        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // console.log(formData);

        if (!formData.username || !formData.password) {
            alert("Please fill all fields");
            return;
        }

        try {
            const res = await axios.post(
                `${BASE_URL}/api/auth/login`,
                formData,
                { withCredentials: true }
            );


            console.log(res.data);

            setFormData({
                username: "",
                password: ""
            });

            navigate('/musics')

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
        <div
            className="h-dvh w-dvw flex justify-center items-end"
            style={{ background: "#111113", fontFamily: "'Nunito', 'Segoe UI', sans-serif" }}
        >
            <div className="md:max-w-175 w-full">
                {/* ── Top hero area ── */}
                <div className="absolute inset-0 overflow-hidden">
                    {/* Deep purple/pink ambient mesh */}
                    <div
                        className="absolute inset-0"
                        style={{
                            background: "linear-gradient(160deg, #1a0533 0%, #2d1b6e 30%, #0f1a3d 60%, #111113 100%)",
                        }}
                    />
                    {/* Glowing orbs */}
                    <div className="absolute top-0 left-0 right-0 h-72 pointer-events-none">
                        <div
                            style={{
                                position: "absolute",
                                top: "-40px",
                                left: "-40px",
                                width: "260px",
                                height: "260px",
                                borderRadius: "50%",
                                background: "radial-gradient(circle, rgba(168,85,247,0.45) 0%, transparent 70%)",
                                filter: "blur(30px)",
                            }}
                        />
                        <div
                            style={{
                                position: "absolute",
                                top: "20px",
                                right: "-60px",
                                width: "220px",
                                height: "220px",
                                borderRadius: "50%",
                                background: "radial-gradient(circle, rgba(99,102,241,0.35) 0%, transparent 70%)",
                                filter: "blur(40px)",
                            }}
                        />
                        <div
                            style={{
                                position: "absolute",
                                top: "60px",
                                left: "50%",
                                transform: "translateX(-50%)",
                                width: "180px",
                                height: "180px",
                                borderRadius: "50%",
                                background: "radial-gradient(circle, rgba(163,230,53,0.12) 0%, transparent 70%)",
                                filter: "blur(25px)",
                            }}
                        />
                    </div>

                    {/* Music note decoration */}
                    <div className="absolute top-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                        <div
                            className="w-16 h-16 rounded-3xl flex items-center justify-center"
                            style={{ background: "rgba(255,255,255,0.07)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.12)" }}
                        >
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8" style={{ color: "#a3e635" }}>
                                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                            </svg>
                        </div>
                        <p className="text-white font-extrabold text-lg tracking-widest" style={{ letterSpacing: "0.2em" }}>MELODIFY</p>
                        <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>Your music, your world</p>
                    </div>
                </div>

                {/* Back button */}
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-5 left-5 z-20 flex items-center gap-1 text-sm font-semibold transition-all"
                    style={{ color: "rgba(255,255,255,0.6)" }}
                >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                </button>

                {/* ── Bottom sheet card ── */}
                <div
                    className="relative z-10 w-full rounded-t-3xl px-6 pt-8 pb-10"
                    style={{
                        background: "rgba(18,18,22,0.97)",
                        backdropFilter: "blur(30px)",
                        border: "1px solid rgba(255,255,255,0.07)",
                        borderBottom: "none",
                        maxHeight: "70vh",
                    }}
                >
                    {/* Handle bar */}
                    <div className="w-10 h-1 rounded-full mx-auto mb-6" style={{ background: "rgba(255,255,255,0.15)" }} />

                    <h2 className="text-2xl font-extrabold text-white mb-1">Welcome back</h2>
                    <p className="text-sm mb-7" style={{ color: "rgba(255,255,255,0.35)" }}>Sign in to continue listening</p>

                    {/* Form */}
                    <div className="flex flex-col gap-3">
                        {/* Username */}
                        <div
                            className="flex items-center gap-3 px-4 py-3.5 rounded-2xl"
                            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                        >
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0" style={{ color: "rgba(255,255,255,0.3)" }}>
                                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                            </svg>
                            <input
                                type="text"
                                name="username"
                                placeholder="Username or Email"
                                className="flex-1 bg-transparent text-sm font-semibold text-white placeholder-white/20 outline-none"
                                onChange={handleChange}
                            />
                        </div>

                        {/* Password */}
                        <div
                            className="flex items-center gap-3 px-4 py-3.5 rounded-2xl"
                            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                        >
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0" style={{ color: "rgba(255,255,255,0.3)" }}>
                                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                            </svg>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Password"
                                className="flex-1 bg-transparent text-sm font-semibold text-white placeholder-white/20 outline-none"
                                onChange={handleChange}
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? (
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4" style={{ color: "rgba(255,255,255,0.3)" }}>
                                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22" />
                                    </svg>
                                ) : (
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4" style={{ color: "rgba(255,255,255,0.3)" }}>
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                                    </svg>
                                )}
                            </button>
                        </div>

                        {/* Sign In */}
                        <button
                            onClick={handleSubmit}
                            className="w-full py-3.5 rounded-2xl font-bold text-sm mt-1 transition-all active:scale-95"
                            style={{ background: "#a3e635", color: "#111" }}
                        >
                            Sign In
                        </button>
                    </div>

                    {/* Register link */}
                    <p className="text-center text-sm mt-5" style={{ color: "rgba(255,255,255,0.35)" }}>
                        Don't have an account?{" "}
                        <Link to="/api/auth/register" className="font-bold" style={{ color: "#a3e635" }}>
                            Sign Up
                        </Link>
                    </p>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-5">
                        <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
                        <span className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>or</span>
                        <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
                    </div>

                    {/* Artist Sign In */}
                    <Link
                        to="/Artist"
                        className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-bold text-sm transition-all active:scale-95"
                        style={{
                            background: "rgba(163,230,53,0.08)",
                            border: "1px solid rgba(163,230,53,0.2)",
                            color: "#a3e635",
                        }}
                    >
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                        </svg>
                        Artist Sign In
                    </Link>
                </div>

                <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
            `}</style>
            </div>
        </div>
    )
}

export default Login;