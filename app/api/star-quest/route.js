import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { message, history, context } = await req.json();

        // System Instruction / Prompt Context
        let systemPrompt = `
        あなたはプロフェッショナルなAIキャリアコンサルタントです。
        ユーザーのキャリアエピソードを深堀りし、「STARメソッド（Situation, Task, Action, Result）」に基づいて、
        職務経歴書や面接で使える具体的なエピソードに仕上げる手伝いをしてください。

        以下のルールに従って対話を行ってください：
        1. ユーザーに対して、一度に1つの質問だけを行ってください。
        2. 具体的で定量的な情報を引き出すような質問をしてください（例：「チームの規模は何人でしたか？」「売上は前年比何%増でしたか？」）。
        3. ユーザーが答えやすいように、選択肢を提示したり、例を挙げたりしてサポートしてください。
        4. 最終的に、Situation, Task, Action, Resultの全ての要素が揃ったら、エピソード全体をまとめて提示してください。
        5. 口調は丁寧で、共感的（Encouraging）なトーンを維持してください。
        `;

        if (context) {
            systemPrompt += `
            
            【重要：コンテキストの注入】
            ユーザーは、以前のキャリア分析で指摘された以下のエピソードについて深堀りを希望しています。
            この情報に基づき、ユーザーが答えやすい具体的な質問から会話を始めてください。
            
            [元のアピール内容]
            "${context.original_text}"
            
            [分析からの指摘事項]
            ${context.critique}
            
            [特に明確にすべき点]
            1. Task (課題): ${context.star_fill_in.task_question}
            2. Result (結果): ${context.star_fill_in.result_question}
            `;
        }

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ error: "API Key not found" }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            systemInstruction: systemPrompt
        });

        // Parse history from frontend
        let chatHistory = history.map((msg, index) => {
            const text = msg.parts && msg.parts[0] ? msg.parts[0].text : "";
            // console.log(`History parsing [${index}]: Role=${msg.role}, Text=${text.substring(0, 20)}...`);
            return {
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: text }]
            };
        });

        if (chatHistory.length > 0 && chatHistory[0].role === 'model') {
            chatHistory.shift();
        }

        const chat = model.startChat({
            history: chatHistory
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ response: text });

    } catch (error) {
        console.error("STAR Quest API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
