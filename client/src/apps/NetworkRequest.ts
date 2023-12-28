import axios from "axios"

class NetworkRequest {
  constructor() {
    // Initialization if needed
  }

  getBaseUrl = () => {
    if (process.env.NODE_ENV === "development") {
      const href = window.location.href.split(":")
      return `${href[0]}:${href[1]}:4000`
    } else {
      const href = window.location.href.split(":")
      return `${href[0]}:${href[1]}`
    }
  }

  openRequest = async (path: string) => {
    try {
      const url = this.getBaseUrl()

      const response = await axios.get(`${url}/api${path}`, {
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = response.data
      console.log("openRequestData />", data)
      return [data, response.status]
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.log("openRequest />", error)
      }
      return [error, 404]
    }
  }

  signup = async (formData: {
    employeeid: string
    firstName: string
    lastName: string
    email: string
    contact: string
    branch: string
  }) => {
    try {
      const url = this.getBaseUrl()
      const response = await axios.post(
        `${url}/api/v1/oauth/signup`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      const payload = response.data

      return [payload, response.status]
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.log("openRequest />", error)
      }
      return error
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  login = async (_username: string, _password: string | undefined) => {
    if (_password) {
      try {
        const url = this.getBaseUrl()

        const response = await axios.post(
          `${url}/api/v1/oauth/login`,
          {
            username: _username,
            password: _password,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )

        const payload = response.data

        return payload
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.log("openRequest />", error)
        }

        // Always return an object with an 'error' property for consistency
        return { error }
      }
    } else {
      throw "password is required"
    }
  }

  ResetPassword = async (
    _username: string,
    _password: string | undefined,
    _newPassword: string | undefined
  ) => {
    try {
      if (!_password || !_newPassword) {
        throw new Error("password is required")
      }

      const url = this.getBaseUrl()

      const response = await axios.post(
        `${url}/api/v1/oauth/password_reset`,
        {
          username: _username,
          password: _password,
          new_password: _newPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )

      if (response.status === 200) {
        return [true, null]
      } else {
        return [false, `Unexpected status: ${response.status}`]
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (process.env.NODE_ENV === "development") {
        console.error("ResetPassword error:", error)
      }

      return [false, error.message || "Unknown error"]
    }
  }

  ForgetPassword = async (
    _username: string | undefined,
    _otp: string | undefined,
    _newPassword: string | undefined
  ) => {
    if (_otp || _newPassword) {
      try {
        const url = this.getBaseUrl()

        const response = await axios.post(
          `${url}/api/v1/oauth/forget_password`,
          {
            username: _username,
            otp: _otp,
            new_password: _newPassword,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )

        const payload = response.data
        // Return an object with both payload and status
        return payload
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.log("openRequest />", error)
        }

        // Always return an object with an 'error' property for consistency
        return { error }
      }
    } else {
      throw "password is required"
    }
  }
}

export default NetworkRequest
