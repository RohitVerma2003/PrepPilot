"use client";

import React, { useState, useEffect } from "react";
import io, { Socket } from "socket.io-client";
import {
  FileText,
  Circle,
  CheckCircle2,
  XCircle,
  GitBranch,
  Award,
} from "lucide-react";
import axios from "axios"

interface Question {
  index: number;
  question: {
    statement: string;
    options: string[];
  };
}

interface ResultQues {
  statement: string;
  options: string[];
}

interface ResultDetail {
  question: ResultQues;
  answer: number;
  correctAnswer: number;
}

interface Results {
  score: number;
  totalScore: number;
  details: ResultDetail[];
}

// Note: Socket.io connection would be initialized here
const socket: Socket = io("http://localhost:8000");

const App: React.FC = () => {
  const [jobDescription, setJobDescription] = useState<string>("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [results, setResults] = useState<Results | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const startQuiz = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await axios.post<{ sessionId: string }>(
        "http://localhost:8000/start-quiz",
        { jobDescription }
      );
      setSessionId(res.data.sessionId);
      socket.emit("join-quiz", res.data.sessionId);
    } catch {
      setError("Failed to start quiz. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    socket.on("question", (data: Question) => {
      setCurrentQuestion(data);
      setSelectedOption(null);
    });

    socket.on("results", (data: Results) => {
      setResults(data);
      setCurrentQuestion(null);
    });

    socket.on("error", (msg: string) => setError(msg));

    return () => {
      socket.off("question");
      socket.off("results");
      socket.off("error");
    };
  }, []);

  const submitAnswer = (index: number) => {
    if (!sessionId) return;
    setSelectedOption(index);
    setTimeout(() => {
      socket.emit("answer", { sessionId, answer: index + 1 });
    }, 300);
  };

  const percentage = results
    ? Math.round((results.score / results.totalScore) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <GitBranch className="w-8 h-8 text-gray-100" />
            <h1 className="text-2xl font-semibold">QuizMaster</h1>
            <span className="px-2 py-0.5 text-xs font-medium bg-green-600 text-white rounded-full">
              v1.0
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {!sessionId && !results && (
          <div className="space-y-4">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span className="text-blue-500 hover:underline cursor-pointer">
                Home
              </span>
              <span>/</span>
              <span>New Quiz</span>
            </div>

            {/* Main Card */}
            <div className="border border-gray-800 rounded-lg bg-gray-900">
              <div className="border-b border-gray-800 px-4 py-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <h2 className="font-semibold">Start New Quiz</h2>
                </div>
              </div>

              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Job Description
                  </label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Enter the job description for which you want to prepare..."
                    rows={8}
                    className="w-full px-3 py-2 bg-gray-950 border border-gray-700 rounded-md text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm resize-none"
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Describe the role, required skills, and responsibilities.
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={startQuiz}
                    disabled={!jobDescription.trim() || isLoading}
                    className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Starting...
                      </>
                    ) : (
                      "Start Quiz"
                    )}
                  </button>
                  <button className="px-4 py-2 text-gray-300 text-sm hover:text-white">
                    Cancel
                  </button>
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="border border-blue-800 bg-blue-950 rounded-md p-4">
              <div className="flex gap-3">
                <Circle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-200">
                  <strong className="text-blue-100">Note:</strong> The quiz will
                  consist of maximum 10 questions tailored to the job description you
                  provide. You'll receive immediate feedback after completion.
                </div>
              </div>
            </div>
          </div>
        )}

        {currentQuestion && (
          <div className="space-y-4">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span className="text-blue-500 hover:underline cursor-pointer">
                Quiz
              </span>
              <span>/</span>
              <span>Question {currentQuestion.index}</span>
            </div>

            {/* Progress */}
            <div className="border border-gray-800 rounded-lg bg-gray-900 p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-300">
                  Question {currentQuestion.index} of 10
                </span>
                <div className="flex gap-1">
                  {[...Array(10)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-8 h-1 rounded-full ${
                        i < currentQuestion.index
                          ? "bg-green-600"
                          : "bg-gray-700"
                      }`}
                    ></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Question Card */}
            <div className="border border-gray-800 rounded-lg bg-gray-900">
              <div className="border-b border-gray-800 px-4 py-3 bg-gray-900">
                <h2 className="font-semibold">Question</h2>
              </div>

              <div className="p-4">
                <p className="text-base leading-relaxed mb-6">
                  {currentQuestion.question.statement}
                </p>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-400 mb-3">
                    Select your answer:
                  </p>
                  {currentQuestion.question.options.map(
                    (option: string, index: number) => (
                      <button
                        key={index}
                        onClick={() => submitAnswer(index)}
                        disabled={selectedOption !== null}
                        className={`w-full text-left px-4 py-3 rounded-md border transition-all ${
                          selectedOption === index
                            ? "border-blue-600 bg-blue-950 text-blue-100"
                            : "border-gray-700 bg-gray-950 hover:border-gray-600 hover:bg-gray-800"
                        } disabled:cursor-not-allowed`}
                      >
                        <div className="flex items-start gap-3">
                          <span
                            className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-semibold mt-0.5 ${
                              selectedOption === index
                                ? "border-blue-500 bg-blue-500 text-white"
                                : "border-gray-600 text-gray-400"
                            }`}
                          >
                            {String.fromCharCode(65 + index)}
                          </span>
                          <span className="flex-1 text-sm">{option}</span>
                        </div>
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {results && (
          <div className="space-y-4">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span className="text-blue-500 hover:underline cursor-pointer">
                Quiz
              </span>
              <span>/</span>
              <span>Results</span>
            </div>

            {/* Score Card */}
            <div className="border border-gray-800 rounded-lg bg-gray-900">
              <div className="border-b border-gray-800 px-4 py-3">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-500" />
                  <h2 className="font-semibold">Quiz Results</h2>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="text-4xl font-bold text-gray-100 mb-1">
                      {percentage}%
                    </div>
                    <p className="text-gray-400">
                      {results.score} out of {results.totalScore} correct
                    </p>
                  </div>
                  <div
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      percentage >= 80
                        ? "bg-green-900 text-green-300"
                        : percentage >= 60
                        ? "bg-yellow-900 text-yellow-300"
                        : "bg-red-900 text-red-300"
                    }`}
                  >
                    {percentage >= 80
                      ? "Excellent"
                      : percentage >= 60
                      ? "Good"
                      : "Needs Improvement"}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-800 rounded-full h-2 mb-4">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      percentage >= 80
                        ? "bg-green-600"
                        : percentage >= 60
                        ? "bg-yellow-600"
                        : "bg-red-600"
                    }`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>

                <button
                  onClick={() => {
                    window.location.reload()                  
                  }}
                  className="px-4 py-2 bg-gray-800 text-gray-100 text-sm font-medium rounded-md hover:bg-gray-700 border border-gray-700"
                >
                  Start New Quiz
                </button>
              </div>
            </div>

            {/* Detailed Results */}
            <div className="border border-gray-800 rounded-lg bg-gray-900">
              <div className="border-b border-gray-800 px-4 py-3">
                <h2 className="font-semibold">Detailed Results</h2>
              </div>

              <div className="divide-y divide-gray-800">
                {results.details.map((q, i) => {
                  const isCorrect = q.answer === q.correctAnswer;
                  return (
                    <div key={i} className="p-4">
                      <div className="flex items-start gap-3 mb-3">
                        {isCorrect ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" />
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-gray-200 mb-2">
                            Question {i + 1}: {q.question.statement}
                          </p>

                          <div className="space-y-2 text-sm">
                            <div
                              className={`flex items-start gap-2 ${
                                isCorrect ? "text-green-400" : "text-red-400"
                              }`}
                            >
                              <span className="font-medium">Your answer:</span>
                              <span>{q.question.options[q.answer - 1]}</span>
                            </div>

                            {!isCorrect && (
                              <div className="flex items-start gap-2 text-green-400">
                                <span className="font-medium">
                                  Correct answer:
                                </span>
                                <span>
                                  {q.question.options[q.correctAnswer - 1]}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="border border-red-800 bg-red-950 rounded-md p-4">
            <div className="flex gap-3">
              <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <div className="text-sm text-red-200">
                <strong className="text-red-100">Error:</strong> {error}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <p className="text-sm text-gray-500 text-center">
            © 2025 QuizMaster. Powered by AI.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
