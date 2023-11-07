type TrueFalseQuestion = {
  type: "TrueFalse";
  text: string;
  answer: "true" | "false";
};

type MultipleChoiceQuestion = {
  type: "MultipleChoice";
  text: string;
  options: string[];
  correctAnswer: number;
};

type FillInTheBlankQuestion = {
  type: "FillInTheBlank";
  text: string;
  blanks: string[];
  correctAnswers: string[];
};

export type Question =
  | TrueFalseQuestion
  | MultipleChoiceQuestion
  | FillInTheBlankQuestion;
