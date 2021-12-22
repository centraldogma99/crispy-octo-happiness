import React from "react";
import IQuiz from "../../types/quiz";
import { Button } from "../styled/Button"

const Result = (props: {
  userAnswers: { index: number, content: string }[], quizs: IQuiz[], startTime: Date, onClickReview: () => void
}) => {
  let count = 0;
  props.userAnswers.forEach((answer, i) => {
    if (answer.content === props.quizs[i].correct_answer) {
      count++;
    }
  })

  return <div>
    <h1>결과</h1>
    <div>
      <p>맞힌 개수</p>
      {count}
      <p>틀린 개수</p>
      {props.quizs.length - count}
      <p>걸린 시간</p>
      {(Number(new Date()) - Number(props.startTime)) / 1000}초
    </div>
    <Button onClick={props.onClickReview}>정답 보기</Button>
  </div>;
};

export default Result;
