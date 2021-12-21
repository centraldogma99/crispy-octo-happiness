import React from "react"
import IQuiz from "../../types/quiz"
import styled from "@emotion/styled"

const Choice = styled.p`
  cursor: ${(props: { clickable?: boolean, selected?: boolean }) => props.clickable ? "pointer" : undefined};
  color: ${(props: { selected?: boolean }) => props.selected ? "red" : undefined};
`

const Quiz = (props: {
  quiz: { question: string, choices: string[] },
  selected?: { index: number, content: string },
  setSelected: React.Dispatch<React.SetStateAction<{
    index: number;
    content: string;
  } | undefined>>
}) => {
  // 0 ~ 3

  return <div>
    <h2>{props.quiz.question}</h2>
    <div>
      {props.quiz.choices.map((choice, i) =>
        <Choice clickable
          selected={i === props.selected?.index}
          onClick={() => props.setSelected({ index: i, content: choice })}
          key={i}
        >
          {choice}
        </Choice>
      )}
    </div>
  </div >
}

export default Quiz;