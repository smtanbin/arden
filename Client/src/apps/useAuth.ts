import { useContext } from "react"
import { AuthContext } from "../Context/AuthProvider"

interface AuthContextValue {
  token: {
    token: string | null
    refreshToken: string | null
    username: string | null
  } | null
  login: (data: {
    token: string
    refreshToken: string
    username: string
  }) => void
  logout: () => void
  username: string | null
}

export const useAuth = (): AuthContextValue => useContext(AuthContext)
