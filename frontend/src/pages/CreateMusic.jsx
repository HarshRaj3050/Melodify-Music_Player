import { useState, useRef } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function CreateMusic() {
    const [title, setTitle] = useState("");
    const [audioFile, setAudioFile] = useState(null);
    const [coverFile, setCoverFile] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null); // { type: "success"|"error", msg }
    const [uploads, setUploads] = useState([
        // mock previous uploads — replace with real API fetch
        { id: 1, title: "music_1", plays: "1.2k" },
    ]);

    const audioRef = useRef(null);
    const coverRef = useRef(null);

    function handleCoverChange(e) {
        const file = e.target.files[0];
        if (!file) return;
        setCoverFile(file);
        setCoverPreview(URL.createObjectURL(file));
    }

    function handleAudioChange(e) {
        const file = e.target.files[0];
        if (!file) return;
        setAudioFile(file);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!title.trim() || !audioFile) {
            setStatus({ type: "error", msg: "Title and audio file are required." });
            return;
        }

        setLoading(true);
        setStatus(null);

        try {
            const formData = new FormData();
            formData.append("title", title.trim());
            formData.append("music", audioFile);
            if (coverFile) formData.append("cover", coverFile);

            await axios.post(`${BASE_URL}/api/music/create`, formData, {
                withCredentials: true,
                headers: { "Content-Type": "multipart/form-data" },
            });

            setStatus({ type: "success", msg: `"${title}" uploaded successfully!` });
            setUploads((prev) => [{ id: Date.now(), title, plays: "0" }, ...prev]);

            // reset form
            setTitle("");
            setAudioFile(null);
            setCoverFile(null);
            setCoverPreview(null);
            if (audioRef.current) audioRef.current.value = "";
            if (coverRef.current) coverRef.current.value = "";
        } catch (err) {
            const msg = err.response?.data?.message || "Upload failed. Try again.";
            setStatus({ type: "error", msg });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div
            className="h-dvh w-dvw flex justify-center"
            style={{ background: "#111113", fontFamily: "'Nunito', 'Segoe UI', sans-serif" }}
        >
            <div className="relative w-full h-full overflow-y-auto no-scrollbar shadow-2xl max-w-175">

                {/* Ambient glow */}
                <div
                    className="sticky top-0 left-0 right-0 h-0 pointer-events-none z-0"
                    style={{
                        background: "radial-gradient(ellipse 90% 60% at 20% 0%, rgba(163,230,53,0.13) 0%, rgba(100,60,200,0.09) 55%, transparent 100%)",
                        height: "220px",
                        marginBottom: "-220px",
                    }}
                />

                <div className="relative z-10 px-6 pt-8 pb-28">

                    {/* Header */}
                    <div className="flex items-center justify-between mb-7">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "rgba(163,230,53,0.7)" }}>Artist Studio</p>
                            <h1 className="text-3xl font-extrabold text-white tracking-tight leading-tight">Upload Music</h1>
                        </div>
                        <div
                            className="w-11 h-11 rounded-2xl flex items-center justify-center"
                            style={{ background: "rgba(163,230,53,0.12)", border: "1px solid rgba(163,230,53,0.2)" }}
                        >
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" style={{ color: "#a3e635" }}>
                                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                            </svg>
                        </div>
                    </div>

                    {/* ── Upload form ── */}
                    <div
                        className="rounded-3xl p-5 mb-6"
                        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                    >
                        {/* Cover art picker */}
                        <div className="flex items-center gap-4 mb-5">
                            <button
                                type="button"
                                onClick={() => coverRef.current?.click()}
                                className="w-20 h-20 rounded-2xl flex flex-col items-center justify-center shrink-0 transition-all active:scale-95 overflow-hidden"
                                style={{
                                    background: coverPreview ? "transparent" : "rgba(255,255,255,0.06)",
                                    border: coverPreview ? "none" : "2px dashed rgba(255,255,255,0.15)",
                                }}
                            >
                                {coverPreview ? (
                                    <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
                                ) : (
                                    <>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 mb-1" style={{ color: "rgba(255,255,255,0.3)" }}>
                                            <rect x="3" y="3" width="18" height="18" rx="3" />
                                            <circle cx="8.5" cy="8.5" r="1.5" />
                                            <polyline points="21 15 16 10 5 21" />
                                        </svg>
                                        <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>Cover</span>
                                    </>
                                )}
                            </button>
                            <input ref={coverRef} type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />

                            <div className="flex-1">
                                <p className="text-white font-bold text-sm mb-0.5">Cover Art</p>
                                <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>Optional · JPG, PNG · Max 5MB</p>
                                {coverPreview && (
                                    <button
                                        type="button"
                                        onClick={() => { setCoverFile(null); setCoverPreview(null); coverRef.current.value = ""; }}
                                        className="text-xs mt-1 transition-all"
                                        style={{ color: "#f87171" }}
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Title */}
                        <div className="mb-4">
                            <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>
                                Track Title *
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. Midnight Drive"
                                className="w-full px-4 py-3 rounded-xl text-sm font-semibold text-white placeholder-white/20 outline-none transition-all"
                                style={{
                                    background: "rgba(255,255,255,0.06)",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                }}
                                onFocus={e => e.target.style.borderColor = "rgba(163,230,53,0.5)"}
                                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                            />
                        </div>

                        {/* Audio file */}
                        <div className="mb-5">
                            <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>
                                Audio File *
                            </label>
                            <button
                                type="button"
                                onClick={() => audioRef.current?.click()}
                                className="w-full px-4 py-3 rounded-xl text-sm font-semibold text-left transition-all active:scale-98"
                                style={{
                                    background: "rgba(255,255,255,0.06)",
                                    border: `1px solid ${audioFile ? "rgba(163,230,53,0.4)" : "rgba(255,255,255,0.1)"}`,
                                    color: audioFile ? "#a3e635" : "rgba(255,255,255,0.25)",
                                }}
                            >
                                <div className="flex items-center gap-3">
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0" style={{ color: audioFile ? "#a3e635" : "rgba(255,255,255,0.25)" }}>
                                        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                                    </svg>
                                    <span className="truncate">{audioFile ? audioFile.name : "Choose audio file (MP3, WAV, FLAC)"}</span>
                                </div>
                            </button>
                            <input ref={audioRef} type="file" accept="audio/*" className="hidden" onChange={handleAudioChange} />
                        </div>

                        {/* Status message */}
                        {status && (
                            <div
                                className="px-4 py-3 rounded-xl text-sm font-semibold mb-4"
                                style={{
                                    background: status.type === "success" ? "rgba(163,230,53,0.1)" : "rgba(239,68,68,0.1)",
                                    border: `1px solid ${status.type === "success" ? "rgba(163,230,53,0.25)" : "rgba(239,68,68,0.25)"}`,
                                    color: status.type === "success" ? "#a3e635" : "#f87171",
                                }}
                            >
                                {status.msg}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full py-3.5 rounded-2xl font-bold text-sm transition-all active:scale-95 flex items-center justify-center gap-2"
                            style={{
                                background: loading ? "rgba(163,230,53,0.4)" : "#a3e635",
                                color: "#111",
                                opacity: loading ? 0.8 : 1,
                            }}
                        >
                            {loading ? (
                                <>
                                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeOpacity="0.25" />
                                        <path d="M21 12a9 9 0 00-9-9" />
                                    </svg>
                                    Uploading…
                                </>
                            ) : (
                                <>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                                    </svg>
                                    Publish Track
                                </>
                            )}
                        </button>
                    </div>

                    {/* ── Your uploads ── */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-lg font-bold text-white">Your Tracks</h2>
                            <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{ background: "rgba(163,230,53,0.1)", color: "#a3e635" }}>
                                {uploads.length} tracks
                            </span>
                        </div>

                        {uploads.length === 0 ? (
                            <p className="text-center text-sm py-8" style={{ color: "rgba(255,255,255,0.2)" }}>No tracks yet. Upload your first one!</p>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {uploads.map((track) => (
                                    <div
                                        key={track.id}
                                        className="flex items-center gap-3 px-4 py-3 rounded-2xl"
                                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
                                    >
                                        <div
                                            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                                            style={{ background: "rgba(163,230,53,0.1)" }}
                                        >
                                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" style={{ color: "#a3e635" }}>
                                                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-white truncate">{track.title}</p>
                                            <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>{track.plays} plays</p>
                                        </div>
                                        <button
                                            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all active:scale-90"
                                            style={{ background: "rgba(239,68,68,0.1)" }}
                                            title="Delete track"
                                        >
                                            <svg viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" className="w-3.5 h-3.5">
                                                <polyline points="3 6 5 6 21 6" />
                                                <path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                @keyframes spin { to { transform: rotate(360deg); } }
                .animate-spin { animation: spin 0.8s linear infinite; }
            `}</style>
        </div>
    );
}