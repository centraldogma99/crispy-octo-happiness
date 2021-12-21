export interface IQuizAPI {
  "category": string,
  "type": string,
  "difficulty": string,
  "question": string,
  "correct_answer": string,
  "incorrect_answers": string[]
}

export default interface IQuiz {
  question: string,
  correct_answer: string,
  incorrect_answers: string[],
  choices: string[]
}