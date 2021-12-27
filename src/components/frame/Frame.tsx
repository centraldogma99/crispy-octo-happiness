import React from "react"
import Intro from "../intro/Intro"
import ContentContext, { IContent } from "../../contexts/ContentContext"
import QuizFrame from "../quiz/QuizFrame"
import { css } from "@emotion/css"

const Frame = () => {
  const [content, setContent] = React.useState<IContent>({ content: "intro" })

  return (
    <ContentContext.Provider value={{ content, setContent }}>
      <div className={css`min-width: 400px;`}>
        {content.content === "intro" && <Intro />}
        {content.content === "quiz" && <QuizFrame difficulty={content.difficulty} />}
        {/* {content.content === "result" && <Result />} */}
      </div>
    </ContentContext.Provider>
  )
}

export default Frame;