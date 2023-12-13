import axios, { AxiosError, AxiosResponse } from "axios"

type TokenData = {
  token: string
  refresh: string
}

type LoginResponse = {
  status: number
  response: TokenData | undefined
}

class Api {
  loginApi = async (
    auth: {
      token: TokenData
      login: (data: TokenData) => void
      logout: () => void
    },
    username: string,
    password: string
  ): Promise<LoginResponse> => {
    const { login } = auth
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    }

    const data: { username: string; password: string } = {
      username,
      password,
    }

    try {
      const response: AxiosResponse<{ message: string; token: string[] }> =
        await axios.post("http://127.0.0.1:4000/api/v1/oauth/login", data, {
          headers,
        })

      const [token, refreshToken] = response.data.token

      login({
        token,
        refreshToken,
      })

      return {
        status: response.status,
        response: {
          token: token,
          refresh: refreshToken,
        },
      }
    } catch (error) {
      const response = (error as AxiosError)?.response || {
        status: 500,
        data: "Unknown error",
      }

      return { status: response.status, response: undefined }
    }
  }
}

export default new Api() // Export an instance of the class
