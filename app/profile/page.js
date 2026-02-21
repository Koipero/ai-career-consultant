"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const router = useRouter();
    const [resumeText, setResumeText] = useState("");
    const [isParsing, setIsParsing] = useState(false);
    const [saveMessage, setSaveMessage] = useState("");
    const fileInputRef = useRef(null);

    // Load registered resume on mount
    useEffect(() => {
        const storedResume = localStorage.getItem("registeredResume");
        if (storedResume) {
            setResumeText(storedResume);
        }
    }, []);

    const handleSave = () => {
        localStorage.setItem("registeredResume", resumeText);
        setSaveMessage("✓ 保存しました。ホーム画面に戻り、キャリア分析をご利用ください。");
        setTimeout(() => setSaveMessage(""), 4000);
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsParsing(true);
        setSaveMessage("");

        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("/api/parse-resume", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                throw new Error("ファイルの読み込みに失敗しました");
            }

            const data = await res.json();
            if (data.text) {
                // If there's already some text, maybe append or create a new block
                setResumeText((prev) => (prev ? prev + "\n" + data.text : data.text));
                setSaveMessage("ファイルを読み込みました。内容を確認してから保存してください。");
            }
        } catch (error) {
            console.error(error);
            alert("ファイルの抽出中にエラーが発生しました。対応ファイルは PDF と DOCX です。");
        } finally {
            setIsParsing(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    return (
        <div className="container" style={{ paddingTop: "2rem" }}>
            <button
                onClick={() => router.push("/")}
                className="btn btn-secondary"
                style={{ marginBottom: "1.5rem", padding: "0.5rem 1rem" }}
            >
                ← ホームに戻る
            </button>

            <div className="card">
                <h2 style={{ marginBottom: "1.5rem", fontSize: "1.4rem", fontWeight: "700", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    👤 プロフィール (職務経歴書の登録)
                </h2>

                <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem", fontSize: "0.95rem" }}>
                    ここで職務経歴書を登録しておくと、毎回入力する手間を省き、分析画面に自動でセットされます。<br />
                    直接入力するか、お手元のPDF/Wordファイルをアップロードして内容を抽出してください。
                </p>

                {/* File Upload Section */}
                <div style={{ marginBottom: "2rem" }}>
                    <div style={{ fontWeight: "600", marginBottom: "0.5rem" }}>
                        ファイルから抽出 (PDF, DOCX)
                    </div>
                    <input
                        type="file"
                        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        onChange={handleFileUpload}
                    />
                    <div
                        onClick={() => !isParsing && fileInputRef.current?.click()}
                        style={{
                            padding: "2rem",
                            textAlign: "center",
                            border: "2px dashed var(--glass-border)",
                            borderRadius: "var(--radius-md)",
                            background: "rgba(0,0,0,0.05)",
                            cursor: isParsing ? "wait" : "pointer",
                            transition: "all 0.3s ease",
                            borderColor: "var(--glass-border)"
                        }}
                    >
                        <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>{isParsing ? "⏳" : "📤"}</div>
                        <p style={{ fontWeight: "600", color: "var(--text-primary)", marginBottom: "0.5rem" }}>
                            {isParsing ? "読み込み中..." : "クリックしてファイルをアップロード"}
                        </p>
                    </div>
                </div>

                {/* Text Area Section */}
                <div style={{ marginBottom: "1.5rem" }}>
                    <label style={{ display: "block", fontWeight: "600", marginBottom: "0.5rem" }}>
                        登録内容 (編集可能)
                    </label>
                    <textarea
                        value={resumeText}
                        onChange={(e) => setResumeText(e.target.value)}
                        placeholder="職務経歴、スキル、アピールポイントなどを入力してください..."
                        style={{ height: "350px", width: "100%", padding: "1rem" }}
                    />
                </div>

                {saveMessage && (
                    <div style={{ color: "var(--success)", fontWeight: "bold", marginBottom: "1rem", whiteSpace: "pre-wrap" }}>
                        {saveMessage}
                    </div>
                )}

                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button onClick={handleSave} className="btn btn-primary" style={{ padding: "0.75rem 2.5rem" }}>
                        保存する
                    </button>
                </div>
            </div>
        </div>
    );
}
