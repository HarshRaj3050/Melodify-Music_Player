import { Link, useLocation } from "react-router-dom";

const navItems = [
    {
        id: "home",
        label: "Home",
        path: "/musics",
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
        ),
    },
    {
        id: "library",
        label: "Library",
        path: "/library",
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z" />
            </svg>
        ),
    },
    {
        id: "queue",
        label: "Queue",
        path: "/queue",
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" />
            </svg>
        ),
    },
    {
        id: "devices",
        label: "Devices",
        path: "/devices",
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M17 1H7c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zm0 18H7V5h10v14zM12 18c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1z" />
            </svg>
        ),
    },
    {
        id: "settings",
        label: "Settings",
        path: "/settings",
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.488.488 0 00-.59-.22l-2.39.96a7.02 7.02 0 00-1.62-.94l-.36-2.54a.484.484 0 00-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.47.47 0 00-.59.22L2.74 9.87a.48.48 0 00.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58a.49.49 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.37 1.04.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.57 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32a.49.49 0 00-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
            </svg>
        ),
    },
];

export default function BottomNav() {
    const location = useLocation();
    const activeId = navItems.find((item) => item.path === location.pathname)?.id ?? "home";

    return (
        <>
            {/* ══════════════════════════════════════════
                MOBILE: bottom tab bar  (< 768px)
            ══════════════════════════════════════════ */}
            <div
                className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-4 py-2 rounded-t-3xl"
                style={{
                    background: "rgba(14,14,18,0.97)",
                    backdropFilter: "blur(20px)",
                    borderTop: "1px solid rgba(255,255,255,0.07)",
                    fontFamily: "'Nunito', sans-serif",
                }}
            >
                {navItems.map((item) => {
                    const isActive = activeId === item.id;
                    return (
                        <Link
                            key={item.id}
                            to={item.path}
                            className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all duration-200"
                            style={{ color: isActive ? "#a3e635" : "rgba(255,255,255,0.35)" }}
                            aria-label={item.label}
                        >
                            <div
                                className="p-1.5 rounded-xl transition-all"
                                style={{ background: isActive ? "rgba(163,230,53,0.15)" : "transparent" }}
                            >
                                {item.icon}
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* ══════════════════════════════════════════
                DESKTOP: left sidebar  (≥ 768px)
            ══════════════════════════════════════════ */}
            <aside
                className="hidden md:flex fixed top-0 left-0 h-full z-50 flex-col"
                style={{
                    width: "220px",
                    background: "rgba(13,13,16,0.98)",
                    backdropFilter: "blur(30px)",
                    borderRight: "1px solid rgba(255,255,255,0.055)",
                    fontFamily: "'Nunito', sans-serif",
                }}
            >
                {/* ── Brand ── */}
                <div className="flex items-center gap-3 px-5 pt-7 pb-6">
                    <div
                        className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
                        style={{
                            background: "linear-gradient(135deg, rgba(163,230,53,0.2) 0%, rgba(163,230,53,0.05) 100%)",
                            border: "1px solid rgba(163,230,53,0.25)",
                            boxShadow: "0 0 20px rgba(163,230,53,0.1)",
                        }}
                    >
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" style={{ color: "#a3e635" }}>
                            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                        </svg>
                    </div>
                    <div className="leading-none">
                        <p
                            className="font-black text-white text-sm tracking-[0.15em]"
                        >
                            MELODIFY
                        </p>
                    
                    </div>
                </div>

                {/* ── Divider ── */}
                <div className="mx-5 h-px mb-5" style={{ background: "rgba(255,255,255,0.055)" }} />

                {/* ── Section label ── */}
                <p
                    className="px-5 mb-2 text-[10px] font-black uppercase tracking-[0.2em]"
                    style={{ color: "rgba(255,255,255,0.2)" }}
                >
                    Navigation
                </p>

                {/* ── Nav links ── */}
                <nav className="flex flex-col gap-1 px-3 flex-1">
                    {navItems.map((item) => {
                        const isActive = activeId === item.id;
                        return (
                            <Link
                                key={item.id}
                                to={item.path}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all duration-200"
                                style={{
                                    background: isActive
                                        ? "rgba(163,230,53,0.09)"
                                        : "transparent",
                                    border: isActive
                                        ? "1px solid rgba(163,230,53,0.14)"
                                        : "1px solid transparent",
                                    color: isActive ? "#a3e635" : "rgba(255,255,255,0.4)",
                                }}
                            >
                                {/* Icon */}
                                <div
                                    className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all"
                                    style={{
                                        background: isActive
                                            ? "rgba(163,230,53,0.15)"
                                            : "rgba(255,255,255,0.04)",
                                    }}
                                >
                                    {item.icon}
                                </div>

                                {/* Label */}
                                <span
                                    className="text-sm font-bold flex-1"
                                    style={{ color: isActive ? "#a3e635" : "rgba(255,255,255,0.5)" }}
                                >
                                    {item.label}
                                </span>

                                {/* Active dot */}
                                {isActive && (
                                    <div
                                        className="w-1.5 h-1.5 rounded-full shrink-0"
                                        style={{ background: "#a3e635", boxShadow: "0 0 6px #a3e635" }}
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* ── Footer ── */}
                <div className="px-5 py-5">
                    <div className="h-px mb-3" style={{ background: "rgba(255,255,255,0.055)" }} />
                    <p className="text-[10px] font-semibold" style={{ color: "rgba(255,255,255,0.15)" }}>
                        Melodify v1.0.0 - Develop by Harsh
                    </p>
                </div>
            </aside>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
            `}</style>
        </>
    );
}

export { navItems };