"use client";

import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import type { RootState } from "@/app/store";
import {
  setIsLoading,
  setError,
  setSessionId,
  setSelectedOption,
} from "@/slices/globalState";
import { getSocket } from "./useSocket";

export function useQuizActions() {
  const dispatch = useDispatch();
  const { jobDescription, sessionId } = useSelector(
    (state: RootState) => state.globalStates
  );

  const startQuiz = async () => {
    try {
      dispatch(setIsLoading(true));
      dispatch(setError(null));
      const res = await axios.post<{ sessionId: string }>(
        "http://localhost:8000/start-quiz",
        { jobDescription }
      );
      dispatch(setSessionId(res.data.sessionId));
      getSocket().emit("join-quiz", res.data.sessionId);
    } catch {
      dispatch(setError("Failed to start quiz. Please try again."));
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  const submitAnswer = (index: number) => {
    if (!sessionId) return;
    dispatch(setSelectedOption(index));
    setTimeout(() => {
      getSocket().emit("answer", { sessionId, answer: index + 1 });
    }, 300);
  };

  return { startQuiz, submitAnswer };
}
