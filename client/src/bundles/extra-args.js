/* global fetch */
import { omit } from 'lodash'

export default {
  name: 'extra-args',
  getExtraArgs: (store) => {
    return {
      apiFetch: (urlPath, config = {}) => {
        const fetchResource = () => {
          const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            ...config.headers
          }
          const mergedConfig = {
            headers,
            ...omit(config, 'headers')
          }
          return fetch(`http://localhost:3000/${urlPath}`, mergedConfig)
        }
        return fetchResource()
      }

    }
  }
}
