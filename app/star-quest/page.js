"use client";

import { useState, useRef, useEffect } from "react";

export default function StarQuestPage() {
    const [messages, setMessages] = useState([
        { role: "model", content: "こんにちは！AIキャリアコンサルタントです。あなたのキャリアエピソードを「STARメソッド」を使って一緒に深堀りしていきましょう。まずは、どのようなエピソードについてお話ししたいか、簡単で構いませんので教えていただけますか？" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [context, setContext] = useState(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Load context on mount
    useEffect(() => {
        const storedContext = localStorage.getItem("starQuestContext");
        if (storedContext) {
            try {
                const parsedContext = JSON.parse(storedContext);
                setContext(parsedContext);
                localStorage.removeItem("starQuestContext");

                // Trigger initial context-aware response
                setIsLoading(true);
                fetch("/api/star-quest", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        message: "深堀りを開始してください。",
                        history: [],
                        context: parsedContext
                    }),
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.response) {
                            setMessages([{ role: "model", content: data.response }]);
                        }
                    })
                    .catch(err => console.error(err))
                    .finally(() => setIsLoading(false));
            } catch (e) {
                console.error("Failed to parse context", e);
            }
        }
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = { role: "user", content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            // Prepare history for API
            const historyPayload = messages.map(m => ({
                role: m.role,
                parts: [{ text: m.content }]
            }));

            const body = {
                message: userMessage.content,
                history: historyPayload
            };

            // Include context if it exists (persist context through conversation if needed,
            // or maybe just for the first turn? API needs to know context to keep acting relevantly.
            // Actually, if we send history, the AI might remember. But sending context explicitly is safer.)
            if (context) {
                body.context = context;
            }

            const response = await fetch("/api/star-quest", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                throw new Error("API request failed");
            }

            const data = await response.json();
            setMessages((prev) => [...prev, { role: "model", content: data.response }]);
        } catch (error) {
            console.error("Error:", error);
            setMessages((prev) => [...prev, { role: "model", content: "エラーが発生しました。もう一度お試しください。" }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "80vh" }}>
            <div style={{ flex: 1, overflowY: "auto", padding: "1rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                {/* Context Indicator */}
                {context && (
                    <div style={{
                        fontSize: "0.8rem",
                        padding: "0.5rem 1rem",
                        background: "var(--bg-secondary)",
                        borderRadius: "var(--radius-sm)",
                        borderLeft: "4px solid var(--accent-secondary)",
                        marginBottom: "0.5rem"
                    }}>
                        <strong>深堀り中のエピソード:</strong> {context.original_text.substring(0, 30)}...
                    </div>
                )}

                {messages.map((msg, index) => (
                    <div key={index} style={{
                        alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                        maxWidth: "80%",
                        padding: "0.8rem 1rem",
                        borderRadius: "1rem",
                        backgroundColor: msg.role === "user" ? "var(--accent-primary)" : "#f0f0f0",
                        color: msg.role === "user" ? "white" : "black",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                        whiteSpace: "pre-wrap"
                    }}>
                        {msg.content}
                    </div>
                ))}
                {isLoading && (
                    <div style={{ alignSelf: "flex-start", color: "#888", fontSize: "0.8rem", paddingLeft: "1rem" }}>
                        入力中...
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div style={{ padding: "1rem", borderTop: "1px solid var(--border-color)", background: "white" }}>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="エピソードを入力..."
                        style={{
                            flex: 1,
                            padding: "0.8rem",
                            borderRadius: "1.5rem",
                            border: "1px solid #ccc",
                            resize: "none",
                            height: "50px",
                            fontFamily: "inherit"
                        }}
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLoading}
                        style={{
                            padding: "0 1.2rem",
                            borderRadius: "1.5rem",
                            border: "none",
                            background: isLoading ? "#ccc" : "var(--accent-primary)",
                            color: "white",
                            fontWeight: "bold",
                            cursor: isLoading ? "default" : "pointer"
                        }}
                    >
                        送信
                    </button>
                </div>
            </div>
        </div>
    );
}
