import dotenv from 'dotenv'
import Groq from 'groq-sdk'

dotenv.config()
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const generateQuestions = async (jobdesc) => {
    const safeJobDesc = jobdesc.replace(/\\/g, '\\\\')   // escape backslashes
        .replace(/"/g, '\\"')     // escape double quotes
        .replace(/\n/g, '\\n');  // replace newlines

    const prompt = `
You are an AI quiz generator. Based on the following job description, generate **10 multiple-choice questions** that test the user's understanding of relevant skills, technologies, and concepts.

Each question should have 4 options, and exactly one correct answer (use 1-based index for correct answer).

Return ONLY a JSON object in this exact format:

{
  "questions": [
    { "statement": "Question 1 text", "options": ["Option 1", "Option 2", "Option 3", "Option 4"] },
    ...
  ],
  "answers": [1, 3, 2, 1, 4 , 1, 3, 2, 1, 4]
}

Job Description:
${safeJobDesc}
  `;

    try {
        const result = await groq.chat.completions.create({
            model: "openai/gpt-oss-20b",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.9,
            max_completion_tokens: 1000,
            reasoning_effort: "medium",
            response_format: {
                type: "json_schema",
                json_schema: {
                    name: "QuizQuestions",
                    schema: {
                        type: "object",
                        properties: {
                            questions: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        statement: { type: "string" },
                                        options: {
                                            type: "array",
                                            items: { type: "string" },
                                            minItems: 4,
                                            maxItems: 4
                                        }
                                    },
                                    required: ["statement", "options"]
                                },
                                minItems: 10,
                                maxItems: 10
                            },
                            answers: {
                                type: "array",
                                items: { type: "integer", minimum: 1, maximum: 4 },
                                minItems: 10,
                                maxItems: 10
                            }
                        },
                        required: ["questions", "answers"],
                        additionalProperties: false
                    }
                }
            }
        });

        const content = result.choices?.[0]?.message?.content || "{}";
        const data = JSON.parse(content);

        console.log("Groq Question Data:", data);
        return data;
    } catch (error) {
        console.error("Groq Question Generation Error:", error);
        return error
    }
};

export const evaluateScore = (state) => {
    const { userAnswers, totalQuestions } = state;
    let score = 0;

    for (let i = 0; i < totalQuestions; i++) {
        score += userAnswers[i].score ? 1 : 0;
    }
    console.log({ score })
    return score;
}