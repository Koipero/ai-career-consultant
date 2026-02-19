export default function AnalysisReport({ data }) {
    if (!data) return null;

    const { analysis_meta, synergy_points, gap_analysis, interview_prep, star_improvements, salary_estimation } = data;

    // Helper for score color
    const getScoreColor = (score) => {
        if (score >= 80) return "var(--success)";
        if (score >= 60) return "var(--warning)";
        return "var(--danger)";
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem", animation: "fadeIn 0.5s ease" }}>

            {/* Meta Section - Card 1 */}
            <div className="card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                    <h3 style={{ color: "var(--text-secondary)", fontSize: "0.8rem", fontWeight: "700" }}>ターゲット職種</h3>
                    <div style={{ fontSize: "1.25rem", fontWeight: "800", color: "var(--text-primary)" }}>{analysis_meta.target_role}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <div style={{ textAlign: "right" }}>
                        <div style={{ color: "var(--text-secondary)", fontSize: "0.8rem", fontWeight: "700" }}>適合スコア</div>
                        <div style={{ fontSize: "1.5rem", fontWeight: "900", color: getScoreColor(analysis_meta.match_score) }}>
                            {analysis_meta.match_score}
                        </div>
                    </div>
                    <div style={{
                        fontSize: "1.5rem",
                        fontWeight: "900",
                        width: "50px",
                        height: "50px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "2px solid " + getScoreColor(analysis_meta.match_score),
                        background: "white",
                        color: getScoreColor(analysis_meta.match_score),
                        borderRadius: "50%",
                    }}>
                        {analysis_meta.match_rating}
                    </div>
                </div>
            </div>

            {/* Synergy Grid */}
            <section>
                <h3 style={{ fontSize: "1.1rem", marginBottom: "0.5rem", fontWeight: "700", marginLeft: "0.5rem" }}>シナジー分析 (強み)</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {synergy_points.map((point, idx) => (
                        <div key={idx} className="card" style={{ borderLeft: "4px solid var(--accent-primary)", padding: "1rem", marginBottom: "0" }}>
                            <div style={{ fontSize: "0.8rem", color: "var(--accent-primary)", marginBottom: "0.25rem", fontWeight: "700" }}>
                                {point.category}
                            </div>
                            <div style={{ fontWeight: "700", marginBottom: "0.5rem", fontSize: "1rem" }}>{point.job_requirement}</div>
                            <div style={{ fontSize: "0.9rem", color: "var(--text-primary)", lineHeight: "1.6" }}>
                                {point.reasoning}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Gap Analysis */}
            <section>
                <h3 className="gradient-text" style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>ギャップ分析 & 対策</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {gap_analysis.map((gap, idx) => (
                        <div key={idx} className="card" style={{ borderLeft: "6px solid var(--accent-danger)" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem", alignItems: "center" }}>
                                <div style={{ fontWeight: "800", fontSize: "1.1rem" }}>⚠️ 不足: {gap.missing_element}</div>
                                <div style={{
                                    color: "white",
                                    fontWeight: "800",
                                    fontSize: "0.8rem",
                                    padding: "0.25rem 0.75rem",
                                    background: gap.risk_level === "High" ? "var(--accent-danger)" : "var(--accent-highlight)",
                                    borderRadius: "var(--radius-full)",
                                    boxShadow: "0 2px 0 rgba(0,0,0,0.2)"
                                }}>
                                    {gap.risk_level} RISK
                                </div>
                            </div>
                            <div style={{ marginBottom: "1.5rem" }}>
                                <span style={{ color: "var(--text-secondary)", fontWeight: "700" }}>対策方針: </span>
                                {gap.mitigation_strategy}
                            </div>
                            <div style={{ background: "var(--bg-secondary)", padding: "1.5rem", borderRadius: "var(--radius-md)", border: "2px solid var(--border-color)" }}>
                                <div style={{ color: "var(--accent-secondary)", marginBottom: "0.5rem", fontWeight: "800", fontSize: "0.9rem" }}>🗣️ 推奨回答スクリプト</div>
                                <div style={{ fontStyle: "italic", color: "var(--text-primary)" }}>"{gap.suggested_script}"</div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Salary Estimation - Card Style */}
            {salary_estimation && (
                <section className="card" style={{ border: "none", boxShadow: "var(--shadow-md)" }}>
                    <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: "700" }}>
                        💰 推定年収 & 交渉戦略
                    </h3>

                    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                        {/* Clean Gauge Visual */}
                        <div style={{ position: "relative", padding: "1rem 0" }}>
                            <div style={{
                                height: "8px",
                                background: "var(--bg-tertiary)",
                                borderRadius: "var(--radius-full)",
                                position: "relative",
                                marginBottom: "2rem"
                            }}>
                                {/* Golden Zone */}
                                <div style={{
                                    position: "absolute",
                                    left: "40%",
                                    width: "40%",
                                    height: "100%",
                                    background: "var(--accent-secondary)",
                                    opacity: 0.3,
                                    borderRadius: "var(--radius-full)"
                                }}></div>

                                {/* Marker */}
                                <div style={{
                                    position: "absolute",
                                    left: "65%",
                                    top: "-10px",
                                    transform: "translateX(-50%)",
                                    textAlign: "center"
                                }}>
                                    <div style={{
                                        width: "16px",
                                        height: "16px",
                                        background: "var(--accent-primary)",
                                        borderRadius: "50%",
                                        border: "2px solid white",
                                        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                                        margin: "0 auto 4px auto"
                                    }}></div>
                                    <div style={{
                                        color: "var(--accent-primary)",
                                        fontSize: "1.2rem",
                                        fontWeight: "800",
                                        whiteSpace: "nowrap"
                                    }}>
                                        {salary_estimation.estimated_value}万円
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-secondary)", fontSize: "0.8rem" }}>
                                <span>{salary_estimation.market_range.min}万円</span>
                                <span>{salary_estimation.market_range.max}万円</span>
                            </div>
                        </div>

                        {/* Rationale & Points */}
                        <div style={{ background: "var(--bg-primary)", padding: "1rem", borderRadius: "var(--radius-sm)" }}>
                            <p style={{ fontWeight: "600", marginBottom: "1rem", fontSize: "0.9rem" }}>{salary_estimation.rationale}</p>
                            <h4 style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>交渉の武器</h4>
                            <ul style={{ paddingLeft: "1.2rem", listStyle: "none", fontSize: "0.9rem" }}>
                                {salary_estimation.negotiation_points.map((point, i) => (
                                    <li key={i} style={{ marginBottom: "0.5rem", display: "flex", gap: "0.5rem" }}>
                                        <span style={{ color: "var(--accent-primary)" }}>✓</span>
                                        <span>{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>
            )}

            {/* STAR Quest */}
            {star_improvements && star_improvements.length > 0 && (
                <section>
                    <h3 className="gradient-text" style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>✏️ エピソードを強化しよう (STAR Quest)</h3>
                    <div style={{ display: "grid", gap: "1.5rem" }}>
                        {star_improvements.map((item, idx) => (
                            <div key={idx} className="card" style={{ borderLeft: "6px solid var(--accent-secondary)" }}>
                                <div style={{ marginBottom: "1rem", background: "var(--bg-secondary)", padding: "1rem", borderRadius: "var(--radius-sm)" }}>
                                    <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", fontWeight: "700", marginBottom: "0.25rem" }}>元の記述 (抽象的)</div>
                                    <div style={{ fontStyle: "italic" }}>"{item.original_text}"</div>
                                </div>

                                <div style={{ color: "var(--accent-danger)", fontWeight: "700", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                    <span>🔍</span> {item.critique}
                                </div>

                                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                    <div>
                                        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "700", color: "var(--accent-secondary-shade)" }}>
                                            Quest 1: Task (課題)
                                        </label>
                                        <div style={{ padding: "1rem", border: "2px dashed var(--accent-secondary)", borderRadius: "var(--radius-md)", background: "white", color: "var(--text-secondary)" }}>
                                            {item.star_fill_in.task_question}
                                        </div>
                                    </div>
                                    <div>
                                        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "700", color: "var(--accent-secondary-shade)" }}>
                                            Quest 2: Result (結果)
                                        </label>
                                        <div style={{ padding: "1rem", border: "2px dashed var(--accent-secondary)", borderRadius: "var(--radius-md)", background: "white", color: "var(--text-secondary)" }}>
                                            {item.star_fill_in.result_question}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => {
                                            localStorage.setItem("starQuestContext", JSON.stringify(item));
                                            window.location.href = "/star-quest";
                                        }}
                                        className="btn btn-primary"
                                        style={{
                                            marginTop: "0.5rem",
                                            background: "var(--accent-secondary)",
                                            border: "none",
                                            width: "100%",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            gap: "0.5rem"
                                        }}
                                    >
                                        <span>🚀</span> このエピソードを深堀りする (AIと対話)
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Interview Prep */}
            <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
                <div className="card">
                    <h4 style={{ color: "var(--text-secondary)", marginBottom: "1rem", fontWeight: "800", textTransform: "uppercase" }}>🤔 想定される質問</h4>
                    <ul style={{ paddingLeft: "1.2rem", listStyleType: "none" }}>
                        {interview_prep.likely_questions.map((q, i) => (
                            <li key={i} style={{ marginBottom: "0.75rem", paddingBottom: "0.75rem", borderBottom: "2px dashed var(--border-color)" }}>{q}</li>
                        ))}
                    </ul>
                </div>
                <div className="card">
                    <h4 style={{ color: "var(--text-secondary)", marginBottom: "1rem", fontWeight: "800", textTransform: "uppercase" }}>💡 おすすめの逆質問</h4>
                    <ul style={{ paddingLeft: "1.2rem", listStyleType: "none" }}>
                        {interview_prep.recommended_reverse_questions.map((q, i) => (
                            <li key={i} style={{ marginBottom: "0.75rem", paddingBottom: "0.75rem", borderBottom: "2px dashed var(--border-color)" }}>{q}</li>
                        ))}
                    </ul>
                </div>
            </section>

        </div>
    );
}
