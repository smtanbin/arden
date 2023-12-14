import axios, { AxiosRequestConfig, AxiosResponse } from "axios"

// const _url: string = import.meta.env.VITE_SERVER_URL as string
const _url: string = "10.140.6.65:4000"

interface TokenData {
  token: string
  refreshToken: string
}

interface Auth {
  token: TokenData
  login: (data: TokenData) => void
  logout: () => void
}

export default class Api {
  auth: Auth

  constructor(auth: Auth) {
    // Save the auth object as an instance variable
    this.auth = auth
  }

  // Define the useApi method
  useApi = async <T>(
    type: AxiosRequestConfig["method"] = "GET",
    path: string,
    data: unknown = null
  ): Promise<T> => {
    const { token } = this.auth
    if (!token) {
      throw new Error("No token found")
    }
    if (!path) {
      throw new Error("No path found")
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token.token,
    }

    try {
      const response: AxiosResponse<T> = await axios({
        method: type,
        url: _url + "/api" + path,
        data,
        headers,
      })
      return response.data
    } catch (error: unknown) {
      if (error.response && error.response.status === 401) {
        console.log("401 found")
        await this.useRefreshToken() // Call useRefreshToken directly
        return this.useApi<T>(type, path, data) // Retry the original API request
      } else {
        console.error("Error in useApi, Path:" + path + " Error: ", error)
        throw error
      }
    }
  }

  // Define the useRefreshToken method
  useRefreshToken = async (): Promise<boolean> => {
    const { token, login, logout } = this.auth

    if (token.token && token.refreshToken) {
      const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token.token,
      }

      const data = { refreshToken: token.refreshToken }

      try {
        const response: AxiosResponse<{ token: string }> = await axios.post(
          _url + "/api/login/refreshToken",
          data,
          { headers }
        )

        const newToken = response.data.token
        login({ token: newToken, refreshToken: token.refreshToken })
        return true
      } catch (error: unknown) {
        console.error("Error in useRefreshToken: ", error)
        logout() // Logout the user if refresh token fails
        throw error
      }
    } else {
      logout()
      throw new Error(
        "Error in useRefreshToken: No token found. Token: " +
          token.token +
          ", Refresh token: " +
          token.refreshToken
      )
    }
  }
}
