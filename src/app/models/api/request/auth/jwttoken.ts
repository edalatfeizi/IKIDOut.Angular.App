export type JWTToken = {
  token: string | null
  refreshToken: string | null
  result: boolean 
  isPasswordChanged: boolean
}
