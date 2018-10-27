import { setObject, removeObject } from '../util/cache'

const name = 'accounts'

const initialState = {
  isSignedIn: false,
  isSigningIn: false,
  isSigningOut: false,
  isSigningUp: false,
  signUpEmailField: '',
  signUpPasswordField: '',
  signUpPasswordConfirmationField: '',
  signInEmailField: '',
  signInPasswordField: '',
  credentials: {}
}

const reducer = (state = initialState, action) => {
  if (action.type === 'UPDATE_SIGN_IN_EMAIL_FIELD') {
    return {
      ...state,
      signInEmailField: action.payload
    }
  }
  if (action.type === 'UPDATE_SIGN_IN_PASSWORD_FIELD') {
    return {
      ...state,
      signInPasswordField: action.payload
    }
  }
  if (action.type === 'UPDATE_SIGN_UP_EMAIL_FIELD') {
    return {
      ...state,
      signUpEmailField: action.payload
    }
  }
  if (action.type === 'UPDATE_SIGN_UP_PASSWORD_FIELD') {
    return {
      ...state,
      signUpPasswordField: action.payload
    }
  }
  if (action.type === 'UPDATE_SIGN_UP_PASSWORD_CONFIRMATION_FIELD') {
    return {
      ...state,
      signUpPasswordConfirmationField: action.payload
    }
  }
  if (action.type === 'SIGN_IN_START') {
    return {
      ...state,
      isSigningIn: true
    }
  }
  if (action.type === 'SIGN_IN_SUCCESS') {
    return {
      ...state,
      isSigningIn: false,
      isSignedIn: true,
      credentials: action.payload.credentials,
      signInEmailField: '',
      signInPasswordField: ''
    }
  }
  if (action.type === 'SIGN_IN_ERROR') {
    return {
      ...state,
      isSigningIn: false
    }
  }
  if (action.type === 'SIGN_UP_START') {
    return {
      ...state,
      isSigningUp: true
    }
  }
  if (action.type === 'SIGN_UP_SUCCESS') {
    return {
      ...state,
      isSigningUp: false,
      isSignedIn: true,
      credentials: action.payload.credentials,
      signUpEmailField: '',
      signUpPasswordField: '',
      signUpPasswordConfirmationField: ''
    }
  }
  if (action.type === 'SIGN_UP_ERROR') {
    return {
      ...state,
      isSigningUp: false
    }
  }
  if (action.type === 'SIGN_OUT_START') {
    return {
      ...state,
      isSigningOut: true
    }
  }
  if (action.type === 'SIGN_OUT_SUCCESS') {
    removeObject(['uid', 'expiry', 'tokenType', 'accessToken', 'client', 'currentUserId'])
    return {
      ...state,
      isSigningOut: false,
      isSignedIn: false,
      credentials: {}
    }
  }
  if (action.type === 'SIGN_OUT_ERROR') {
    return {
      ...state,
      isSigningOut: false
    }
  }

  return state
}

const selectors = {
  selectCredentials: (state) => state.accounts.credentials,
  selectIsSignedIn: (state) => state.accounts.isSignedIn,
  selectSignInEmailField: (state) => state.accounts.signInEmailField,
  selectSignInPasswordField: (state) => state.accounts.signInPasswordField,
  selectSignUpEmailField: (state) => state.accounts.signUpEmailField,
  selectSignUpPasswordField: (state) => state.accounts.signUpPasswordField,
  selectSignUpPasswordConfirmationField: (state) => state.accounts.signUpPasswordConfirmationField
}

const actionCreators = {
  doUpdateSignInEmailField: (email) => ({ dispatch }) => {
    dispatch({ type: 'UPDATE_SIGN_IN_EMAIL_FIELD', payload: email })
  },
  doUpdateSignInPasswordField: (password) => ({ dispatch }) => {
    dispatch({ type: 'UPDATE_SIGN_IN_PASSWORD_FIELD', payload: password })
  },
  doUpdateSignUpEmailField: (email) => ({ dispatch }) => {
    dispatch({ type: 'UPDATE_SIGN_UP_EMAIL_FIELD', payload: email })
  },
  doUpdateSignUpPasswordField: (password) => ({ dispatch }) => {
    dispatch({ type: 'UPDATE_SIGN_UP_PASSWORD_FIELD', payload: password })
  },
  doUpdateSignUpPasswordConfirmationField: (passwordConfirmation) => ({ dispatch }) => {
    dispatch({ type: 'UPDATE_SIGN_UP_PASSWORD_CONFIRMATION_FIELD', payload: passwordConfirmation })
  },
  doSignIn: (signInData) => ({ dispatch, apiFetch }) => {
    dispatch({ type: 'SIGN_IN_START' })
    apiFetch('api/v1/auth/sign_in', {
      method: 'POST',
      body: JSON.stringify(signInData)
    })
      .then(response => {
        if (!response.ok) {
          return Promise.reject(new Error(`${response.status} ${response.statusText}`))
        }
        const credentials = {
          accessToken: response.headers.get('access-token'),
          client: response.headers.get('client'),
          expiry: response.headers.get('expiry'),
          tokenType: response.headers.get('token-type'),
          uid: response.headers.get('uid')
        }
        return response.json()
          .then((user) => {
            const credentialsWithCurrentUserId = {
              ...credentials,
              currentUserId: user.data.id
            }
            setObject(credentialsWithCurrentUserId)
            dispatch({ type: 'SIGN_IN_SUCCESS', payload: { user: user.data, credentials: credentialsWithCurrentUserId } })
          })
      })
      .catch((error) => {
        dispatch({ type: 'SIGN_IN_ERROR', payload: error })
      })
  },
  doSignUp: (signUpData) => ({ dispatch, apiFetch }) => {
    dispatch({ type: 'SIGN_UP_START' })
    apiFetch('api/v1/auth', {
      method: 'POST',
      body: JSON.stringify(signUpData)
    })
      .then(response => {
        if (!response.ok) {
          return Promise.reject(new Error(`${response.status} ${response.statusText}`))
        }
        const credentials = {
          accessToken: response.headers.get('access-token'),
          client: response.headers.get('client'),
          expiry: response.headers.get('expiry'),
          tokenType: response.headers.get('token-type'),
          uid: response.headers.get('uid')
        }
        return response.json()
          .then((user) => {
            const credentialsWithCurrentUserId = {
              ...credentials,
              currentUserId: user.data.id
            }
            setObject(credentialsWithCurrentUserId)
            dispatch({ type: 'SIGN_UP_SUCCESS', payload: { user: user.data, credentials: credentialsWithCurrentUserId } })
            dispatch({ actionCreator: 'doUpdateHash', args: ['#'] })
          })
      })
      .catch((error) => {
        dispatch({ type: 'SIGN_UP_ERROR', payload: error })
      })
  },
  doSignOut: () => ({ dispatch, apiFetch, getState }) => {
    const credentials = getState().accounts.credentials
    const sanitizedCredentials = {
      'access-token': credentials.accessToken,
      'token-type': credentials.tokenType,
      client: credentials.client,
      uid: credentials.uid,
      expiry: credentials.expiry
    }
    dispatch({ type: 'SIGN_OUT_START' })
    apiFetch('api/v1/auth/sign_out', {
      method: 'DELETE',
      headers: sanitizedCredentials
    })
      .then(response => {
        if (!response.ok) {
          return Promise.reject(new Error(`${response.status} ${response.statusText}`))
        }
        dispatch({ type: 'SIGN_OUT_SUCCESS' })
      })
      .catch((error) => {
        dispatch({ type: 'SIGN_OUT_ERROR', payload: error })
      })
  }
}

const reactors = {}

const persistActions = []

export default {
  name,
  reducer,
  ...selectors,
  ...actionCreators,
  ...reactors,
  persistActions
}
