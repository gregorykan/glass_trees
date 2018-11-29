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
  updatedLinkIds: [],
  removedLinkIds: [],
  newLinkIds: [],
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
    const newLinks = concat(state.data, concat(action.payload.source_links, action.payload.target_links))
    return {
      ...state,
      data: newLinks,
      newLinkIds: concat(state.newLinkIds, map(newLinks, 'id'))
    }
  }
  if (action.type === 'CLEAR_NEW_LINK_IDS') {
    return {
      ...state,
      newLinkIds: []
    }
  }
  if (action.type === 'SIGN_OUT_SUCCESS') {
    return initialState
  }
  return baseReducer(state, action)
}

bundle.selectLinks = (state) => state.links.data
bundle.selectNewLinkIds = (state) => state.links.newLinkIds
bundle.selectLinksForRendering = createSelector(
  'selectLinks',
  'selectThisWorkspaceId',
  (rawLinks, workspaceId) => {
    if (isNil(rawLinks)) return []
    const linksToRender = filter(rawLinks, (rawLink) => { return rawLink.workspace_id === workspaceId })
    return map(linksToRender, (rawLink) => {
      return {
        id: rawLink.id,
        source: rawLink.source_id,
        target: rawLink.target_id
      }
    })
  }
)
bundle.selectLinksByCurrentNodeId = createSelector(
  'selectCurrentNodeId',
  'selectLinks',
  (currentNodeId, links) => {
    if (isNil(currentNodeId)) return links
    return filter(links, (link) => {
      return link.source_id === currentNodeId
    })
  }
)

bundle.selectAllLinksByCurrentNodeId = createSelector(
  'selectCurrentNodeId',
  'selectLinks',
  (currentNodeId, links) => {
    if (isNil(currentNodeId)) return links
    return filter(links, (link) => {
      return link.source_id === currentNodeId || link.target_id === currentNodeId
    })
  }
)

bundle.selectLinkIdsToHighlight = createSelector(
  'selectLinksByCurrentNodeId',
  (links) => {
    return map(links, l => l.id)
  }
)

bundle.selectNodeIdsToHighlight = createSelector(
  'selectLinksByCurrentNodeId',
  'selectCurrentNodeId',
  (links, currentNodeId) => {
    if (isNil(currentNodeId)) return null
    return concat(map(links, l => l.target_id), [currentNodeId])
  }
)

bundle.doClearNewLinkIds = () => ({ dispatch }) => {
  dispatch({ type: 'CLEAR_NEW_LINK_IDS' })
}

bundle.reactLinksFetch = createSelector(
  'selectLinksShouldUpdate',
  'selectIsSignedIn',
  (shouldUpdate, isSignedIn) => {
    if (shouldUpdate && isSignedIn) {
      return { actionCreator: 'doFetchLinks' }
    }
    return false
  }
)

export default bundle
