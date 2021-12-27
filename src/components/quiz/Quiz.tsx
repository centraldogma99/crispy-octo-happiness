import React from "react"
import IQuiz from "../../types/quiz"
import styled from "@emotion/styled"
import { css } from "@emotion/css"

const Choice = styled.p`
  cursor: ${(props: { clickable?: boolean, selected?: boolean, answer?: boolean, wrong?: boolean }) =>
    props.clickable ? "pointer" : undefined};
  color: ${(props: { selected?: boolean, answer?: boolean, wrong?: boolean }) =>
    props.answer ? "green" : (props.wrong ? "red" : (props.selected ? "blue" : undefined))};
  border: ${(props: { selected?: boolean }) => props.selected ? "0.7px dotted blue" : "0.7px dotted gainsboro"};
  padding: 0.7em;
  font-weight: ${(props: { answer?: boolean }) => props.answer ? "bold" : undefined};
`

const Quiz = (props: {
  quiz: IQuiz,
  selected?: { index: number, content: string },
  setSelected: React.Dispatch<React.SetStateAction<{
    index: number;
    content: string;
  } | undefined>>,
  showAnswers?: boolean,
  userAnswer?: { index: number, content: string }
}) => {

  const onClickChoice = (i: number, choice: string) => {
    return () => {
      if (!props.showAnswers) {
        props.setSelected({ index: i, content: choice })
      }
    }
  }

  return <div className={css`margin: 20px;`}>
    <h2 className={css`max-width: 900px; margin: auto; margin-top: 1em; margin-bottom: 1.5em;`}>
      {decodeURIComponent(props.quiz.question)}
    </h2>
    <div className={css`width: 20em; margin: auto; margin-bottom: 4em;`}>
      {props.quiz.choices.map((choice, i) =>
        <Choice clickable
          selected={i === props.selected?.index}
          onClick={onClickChoice(i, choice)}
          key={i}
          answer={props.showAnswers && props.quiz.correct_answer === choice}
          wrong={props.showAnswers && props.userAnswer?.index === i}
        >
          {decodeURIComponent(choice)}
        </Choice>
      )}
    </div>
  </div >
}

export default Quiz;