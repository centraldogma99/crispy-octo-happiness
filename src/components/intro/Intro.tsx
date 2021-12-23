import React from "react";
import ContentContext from "../../contexts/ContentContext";
import { css } from "@emotion/css";
import { Button } from "../styled/Button";
import { Select, MenuItem } from "@mui/material";

const style2 = css`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border: 2px solid dodgerblue;
  padding: 3em;
`

const Intro = () => {
  const { setContent } = React.useContext(ContentContext)
  const [difficulty, setDifficulty] = React.useState<string>("easy")

  const onClickStart = () => {
    setContent({ content: "quiz", difficulty: difficulty })
  }

  return (
    <div className={style2}>
      <h1 className={css`margin: 0; margin-bottom: 1.5em;`}>상식 퀴즈 맞추기!</h1>
      <Select
        labelId="demo-simple-select-label"
        label="Age"
        onChange={(e) => setDifficulty(e.target.value as string)}
        value={difficulty}
        defaultValue="easy"
        className={css`margin-bottom: 1em;`}
      >
        <MenuItem value="easy">쉬움</MenuItem>
        <MenuItem value="medium">중간</MenuItem>
        <MenuItem value="hard">어려움</MenuItem>
      </Select>
      <br />
      <Button onClick={onClickStart}>시작하기</Button>
    </div>
  );
};

export default Intro;
