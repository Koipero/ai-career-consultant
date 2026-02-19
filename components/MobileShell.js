"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function MobileShell({ children }) {
    const pathname = usePathname();

    const isActive = (path) => pathname === path;

    return (
        <div style={{ paddingBottom: "80px" }}> {/* Space for bottom nav */}

            {/* Fixed Header */}
            <header style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                height: "60px",
                background: "var(--accent-primary)",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 1rem",
                zIndex: 1000,
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: "bold", fontSize: "1.1rem" }}>
                    <span>AI Career</span>
                </div>
                <div style={{ display: "flex", gap: "1rem" }}>
                    <span>🔔</span>
                    <span>👤</span>
                </div>
            </header>

            {/* Main Content Area */}
            <main style={{ marginTop: "70px", padding: "0 1rem" }}>
                {children}
            </main>

            {/* Fixed Bottom Navigation */}
            <nav style={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                background: "white",
                borderTop: "1px solid var(--border-color)",
                display: "flex",
                justifyContent: "space-around",
                padding: "0.5rem 0",
                zIndex: 1000,
                height: "60px",
                paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" // Safe area for iPhone
            }}>
                <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
                    <NavIcon label="ホーム" icon="🏠" active={isActive("/")} />
                </Link>
                <Link href="/star-quest" style={{ textDecoration: "none", color: "inherit" }}>
                    <NavIcon label="STAR Quest" icon="🌟" active={isActive("/star-quest")} />
                </Link>
                <Link href="#" style={{ textDecoration: "none", color: "inherit" }}>
                    <NavIcon label="スカウト" icon="📩" active={false} />
                </Link>
                <Link href="#" style={{ textDecoration: "none", color: "inherit" }}>
                    <NavIcon label="学習" icon="📖" active={false} />
                </Link>
                <Link href="#" style={{ textDecoration: "none", color: "inherit" }}>
                    <NavIcon label="設定" icon="⚙️" active={false} />
                </Link>
            </nav>
        </div>
    );
}

function NavIcon({ label, icon, active, onClick }) {
    return (
        <div
            onClick={onClick}
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: active ? "var(--accent-primary)" : "var(--text-tertiary)",
                fontSize: "0.7rem",
                gap: "2px",
                cursor: "pointer",
                width: "60px"
            }}
        >
            <span style={{ fontSize: "1.5rem" }}>{icon}</span>
            <span style={{ fontWeight: active ? "700" : "400" }}>{label}</span>
        </div>
    );
}
