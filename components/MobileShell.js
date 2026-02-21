"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function MobileShell({ children }) {
    // pathname check logic (reusable if needed later)
    // const pathname = usePathname();
    // const isActive = (path) => pathname === path;

    return (
        <div style={{ paddingBottom: "20px" }}> {/* Reduced bottom padding as nav is gone */}

            {/* Fixed Header with Navigation */}
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
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <Link href="/" style={{ textDecoration: "none", color: "white", fontWeight: "bold", fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span>AI Career</span>
                    </Link>
                </div>

                <nav style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
                    <Link href="/" style={{ textDecoration: "none", color: "white", fontSize: "0.9rem", fontWeight: "600" }}>
                        ホーム
                    </Link>
                    <Link href="/star-quest" style={{ textDecoration: "none", color: "white", fontSize: "0.9rem", fontWeight: "600" }}>
                        STAR Quest
                    </Link>
                    <Link href="/profile" style={{ textDecoration: "none", fontSize: "1.2rem", opacity: 0.9 }}>
                        👤
                    </Link>
                </nav>
            </header>

            {/* Main Content Area */}
            <main style={{ marginTop: "70px", padding: "0 1rem" }}>
                {children}
            </main>

            {/* Bottom Navigation Removed as per request */}
        </div>
    );
}
