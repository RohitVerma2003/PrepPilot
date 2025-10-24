import dotenv from 'dotenv'
import Groq from 'groq-sdk'

dotenv.config()
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const generateQuestions = async (jobdesc) => {
    const safeJobDesc = jobdesc.replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/\n/g, '\\n');

    const prompt = `You are an AI technical quiz generator. Your task is to create skill-based questions for a technical interview.

IMPORTANT: DO NOT ask questions about the job description itself. Instead, analyze the job description to identify the required technical skills, programming languages, frameworks, tools, and concepts, then generate questions that TEST those skills.

INSTRUCTIONS:
1. First, identify all technical skills, technologies, frameworks, and concepts mentioned in the job description
2. Generate 10 technical multiple-choice questions that test practical knowledge of those skills
3. Questions should be realistic interview questions that assess actual technical understanding
4. Each question must have exactly 4 options with only one correct answer
5. Questions should cover: syntax, concepts, best practices, problem-solving, and real-world scenarios

EXAMPLE:
If job requires "React and JavaScript":
- GOOD: "In React, what is the purpose of the useEffect hook?"
- GOOD: "What is the output of: console.log(typeof null)?"
- BAD: "What skills are required for this position?"
- BAD: "What is mentioned in the job description?"

OUTPUT FORMAT - Return valid JSON only:
{
  "questions": [
    {"statement": "What is...", "options": ["A", "B", "C", "D"]},
    {"statement": "Which...", "options": ["A", "B", "C", "D"]}
  ],
  "answers": [1, 2, 3, 1, 4, 2, 3, 1, 2, 4]
}

Job Description:
${safeJobDesc}`;

    try {
        const result = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile", // Better model for structured output
            messages: [
                { role: "system", content: "You are a quiz generator that outputs valid JSON only." },
                { role: "user", content: prompt }
            ],
            temperature: 0.5,
            max_completion_tokens: 3000,
            response_format: { type: "json_object" } // Simpler response format
        });

        const content = result.choices?.[0]?.message?.content;
        
        if (!content) {
            throw new Error("No content received from API");
        }

        // Parse JSON
        let data;
        try {
            data = JSON.parse(content);
        } catch (parseError) {
            console.error("JSON Parse Error:", parseError);
            console.error("Raw content:", content);
            throw new Error("Invalid JSON response from API");
        }

        // Validate and fix the response
        if (!data.questions || !Array.isArray(data.questions)) {
            throw new Error("Invalid questions array");
        }

        if (!data.answers || !Array.isArray(data.answers)) {
            throw new Error("Invalid answers array");
        }

        // Ensure exactly 10 questions
        if (data.questions.length > 10) {
            data.questions = data.questions.slice(0, 10);
        } else if (data.questions.length < 10) {
            throw new Error(`Only ${data.questions.length} questions generated, expected 10`);
        }

        // Ensure exactly 10 answers
        if (data.answers.length > 10) {
            data.answers = data.answers.slice(0, 10);
        } else if (data.answers.length < 10) {
            throw new Error(`Only ${data.answers.length} answers generated, expected 10`);
        }

        // Validate and fix each question
        for (let i = 0; i < data.questions.length; i++) {
            const q = data.questions[i];
            
            if (!q.statement || typeof q.statement !== 'string') {
                throw new Error(`Question ${i + 1} has invalid statement`);
            }

            if (!Array.isArray(q.options)) {
                throw new Error(`Question ${i + 1} has invalid options`);
            }

            // Ensure exactly 4 options
            if (q.options.length > 4) {
                q.options = q.options.slice(0, 4);
            } else if (q.options.length < 4) {
                // Pad with empty options if needed
                while (q.options.length < 4) {
                    q.options.push(`Option ${q.options.length + 1}`);
                }
            }

            // Validate all options are strings
            q.options = q.options.map(opt => 
                typeof opt === 'string' ? opt : String(opt)
            );
        }

        // Validate and fix each answer
        data.answers = data.answers.map((ans, idx) => {
            const num = Number(ans);
            if (!Number.isInteger(num) || num < 1 || num > 4) {
                console.warn(`Answer ${idx + 1} invalid (${ans}), defaulting to 1`);
                return 1;
            }
            return num;
        });

        console.log("✓ Successfully generated 10 questions with answers");
        console.log("Questions:", data.questions.length);
        console.log("Answers:", data.answers);
        
        return {
            questions: data.questions,
            answers: data.answers
        };

    } catch (error) {
        console.error("Groq Question Generation Error:", error.message || error);
        
        // Return fallback generic questions
        return {
            error: true,
            message: error.message || "Failed to generate questions",
            questions: [
                {
                    statement: "What is the primary purpose of this role?",
                    options: ["Development", "Management", "Design", "Analysis"]
                },
                {
                    statement: "Which skill is most important for this position?",
                    options: ["Technical", "Communication", "Leadership", "Creativity"]
                },
                {
                    statement: "What level of experience is typically required?",
                    options: ["Entry level", "Mid level", "Senior", "Expert"]
                },
                {
                    statement: "Which of these is a key responsibility?",
                    options: ["Coding", "Planning", "Testing", "Documentation"]
                },
                {
                    statement: "What type of work environment is this?",
                    options: ["Remote", "Hybrid", "On-site", "Flexible"]
                },
                {
                    statement: "Which technology stack is mentioned?",
                    options: ["Frontend", "Backend", "Full-stack", "DevOps"]
                },
                {
                    statement: "What is the expected team size?",
                    options: ["Solo", "Small team", "Medium team", "Large team"]
                },
                {
                    statement: "Which methodology is preferred?",
                    options: ["Agile", "Waterfall", "Scrum", "Kanban"]
                },
                {
                    statement: "What is the primary deliverable?",
                    options: ["Software", "Documentation", "Analysis", "Design"]
                },
                {
                    statement: "Which soft skill is emphasized?",
                    options: ["Communication", "Problem-solving", "Teamwork", "Adaptability"]
                }
            ],
            answers: [1, 1, 2, 1, 1, 3, 2, 1, 1, 1]
        };
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