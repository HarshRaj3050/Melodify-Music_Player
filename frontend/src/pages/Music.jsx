import { useState, useEffect, useRef } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;
import { useNavigate } from "react-router-dom";

import BottomNav from "../components/BottomNav";

const tabs = ["All", "New Release", "Trending", "Top Charts"];

const navItems = [
    {
        id: "home",
        label: "Home",
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
        ),
    },
    {
        id: "library",
        label: "Library",
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z" />
            </svg>
        ),
    },
    {
        id: "repeat",
        label: "Queue",
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" />
            </svg>
        ),
    },
    {
        id: "device",
        label: "Devices",
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M17 1H7c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zm0 18H7V5h10v14zM12 18c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1z" />
            </svg>
        ),
    },
    {
        id: "settings",
        label: "Settings",
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.488.488 0 00-.59-.22l-2.39.96a7.02 7.02 0 00-1.62-.94l-.36-2.54a.484.484 0 00-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.47.47 0 00-.59.22L2.74 9.87a.48.48 0 00.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58a.49.49 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.37 1.04.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.57 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32a.49.49 0 00-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
            </svg>
        ),
    },
];

let screenHeight = screen.height;

// ── Mini waveform bars animation (shown on active track) ──────────────────────
function WaveBars({ isPlaying }) {
    return (
        <div className="flex items-end gap-0.5 h-4">
            {[1, 2, 3, 4].map((i) => (
                <div
                    key={i}
                    className="w-0.5 rounded-full"
                    style={{
                        background: "#a3e635",
                        height: isPlaying ? undefined : "4px",
                        animation: isPlaying ? `wave${i} 0.8s ease-in-out infinite alternate` : "none",
                    }}
                />
            ))}
            <style>{`
                @keyframes wave1 { from { height: 4px } to { height: 14px } }
                @keyframes wave2 { from { height: 8px } to { height: 6px } }
                @keyframes wave3 { from { height: 12px } to { height: 4px } }
                @keyframes wave4 { from { height: 5px } to { height: 13px } }
            `}</style>
        </div>
    );
}

export default function Music() {
    const [activeTab, setActiveTab] = useState("All");
    const [activeNav, setActiveNav] = useState("home");
    const [liked, setLiked] = useState(false);
    const [playlists, setPlaylists] = useState([]);

    const [username, setUsername] = useState("Tester");

    // ── Audio state ────────────────────────────────────────────────────────────
    const audioRef = useRef(null);                    // single <audio> element
    const [currentId, setCurrentId] = useState(null); // id of the playing track
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);      // 0-100
    const [duration, setDuration] = useState(0);

    let screenHeight = screen.height;
    const navigate = useNavigate();

    // ── Fetch music from your API ──────────────────────────────────────────────


    const [page, setPage] = useState(1);

    async function getAllMusic(pageNum) {          // ← accept page as argument
        try {
            const res = await axios.get(`${BASE_URL}/api/music/musics?page=${pageNum}`, {
                withCredentials: true
            });
            const data = res.data;
            setUsername(data.username);
            const allMusics = data?.musics || [];

            const formattedPlaylists = allMusics.map((e) => ({
                id: e._id,
                title: e.title,
                artist: e.artist.username,
                cover: e.coverUrl || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=80&h=80&fit=crop",
                uri: e.uri,
            }));

            if (pageNum === 1) {
                setPlaylists(formattedPlaylists);           // first load → replace
            } else {
                setPlaylists(prev => [...prev, ...formattedPlaylists]); // append
            }

            setPage(pageNum + 1);                           // ← increment after fetch

        } catch (error) {
            if (error.response?.status === 401) { navigate("/"); }
            if (error.response?.status === 403) { alert("Access denied"); }
        }
    }

    function moreSong() {
        getAllMusic(page);
    }



    useEffect(() => {
        getAllMusic(1);
        // Create a single persistent Audio instance
        audioRef.current = new Audio();

        audioRef.current.addEventListener("timeupdate", () => {
            const audio = audioRef.current;
            if (audio.duration) {
                setProgress((audio.currentTime / audio.duration) * 100);
            }
        });

        audioRef.current.addEventListener("loadedmetadata", () => {
            setDuration(audioRef.current.duration);
        });

        audioRef.current.addEventListener("ended", () => {
            setIsPlaying(false);
            setProgress(0);
        });

        return () => {
            audioRef.current.pause();
            audioRef.current = null;
        };
    }, []);

    // ── Play / Pause a track ───────────────────────────────────────────────────
    function handlePlayPause(playlist) {
        const audio = audioRef.current;
        if (!audio) return;

        if (currentId === playlist.id) {
            // Same track → toggle play/pause
            if (isPlaying) {
                audio.pause();
                setIsPlaying(false);
            } else {
                audio.play();
                setIsPlaying(true);
            }
        } else {
            // Different track → swap source and play
            audio.pause();
            audio.src = playlist.uri;
            audio.load();
            audio.play();
            setCurrentId(playlist.id);
            setIsPlaying(true);
            setProgress(0);
        }
    }

    // ── Seek bar click ─────────────────────────────────────────────────────────
    function handleSeek(e) {
        const audio = audioRef.current;
        if (!audio || !audio.duration) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const ratio = (e.clientX - rect.left) / rect.width;
        audio.currentTime = ratio * audio.duration;
        setProgress(ratio * 100);
    }

    // ── Format seconds → m:ss ─────────────────────────────────────────────────
    function fmt(s) {
        if (!s || isNaN(s)) return "0:00";
        return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
    }

    const currentTrack = playlists.find((p) => p.id === currentId);

    return (
        <div
            className="h-dvh w-dvw flex justify-center"
            style={{
                background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 70%, #1a1a2e 100%)",
                fontFamily: "'Nunito', 'Segoe UI', sans-serif",
            }}
        >
            {/* ── Main container ──────────────────────────────────────────────── */}
            <div
                className="relative w-full h-full overflow-hidden shadow-2xl pt-6"
                style={{
                    background: "#111113",
                    boxShadow: "0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.07)",
                }}
            >
                {/* Ambient glow */}
                <div
                    className="absolute top-0 left-0 right-0 h-64 pointer-events-none"
                    style={{
                        background:
                            "radial-gradient(ellipse 80% 60% at 30% 0%, rgba(220,80,180,0.35) 0%, rgba(100,60,200,0.2) 50%, transparent 100%)",
                    }}
                />

                {/* ── Header ──────────────────────────────────────────────────── */}
                <div className="relative z-10 flex items-center justify-between px-6 pb-4">
                    <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-white/20">
                        <img
                            src="https://plus.unsplash.com/premium_photo-1739405177421-de315b3606dd?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex gap-3">
                        <button className="w-9 h-9 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white hover:bg-white/20 transition-all">
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                            </svg>
                        </button>
                        <button
                            onClick={() => setLiked(!liked)}
                            className="w-9 h-9 rounded-full bg-white/10 backdrop-blur flex items-center justify-center transition-all hover:bg-white/20"
                            style={{ color: liked ? "#e879f9" : "white" }}
                        >
                            <svg viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* ── Greeting ────────────────────────────────────────────────── */}
                <div className="relative z-10 px-6 pb-5">
                    <h1 className="text-3xl font-bold text-white tracking-tight">Hi, {username.toUpperCase()}</h1>
                </div>

                {/* ── Tabs ────────────────────────────────────────────────────── */}
                <div className="relative z-10 flex gap-2 px-6 pb-6 overflow-x-auto no-scrollbar">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className="whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200"
                            style={{
                                background: activeTab === tab ? "#a3e635" : "rgba(255,255,255,0.1)",
                                color: activeTab === tab ? "#111" : "rgba(255,255,255,0.7)",
                                flexShrink: 0,
                            }}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* ── Curated & Trending card ──────────────────────────────────── */}

                <div className="relative z-10 px-6 pb-4">
                    {
                        screenHeight > 750 ? (
                            <><h2 className="text-lg font-bold text-white mb-3">Curated &amp; trending</h2><div
                                className="relative rounded-2xl overflow-hidden"
                                style={{
                                    background: "linear-gradient(135deg, #c084fc 0%, #a855f7 60%, #7c3aed 100%)",
                                    minHeight: "130px",
                                }}
                            >
                                <div className="absolute right-0 top-0 bottom-0 w-40 overflow-hidden">
                                    <img
                                        src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop"
                                        alt="Discover Weekly"
                                        className="w-full h-full object-cover opacity-70"
                                        style={{ filter: "saturate(1.3)" }} />
                                    <div className="absolute inset-0" style={{ background: "linear-gradient(to right, #a855f7 0%, transparent 60%)" }} />
                                </div>
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-16 rounded-l-lg" style={{ background: "#a3e635" }} />
                                <div className="relative z-10 p-4">
                                    <h3 className="text-white font-bold text-base mb-1">Discover weekly</h3>
                                    <p className="text-purple-100 text-xs leading-relaxed mb-4 max-w-40">
                                        The original slow instrumental best playlists.
                                    </p>
                                    <div className="flex items-center gap-4">
                                        <button
                                            className="w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90"
                                            style={{ background: "#5b21b6" }}
                                        >
                                            <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4" style={{ marginLeft: "2px" }}>
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        </button>
                                        <button className="text-white/80 hover:text-white transition-colors">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                                                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                                            </svg>
                                        </button>
                                        <button className="text-white/80 hover:text-white transition-colors">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                                                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                                            </svg>
                                        </button>
                                        <button className="text-white/80 hover:text-white transition-colors">
                                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div></>
                        ) : (
                            <></>
                        )

                    }

                </div>

                {/* ── Playlist list ────────────────────────────────────────────── */}
                <div className="relative z-10 px-6" style={{ paddingBottom: currentTrack ? "160px" : "90px" }}>
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-lg font-bold text-white">Top daily playlists</h2>
                        <button className="text-sm font-medium" style={{ color: "#a3e635" }} onClick={moreSong}>See more</button>
                    </div>

                    <div className="flex flex-col gap-3 overflow-y-auto no-scrollbar" style={{ maxHeight: "230px" }}>
                        {playlists.map((playlist) => {
                            const isActive = currentId === playlist.id;
                            return (
                                <div
                                    key={playlist.id}
                                    onClick={() => handlePlayPause(playlist)}
                                    className="flex items-center gap-3 group cursor-pointer rounded-xl px-2 py-1 transition-all duration-200"
                                    style={{
                                        background: isActive ? "rgba(163,230,53,0.08)" : "transparent",
                                        border: isActive ? "1px solid rgba(163,230,53,0.2)" : "1px solid transparent",
                                    }}
                                >
                                    {/* Cover */}
                                    <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0">
                                        <img
                                            src={playlist.cover}
                                            alt={playlist.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        {/* Overlay play icon on hover (non-active) */}
                                        {!isActive && (
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
                                                    <path d="M8 5v14l11-7z" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <p
                                            className="font-semibold text-sm truncate"
                                            style={{ color: isActive ? "#a3e635" : "white" }}
                                        >
                                            {playlist.title}
                                        </p>
                                        <p className="text-xs mt-0.5 truncate" style={{ color: "rgba(255,255,255,0.45)" }}>
                                            By {playlist.artist}
                                        </p>
                                    </div>

                                    {/* Right side: waveform when active, play button otherwise */}
                                    {isActive ? (
                                        <div className="shrink-0 pr-1">
                                            <WaveBars isPlaying={isPlaying} />
                                        </div>
                                    ) : (
                                        <button
                                            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all hover:scale-110"
                                            style={{ background: "rgba(255,255,255,0.08)" }}
                                            onClick={(e) => { e.stopPropagation(); handlePlayPause(playlist); }}
                                        >
                                            <svg viewBox="0 0 24 24" fill="white" className="w-3.5 h-3.5" style={{ marginLeft: "1px" }}>
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            );
                        })}

                        {playlists.length === 0 && (
                            <p className="text-white/30 text-sm text-center py-8">Loading playlists…</p>
                        )}
                    </div>
                </div>

                {/* ── Now-playing mini bar (slides up when a track is active) ─── */}
                <div
                    className="absolute left-0 right-0 z-20 px-4 transition-all duration-500"
                    style={{
                        bottom: currentTrack ? "72px" : "-120px",
                        opacity: currentTrack ? 1 : 0,
                    }}
                >
                    <div
                        className="rounded-2xl p-3"
                        style={{
                            background: "rgba(30,30,40,0.97)",
                            backdropFilter: "blur(24px)",
                            border: "1px solid rgba(163,230,53,0.15)",
                            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                        }}
                    >
                        {/* Track info + controls row */}
                        <div className="flex items-center gap-3 mb-2">
                            {/* Cover thumb */}
                            <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
                                <img src={currentTrack?.cover} alt="" className="w-full h-full object-cover" />
                            </div>

                            {/* Title & artist */}
                            <div className="flex-1 min-w-0">
                                <p className="text-white text-xs font-bold truncate">{currentTrack?.title}</p>
                                <p className="text-xs truncate" style={{ color: "rgba(255,255,255,0.4)" }}>{currentTrack?.artist}</p>
                            </div>

                            {/* Play / Pause */}
                            <button
                                onClick={() => {
                                    if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); }
                                    else { audioRef.current.play(); setIsPlaying(true); }
                                }}
                                className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all active:scale-90"
                                style={{ background: "#a3e635" }}
                            >
                                {isPlaying ? (
                                    <svg viewBox="0 0 24 24" fill="#111" className="w-4 h-4">
                                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                                    </svg>
                                ) : (
                                    <svg viewBox="0 0 24 24" fill="#111" className="w-4 h-4" style={{ marginLeft: "2px" }}>
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>

                        {/* Seek bar */}
                        <div
                            className="h-1 rounded-full cursor-pointer mb-1"
                            style={{ background: "rgba(255,255,255,0.12)" }}
                            onClick={handleSeek}
                        >
                            <div
                                className="h-full rounded-full transition-all"
                                style={{ width: `${progress}%`, background: "#a3e635" }}
                            />
                        </div>

                        {/* Time labels */}
                        <div className="flex justify-between">
                            <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
                                {fmt((progress / 100) * duration)}
                            </span>
                            <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
                                {fmt(duration)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* ── Bottom Navigation ────────────────────────────────────────── */}
                <BottomNav />

                {/* Home indicator */}

            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap');
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
}