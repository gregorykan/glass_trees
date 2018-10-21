import { createAsyncResourceBundle, createSelector } from 'redux-bundler'
import cuid from 'cuid'
import { omit, concat, isNil, find, filter, map } from 'lodash'
import ms from 'milliseconds'

const bundle = createAsyncResourceBundle({
  name: 'nodes',
  getPromise: async ({ apiFetch, getState }) => {
    return apiFetch(`api/v1/nodes`, {})
      .then(response => response.json())
      .catch(err => {
        console.log('err', err)
        throw new Error({ permanent: true })
      })
  },
  staleAfter: ms.minutes(5),
  retryAfter: ms.minutes(2)
})

const initialState = {
  // needed by createAsyncResourceBundle
  data: null,
  errorTimes: [],
  errorType: null,
  failedPermanently: false,
  isExpired: false,
  isLoading: false,
  isOutdated: false,
  lastSuccess: null
}

const baseReducer = bundle.reducer
bundle.reducer = (state = initialState, action) => {
  return baseReducer(state, action)
}

bundle.selectNodes = (state) => state.nodes.data
bundle.selectNodesForRendering = createSelector(
  'selectNodes',
  (rawNodes) => {
    if (isNil(rawNodes)) return []
    return map(rawNodes, (rawNode) => {
      return {
        id: rawNode.id,
        label: `(${rawNode.id}) ${rawNode.label}`,
        symbolType: rawNode.node_type === 'question' ? 'diamond' : 'circle',
        color: rawNode.node_type === 'question' ? 'red' : 'lightgreen'
      }
    })
  }
)

bundle.reactNodesFetch = createSelector(
  'selectNodesShouldUpdate',
  (shouldUpdate) => {
    if (shouldUpdate) {
      return { actionCreator: 'doFetchNodes' }
    }
    return false
  }
)

export default bundle
