"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import io, { Socket } from "socket.io-client";
import {
  setCurrentQuestion,
  setError,
  setResults,
  setSelectedOption,
} from "@/slices/globalState";
import type { Question, Results } from "@/types";

let socket: Socket;

export function useSocket() {
  const dispatch = useDispatch();

  useEffect(() => {
    socket = io("http://localhost:8000");

    socket.on("question", (data: Question) => {
      dispatch(setCurrentQuestion(data));
      dispatch(setSelectedOption(null));
    });

    socket.on("results", (data: Results) => {
      dispatch(setResults(data));
      dispatch(setCurrentQuestion(null));
    });

    socket.on("error", (msg: string) => dispatch(setError(msg)));

    return () => {
      socket.off("question");
      socket.off("results");
      socket.off("error");
    };
  }, [dispatch]);

  return socket;
}

export function getSocket() {
  return socket;
}
