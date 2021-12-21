import axios from "axios";
import React, { useEffect, useLayoutEffect, useRef } from "react";
import ContentContext from "../../contexts/ContentContext";
import IQuiz, { IQuizAPI } from "../../types/quiz";
import Quiz from "./Quiz";
import shuffle from "../../modules/shuffle";
import Result from "../result/Result";

const QuizFrame = (props: { difficulty?: string, numOfQuiz?: number }) => {
  const numOfQuiz = props.numOfQuiz ?? 10;
  const difficulty = props.difficulty ?? "easy"

  // !! starts with 1, 0 is just initial value
  // 현재 문제 몇번인지?
  const [currentIndex, setCurrentIndex] = React.useState<number>(0);
  // 사용자가 누른 선지 번호
  const [selected, setSelected] = React.useState<{ index: number, content: string }>();
  // 퀴즈들
  const [quizs, setQuizs] = React.useState<IQuiz[]>([]);
  const [userAnswers, setUserAnswers] = React.useState<{ index: number, content: string }[]>([]);
  // 끝났는지?
  const [isResult, setIsResult] = React.useState<boolean>(false);

  const startTime = useRef<Date>(new Date());

  // 컴포넌트 최초 로딩 시 API로부터 퀴즈 로딩
  useLayoutEffect(() => {
    (async () => {
      const res = await axios.get<{ response_code: number, results: IQuizAPI[] }>(
        `https://opentdb.com/api.php?amount=${numOfQuiz}&category=9&difficulty=${difficulty}&type=multiple`);

      const quizs = res.data.results.map(quiz => {
        return {
          question: quiz.question,
          correct_answer: quiz.correct_answer,
          incorrect_answers: quiz.incorrect_answers,
          choices: shuffle([quiz.correct_answer, ...quiz.incorrect_answers])
        }
      })
      startTime.current = new Date();
      setQuizs(quizs);
      setCurrentIndex(1);
    })()
  }, [])

  const onClickNext = () => {
    if (!selected) return;
    if (currentIndex === 0) return;
    setUserAnswers(prev => [...prev, selected])
    setSelected(undefined)
    if (currentIndex < numOfQuiz) {
      setCurrentIndex(prev => prev + 1)
    }
    else {
      setIsResult(true)
    }
  }

  let diffKor = "";
  if (difficulty === "easy") {
    diffKor = "쉬움 난이도";
  } else if (difficulty === "medium") {
    diffKor = "보통 난이도";
  } else {
    diffKor = "어려움 난이도"
  }

  return (<>
    {!isResult && <div>
      <h1>{diffKor} 퀴즈</h1>
      <p>{currentIndex}/{numOfQuiz}</p>

      {quizs.length > 0 && currentIndex > 0 && <Quiz
        quiz={quizs[currentIndex - 1]}
        selected={selected}
        setSelected={setSelected}
      />}

      <input type="button" onClick={onClickNext} value={currentIndex < numOfQuiz ? "다음" : "결과 보기"} />
    </div>}
    {isResult && <Result userAnswers={userAnswers} quizs={quizs} startTime={startTime.current} />}
  </>)
};

export default QuizFrame;
