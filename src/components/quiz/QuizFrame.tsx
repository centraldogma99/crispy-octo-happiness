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
import ContentContext from "../../contexts/ContentContext";

const QuizFrame = (props: { difficulty?: string, numOfQuiz?: number, showAnswers?: boolean }) => {
  const numOfQuiz = props.numOfQuiz ?? 10;
  const difficulty = props.difficulty ?? "easy"

  const { setContent } = React.useContext(ContentContext);

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
  // 로딩 중인지?, 로드를 할 것인지? 로도 사용됨
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  // 답 보여주는지?
  const [showAnswers, setShowAnswers] = React.useState<boolean>(props.showAnswers ?? false)
  // 에러 발생? (문제 소진)
  const [isError, setIsError] = React.useState<string>("")
  const [isReview, setIsReview] = React.useState<boolean>(false);

  const startTime = useRef<Date>(new Date());

  const sessionKeyName = 'quizApiToken';

  // 컴포넌트 최초 로딩 시 API로부터 퀴즈 로딩
  useLayoutEffect(() => {
    (async () => {
      if (isError.length > 0) return;
      if (!isLoading) return;

      // 토큰 가져오기
      let token = sessionStorage.getItem(sessionKeyName);
      if (!token) {
        const t = await getToken();
        sessionStorage.setItem(sessionKeyName, t);
        token = t;
      }

      const fetchData = (token: string) => {
        return axios.get<{ response_code: number, results: IQuizAPI[] }>(
          `https://opentdb.com/api.php?amount=${numOfQuiz}&category=9&difficulty=${difficulty}&type=multiple&encode=url3986&token=${token}`);
      }

      let res = await fetchData(token);

      // session expired
      if (res.data.response_code === 3) {
        const token = await getToken();
        res = await fetchData(token)
      } else if (res.data.response_code === 4) {
        setIsError("이 난이도의 모든 퀴즈를 풀었습니다. 이미 푼 퀴즈도 다시 풀고 싶다면 아래 버튼을 눌러주세요.")
        return;
      }
      setIsLoading(false);

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
  }, [isError, isLoading])

  const onClickNext = () => {
    if (!showAnswers) {
      // 제출 버튼
      if (!selected) return;
      // 답 확인 시켜준 후 저장
      setShowAnswers(true);
      if (!userAnswers[currentIndex]) {
        setUserAnswers(prev => [...prev.slice(0, currentIndex - 1), selected, ...prev.slice(currentIndex)])
      }
      setSelected(undefined);
    }
    else {
      // 다음 버튼
      setShowAnswers(false);
      setSelected(undefined);

      if (currentIndex < quizs.length) {
        setCurrentIndex(prev => prev + 1)
      } else {
        setIsResult(true)
      }

      if (userAnswers[currentIndex]) setShowAnswers(true);
    }
  }

  const onClickBefore = () => {
    if (currentIndex <= 1) return;
    setSelected(undefined)
    // if (selected) {
    //   setUserAnswers(prev => [...prev.slice(0, currentIndex - 1), selected, ...prev.slice(currentIndex)]);
    // }
    setShowAnswers(true);
    // setSelected(userAnswers[currentIndex - 2])

    setCurrentIndex(prev => prev - 1);
  }

  const onClickReview = () => {
    setIsReview(true);
    setIsResult(false);
    setCurrentIndex(1);
    // setUserAnswers([]);
    setShowAnswers(true);
    setSelected(userAnswers[0])
  }

  const onClickResult = () => {
    setIsResult(true);
    setCurrentIndex(1);
    setShowAnswers(false);
    setIsReview(false);
    setSelected(undefined);
  }

  const onClickRetry = () => {
    const wrongs = quizs.filter((quiz, i) => {
      return quiz.correct_answer != userAnswers[i].content
    })
    setQuizs(wrongs)
    setIsResult(false);
    setCurrentIndex(1);
    setUserAnswers([]);
    setShowAnswers(false)
  }

  const onClickRefresh = () => {
    refreshToken(sessionStorage.getItem(sessionKeyName))
    setIsError("")
    setCurrentIndex(1);
    setUserAnswers([]);
    setShowAnswers(false);
    setIsLoading(true);
  }

  const onClickRetryNew = () => {
    setIsResult(false);
    setCurrentIndex(1);
    setUserAnswers([]);
    setShowAnswers(false);
    setIsLoading(true);
  }

  const onClickToIntro = () => {
    setIsResult(false);
    setCurrentIndex(1);
    setUserAnswers([]);
    setShowAnswers(false);
    setContent({ content: "intro" });
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
    {isLoading && <div className={css`position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);`}>
      <h1>퀴즈 로딩 중...</h1>
    </div>}

    {isError.length > 0 && <div>
      <p>{isError}</p>
      <Button onClick={onClickRefresh}>클릭!</Button>
    </div>}

    {(!isLoading && !isResult && isError.length === 0) && <div>
      <div className={css`background-color: dodgerblue; color: white; padding-top: 0.5em; padding-bottom: 0.5em;`}>
        <p className={css`font-size: 2em; margin: 0; margin-bottom: 0.5em; font-weight: 600;`}>
          {diffKor} 퀴즈 {showAnswers ? "정답 보기" : ""}</p>
        <p className={css`font-size: 1.3em; margin: 0;`}>({currentIndex}/{quizs.length})</p>
      </div>
      <LinearProgress variant="determinate" value={currentIndex / quizs.length * 100} />

      {(quizs.length > 0 && currentIndex > 0 && isError.length === 0) && <Quiz
        quiz={quizs[currentIndex - 1]}
        selected={selected}
        setSelected={setSelected}
        showAnswers={showAnswers}
        userAnswer={userAnswers[currentIndex - 1]}
      />}

      {(currentIndex > 1) && <Button onClick={onClickBefore} className={css`margin-right: 1em;`}>
        이전
      </Button>}
      <Button disabled={!showAnswers && !selected} onClick={onClickNext}>
        {showAnswers ? (currentIndex < quizs.length ? "다음" : "결과 보기") : "제출"}
      </Button><br />
      {showAnswers && <div className={css`font-size: 20px; font-weight: bold; margin-top: 40px;`}>
        {userAnswers[currentIndex - 1].content === quizs[currentIndex - 1].correct_answer ?
          <p>정답입니다!</p> : <p>틀렸습니다!<br />정답이 <span className={css`color: green;`}>녹색</span>으로 표시됩니다.</p>}
      </div>}
      {isReview && <Button className={css`margin-top: 20px;`} onClick={onClickResult}>결과창으로 돌아가기</Button>}
    </div>}

    {(!isLoading && isResult) &&
      <Result userAnswers={userAnswers}
        quizs={quizs}
        startTime={startTime.current}
        onClickReview={onClickReview}
        onClickRetry={onClickRetry}
        onClickRetryNew={onClickRetryNew}
        onClickToIntro={onClickToIntro} />}
  </>)
};

export default QuizFrame;
