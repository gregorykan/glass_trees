import { createAsyncResourceBundle, createSelector } from 'redux-bundler'
import cuid from 'cuid'
import { omit, concat, isNil, find, filter, isEmpty } from 'lodash'
import ms from 'milliseconds'

const bundle = createAsyncResourceBundle({
  name: 'groups',
  getPromise: async ({ apiFetch, getState }) => {
    const credentials = getState().accounts.credentials
    const sanitizedCredentials = {
      'access-token': credentials.accessToken,
      'token-type': credentials.tokenType,
      client: credentials.client,
      uid: credentials.uid,
      expiry: credentials.expiry
    }
    return apiFetch(`api/groups`, {
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
  isCreatingGroup: false,
  isUpdatingGroup: false,
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
  if (action.type === 'UPDATE_GROUP_NAME_FIELD') {
    return {
      ...state,
      nameField: action.payload
    }
  }
  if (action.type === 'CREATE_GROUP_START') {
    return {
      ...state,
      isCreatingGroup: true
    }
  }
  if (action.type === 'CREATE_GROUP_SUCCESS') {
    return {
      ...state,
      isCreatingGroup: false,
      data: action.payload,
      nameField: ''
    }
  }
  if (action.type === 'CREATE_GROUP_ERROR') {
    return {
      ...state,
      isCreatingGroup: false
    }
  }
  if (action.type === 'UPDATE_GROUP_START') {
    return {
      ...state,
      isUpdatingGroup: true
    }
  }
  if (action.type === 'UPDATE_GROUP_SUCCESS') {
    return {
      ...state,
      isUpdatingGroup: false,
      data: action.payload
    }
  }
  if (action.type === 'UPDATE_GROUP_ERROR') {
    return {
      ...state,
      isUpdatingGroup: false
    }
  }

  if (action.type === 'SIGN_OUT_SUCCESS') {
    return initialState
  }

  return baseReducer(state, action)
}

bundle.selectGroup = state => state.groups.data
bundle.selectGroupNameField = state => state.groups.nameField

bundle.doUpdateGroupNameField = (name) => ({ dispatch }) => {
  dispatch({ type: 'UPDATE_GROUP_NAME_FIELD', payload: name })
}

bundle.doCreateGroup = (formData) => ({ dispatch, apiFetch, getState }) => {
  const credentials = getState().accounts.credentials
  const sanitizedCredentials = {
    'access-token': credentials.accessToken,
    'token-type': credentials.tokenType,
    client: credentials.client,
    uid: credentials.uid,
    expiry: credentials.expiry
  }
  dispatch({ type: 'CREATE_GROUP_START' })
  apiFetch('api/groups', {
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
      dispatch({ type: 'CREATE_GROUP_SUCCESS', payload: data })
      dispatch({ actionCreator: 'doUpdateHash', args: ['my-group'] })
    })
    .catch((error) => {
      dispatch({ type: 'CREATE_GROUP_ERROR', payload: error })
    })
}

bundle.doUpdateGroup = (formData) => ({ dispatch, apiFetch, getState }) => {
  const credentials = getState().accounts.credentials
  const sanitizedCredentials = {
    'access-token': credentials.accessToken,
    'token-type': credentials.tokenType,
    client: credentials.client,
    uid: credentials.uid,
    expiry: credentials.expiry
  }
  dispatch({ type: 'UPDATE_GROUP_START' })
  apiFetch(`api/groups/${formData.id}`, {
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
      dispatch({ type: 'UPDATE_GROUP_SUCCESS', payload: data })
      dispatch({ actionCreator: 'doUpdateHash', args: ['my-group'] })
    })
    .catch((error) => {
      dispatch({ type: 'UPDATE_GROUP_ERROR', payload: error })
    })
}

bundle.reactGroupsFetch = createSelector(
  'selectGroupsShouldUpdate',
  'selectIsSignedIn',
  'selectCurrentUserHasGroup',
  (shouldUpdate, isSignedIn, currentUserHasGroup) => {
    if (shouldUpdate && isSignedIn && currentUserHasGroup) {
      return { actionCreator: 'doFetchGroups' }
    }
    return false
  }
)

export default bundle
