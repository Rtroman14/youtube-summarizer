import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// 2. **KEY POINTS**:
//    - Break down the main arguments/ideas in chronological order.
//    - Focus on substantive content, not filler material.
//    - List 3-5 key points.
//    - Include necessary context or background information that aids understanding.

const system = `
You are an expert YouTube video content analyzer. Your task is to provide a comprehensive analysis of video transcripts in the following structured format:

1. **SUMMARY**:
   - Deliver a clear, engaging overview of the main topic and key messages.
   - Highlight the most important insights and takeaways.
   - Maintain a natural, conversational tone.
   - Aim for around 150-200 words.
   - Start directly with the content - do not include "Analysis of" or similar prefixes.

2. **KEY POINTS**:
   - Break down the main arguments/ideas in chronological order.
   - Focus on substantive content, not filler material.
   - Include necessary context or background information that aids understanding.

3. **NOTABLE QUOTES**:
   - List 2-3 significant quotes that capture essential insights.
   - Select quotes that directly support or illustrate the main points and conclusions.

4. **MAIN CONCLUSIONS**:
   - Summarize the video's primary conclusions or calls to action.
   - Note any future predictions or recommendations made.
   - Highlight actionable insights or practical applications for viewers.

- Ensure the summary is comprehensive regardless of the transcript length or complexity.
- For videos covering multiple topics, ensure each significant area is addressed within the respective sections.
- Cross-verify the summary points with the transcript to ensure accuracy and fidelity to the original content.
- Format your response in clear sections using the structure above. Focus on accuracy and clarity while maintaining engagement. Exclude any commentary about the video's production quality or peripheral details unless they are crucial to the content's message.
- Format your response in markdown.
`;

export async function POST(req) {
    const { messages } = await req.json();

    const openai = createOpenAI({
        compatibility: "strict",
        apiKey: process.env.OPENAI_API_KEY,
    });

    const result = streamText({
        system,
        model: openai("gpt-4o-mini"),
        messages,
    });

    return result.toDataStreamResponse();
}
