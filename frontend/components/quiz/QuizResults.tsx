"use client";

import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import Breadcrumb from "@/components/ui/BreadCrumb";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import ResultItem from "./ResultItem";
import { Award } from "lucide-react";

export default function QuizResults() {
  const { results } = useSelector((state: RootState) => state.globalStates);

  if (!results) return null;

  const percentage = Math.round((results.score / results.totalScore) * 100);
  const status =
    percentage >= 80
      ? "Excellent"
      : percentage >= 60
      ? "Good"
      : "Needs Improvement";

  return (
    <div className="space-y-4">
      <Breadcrumb
        items={[{ label: "Quiz", href: "#" }, { label: "Results" }]}
      />

      <Card
        title="Quiz Results"
        icon={<Award className="w-5 h-5 text-yellow-500" />}
      >
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
            {status}
          </div>
        </div>

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
          />
        </div>

        <Button onClick={() => window.location.reload()} variant="secondary">
          Start New Quiz
        </Button>
      </Card>

      <Card title="Detailed Results">
        <div className="divide-y divide-gray-800">
          {results.details.map((detail, i) => (
            <ResultItem key={i} detail={detail} index={i} />
          ))}
        </div>
      </Card>
    </div>
  );
}
