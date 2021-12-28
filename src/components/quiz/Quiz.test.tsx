import Quiz from "./Quiz"
import React from 'react'
import { render } from "@testing-library/react"

it("matches snapshot", () => {
  // question: string,
  // correct_answer: string,
  // incorrect_answers: string[],
  // choices: string[]
  const a = render(
    <Quiz quiz={{
      question: "hello, world question",
      correct_answer: "right answer0",
      incorrect_answers: ["wrong1", "wrong2", "wrong3"],
      choices: ["right answer0", "wrong1", "wrong2", "wrong3"]
    }}
      setSelected={ }
    />)
})