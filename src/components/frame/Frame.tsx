import React from "react"
import Intro from "../intro/Intro"
import ContentContext, { IContent } from "../../contexts/ContentContext"
import Quiz from "../quiz/QuizFrame"
import Result from "../result/Result"
import QuizFrame from "../quiz/QuizFrame"

const Frame = () => {
  const [content, setContent] = React.useState<IContent>({ content: "intro" })

  return (
    <ContentContext.Provider value={{ content, setContent }}>
      <div>
        {content.content === "intro" && <Intro />}
        {content.content === "quiz" && <QuizFrame difficulty={content.difficulty} />}
        {/* {content.content === "result" && <Result />} */}
      </div>
    </ContentContext.Provider>
  )
}

export default Frame;