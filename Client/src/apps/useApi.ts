/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios"
const _url = "http://10.140.6.65:4000"
// const _url = import.meta.env.VITE_SERVER_URL

export default class Api {
  auth: any
  constructor(auth: any) {
    // Save the auth object as an instance variable
    this.auth = auth
  }

  // Define the useApi method
  useApi = async (type = "GET", path: string, data: any = null) => {
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
      const response: any = await axios({
        method: type,
        url: _url + "/api" + path,
        data,
        headers,
      })
      return response.data
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        console.log("401 found")
        const _token = await this.useRefreshToken()
        if (_token) {
          const headers = {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token.token,
          }
          try {
            const response: any = await axios({
              method: type,
              url: _url + "/api" + path,
              data,
              headers,
            })
            console.log("api reply: ", response.data)
            return response.data
          } catch (error: any) {
            console.error("Error in useApi, Path:" + path + " Error: ", error)
            throw error
          }
        } else {
          throw new Error("Token Error R")
        }
      } else {
        console.error("Error in useApi, Path:" + path + " Error: ", error)
        throw error
      }
    }
  }

  // Define the useRefreshToken method
  useRefreshToken = async () => {
    const { token, login } = this.auth

    if (token.token && token.refreshToken) {
      const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token.token,
      }

      const data = { refreshToken: token.refreshToken }

      try {
        const response = await axios.post(
          _url + "/api/login/refreshToken",
          data,
          { headers }
        )

        const newToken = response.data.token
        login({ token: newToken, refreshToken: token.refreshToken })
        return true
      } catch (error: any) {
        console.error("Error in useRefreshToken: ", error)
        throw error
      }
    } else {
      this.auth.logout()
      throw new Error(
        "Error in useRefreshToken: No token found. Token: " +
          token.token +
          ", Refresh token: " +
          token.refreshToken
      )
    }
  }
}
