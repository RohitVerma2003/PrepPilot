import { createSlice } from "@reduxjs/toolkit";

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

interface GlobalState {
  jobDescription: string;
  sessionId: string | null;
  currentQuestion: Question | null;
  results: Results | null;
  error: string | null;
  isLoading: boolean;
  selectedOption: number | null;
}

const initialState: GlobalState = {
  jobDescription: "",
  sessionId: null,
  currentQuestion: null,
  results: null,
  error: null,
  isLoading: false,
  selectedOption: null,
};

export const globalStates = createSlice({
  name: "globalStates",
  initialState,
  reducers: {
    setJobDescription: (state, action) => {
      state.jobDescription = action.payload;
    },
    setSessionId: (state, action) => {
      state.sessionId = action.payload;
    },
    setCurrentQuestion: (state, action) => {
      state.currentQuestion = action.payload;
    },
    setResults: (state, action) => {
      state.results = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setSelectedOption: (state, action) => {
      state.selectedOption = action.payload;
    },
    resetGlobalState: () => initialState,
  },
});

export const {
  setJobDescription,
  setSessionId,
  setCurrentQuestion,
  setResults,
  setError,
  setIsLoading,
  setSelectedOption,
  resetGlobalState,
} = globalStates.actions;

export default globalStates.reducer;
