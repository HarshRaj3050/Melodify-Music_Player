import { useState } from "react";
import axios from "axios";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import { useAudio } from "../context/AudioContext";

import { AudioProvider } from "../context/AudioContext";

const BASE_URL = import.meta.env.VITE_API_URL;
const tabs = ["All", "New Release", "Trending", "Top Charts"];

// ── Waveform animation ────────────────────────────────────────────────────────
function WaveBars({ isPlaying }) {
    return (
        <div className="flex items-end gap-0.5 h-4">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-0.5 rounded-full"
                    style={{
                        background: "#a3e635",
                        height: isPlaying ? undefined : "4px",
                        animation: isPlaying ? `wave${i} 0.8s ease-in-out infinite alternate` : "none",
                    }}
                />
            ))}
            <style>{`
                @keyframes wave1 { from{height:4px} to{height:14px} }
                @keyframes wave2 { from{height:8px} to{height:6px} }
                @keyframes wave3 { from{height:12px} to{height:4px} }
                @keyframes wave4 { from{height:5px} to{height:13px} }
            `}</style>
        </div>
    );
}

// ── Fetch function (outside component, no re-creation on render) ──────────────
async function fetchMusics({ pageParam = 1 }) {
    const res = await axios.get(`${BASE_URL}/api/music/musics?page=${pageParam}`, {
        withCredentials: true,
    });
    return res.data; // expects: { musics, username, page, totalPages }
}

export default function Music() {
    const [activeTab, setActiveTab] = useState("All");
    const [liked, setLiked] = useState(false);
    const navigate = useNavigate();
    const screenHeight = screen.height;

    // ── Audio from shared context (survives navigation) ───────────────────────
    const { currentTrack, isPlaying, progress, duration, playTrack, handleSeek, fmt, setIsPlaying, audioRef } = useAudio();

    // ── TanStack infinite query ───────────────────────────────────────────────
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error,
    } = useInfiniteQuery({
        queryKey: ["musics"],
        queryFn: fetchMusics,
        initialPageParam: 1,
        getNextPageParam: (lastPage) =>
            lastPage.musics.length < 2 ? undefined : lastPage.page + 1,
        staleTime: 1000 * 60 * 5,   // cache 5 min → no refetch on tab switch
        retry: false,
    });

    // Redirect on 401
    if (isError && error?.response?.status === 401) navigate("/");

    // Flatten all pages into one list
    const playlists = data?.pages.flatMap((page) =>
        page.musics.map((e) => ({
            id: e._id,
            title: e.title,
            artist: e.artist.username,
            cover: e.coverUrl || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=80&h=80&fit=crop",
            uri: e.uri,
        }))
    ) ?? [];

    const username = data?.pages[0]?.username ?? "User";

    return (
        <div className="h-dvh w-dvw flex justify-center md:pl-55"
            style={{ background: "#111113", fontFamily: "'Nunito', 'Segoe UI', sans-serif" }}>

            <div className="relative w-full h-full overflow-hidden shadow-2xl pt-6"
                style={{ background: "#111113" }}>

                {/* Ambient glow */}
                <div className="absolute top-0 left-0 right-0 h-64 pointer-events-none"
                    style={{ background: "radial-gradient(ellipse 80% 60% at 30% 0%, rgba(220,80,180,0.35) 0%, rgba(100,60,200,0.2) 50%, transparent 100%)" }}
                />

                {/* ── Header ── */}
                <div className="relative z-10 flex items-center justify-between px-6 pb-4">
                    <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-white/20">
                        <img src="https://plus.unsplash.com/premium_photo-1739405177421-de315b3606dd?q=80&w=100&auto=format&fit=crop"
                            alt="Profile" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex gap-3">
                        <button className="w-9 h-9 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white hover:bg-white/20 transition-all">
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                            </svg>
                        </button>
                        <button onClick={() => setLiked(!liked)}
                            className="w-9 h-9 rounded-full bg-white/10 backdrop-blur flex items-center justify-center transition-all hover:bg-white/20"
                            style={{ color: liked ? "#e879f9" : "white" }}>
                            <svg viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* ── Greeting ── */}
                <div className="relative z-10 px-6 pb-5">
                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        {isLoading ? "Hi, ..." : `Hi, ${username.toUpperCase()}`}
                    </h1>
                </div>

                {/* ── Tabs ── */}
                <div className="relative z-10 flex gap-2 px-6 pb-6 overflow-x-auto no-scrollbar">
                    {tabs.map((tab) => (
                        <button key={tab} onClick={() => setActiveTab(tab)}
                            className="whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200"
                            style={{
                                background: activeTab === tab ? "#a3e635" : "rgba(255,255,255,0.1)",
                                color: activeTab === tab ? "#111" : "rgba(255,255,255,0.7)",
                                flexShrink: 0,
                            }}>
                            {tab}
                        </button>
                    ))}
                </div>

                {/* ── Curated & trending card ── */}
                {screenHeight > 750 && (
                    <div className="relative z-10 px-6 pb-4">
                        <h2 className="text-lg font-bold text-white mb-3">Curated &amp; trending</h2>
                        <div className="relative rounded-2xl overflow-hidden"
                            style={{ background: "linear-gradient(135deg, #c084fc 0%, #a855f7 60%, #7c3aed 100%)", minHeight: "130px" }}>
                            <div className="absolute right-0 top-0 bottom-0 w-40 overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop"
                                    alt="" className="w-full h-full object-cover opacity-70" style={{ filter: "saturate(1.3)" }} />
                                <div className="absolute inset-0" style={{ background: "linear-gradient(to right, #a855f7 0%, transparent 60%)" }} />
                            </div>
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-16 rounded-l-lg" style={{ background: "#a3e635" }} />
                            <div className="relative z-10 p-4">
                                <h3 className="text-white font-bold text-base mb-1">Discover weekly</h3>
                                <p className="text-purple-100 text-xs leading-relaxed mb-4 max-w-40">The original slow instrumental best playlists.</p>
                                <div className="flex items-center gap-4">
                                    <button className="w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90" style={{ background: "#5b21b6" }}>
                                        <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4" style={{ marginLeft: "2px" }}><path d="M8 5v14l11-7z" /></svg>
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
                        </div>
                    </div>
                )}

                {/* ── Playlist list ── */}
                <div className="relative z-10 px-6" style={{ paddingBottom: currentTrack ? "160px" : "90px" }}>
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-lg font-bold text-white">Top daily playlists</h2>
                        {hasNextPage && (
                            <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}
                                className="text-sm font-medium transition-opacity"
                                style={{ color: "#a3e635", opacity: isFetchingNextPage ? 0.5 : 1 }}>
                                {isFetchingNextPage ? "Loading…" : "See more"}
                            </button>
                        )}
                    </div>

                    <div className="flex flex-col gap-3 overflow-y-auto no-scrollbar pb-39" style={{ maxHeight: "230px" }}>
                        {isLoading && (
                            <p className="text-white/30 text-sm text-center py-8">Loading playlists…</p>
                        )}

                        {playlists.map((playlist) => {
                            const isActive = currentTrack?.id === playlist.id;
                            return (
                                <div key={playlist.id} onClick={() => playTrack(playlist)}
                                    className="flex items-center gap-3 group cursor-pointer rounded-xl px-2 py-1 transition-all duration-200"
                                    style={{
                                        background: isActive ? "rgba(163,230,53,0.08)" : "transparent",
                                        border: isActive ? "1px solid rgba(163,230,53,0.2)" : "1px solid transparent",
                                    }}>
                                    <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0">
                                        <img src={playlist.cover} alt={playlist.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                        {!isActive && (
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6"><path d="M8 5v14l11-7z" /></svg>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-sm truncate" style={{ color: isActive ? "#a3e635" : "white" }}>
                                            {playlist.title}
                                        </p>
                                        <p className="text-xs mt-0.5 truncate" style={{ color: "rgba(255,255,255,0.45)" }}>By {playlist.artist}</p>
                                    </div>
                                    {isActive ? (
                                        <div className="shrink-0 pr-1"><WaveBars isPlaying={isPlaying} /></div>
                                    ) : (
                                        <button className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all hover:scale-110"
                                            style={{ background: "rgba(255,255,255,0.08)" }}
                                            onClick={(e) => { e.stopPropagation(); playTrack(playlist); }}>
                                            <svg viewBox="0 0 24 24" fill="white" className="w-3.5 h-3.5" style={{ marginLeft: "1px" }}><path d="M8 5v14l11-7z" /></svg>
                                        </button>
                                    )}
                                </div>
                            );
                        })}

                        {!isLoading && playlists.length === 0 && (
                            <p className="text-white/30 text-sm text-center py-8">No playlists found.</p>
                        )}
                    </div>
                </div>

                {/* ── Now-playing bar — always visible when track is set ── */}
                <div className="absolute left-0 bottom-0 right-0 z-20 px-4 transition-all duration-500"
                    style={{
                        bottom: currentTrack
                            ? (window.innerWidth >= 768 ? "6px" : "72px")  // ← desktop vs mobile
                            : "-120px",
                        opacity: currentTrack ? 1 : 0,
                        pointerEvents: currentTrack ? "auto" : "none",
                    }}>
                    <div className="rounded-2xl p-3"
                        style={{
                            background: "rgba(30,30,40,0.97)",
                            backdropFilter: "blur(24px)",
                            border: "1px solid rgba(163,230,53,0.15)",
                            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                        }}>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
                                <img src={currentTrack?.cover} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-white text-xs font-bold truncate">{currentTrack?.title}</p>
                                <p className="text-xs truncate" style={{ color: "rgba(255,255,255,0.4)" }}>{currentTrack?.artist}</p>
                            </div>
                            <button
                                onClick={() => {
                                    if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); }
                                    else { audioRef.current.play(); setIsPlaying(true); }
                                }}
                                className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all active:scale-90"
                                style={{ background: "#a3e635" }}>
                                {isPlaying
                                    ? <svg viewBox="0 0 24 24" fill="#111" className="w-4 h-4"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                                    : <svg viewBox="0 0 24 24" fill="#111" className="w-4 h-4" style={{ marginLeft: "2px" }}><path d="M8 5v14l11-7z" /></svg>
                                }
                            </button>
                        </div>

                        <div className="h-1 rounded-full cursor-pointer mb-1"
                            style={{ background: "rgba(255,255,255,0.12)" }} onClick={handleSeek}>
                            <div className="h-full rounded-full transition-all"
                                style={{ width: `${progress}%`, background: "#a3e635" }} />
                        </div>

                        <div className="flex justify-between">
                            <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>{fmt((progress / 100) * duration)}</span>
                            <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>{fmt(duration)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap');
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>


            <BottomNav />
        </div>
    );
}