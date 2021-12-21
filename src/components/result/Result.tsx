import React from "react";
import IQuiz from "../../types/quiz";

const Result = (props: { userAnswers: { index: number, content: string }[], quizs: IQuiz[], startTime: Date }) => {
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
  </div>;
};

export default Result;
