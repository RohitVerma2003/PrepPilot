"use client";

import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import { setJobDescription } from "@/slices/globalState";
import { useQuizActions } from "@/hooks/useQuizActions";
import Breadcrumb from "@/components/ui/BreadCrumb";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import InfoBox from "@/components/ui/InfoBox";
import { FileText } from "lucide-react";

export default function QuizStart() {
  const { jobDescription, isLoading } = useSelector(
    (state: RootState) => state.globalStates
  );
  const dispatch = useDispatch();
  const { startQuiz } = useQuizActions();

  return (
    <div className="space-y-4">
      <Breadcrumb
        items={[{ label: "Home", active: true }, { label: "New Quiz" }]}
      />

      <Card
        title="Start New Quiz"
        icon={<FileText className="w-5 h-5 text-gray-400" />}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Job Description
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => dispatch(setJobDescription(e.target.value))}
              placeholder="Enter the job description for which you want to prepare..."
              rows={8}
              className="w-full px-3 py-2 bg-gray-950 border border-gray-700 rounded-md text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm resize-none"
            />
            <p className="mt-2 text-xs text-gray-500">
              Describe the role, required skills, and responsibilities.
            </p>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button
              onClick={startQuiz}
              disabled={!jobDescription.trim() || isLoading}
              loading={isLoading}
              variant="primary"
            >
              Start Quiz
            </Button>
            <Button variant="ghost">Cancel</Button>
          </div>
        </div>
      </Card>

      <InfoBox variant="info">
        <strong>Note:</strong> The quiz will consist of maximum 10 questions
        tailored to the job description you provide. You'll receive immediate
        feedback after completion.
      </InfoBox>
    </div>
  );
}
