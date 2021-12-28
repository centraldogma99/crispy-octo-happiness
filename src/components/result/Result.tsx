import React from "react";
import IQuiz from "../../types/quiz";
import { Button } from "../styled/Button"
import { css } from "@emotion/css"
import styled from "@emotion/styled";

const Item = styled.p`
  font-weight: 600;
  font-size: 1.2em;
  margin: 0;
  color: dodgerblue;
`
const ItemValue = styled.p`
  font-size: 1.2em;
  margin-top: 0.5em;
  margin-bottom: 1em;
`

const container = css`
  border: 1px solid black;
  width: 10em;
  margin: auto;
  padding: 1em;
  padding-top: 2em;
`

const titleContainer = css`
background-color: dodgerblue;
color: white;
padding-top: 1em;
padding-bottom: 1em;
margin-bottom: 1em;
display: flex;
align-items: center;
justify-content: center;`


const Result = (props: {
  userAnswers: { index: number, content: string }[],
  quizs: IQuiz[],
  startTime: Date,
  onClickReview: () => void,
  onClickRetry: () => void,
  onClickRetryNew: () => void,
  onClickToIntro: () => void
}) => {
  let count = 0;
  props.userAnswers.forEach((answer, i) => {
    if (answer.content === props.quizs[i].correct_answer) {
      count++;
    }
  })

  return <div>
    <div className={titleContainer}>
      <p className={css`font-size: 2em; margin: 0; font-weight: 600;`}>
        결과
      </p>
    </div>
    <div className={container}>
      <Item>맞힌 개수</Item>
      <ItemValue>{count}</ItemValue>
      <Item>틀린 개수</Item>
      <ItemValue>{props.quizs.length - count}</ItemValue>
      <Item>걸린 시간</Item>
      <ItemValue>{(Number(new Date()) - Number(props.startTime)) / 1000}초</ItemValue>
    </div>
    <p><Button onClick={props.onClickReview}>다시 보기</Button></p>
    <p><Button onClick={props.onClickRetry}>틀린 문제만 풀기</Button></p>
    <p><Button onClick={props.onClickRetryNew}>새로운 문제 풀기</Button></p>
    <p><Button onClick={props.onClickToIntro}>난이도 선택 화면으로 돌아가기</Button></p>
  </div>;
};

export default Result;
