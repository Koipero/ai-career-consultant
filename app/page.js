"use client";

import { useState, useEffect } from "react";
import InputForm from "../components/InputForm";
import AnalysisReport from "../components/AnalysisReport";

export default function Home() {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState([]);

  // Load history from localStorage on initial render
  useEffect(() => {
    const savedHistory = localStorage.getItem("careerConsultHistory");
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history from localStorage", e);
      }
    }
  }, []);

  const saveToHistory = (data) => {
    setHistory((prev) => {
      const newEntry = {
        id: Date.now(),
        date: new Date().toLocaleString("ja-JP"),
        target_role: data.analysis_meta?.target_role || "不明",
        score: data.analysis_meta?.match_score || 0,
        data: data
      };
      
      const updatedHistory = [newEntry, ...prev].slice(0, 10); // Keep max 10
      localStorage.setItem("careerConsultHistory", JSON.stringify(updatedHistory));
      return updatedHistory;
    });
  };

  // Updated to handle payload object from InputForm
  const handleAnalyze = async (payload) => {
    setIsLoading(true);
    setAnalysisResult(null);

    const formData = new FormData();

    // Resume Processing
    formData.append("resumeType", payload.resume.type);
    if (payload.resume.type === "file") {
      // payload.resume.data should be an array of files
      if (Array.isArray(payload.resume.data)) {
        payload.resume.data.forEach((file) => {
          formData.append("resumeFiles", file);
        });
      } else if (payload.resume.data) {
        // Fallback for single file if not array
        formData.append("resumeFiles", payload.resume.data);
      }
    } else {
      formData.append("resumeText", payload.resume.data);
    }

    // Job Processing
    formData.append("jobType", payload.job.type);
    if (payload.job.type === "file") {
      formData.append("jobFile", payload.job.data);
    } else if (payload.job.type === "url") {
      formData.append("jobUrl", payload.job.data);
    } else {
      formData.append("jobText", payload.job.data);
    }

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData, // Send as FormData
      });

      if (!response.ok) {
        throw new Error("Analysis failed");
      }

      const data = await response.json();
      setAnalysisResult(data);
      saveToHistory(data);
    } catch (error) {
      console.error("Error:", error);
      alert("エラーが発生しました。もう一度お試しください。");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
  };

  return (
    <div style={{ paddingBottom: "2rem" }}>
      <div style={{ paddingBottom: "2rem" }}>
        <div style={{ display: analysisResult ? "none" : "block" }}>
          <InputForm onAnalyze={handleAnalyze} isLoading={isLoading} />
        </div>

        {analysisResult && (
          <div style={{ animation: "fadeIn 0.5s ease" }}>
            <button
              onClick={handleReset}
              className="btn btn-secondary"
              style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem", padding: "0.5rem 1rem" }}
            >
              <span>←</span> 再分析・履歴へ戻る
            </button>
            <AnalysisReport data={analysisResult} />
          </div>
        )}

        {!analysisResult && history.length > 0 && (
          <div style={{ marginTop: "2rem" }}>
            <h3 style={{ marginBottom: "1rem", fontSize: "1.2rem", fontWeight: "700", color: "var(--text-primary)" }}>
              🕒 過去の分析履歴 (最大10件)
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {history.map((item) => (
                <div 
                  key={item.id} 
                  className="card" 
                  style={{ 
                    cursor: "pointer", 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center",
                    padding: "1rem",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    borderLeft: "4px solid var(--accent-secondary)"
                  }}
                  onClick={() => setAnalysisResult(item.data)}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "var(--shadow-md)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "var(--shadow-sm)";
                  }}
                >
                  <div>
                    <div style={{ fontSize: "1.1rem", fontWeight: "700", color: "var(--text-primary)", marginBottom: "0.25rem" }}>
                      {item.target_role}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                      {item.date}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", fontWeight: "700" }}>適合スコア</div>
                    <div style={{ 
                        fontSize: "1.5rem", 
                        fontWeight: "900", 
                        color: item.score >= 80 ? "var(--success)" : item.score >= 60 ? "var(--warning)" : "var(--danger)" 
                    }}>
                      {item.score}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
