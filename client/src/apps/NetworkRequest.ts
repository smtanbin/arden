class NetworkRequest {
  constructor() {
    // Initialization if needed
  }

  getBaseUrl = () => {
    if (process.env.NODE_ENV === "development") {
      const href = window.location.href.split(":")
      return href[0] + ":" + href[1] + ":4000"
    } else {
      const href = window.location.href.split(":")
      return href[0] + ":" + href[1]
    }
  }

  openRequest = async (path: string) => {
    try {
      const url = this.getBaseUrl()

      const response = await fetch(`${url}/api${path}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()
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
      const response = await fetch(`${url}/api/v1/oauth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employeeid: formData.employeeid,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          contact: formData.contact,
          branch: formData.branch,
        }),
      })
      const payload = await response.json()

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

        const response = await fetch(`${url}/api/v1/oauth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: _username,
            password: _password,
          }),
        })

        const payload = await response.json()

        if (!response.ok) {
          // If the response status is not OK, throw an error with the status and payload
          throw { status: response.status, payload }
        }

        // Return an object with both payload and status
        return payload
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.log("openRequest />", error)
        }

        // Always return an object with a 'error' property for consistency
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
    if (_password || _newPassword) {
      try {
        const url = this.getBaseUrl()

        const response = await fetch(`${url}/api/v1/oauth/password_reset`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: _username,
            password: _password,
            new_password: _newPassword,
          }),
        })

        const payload = await response.json()

        if (!response.ok) {
          // If the response status is not OK, throw an error with the status and payload
          throw { status: response.status, payload }
        }

        // Return an object with both payload and status
        return payload
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.log("openRequest />", error)
        }

        // Always return an object with a 'error' property for consistency
        return { error }
      }
    } else {
      throw "password is required"
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

        const response = await fetch(`${url}/api/v1/oauth/forget_password`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: _username,
            otp: _otp,
            new_password: _newPassword,
          }),
        })

        const payload = await response.json()

        if (!response.ok) {
          // If the response status is not OK, throw an error with the status and payload
          throw { status: response.status, payload }
        }

        // Return an object with both payload and status
        return payload
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.log("openRequest />", error)
        }

        // Always return an object with a 'error' property for consistency
        return { error }
      }
    } else {
      throw "password is required"
    }
  }
}

export default NetworkRequest
