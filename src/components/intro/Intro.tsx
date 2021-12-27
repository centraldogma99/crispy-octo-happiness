import React from "react";
import ContentContext from "../../contexts/ContentContext";
import { css } from "@emotion/css";
import { Button } from "../styled/Button";
import { Select, MenuItem } from "@mui/material";

const style = css`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`

const style2 = css`
  min-width: 250px;
  width: 300px;
  height: 150px;
  
  padding: 3em;
`

const Intro = () => {
  const { setContent } = React.useContext(ContentContext)
  const [difficulty, setDifficulty] = React.useState<string>("easy")

  const onClickStart = () => {
    setContent({ content: "quiz", difficulty: difficulty })
  }

  return (
    <div className={style}>
      <p className={css`margin: 0; margin-bottom: 1.5em; font-size: 50px; font-weight: bold;`}>상식 퀴즈 맞추기</p>
      <p className={css`font-size: 25px;`}>당신의 상식을 시험해 보세요!</p>
      <div className={style2}>

        <Select
          labelId="demo-simple-select-label"
          label="Age"
          onChange={(e) => setDifficulty(e.target.value as string)}
          value={difficulty}
          defaultValue="easy"
          className={css`margin-bottom: 2em; `}
        >
          <MenuItem value="easy">쉬움</MenuItem>
          <MenuItem value="medium">중간</MenuItem>
          <MenuItem value="hard">어려움</MenuItem>
        </Select>
        <br />
        <Button onClick={onClickStart}>시작하기</Button>
      </div>
    </div>
  );
};

export default Intro;
