import { useNavigate, useLocation } from "react-router-dom";

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
    const navigate = useNavigate();
    const location = useLocation();

    // Derive active tab from current URL path
    const activeId = navItems.find((item) => item.path === location.pathname)?.id ?? "home";

    return (
        <div
            className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-around px-4 py-3 rounded-t-3xl"
            style={{
                background: "rgba(20,20,25,0.95)",
                backdropFilter: "blur(20px)",
                borderTop: "1px solid rgba(255,255,255,0.07)",
            }}
        >
            {navItems.map((item) => {
                const isActive = activeId === item.id;
                return (
                    <button
                        key={item.id}
                        onClick={() => navigate(item.path)}
                        className="flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all duration-200"
                        style={{ color: isActive ? "#a3e635" : "rgba(255,255,255,0.35)" }}
                        aria-label={item.label}
                        title={item.label}
                    >
                        <div
                            className="p-2 rounded-xl transition-all"
                            style={{ background: isActive ? "rgba(163,230,53,0.15)" : "transparent" }}
                        >
                            {item.icon}
                        </div>
                        
                    </button>
                );
            })}
        </div>
    );
}

// Named export so you can also import just the navItems array if needed
export { navItems };