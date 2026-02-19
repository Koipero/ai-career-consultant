import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { scrapeUrl } from "../../../utils/scraper";

// Mock Data (unchanged)
const MOCK_CASE_A = {
    analysis_meta: {
        target_role: "品質保証(QA)エンジニア",
        match_score: 85,
        match_rating: "A"
    },
    synergy_points: [
        {
            category: "Hard Skill",
            job_requirement: "ラボ管理・プロトコル設計",
            user_evidence: "3年間の化学ラボ安全管理プロトコルの策定・運用経験",
            reasoning: "厳格な手順遵守とプロセス管理能力は、ソフトウェア品質管理に直接転用可能です。"
        },
        {
            category: "Soft Skill",
            job_requirement: "部門間の調整・折衝能力",
            user_evidence: "R&D部門と製造部門のリエゾン担当経験",
            reasoning: "開発と製品部門の橋渡し役となるQAにとって不可欠なスキルです。"
        }
    ],
    gap_analysis: [
        {
            missing_element: "自動テストツール (Selenium/Cypress)",
            risk_level: "Medium",
            mitigation_strategy: "Pythonスクリプティング経験を活かし、テスト自動化を早期習得する。",
            suggested_script: "Cypressの実務経験はありませんが、Pythonでのデータ自動化スクリプト作成経験があり、コードベースのテストロジックは即座に理解可能です。"
        }
    ],
    interview_prep: {
        likely_questions: [
            "開発者がバグ修正を拒否した場合、どのように対応しますか？",
            "プロセスの効率化を行った具体的な経験を教えてください。"
        ],
        recommended_reverse_questions: [
            "手動テストと自動テストの現在の比率はどのくらいですか？",
            "QAチームは開発プロセスのどの段階から関与していますか？"
        ]
    },
    star_improvements: [
        {
            original_text: "ラボの安全管理リーダーとして事故ゼロを達成",
            critique: "「リーダーとして何をしたか」と「ゼロ達成の難易度」が不明瞭です。",
            star_fill_in: {
                task_question: "当時のラボには何名のメンバーがいて、以前は年間何件の事故が起きていましたか？",
                result_question: "どのような施策（例：週1回の点検）の結果、期間（例：2年間）ゼロを維持しましたか？"
            }
        }
    ],
    salary_estimation: {
        market_range: { min: 600, max: 900 },
        estimated_value: 780,
        rationale: "未経験職種への転身ですが、管理経験が高く評価され、中央値以上を狙えます。",
        negotiation_points: [
            "安全管理プロトコルの策定経験は、QAプロセスの構築に即戦力となります。",
            "部門間調整の経験により、PMとも円滑に連携可能です。"
        ]
    }
};

const MOCK_CASE_B = {
    analysis_meta: {
        target_role: "エンタープライズSaaS営業",
        match_score: 70,
        match_rating: "B"
    },
    synergy_points: [
        {
            category: "Experience",
            job_requirement: "高額商材のクロージング",
            user_evidence: "5,000万円規模の不動産売買契約の締結実績",
            reasoning: "複雑で高額な意思決定プロセスをリードする能力は、エンタープライズセールスで高く評価されます。"
        },
        {
            category: "Soft Skill",
            job_requirement: "粘り強さとレジリエンス",
            user_evidence: "コールドコール部門でのトップセールス実績",
            reasoning: "SaaSの新規開拓営業において不可欠なグリット（やり抜く力）の証明になります。"
        }
    ],
    gap_analysis: [
        {
            missing_element: "IT/SaaS業界知識",
            risk_level: "High",
            mitigation_strategy: "ITパスポートの独学と、適応力の高さをアピール。",
            suggested_script: "現在はクラウドの基礎を学習中ですが、不動産営業で培った『顧客の真の課題を特定する力』は、商材が変わっても活かせると確信しています。"
        }
    ],
    interview_prep: {
        likely_questions: [
            "なぜ不動産からIT業界へ転職しようと思ったのですか？",
            "リードタイムの長い案件をどのように管理しますか？"
        ],
        recommended_reverse_questions: [
            "エンタープライズプランの平均的な商談期間はどのくらいですか？",
            "購買意思決定に関わる主なステークホルダーはどのような役職の方ですか？"
        ]
    },
    star_improvements: [
        {
            original_text: "トップセールスとして表彰されました",
            critique: "比較対象や規模感がわからず、凄さが伝わりにくいです。",
            star_fill_in: {
                task_question: "部員何名中、何位でしたか？また、目標達成率は何%でしたか？",
                result_question: "その結果、部門全体の売上にどの程度（金額・割合）貢献しましたか？"
            }
        }
    ],
    salary_estimation: {
        market_range: { min: 800, max: 1200 },
        estimated_value: 950,
        rationale: "業界未経験によりMAX提示は難しいですが、営業基礎体力の高さから、オンボーディング後の伸びしろを含めて交渉可能です。",
        negotiation_points: [
            "5,000万円規模の決裁者（役員クラス）との商談経験。",
            "新規開拓における圧倒的な行動量と成果（トップセールス）。"
        ]
    }
};


async function fileToGenerativePart(file) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return {
        inlineData: {
            data: buffer.toString("base64"),
            mimeType: file.type,
        },
    };
}

export async function POST(req) {
    try {
        const formData = await req.formData();
        const resumeType = formData.get("resumeType");
        const jobType = formData.get("jobType");

        // Prepare Parts for Gemini
        const parts = [];

        // System Instruction / Prompt Context
        parts.push({
            text: `
        あなたはプロフェッショナルなAIキャリアコンサルタントです。
        求職者のプロフィール（Input A）と求人要件（Input B）の適合性を分析してください。
        
        以下のJSONスキーマに従って、**日本語で** 結果を出力してください。
          {
            "analysis_meta": {
              "target_role": "String (ターゲット職種名)",
              "match_score": Integer (0-100),
              "match_rating": "String (S/A/B/C)"
            },
            "synergy_points": [
              { "category": "String (区分)", "job_requirement": "String (求人要件)", "user_evidence": "String (ユーザーの経験)", "reasoning": "String (理由)" }
            ],
            "gap_analysis": [
              { "missing_element": "String (不足要素)", "risk_level": "High/Medium/Low", "mitigation_strategy": "String (対策)", "suggested_script": "String (面接回答例)" }
            ],
            "interview_prep": {
              "likely_questions": ["String", "String"],
              "recommended_reverse_questions": ["String"]
            },
            "star_improvements": [
              {
                "original_text": "String (経歴書の元の記述)",
                "critique": "String (なぜ抽象的か)",
                "star_fill_in": {
                  "task_question": "String (数値を埋めさせる質問)",
                  "result_question": "String (結果の数値を問う質問)"
                }
              }
            ],
            "salary_estimation": {
              "market_range": { "min": Integer (万円), "max": Integer (万円) },
              "estimated_value": Integer (万円),
              "rationale": "String (算出根拠)",
              "negotiation_points": ["String", "String"]
            }
          }
      `
        });

        // Handle Input A: Resume
        // Handle Input A: Resume
        if (resumeType === "file") {
            const files = formData.getAll("resumeFiles");
            if (files && files.length > 0) {
                parts.push({ text: "\n\nInput A (求職者 - 提出書類):" });
                for (const file of files) {
                    if (file.size > 0) { // check for empty parts if any
                        parts.push(await fileToGenerativePart(file));
                    }
                }
            } else {
                // Fallback (if single file sent with old key, though we plan to update frontend)
                const file = formData.get("resumeFile");
                if (file) {
                    parts.push({ text: "\n\nInput A (求職者 - 提出書類):" });
                    parts.push(await fileToGenerativePart(file));
                }
            }
        } else {
            const text = formData.get("resumeText");
            parts.push({ text: `\n\nInput A (求職者 - テキスト):\n${text}` });
        }

        // Handle Input B: Job
        if (jobType === "file") {
            const file = formData.get("jobFile");
            if (file) {
                parts.push({ text: "\n\nInput B (求人要件 - ファイル):" });
                parts.push(await fileToGenerativePart(file));
            }
        } else if (jobType === "url") {
            const url = formData.get("jobUrl");
            const scrapedText = await scrapeUrl(url);
            parts.push({ text: `\n\nInput B (求人要件 - URL: ${url}):\n${scrapedText}` });
        } else {
            const text = formData.get("jobText");
            parts.push({ text: `\n\nInput B (求人要件 - テキスト):\n${text}` });
        }

        // Call Gemini API
        const apiKey = process.env.GEMINI_API_KEY;
        console.log("API Key present:", !!apiKey);

        if (apiKey) {
            try {
                const genAI = new GoogleGenerativeAI(apiKey);
                // Switch to stable model
                const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

                console.log("Generating content with Gemini...");
                const result = await model.generateContent(parts);
                const response = await result.response;
                const text = response.text();
                console.log("Gemini response received");

                const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();
                const json = JSON.parse(jsonStr);

                return NextResponse.json(json);

            } catch (apiError) {
                console.error("Gemini API Detailed Error:", apiError);
                // Fallthrough to mock
            }
        } else {
            console.warn("No API Key found provided in process.env");
        }

        // Mock Fallback
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Simple logic to detect "Sales" in text inputs only (cannot read files in mock)
        let combinedText = "";
        if (resumeType === "text") combinedText += formData.get("resumeText");
        if (jobType === "text") combinedText += formData.get("jobText");
        if (jobType === "url") combinedText += "sales"; // Fake assumption for URL mock test

        if (combinedText.toLowerCase().includes("sales") || combinedText.includes("営業")) {
            return NextResponse.json(MOCK_CASE_B);
        }
        return NextResponse.json(MOCK_CASE_A);

    } catch (error) {
        console.error("Server Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
