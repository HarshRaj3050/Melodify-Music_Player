import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BottomNav from "../components/BottomNav";

const BASE_URL = import.meta.env.VITE_API_URL;

// ── Reusable toggle switch ────────────────────────────────────────────────────
function Toggle({ on, onChange }) {
    return (
        <button
            onClick={() => onChange(!on)}
            className="relative w-11 h-6 rounded-full transition-all duration-300 shrink-0"
            style={{ background: on ? "#a3e635" : "rgba(255,255,255,0.12)" }}
        >
            <span
                className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300"
                style={{ transform: on ? "translateX(20px)" : "translateX(0)" }}
            />
        </button>
    );
}

// ── Section wrapper ───────────────────────────────────────────────────────────
function Section({ title, children }) {
    return (
        <div className="mb-6">
            <p
                className="text-xs font-bold uppercase tracking-widest mb-2 px-1"
                style={{ color: "rgba(163,230,53,0.7)" }}
            >
                {title}
            </p>
            <div
                className="rounded-2xl overflow-hidden"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
                {children}
            </div>
        </div>
    );
}

// ── Row variants ──────────────────────────────────────────────────────────────
function RowToggle({ icon, label, sublabel, value, onChange }) {
    return (
        <div className="flex items-center gap-3 px-4 py-3.5 border-b last:border-b-0" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.07)" }}>
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">{label}</p>
                {sublabel && <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>{sublabel}</p>}
            </div>
            <Toggle on={value} onChange={onChange} />
        </div>
    );
}

function RowNav({ icon, label, sublabel, value, onClick, danger }) {
    return (
        <button
            onClick={onClick}
            className="w-full flex items-center gap-3 px-4 py-3.5 border-b last:border-b-0 transition-all active:opacity-70"
            style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
            <div
                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: danger ? "rgba(239,68,68,0.12)" : "rgba(255,255,255,0.07)" }}
            >
                {icon}
            </div>
            <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-semibold" style={{ color: danger ? "#f87171" : "white" }}>{label}</p>
                {sublabel && <p className="text-xs mt-0.5 truncate" style={{ color: "rgba(255,255,255,0.35)" }}>{sublabel}</p>}
            </div>
            {value && <span className="text-xs shrink-0" style={{ color: "rgba(255,255,255,0.35)" }}>{value}</span>}
            {!danger && (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 shrink-0" style={{ color: "rgba(255,255,255,0.2)" }}>
                    <path d="M9 18l6-6-6-6" />
                </svg>
            )}
        </button>
    );
}

// ── Logout confirmation modal ─────────────────────────────────────────────────
function LogoutModal({ onConfirm, onCancel }) {
    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center pb-10 px-6" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}>
            <div
                className="w-full rounded-3xl p-6"
                style={{ background: "#1a1a22", border: "1px solid rgba(255,255,255,0.1)", maxWidth: "380px" }}
            >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(239,68,68,0.12)" }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" className="w-6 h-6">
                        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
                    </svg>
                </div>
                <h3 className="text-white font-bold text-lg text-center mb-1">Log out?</h3>
                <p className="text-center text-sm mb-6" style={{ color: "rgba(255,255,255,0.4)" }}>
                    You'll need to sign in again to listen to your music.
                </p>
                <button
                    onClick={onConfirm}
                    className="w-full py-3 rounded-2xl font-bold text-sm mb-3 transition-all active:scale-95"
                    style={{ background: "#ef4444", color: "white" }}
                >
                    Yes, log me out
                </button>
                <button
                    onClick={onCancel}
                    className="w-full py-3 rounded-2xl font-bold text-sm transition-all active:scale-95"
                    style={{ background: "rgba(255,255,255,0.07)", color: "white" }}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}

// ── Main Settings page ────────────────────────────────────────────────────────
export default function Settings() {
    const navigate = useNavigate();

    // Toggle states
    const [notifications, setNotifications] = useState(true);
    const [autoPlay, setAutoPlay] = useState(true);
    const [highQuality, setHighQuality] = useState(false);
    const [offlineMode, setOfflineMode] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    async function handleLogout() {
        try {
            await axios.post(`${BASE_URL}/api/auth/logout`, {}, { withCredentials: true });
        } catch (err) {
            console.log(err);
        }
        navigate("/");
    }

    return (
        <div
            className="h-dvh w-dvw flex justify-center"
            style={{ background: "#111113", fontFamily: "'Nunito', 'Segoe UI', sans-serif" }}
        >
            <div className="relative w-full h-full overflow-hidden shadow-2xl">

                {/* Ambient glow */}
                <div
                    className="absolute top-0 left-0 right-0 h-56 pointer-events-none"
                    style={{
                        background: "radial-gradient(ellipse 70% 50% at 70% 0%, rgba(163,230,53,0.12) 0%, rgba(100,60,200,0.08) 50%, transparent 100%)",
                    }}
                />

                {/* ── Header ──────────────────────────────────────────────────── */}
                <div className="relative z-10 flex items-center gap-3 px-6 pt-8 pb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">Settings</h1>
                        <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>Manage your account & preferences</p>
                    </div>
                </div>

                {/* ── Scrollable content ───────────────────────────────────────── */}
                <div className="relative z-10 overflow-y-auto no-scrollbar px-6" style={{ paddingBottom: "100px", height: "calc(100% - 90px)" }}>

                    {/* Profile card */}
                    <div
                        className="flex items-center gap-4 p-4 rounded-2xl mb-6"
                        style={{ background: "rgba(163,230,53,0.06)", border: "1px solid rgba(163,230,53,0.12)" }}
                    >
                        <div className="w-14 h-14 rounded-2xl overflow-hidden ring-2 shrink-0" style={{ ringColor: "rgba(163,230,53,0.3)" }}>
                            <img
                                src="https://plus.unsplash.com/premium_photo-1739405177421-de315b3606dd?q=80&w=200&auto=format&fit=crop"
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-white font-bold text-base">HARSH</p>
                            <p className="text-xs mt-0.5 truncate" style={{ color: "rgba(255,255,255,0.4)" }}>harsh@example.com</p>
                            <span
                                className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full mt-1"
                                style={{ background: "rgba(163,230,53,0.15)", color: "#a3e635" }}
                            >
                                Free Plan
                            </span>
                        </div>
                        <button
                            className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95"
                            style={{ background: "rgba(255,255,255,0.08)", color: "white" }}
                        >
                            Edit
                        </button>
                    </div>

                    {/* Account */}
                    <Section title="Account">
                        <RowNav
                            icon={<svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" /></svg>}
                            label="Edit Profile"
                            sublabel="Name, photo, bio"
                        />
                        <RowNav
                            icon={<svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" /></svg>}
                            label="Change Password"
                            sublabel="Last changed 3 months ago"
                        />
                        <RowNav
                            icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4" style={{ color: "#a3e635" }}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>}
                            label="Upgrade to Premium"
                            sublabel="Ad-free, offline & HD audio"
                        />
                    </Section>

                    {/* Playback */}
                    <Section title="Playback">
                        <RowToggle
                            icon={<svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white"><path d="M6 18l8.5-6L6 6v12zm2-8.14L11.03 12 8 14.14V9.86zM16 6h2v12h-2z" /></svg>}
                            label="Autoplay"
                            sublabel="Play similar songs when queue ends"
                            value={autoPlay}
                            onChange={setAutoPlay}
                        />
                        <RowToggle
                            icon={<svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" /></svg>}
                            label="High Quality Audio"
                            sublabel="Uses more data"
                            value={highQuality}
                            onChange={setHighQuality}
                        />
                        <RowToggle
                            icon={<svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" /></svg>}
                            label="Offline Mode"
                            sublabel="Only play downloaded music"
                            value={offlineMode}
                            onChange={setOfflineMode}
                        />
                        <RowNav
                            icon={<svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" /></svg>}
                            label="Equalizer"
                            value="Flat"
                        />
                    </Section>

                    {/* Notifications */}
                    <Section title="Notifications">
                        <RowToggle
                            icon={<svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" /></svg>}
                            label="Push Notifications"
                            sublabel="New releases & recommendations"
                            value={notifications}
                            onChange={setNotifications}
                        />
                    </Section>

                    {/* Support */}
                    <Section title="Support">
                        <RowNav
                            icon={<svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white"><path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z" /></svg>}
                            label="Help & FAQ"
                        />
                        <RowNav
                            icon={<svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" /></svg>}
                            label="Contact Support"
                        />
                        <RowNav
                            icon={<svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" /></svg>}
                            label="Privacy Policy"
                        />
                    </Section>

                    {/* Danger zone */}
                    <Section title="Account Actions">
                        <RowNav
                            icon={<svg viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" className="w-4 h-4"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" /></svg>}
                            label="Log Out"
                            danger
                            onClick={() => setShowLogoutModal(true)}
                        />
                        <RowNav
                            icon={<svg viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" className="w-4 h-4"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2" /></svg>}
                            label="Delete Account"
                            danger
                            onClick={() => alert("Delete account — connect your API here")}
                        />
                    </Section>

                    {/* App version */}
                    <p className="text-center text-xs pb-4" style={{ color: "rgba(255,255,255,0.15)" }}>
                        Melodify v1.0.0 · Made by Harsh
                    </p>
                </div>

                {/* ── Bottom Nav ───────────────────────────────────────────────── */}
                <BottomNav />
            </div>

            {/* ── Logout modal ─────────────────────────────────────────────────── */}
            {showLogoutModal && (
                <LogoutModal
                    onConfirm={handleLogout}
                    onCancel={() => setShowLogoutModal(false)}
                />
            )}

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap');
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
}