export interface Question {
  index: number;
  question: {
    statement: string;
    options: string[];
  };
}

export interface ResultQues {
  statement: string;
  options: string[];
}

export interface ResultDetail {
  question: ResultQues;
  answer: number;
  correctAnswer: number;
}

export interface Results {
  score: number;
  totalScore: number;
  details: ResultDetail[];
}