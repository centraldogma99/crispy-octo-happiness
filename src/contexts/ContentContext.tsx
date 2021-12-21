/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext } from "react";

export interface IContent {
  content: "intro" | "quiz" | "result",
  difficulty?: string
}

interface IContentContext {
  content: { content: "intro" | "quiz" | "result", difficulty?: string }
  setContent: React.Dispatch<React.SetStateAction<IContent>>
}

const ContentContext = createContext<IContentContext>({
  content: { content: "intro" },
  setContent: () => { }
});

export default ContentContext;