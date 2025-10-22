import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import { evaluateScore, generateQuestions } from "./utility.js";

const app = express();
const server = http.createServer(app);

app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:8000"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:8000"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const quizState = new Map();       // sessionId → quiz data
const socketToSession = new Map(); // socketId → sessionId

app.use(express.json());

app.post("/start-quiz", async (req, res) => {
  try {
    const { jobDescription } = req.body;
    if (!jobDescription)
      return res.status(400).json({ error: "Job description required..." });

    const { questions, answers } = await generateQuestions(jobDescription);
    const sessionId = uuidv4();

    quizState.set(sessionId, {
      questions,
      currentIndex: 0,
      answers,
      userAnswers: [],
      totalQuestions: questions.length
    });

    res.json({ sessionId });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate questions" });
  }
});

io.on("connection", (socket) => {
  const origin = socket.handshake.headers.origin;
  const allowedOrigins = ["http://localhost:3000", "http://localhost:8000"];
  if (!allowedOrigins.includes(origin)) {
    console.log(`🚫 Blocked connection from origin: ${origin}`);
    socket.disconnect(true);
    return;
  }

  console.log("✅ User Connected:", socket.id);

  socket.on("join-quiz", (sessionId) => {
    if (!quizState.has(sessionId)) {
      socket.emit("error", "Invalid Session");
      return;
    }

    socket.join(sessionId);
    socketToSession.set(socket.id, sessionId);

    const state = quizState.get(sessionId);
    socket.emit("question", {
      question: state.questions[state.currentIndex],
      index: state.currentIndex + 1,
    });
  });

  socket.on("answer", ({ sessionId, answer }) => {
    const state = quizState.get(sessionId);
    if (!state || state.currentIndex >= state.totalQuestions) {
      socket.emit("error", "Quiz ended or some error occurred");
      return;
    }

    state.userAnswers.push({
      question: state.questions[state.currentIndex],
      answer,
      score: state.answers[state.currentIndex] === answer,
      correctAnswer: state.answers[state.currentIndex],
    });
    state.currentIndex++;

    if (state.currentIndex < state.totalQuestions) {
      socket.emit("question", {
        question: state.questions[state.currentIndex],
        index: state.currentIndex + 1,
      });
    } else {
      socket.emit("results", {
        score: evaluateScore(state),
        details: state.userAnswers,
        totalScore: state.totalQuestions,
      });

      quizState.delete(sessionId);
      socketToSession.delete(socket.id);
      socket.disconnect();
    }
  });

  socket.on("disconnect", () => {
    const sessionId = socketToSession.get(socket.id);

    if (sessionId) {
      // Cleanup session when user leaves midway
      quizState.delete(sessionId);
      socketToSession.delete(socket.id);
      console.log(`🧹 Cleaned up session ${sessionId}`);
    }

    console.log("❌ User disconnected:", socket.id, quizState.size);
  });
});

server.listen(8000, () => {
  console.log("🚀 Server started at http://localhost:8000");
});
