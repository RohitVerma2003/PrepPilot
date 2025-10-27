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
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

const MAX_CHARACTERS = 1500;

export default function QuizStart() {
  const { jobDescription, isLoading } = useSelector(
    (state: RootState) => state.globalStates
  );
  const dispatch = useDispatch();
  const { startQuiz } = useQuizActions();

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_CHARACTERS) {
      dispatch(setJobDescription(value));
    }
  };

  const remainingChars = MAX_CHARACTERS - jobDescription.length;
  const isNearLimit = remainingChars <= 50;

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
              onChange={handleDescriptionChange}
              placeholder="Enter the job description for which you want to prepare..."
              rows={8}
              maxLength={MAX_CHARACTERS}
              className="w-full px-3 py-2 bg-gray-950 border border-gray-700 rounded-md text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm resize-none"
            />
            <div className="mt-2 flex items-center justify-between">
              <p className="text-xs text-gray-500">
                Describe the role, required skills, and responsibilities.
              </p>
              <p
                className={`text-xs font-medium ${
                  isNearLimit
                    ? "text-yellow-500"
                    : remainingChars === 0
                    ? "text-red-500"
                    : "text-gray-500"
                }`}
              >
                {remainingChars} / {MAX_CHARACTERS} characters remaining
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <SignedOut>
              <SignInButton>
                <Button variant="primary">Start Quiz</Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Button
                onClick={startQuiz}
                disabled={!jobDescription.trim() || isLoading}
                loading={isLoading}
                variant="primary"
              >
                Start Quiz
              </Button>
            </SignedIn>
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