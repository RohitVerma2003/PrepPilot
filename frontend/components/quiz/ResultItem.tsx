import { CheckCircle2, XCircle } from "lucide-react";
import type { ResultDetail } from "@/types";

interface ResultItemProps {
  detail: ResultDetail;
  index: number;
}

export default function ResultItem({ detail, index }: ResultItemProps) {
  const isCorrect = detail.answer === detail.correctAnswer;

  return (
    <div className="p-4">
      <div className="flex items-start gap-3 mb-3">
        {isCorrect ? (
          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
        ) : (
          <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" />
        )}
        <div className="flex-1">
          <p className="font-medium text-gray-200 mb-2">
            Question {index + 1}: {detail.question.statement}
          </p>

          <div className="space-y-2 text-sm">
            <div
              className={`flex items-start gap-2 ${
                isCorrect ? "text-green-400" : "text-red-400"
              }`}
            >
              <span className="font-medium">Your answer:</span>
              <span>{detail.question.options[detail.answer - 1]}</span>
            </div>

            {!isCorrect && (
              <div className="flex items-start gap-2 text-green-400">
                <span className="font-medium">Correct answer:</span>
                <span>{detail.question.options[detail.correctAnswer - 1]}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
