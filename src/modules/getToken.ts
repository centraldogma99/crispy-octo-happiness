// https://opentdb.com/api_token.php?command=request

import axios from "axios"

const getToken = async () => {
  const res = await axios.get<{ response_code: number, response_message: string, token: string }>('https://opentdb.com/api_token.php?command=request')
  return res.data.token;
}

export default getToken;