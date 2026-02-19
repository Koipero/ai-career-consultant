"use client";

import { useState, useRef } from "react";

export default function InputForm({ onAnalyze, isLoading }) {
    // Input A State
    const [resumeMode, setResumeMode] = useState("text"); // 'text' | 'file'
    const [resumeText, setResumeText] = useState("");
    const [resumeFiles, setResumeFiles] = useState([]);
    const resumeInputRef = useRef(null);

    // Input B State
    const [jobMode, setJobMode] = useState("text"); // 'text' | 'file' | 'url'
    const [jobText, setJobText] = useState("");
    const [jobFile, setJobFile] = useState(null);
    const [jobUrl, setJobUrl] = useState("");
    const jobInputRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Construct payload object first (page.js will convert to FormData)
        const payload = {
            resume: {
                type: resumeMode,
                data: resumeMode === "text" ? resumeText : resumeFiles
            },
            job: {
                type: jobMode,
                data: jobMode === "text" ? jobText : (jobMode === "file" ? jobFile : jobUrl)
            }
        };

        if (payload.resume.data && payload.job.data) {
            onAnalyze(payload);
        }
    };

    const TabButton = ({ active, label, onClick }) => (
        <button
            type="button"
            onClick={onClick}
            className={`tab-btn ${active ? "active" : ""}`}
        >
            {label}
        </button>
    );

    return (
        <div className="card">
            <h2 style={{ marginBottom: "1rem", fontSize: "1.2rem", fontWeight: "700", color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                📝 キャリア情報の入力
            </h2>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

                {/* Input A: User Profile */}
                <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                        <label style={{ fontWeight: "600", color: "var(--text-primary)" }}>
                            Input A: 職務経歴書
                        </label>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                            <TabButton active={resumeMode === "text"} label="テキスト" onClick={() => setResumeMode("text")} />
                            <TabButton active={resumeMode === "file"} label="ファイル (PDF)" onClick={() => setResumeMode("file")} />
                        </div>
                    </div>

                    {resumeMode === "text" ? (
                        <textarea
                            value={resumeText}
                            onChange={(e) => setResumeText(e.target.value)}
                            placeholder="ここに職務経歴書や自己PRを入力してください..."
                            style={{ height: "150px" }}
                        />
                    ) : (
                        <div>
                            <input
                                id="resume-upload"
                                ref={resumeInputRef}
                                type="file"
                                accept=".pdf"
                                multiple
                                onChange={(e) => {
                                    if (e.target.files?.length) {
                                        setResumeFiles(prev => [...prev, ...Array.from(e.target.files)]);
                                    }
                                    // Reset to allow same file selection again, but uses setTimeout to ensure event processing
                                    const target = e.target;
                                    setTimeout(() => { target.value = ""; }, 0);
                                }}
                                style={{ display: "none" }}
                            />
                            <div className="glass-panel" style={{
                                padding: "2rem",
                                textAlign: "center",
                                border: "2px dashed var(--glass-border)",
                                borderRadius: "var(--radius-md)",
                                background: "rgba(0,0,0,0.2)",
                                transition: "all 0.3s ease",
                                cursor: "pointer",
                                position: "relative"
                            }}
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    e.currentTarget.style.borderColor = "var(--accent-primary)";
                                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                                }}
                                onDragLeave={(e) => {
                                    e.preventDefault();
                                    e.currentTarget.style.borderColor = "var(--glass-border)";
                                    e.currentTarget.style.background = "rgba(0,0,0,0.2)";
                                }}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    e.currentTarget.style.borderColor = "var(--glass-border)";
                                    e.currentTarget.style.background = "rgba(0,0,0,0.2)";
                                    const droppedFiles = Array.from(e.dataTransfer.files).filter(f => f.type === "application/pdf");
                                    if (droppedFiles.length > 0) {
                                        setResumeFiles(prev => [...prev, ...droppedFiles]);
                                    }
                                }}
                                onClick={() => resumeInputRef.current?.click()}
                            >
                                <div style={{ fontSize: "2rem", marginBottom: "1rem", color: "var(--text-secondary)" }}>
                                    📂
                                </div>
                                <p style={{ fontWeight: "600", color: "var(--text-primary)", marginBottom: "0.5rem" }}>
                                    クリックまたはドラッグ＆ドロップでアップロード
                                </p>
                                <p style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>
                                    職務経歴書、ポートフォリオなど（PDF形式 / 複数可）
                                </p>
                            </div>

                            {/* File List (Moved outside drop zone) */}
                            {resumeFiles.length > 0 && (
                                <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                    {resumeFiles.map((file, index) => (
                                        <div key={index} style={{
                                            display: "flex", alignItems: "center", justifyContent: "space-between",
                                            padding: "0.75rem 1rem",
                                            background: "var(--bg-secondary)",
                                            border: "2px solid var(--border-color)",
                                            borderRadius: "var(--radius-md)"
                                        }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", overflow: "hidden" }}>
                                                <span style={{ fontSize: "1.2rem" }}>📄</span>
                                                <div style={{ display: "flex", flexDirection: "column" }}>
                                                    <span style={{ fontSize: "0.9rem", color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "300px" }}>
                                                        {file.name}
                                                    </span>
                                                    <span style={{ fontSize: "0.75rem", color: "var(--text-tertiary)" }}>
                                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                                    </span>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Stop bubble to prevent opening file dialog if relevant
                                                    setResumeFiles(prev => prev.filter((_, i) => i !== index));
                                                }}
                                                style={{
                                                    background: "none", border: "none", cursor: "pointer",
                                                    color: "var(--text-tertiary)", padding: "0.25rem"
                                                }}
                                                title="削除"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Input B: Target Job */}
                <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                        <label style={{ fontWeight: "600", color: "var(--text-primary)" }}>
                            Input B: 募集要項
                        </label>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                            <TabButton active={jobMode === "text"} label="テキスト" onClick={() => setJobMode("text")} />
                            <TabButton active={jobMode === "file"} label="画像/PDF" onClick={() => setJobMode("file")} />
                            <TabButton active={jobMode === "url"} label="URL" onClick={() => setJobMode("url")} />
                        </div>
                    </div>

                    {jobMode === "text" && (
                        <textarea
                            value={jobText}
                            onChange={(e) => setJobText(e.target.value)}
                            placeholder="応募したい求人の要件や説明を入力してください..."
                            style={{ height: "150px" }}
                        />
                    )}

                    {jobMode === "file" && (
                        <>
                            <input
                                id="job-upload"
                                ref={jobInputRef}
                                type="file"
                                accept=".pdf,image/*"
                                style={{ display: "none" }}
                                onChange={(e) => setJobFile(e.target.files[0])}
                            />
                            <div style={{
                                padding: "2rem",
                                textAlign: "center",
                                border: "2px dashed var(--text-tertiary)",
                                borderRadius: "var(--radius-lg)",
                                background: "var(--bg-secondary)",
                                cursor: "pointer"
                            }}
                                onClick={() => jobInputRef.current?.click()}
                            >
                                <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🖼️</div>
                                <p style={{ marginTop: "1rem", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                                    求人票のPDFまたは画像ファイルをアップロードしてください
                                </p>
                                {jobFile && <p style={{ color: "var(--accent-primary)", fontWeight: "bold", marginTop: "0.5rem" }}>{jobFile.name}</p>}
                            </div>
                        </>
                    )}

                    {jobMode === "url" && (
                        <input
                            type="url"
                            value={jobUrl}
                            onChange={(e) => setJobUrl(e.target.value)}
                            placeholder="求人ページのURL (例: https://example.com/jobs/123)"
                        />
                    )}
                </div>

                <button
                    type="submit"
                    disabled={
                        (resumeMode === "text" && !resumeText) || (resumeMode === "file" && resumeFiles.length === 0) ||
                        (jobMode === "text" && !jobText) || (jobMode === "file" && !jobFile) || (jobMode === "url" && !jobUrl) ||
                        isLoading
                    }
                    className="btn btn-primary"
                    style={{ alignSelf: "flex-end", minWidth: "200px" }}
                >
                    {isLoading ? "分析中 (数分かかる場合があります)..." : "キャリア分析を開始"}
                </button>
            </form >
        </div >
    );
}
