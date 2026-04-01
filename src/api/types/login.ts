export interface LoginRequestBody {
  email: string
  password: string
}

export interface LoginResponseBody {
  access_token: string
  refresh_token: string
  token_type: string
  is_admin: boolean
  full_name: string
}
