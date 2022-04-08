import AxiosBase, { AxiosInstance } from 'axios'

export type AuthProvider = { logout: () => void }
export type ApiConstructor<T> = new (axios: AxiosInstance) => T

export function createService<T>(Api: ApiConstructor<T>, basePath: string, authProvider?: AuthProvider): T {
  const axios = AxiosBase.create({
    timeout: 59000,
    baseURL: basePath,
  })

  axios.defaults.withCredentials = process.env.APP_ENV === 'production' || false

  axios.interceptors.response.use((response) => response, async (error) => {
    if (error.response && authProvider && error.response.status === 401) {
      authProvider.logout()
    }

    throw error
  })

  return new Api(axios)
}
