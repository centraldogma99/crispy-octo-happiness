import React from "react";
import ContentContext from "../../contexts/ContentContext";

const Intro = () => {
  const { setContent } = React.useContext(ContentContext)
  const [difficulty, setDifficulty] = React.useState<string>("easy")

  const onClickStart = () => {
    setContent({ content: "quiz", difficulty: difficulty })
  }

  return (
    <div>
      <h1>상식 퀴즈 맞추기!</h1>
      <select onChange={(e) => setDifficulty(e.target.value)}>
        <option value="easy" selected={true}>쉬움</option>
        <option value="medium">중간</option>
        <option value="hard">어려움</option>
      </select>
      <input type="button" value="시작하기" onClick={onClickStart} />
    </div>
  );
};

export default Intro;
