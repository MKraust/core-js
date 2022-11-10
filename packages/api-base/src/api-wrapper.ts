import AxiosBase, { AxiosInstance } from 'axios'

import { HttpClientConfig } from './client'

export type AuthProvider = { logout: () => void }
export type ApiConstructor<T> = new (axios: AxiosInstance, config: HttpClientConfig) => T

export function createService<T>(
  Api: ApiConstructor<T>,
  basePath: string,
  authProvider?: AuthProvider,
  config: HttpClientConfig = {},
): T {
  const { requestTimeout } = config

  const axios = AxiosBase.create({
    timeout: requestTimeout,
    baseURL: basePath,
  })

  axios.defaults.withCredentials = process.env.APP_ENV === 'production' || false

  axios.interceptors.response.use((response) => response, async (error) => {
    if (error.response && authProvider && error.response.status === 401) {
      authProvider.logout()
    }

    throw error
  })

  return new Api(axios, config)
}
