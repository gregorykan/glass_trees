import { createAsyncResourceBundle, createSelector } from 'redux-bundler'
import cuid from 'cuid'
import { omit, concat, isNil, find, filter, isEmpty } from 'lodash'
import ms from 'milliseconds'

const bundle = createAsyncResourceBundle({
  name: 'workspaces',
  getPromise: async ({ apiFetch, getState }) => {
    const credentials = getState().accounts.credentials
    const sanitizedCredentials = {
      'access-token': credentials.accessToken,
      'token-type': credentials.tokenType,
      client: credentials.client,
      uid: credentials.uid,
      expiry: credentials.expiry
    }
    return apiFetch(`api/workspaces`, {
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
  nameField: '',
  isCreatingWorkspace: false,
  isUpdatingWorkspace: false,
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
  if (action.type === 'UPDATE_WORKSPACE_NAME_FIELD') {
    return {
      ...state,
      nameField: action.payload
    }
  }
  if (action.type === 'CREATE_WORKSPACE_START') {
    return {
      ...state,
      isCreatingWorkspace: true
    }
  }
  if (action.type === 'CREATE_WORKSPACE_SUCCESS') {
    const newWorkspace = action.payload.workspace
    return {
      ...state,
      isCreatingWorkspace: false,
      data: concat(filter(state.data, (workspace) => { return workspace.id !== newWorkspace.id }), newWorkspace),
      nameField: ''
    }
  }
  if (action.type === 'CREATE_WORKSPACE_ERROR') {
    return {
      ...state,
      isCreatingWorkspace: false
    }
  }
  if (action.type === 'UPDATE_WORKSPACE_START') {
    return {
      ...state,
      isUpdatingWorkspace: true
    }
  }
  if (action.type === 'UPDATE_WORKSPACE_SUCCESS') {
    return {
      ...state,
      isUpdatingWorkspace: false,
      data: concat(filter(state.data, (workspace) => { return workspace.id !== action.payload.id }), action.payload)
    }
  }
  if (action.type === 'UPDATE_WORKSPACE_ERROR') {
    return {
      ...state,
      isUpdatingWorkspace: false
    }
  }

  if (action.type === 'SIGN_OUT_SUCCESS') {
    return initialState
  }

  return baseReducer(state, action)
}

bundle.selectWorkspaces = state => state.workspaces.data
bundle.selectWorkspaceNameField = state => state.workspaces.nameField
bundle.selectThisWorkspaceId = createSelector(
  'selectHash',
  (urlHash) => {
    const urlHashArray = urlHash.split('/')
    const path = urlHashArray[0]
    if (path !== 'workspaces') return null
    const orderId = urlHashArray[1]
    return Number(orderId)
  }
)
bundle.selectThisWorkspace = createSelector(
  'selectThisWorkspaceId',
  'selectWorkspaces',
  (workspaceId, workspaces) => {
    if (isNil(workspaceId) || isNil(workspaces)) return null
    const workspace = find(workspaces, { 'id': workspaceId })
    return workspace
  }
)

bundle.doUpdateWorkspaceNameField = (name) => ({ dispatch }) => {
  dispatch({ type: 'UPDATE_WORKSPACE_NAME_FIELD', payload: name })
}

bundle.doCreateWorkspace = (formData) => ({ dispatch, apiFetch, getState }) => {
  const credentials = getState().accounts.credentials
  const sanitizedCredentials = {
    'access-token': credentials.accessToken,
    'token-type': credentials.tokenType,
    client: credentials.client,
    uid: credentials.uid,
    expiry: credentials.expiry
  }
  dispatch({ type: 'CREATE_WORKSPACE_START' })
  apiFetch('api/workspaces', {
    method: 'POST',
    body: JSON.stringify(formData),
    headers: sanitizedCredentials
  })
    .then(response => {
      if (!response.ok) {
        return Promise.reject(new Error(`${response.status} ${response.statusText}`))
      }
      return response.json()
    })
    .then((data) => {
      dispatch({ type: 'CREATE_WORKSPACE_SUCCESS', payload: data })
      dispatch({ actionCreator: 'doUpdateHash', args: ['workspaces'] })
    })
    .catch((error) => {
      dispatch({ type: 'CREATE_WORKSPACE_ERROR', payload: error })
    })
}

bundle.doUpdateWorkspace = (formData) => ({ dispatch, apiFetch, getState }) => {
  const credentials = getState().accounts.credentials
  const sanitizedCredentials = {
    'access-token': credentials.accessToken,
    'token-type': credentials.tokenType,
    client: credentials.client,
    uid: credentials.uid,
    expiry: credentials.expiry
  }
  dispatch({ type: 'UPDATE_WORKSPACE_START' })
  apiFetch(`api/workspaces/${formData.id}`, {
    method: 'PATCH',
    body: JSON.stringify(omit(formData, ['id'])),
    headers: sanitizedCredentials
  })
    .then(response => {
      if (!response.ok) {
        return Promise.reject(new Error(`${response.status} ${response.statusText}`))
      }
      return response.json()
    })
    .then((data) => {
      dispatch({ type: 'UPDATE_WORKSPACE_SUCCESS', payload: data })
    })
    .catch((error) => {
      dispatch({ type: 'UPDATE_WORKSPACE_ERROR', payload: error })
    })
}

bundle.reactWorkspacesFetch = createSelector(
  'selectWorkspacesShouldUpdate',
  'selectIsSignedIn',
  (shouldUpdate, isSignedIn) => {
    if (shouldUpdate && isSignedIn) {
      return { actionCreator: 'doFetchWorkspaces' }
    }
    return false
  }
)

export default bundle
