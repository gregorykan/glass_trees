import { createAsyncResourceBundle, createSelector } from 'redux-bundler'
import cuid from 'cuid'
import { omit, isNil } from 'lodash'
import ms from 'milliseconds'

const bundle = createAsyncResourceBundle({
  name: 'myProfile',
  getPromise: async ({ apiFetch, getState }) => {
    const credentials = getState().accounts.credentials
    const currentUserId = credentials.currentUserId
    const sanitizedCredentials = {
      'access-token': credentials.accessToken,
      'token-type': credentials.tokenType,
      client: credentials.client,
      uid: credentials.uid,
      expiry: credentials.expiry
    }
    return apiFetch(`api/users/${currentUserId}`, {
      headers: sanitizedCredentials
    })
      .then(response => {
        if (!response.ok) {
          return Promise.reject(new Error(`${response.status} ${response.statusText}`))
        }
        return response.json()
      })
  },
  staleAfter: ms.minutes(5),
  retryAfter: ms.minutes(2)
})

const initialState = {
  phoneField: '',
  shippingAddressField: '',
  nameField: '',
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
  if (action.type === 'SIGN_IN_SUCCESS' || action.type === 'SIGN_UP_SUCCESS') {
    return {
      ...state,
      data: action.payload.user,
      phoneField: action.payload.user.phone,
      nameField: action.payload.user.name,
      shippingAddressField: action.payload.user.shipping_address
    }
  }
  if (action.type === 'MYPROFILE_FETCH_FINISHED') {
    return {
      ...state,
      data: action.payload,
      phoneField: action.payload.phone,
      nameField: action.payload.name,
      shippingAddressField: action.payload.shipping_address
    }
  }
  if (action.type === 'SIGN_OUT_SUCCESS') {
    return {
      ...state,
      data: {},
      phoneField: null,
      nameField: null,
      shippingAddressField: null
    }
  }
  if (action.type === 'UPDATE_MY_PROFILE_SUCCESS') {
    return {
      ...state,
      data: action.payload,
      phoneField: action.payload.phone,
      nameField: action.payload.name,
      shippingAddressField: action.payload.shipping_address
    }
  }
  if (action.type === 'UPDATE_PHONE_FIELD') {
    return {
      ...state,
      phoneField: action.payload
    }
  }
  if (action.type === 'UPDATE_SHIPPING_ADDRESS_FIELD') {
    return {
      ...state,
      shippingAddressField: action.payload
    }
  }
  if (action.type === 'UPDATE_NAME_FIELD') {
    return {
      ...state,
      nameField: action.payload
    }
  }
  if (action.type === 'CREATE_GROUP_SUCCESS') {
    return {
      ...state,
      data: {
        ...state.data,
        group_id: action.payload.id
      }
    }
  }
  return baseReducer(state, action)
}

bundle.selectCurrentUser = state => state.myProfile.data
bundle.selectHasCurrentUser = createSelector(
  'selectCurrentUser',
  (currentUser) => {
    return !isNil(currentUser)
  }
)
bundle.selectCurrentUserHasGroup = createSelector(
  'selectCurrentUser',
  (currentUser) => {
    if (isNil(currentUser)) return false
    return !isNil(currentUser.group_id)
  }
)
bundle.selectNameField = state => state.myProfile.nameField
bundle.selectPhoneField = state => state.myProfile.phoneField
bundle.selectShippingAddressField = state => state.myProfile.shippingAddressField

bundle.doUpdateNameField = (name) => ({ dispatch }) => {
  dispatch({ type: 'UPDATE_NAME_FIELD', payload: name })
}
bundle.doUpdatePhoneField = (phone) => ({ dispatch }) => {
  dispatch({ type: 'UPDATE_PHONE_FIELD', payload: phone })
}
bundle.doUpdateShippingAddressField = (shippingAddress) => ({ dispatch }) => {
  dispatch({ type: 'UPDATE_SHIPPING_ADDRESS_FIELD', payload: shippingAddress })
}

bundle.doUpdateMyProfile = (profileData) => ({ dispatch, apiFetch, getState }) => {
  const credentials = getState().accounts.credentials
  const sanitizedCredentials = {
    'access-token': credentials.accessToken,
    'token-type': credentials.tokenType,
    client: credentials.client,
    uid: credentials.uid,
    expiry: credentials.expiry
  }
  dispatch({ type: 'UPDATE_MY_PROFILE_START' })
  apiFetch(`api/users/${credentials.currentUserId}`, {
    method: 'PATCH',
    body: JSON.stringify(profileData),
    headers: sanitizedCredentials
  })
    .then(response => {
      if (!response.ok) {
        return Promise.reject(new Error(`${response.status} ${response.statusText}`))
      }
      return response.json()
    })
    .then((data) => {
      dispatch({ type: 'UPDATE_MY_PROFILE_SUCCESS', payload: data })
    })
    .catch((error) => {
      dispatch({ type: 'UPDATE_MY_PROFILE_ERROR', payload: error })
    })
}

bundle.reactMyProfileFetch = createSelector(
  'selectMyProfileShouldUpdate',
  'selectIsSignedIn',
  (shouldUpdate, isSignedIn) => {
    if (shouldUpdate && isSignedIn) {
      return { actionCreator: 'doFetchMyProfile' }
    }
    return false
  }
)

export default bundle
