import { useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

// Floating music note SVG paths
const notes = [
    { top: "12%", left: "8%", size: 22, delay: "0s", duration: "6s", opacity: 0.18 },
    { top: "20%", right: "10%", size: 16, delay: "1.2s", duration: "7s", opacity: 0.13 },
    { top: "38%", left: "5%", size: 14, delay: "2s", duration: "5.5s", opacity: 0.1 },
    { top: "55%", right: "7%", size: 20, delay: "0.5s", duration: "8s", opacity: 0.15 },
    { top: "70%", left: "14%", size: 12, delay: "3s", duration: "6.5s", opacity: 0.09 },
    { top: "30%", left: "50%", size: 10, delay: "1.8s", duration: "7.5s", opacity: 0.08 },
];

export default function Start() {
    useEffect(() => {
        axios.get(`${BASE_URL}/`)
            .then((res) => console.log(res.data))
            .catch((err) => console.log(err));
    }, []);

    return (
        <div
            className="h-dvh w-dvw flex items-center justify-center overflow-hidden"
            style={{ background: "#0c0c0f", fontFamily: "'Nunito', sans-serif" }}
        >
            {/* ── Full-screen card ── */}
            <div
                className="relative w-full h-full overflow-hidden flex flex-col"
                style={{
                    background: "#111113",
                    boxShadow: "0 40px 120px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.06)",
                }}
            >
                {/* ── Background layers ── */}

                {/* Deep gradient base */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: "linear-gradient(160deg, #0d0d10 0%, #131020 40%, #0e1528 70%, #0d0d10 100%)",
                    }}
                />

                {/* Radial glows */}
                <div className="absolute inset-0 pointer-events-none">
                    <div style={{
                        position: "absolute", top: "-60px", left: "-60px",
                        width: "340px", height: "340px", borderRadius: "50%",
                        background: "radial-gradient(circle, rgba(163,230,53,0.12) 0%, transparent 70%)",
                        filter: "blur(40px)",
                    }} />
                    <div style={{
                        position: "absolute", top: "30%", right: "-80px",
                        width: "280px", height: "280px", borderRadius: "50%",
                        background: "radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)",
                        filter: "blur(50px)",
                    }} />
                    <div style={{
                        position: "absolute", bottom: "10%", left: "10%",
                        width: "220px", height: "220px", borderRadius: "50%",
                        background: "radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)",
                        filter: "blur(40px)",
                    }} />
                </div>

                {/* Floating music notes */}
                {notes.map((n, i) => (
                    <div
                        key={i}
                        className="absolute pointer-events-none"
                        style={{
                            top: n.top, left: n.left, right: n.right,
                            opacity: n.opacity,
                            animation: `floatNote ${n.duration} ease-in-out infinite alternate`,
                            animationDelay: n.delay,
                        }}
                    >
                        <svg width={n.size} height={n.size} viewBox="0 0 24 24" fill="#a3e635">
                            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                        </svg>
                    </div>
                ))}

                {/* Subtle grid overlay */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        backgroundImage: "linear-gradient(rgba(163,230,53,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(163,230,53,0.03) 1px, transparent 1px)",
                        backgroundSize: "40px 40px",
                    }}
                />

                {/* ── Content ── */}
                <div className="relative z-10 flex flex-col h-full">

                    {/* Top: Logo area */}
                    <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">

                        {/* Icon + brand */}
                        <div className="mb-10">
                            <div
                                className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-5"
                                style={{
                                    background: "rgba(163,230,53,0.1)",
                                    border: "1px solid rgba(163,230,53,0.2)",
                                    boxShadow: "0 0 40px rgba(163,230,53,0.15), inset 0 0 20px rgba(163,230,53,0.05)",
                                    animation: "pulseGlow 3s ease-in-out infinite",
                                }}
                            >
                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10" style={{ color: "#a3e635" }}>
                                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                                </svg>
                            </div>
                            <h1
                                className="text-5xl font-black text-white mb-2"
                                style={{ letterSpacing: "-0.02em", textShadow: "0 0 40px rgba(163,230,53,0.2)" }}
                            >
                                Melodify
                            </h1>
                            <p
                                className="text-sm font-semibold leading-relaxed max-w-xs mx-auto"
                                style={{ color: "rgba(255,255,255,0.35)" }}
                            >
                                Find new music, build playlists,<br />and enjoy every single beat
                            </p>
                        </div>

                        {/* Feature pills */}
                        <div className="flex flex-wrap gap-2 justify-center mb-2">
                            {["🎵 Singing practice", "🎧 Group song mode", "📱 Make new Friend"].map((f) => (
                                <span
                                    key={f}
                                    className="text-xs font-bold px-3 py-1.5 rounded-full"
                                    style={{
                                        background: "rgba(255,255,255,0.05)",
                                        border: "1px solid rgba(255,255,255,0.08)",
                                        color: "rgba(255,255,255,0.4)",
                                    }}
                                >
                                    {f}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Bottom: CTA buttons */}
                    <div className="px-6 pb-10 pt-4 flex flex-col items-center">
                        {/* Sign Up — primary */}
                        <Link
                            to="/api/auth/register"
                            className="block w-full max-w-120 text-center py-4 rounded-2xl font-extrabold text-base mb-3 transition-all active:scale-95"
                            style={{
                                background: "#a3e635",
                                color: "#0d0d10",
                                boxShadow: "0 8px 30px rgba(163,230,53,0.3)",
                                letterSpacing: "0.02em",
                            }}
                        >
                            Get Started Free
                        </Link>

                        {/* Sign In — secondary */}
                        <Link
                            to="/api/auth/login"
                            className="block w-full max-w-120 text-center py-4 rounded-2xl font-extrabold text-base transition-all active:scale-95"
                            style={{
                                background: "rgba(255,255,255,0.05)",
                                border: "1px solid rgba(255,255,255,0.1)",
                                color: "rgba(255,255,255,0.7)",
                            }}
                        >
                            Sign In
                        </Link>

                        <p className="text-center text-xs mt-4" style={{ color: "rgba(255,255,255,0.18)" }}>
                            By continuing you agree to our Terms & Privacy Policy
                        </p>
                    </div>
                </div>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');

                @keyframes floatNote {
                    from { transform: translateY(0px) rotate(-5deg); }
                    to   { transform: translateY(-18px) rotate(5deg); }
                }
                @keyframes pulseGlow {
                    0%, 100% { box-shadow: 0 0 40px rgba(163,230,53,0.15), inset 0 0 20px rgba(163,230,53,0.05); }
                    50%       { box-shadow: 0 0 60px rgba(163,230,53,0.3), inset 0 0 30px rgba(163,230,53,0.1); }
                }
            `}</style>
        </div>
    );
}