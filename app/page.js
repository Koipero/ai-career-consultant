"use client";

import { useState } from "react";
import InputForm from "../components/InputForm";
import AnalysisReport from "../components/AnalysisReport";

export default function Home() {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
              <span>←</span> 再分析
            </button>
            <AnalysisReport data={analysisResult} />
          </div>
        )}
      </div>
    </div>
  );
}
