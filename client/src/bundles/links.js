import { createAsyncResourceBundle, createSelector } from 'redux-bundler'
import cuid from 'cuid'
import { omit, concat, isNil, find, filter, map } from 'lodash'
import ms from 'milliseconds'

const bundle = createAsyncResourceBundle({
  name: 'links',
  getPromise: async ({ apiFetch, getState }) => {
    const credentials = getState().accounts.credentials
    const sanitizedCredentials = {
      'access-token': credentials.accessToken,
      'token-type': credentials.tokenType,
      client: credentials.client,
      uid: credentials.uid,
      expiry: credentials.expiry
    }
    return apiFetch(`api/links`, {
      headers: sanitizedCredentials
    })
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
  if (action.type === 'CREATE_NODE_SUCCESS') {
    return {
      ...state,
      data: concat(state.data, concat(action.payload.source_links, action.payload.target_links))
    }
  }
  return baseReducer(state, action)
}

bundle.selectLinks = (state) => state.links.data
bundle.selectLinksForRendering = createSelector(
  'selectLinks',
  (rawLinks) => {
    if (isNil(rawLinks)) return []
    return map(rawLinks, (rawLink) => {
      return {
        source: rawLink.source_id,
        target: rawLink.target_id
      }
    })
  }
)

bundle.reactLinksFetch = createSelector(
  'selectLinksShouldUpdate',
  (shouldUpdate) => {
    if (shouldUpdate) {
      return { actionCreator: 'doFetchLinks' }
    }
    return false
  }
)

export default bundle
