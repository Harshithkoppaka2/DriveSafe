import axios from 'axios'

export const authApi = axios.create({ baseURL: import.meta.env.VITE_AUTH_API || 'http://localhost:8081' })
export const vehicleApi = axios.create({ baseURL: import.meta.env.VITE_VEHICLE_API || 'http://localhost:8082' })
export const rentalApi = axios.create({ baseURL: import.meta.env.VITE_RENTAL_API || 'http://localhost:8083' })

export function attachToken(token) {
  const value = token ? `Bearer ${token}` : undefined
  for (const client of [authApi, vehicleApi, rentalApi]) {
    if (value) client.defaults.headers.common.Authorization = value
    else delete client.defaults.headers.common.Authorization
  }
}

export function errorMessage(error) {
  return error?.response?.data?.message || 'Something went wrong. Please try again.'
}
