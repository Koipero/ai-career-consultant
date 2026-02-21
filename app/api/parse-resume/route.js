import { NextResponse } from "next/server";
import pdf from "pdf-parse";
import mammoth from "mammoth";

export async function POST(req) {
    try {
        const formData = await req.formData();
        const file = formData.get("file");

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const type = file.type;
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        let text = "";

        if (type === "application/pdf") {
            const data = await pdf(buffer);
            text = data.text;
        } else if (
            type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
            file.name.endsWith(".docx")
        ) {
            const result = await mammoth.extractRawText({ buffer });
            text = result.value;
        } else {
            return NextResponse.json(
                { error: "Unsupported file type. Only PDF and DOCX are supported." },
                { status: 400 }
            );
        }

        // Clean up basic whitespace issues
        text = text.replace(/\n\s*\n/g, "\n\n").trim();

        return NextResponse.json({ text });
    } catch (error) {
        console.error("Error parsing resume:", error);
        return NextResponse.json({ error: "Failed to parse file" }, { status: 500 });
    }
}
