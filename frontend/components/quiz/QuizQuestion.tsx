"use client";

import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import { useQuizActions } from "@/hooks/useQuizActions";
import Breadcrumb from "@/components/ui/BreadCrumb";
import Card from "@/components/ui/Card";
import QuizProgress from "./QuizProgress";
import AnswerOption from "./AnswerOption";

export default function QuizQuestion() {
  const { currentQuestion, selectedOption } = useSelector(
    (state: RootState) => state.globalStates
  );
  const { submitAnswer } = useQuizActions();

  if (!currentQuestion) return null;

  return (
    <div className="space-y-4">
      <Breadcrumb
        items={[
          { label: "Quiz", href: "#", active: false },
          { label: `Question ${currentQuestion.index}` },
        ]}
      />

      <QuizProgress current={currentQuestion.index} total={10} />

      <Card title="Question">
        <p className="text-base leading-relaxed mb-6">
          {currentQuestion.question.statement}
        </p>

        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-400 mb-3">
            Select your answer:
          </p>
          {currentQuestion.question.options.map((option, index) => (
            <AnswerOption
              key={index}
              option={option}
              index={index}
              isSelected={selectedOption === index}
              isDisabled={selectedOption !== null}
              onSelect={() => submitAnswer(index)}
            />
          ))}
        </div>
      </Card>
    </div>
  );
}
