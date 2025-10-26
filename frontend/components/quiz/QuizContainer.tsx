"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import { useSocket } from "@/hooks/useSocket";
import Layout from "@/components/Layout";
import QuizStart from "./QuizStart";
import QuizQuestion from "./QuizQuestion";
import QuizResults from "./QuizResults";
import ErrorDisplay from "@/components/ui/ErrorDisplay";

export default function QuizContainer() {
  const { sessionId, currentQuestion, results, error } = useSelector(
    (state: RootState) => state.globalStates
  );

  useSocket(); // Custom hook for socket management

  return (
    <Layout>
      {!sessionId && !results && <QuizStart />}
      {currentQuestion && <QuizQuestion />}
      {results && <QuizResults />}
      {error && <ErrorDisplay message={error} />}
    </Layout>
  );
}
