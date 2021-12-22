import styled from "@emotion/styled"

export const Button = styled.button`
  text-align: center;
  font-size: 1.4em;
  border: none;
  background-color: ${(props: { disabled?: boolean }) => props.disabled ? "gainsboro" : "dodgerblue"};
  border-radius: 4px;
  color: white;
  padding: 0.6em;
  padding-left: 0.8em;
  padding-right: 0.8em;
`