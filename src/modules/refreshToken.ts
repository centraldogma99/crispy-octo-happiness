import axios from "axios"

const refreshToken = (token: string | null) => {
  if (!token) throw Error("no token given")
  axios.get(`https://opentdb.com/api_token.php?command=reset&token=${token}`)
}

export default refreshToken;