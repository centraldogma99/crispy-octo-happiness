import axios from "axios";
import React, { useLayoutEffect, useRef } from "react";
import IQuiz, { IQuizAPI } from "../../types/quiz";
import Quiz from "./Quiz";
import shuffle from "../../modules/shuffle";
import Result from "../result/Result";
import { LinearProgress } from "@mui/material";
import { Button } from "../styled/Button"
import { css } from "@emotion/css"
import getToken from "../../modules/getToken";
import refreshToken from "../../modules/refreshToken";

const QuizFrame = (props: { difficulty?: string, numOfQuiz?: number, showAnswers?: boolean }) => {
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
  // 로딩 중인지?
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [showAnswers, setShowAnswers] = React.useState<boolean>(props.showAnswers ?? false)

  const [isError, setIsError] = React.useState<string>("")

  const startTime = useRef<Date>(new Date());

  const sessionKeyName = 'quizApiToken';

  // 컴포넌트 최초 로딩 시 API로부터 퀴즈 로딩
  useLayoutEffect(() => {
    (async () => {
      if (isError.length > 0) return;
      let token = sessionStorage.getItem(sessionKeyName);
      if (!token) {
        const t = await getToken();
        sessionStorage.setItem(sessionKeyName, t);
        token = t;
      }

      const res = await axios.get<{ response_code: number, results: IQuizAPI[] }>(
        `https://opentdb.com/api.php?amount=${numOfQuiz}&category=9&difficulty=${difficulty}&type=multiple&encode=url3986&token=${token}`);
      setIsLoading(false);

      if (res.data.response_code === 4) {
        setIsError("이 난이도의 모든 퀴즈를 풀었습니다. 이미 푼 퀴즈도 다시 풀고 싶다면 아래 버튼을 눌러주세요.")
        return;
      }

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
  }, [isError])

  const onClickNext = () => {
    if (showAnswers) {
      setSelected(undefined);
    } else {
      if (!selected) return;
      if (currentIndex === 0) return;
      // 이전으로 왔다가 다음 누르는 것 아니면 데이터 추가
      if (!userAnswers[currentIndex]) {
        setUserAnswers(prev => [...prev.slice(0, currentIndex - 1), selected, ...prev.slice(currentIndex + 1)])
        setSelected(undefined)
      }
    }
    if (currentIndex < numOfQuiz) {
      setCurrentIndex(prev => prev + 1)
    } else {
      setIsResult(true)
    }
    // 다음 항목이 있다면 selected값 변경
    if (userAnswers[currentIndex]) setSelected(userAnswers[currentIndex])
  }

  const onClickBefore = () => {
    if (currentIndex <= 1) return;
    if (selected) {
      setUserAnswers(prev => [...prev.slice(0, currentIndex - 1), selected, ...prev.slice(currentIndex + 1)]);
    }
    setSelected(userAnswers[currentIndex - 2])

    setCurrentIndex(prev => prev - 1);
  }

  const onClickReview = () => {
    setIsResult(false);
    setCurrentIndex(1);
    // setUserAnswers([]);
    setShowAnswers(true);
  }

  const onClickRetry = () => {
    setIsResult(false);
    setCurrentIndex(1);
    setUserAnswers([]);
    setShowAnswers(false)
  }

  const onClickRefresh = () => {
    refreshToken(sessionStorage.getItem(sessionKeyName))
    setIsError("")
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
    {isLoading && <div>
      <h1>Loading...</h1>
    </div>}

    {isError.length > 0 && <div>
      <p>{isError}</p>
      <Button onClick={onClickRefresh}>클릭!</Button>
    </div>}

    {(!isLoading && !isResult && isError.length === 0) && <div>
      <div className={css`background-color: dodgerblue; color: white; padding-top: 0.5em; padding-bottom: 0.5em;`}>
        <p className={css`font-size: 2em; margin: 0; margin-bottom: 0.5em; font-weight: 600;`}>
          {diffKor} 퀴즈 {showAnswers ? "정답 보기" : ""}</p>
        <p className={css`font-size: 1.3em; margin: 0;`}>({currentIndex}/{numOfQuiz})</p>
      </div>
      <LinearProgress variant="determinate" value={currentIndex / numOfQuiz * 100} />

      {(quizs.length > 0 && currentIndex > 0 && isError.length === 0) && <Quiz
        quiz={quizs[currentIndex - 1]}
        selected={selected}
        setSelected={setSelected}
        showAnswers={showAnswers}
        userAnswer={userAnswers[currentIndex - 1]}
      />}

      {(currentIndex > 1) && <Button onClick={onClickBefore}>
        이전
      </Button>}
      <Button disabled={!showAnswers && !selected} onClick={onClickNext}>
        {currentIndex < numOfQuiz ? "다음" : (showAnswers ? "결과창으로 돌아가기" : "결과 보기")}
      </Button>
    </div>}

    {(!isLoading && isResult) &&
      <Result userAnswers={userAnswers}
        quizs={quizs}
        startTime={startTime.current}
        onClickReview={onClickReview}
        onClickRetry={onClickRetry} />}
  </>)
};

export default QuizFrame;
