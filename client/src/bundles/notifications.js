import cuid from 'cuid'
import { omit } from 'lodash'

const name = 'notifications'

const initialState = {
  notifications: {}
}

const reducer = (state = initialState, action) => {
  if (
    action.type === 'SIGN_IN_ERROR' ||
    action.type === 'UPDATE_PROFILE_ERROR' ||
    action.type === 'ACCEPT_INVITATION_ERROR' ||
    action.type === 'ACCEPT_INVITATION_SUCCESS' ||
    action.type === 'SIGN_UP_ERROR' ||
    action.type === 'ADD_NOTIFICATION' ||
    action.type === 'CREATE_INVITATION_SUCCESS'
  ) {
    const nextId = cuid()
    return {
      ...state,
      notifications: {
        ...state.notifications,
        [nextId]: {
          message: String(action.payload)
        }
      }
    }
  }
  if (action.type === 'SIGN_UP_SUCCESS') {
    const nextId = cuid()
    return {
      ...state,
      notifications: {
        ...state.notifications,
        [nextId]: {
          message: 'Sign up successful! Welcome aboard.'
        }
      }
    }
  }
  if (action.type === 'REMOVE_ERROR_NOTIFICATION') {
    return {
      ...state,
      notifications: omit(state.notifications, action.payload)
    }
  }

  return state
}

const selectors = {
  selectNotifications: (state) => state.notifications.notifications
}

const actionCreators = {
  doRemoveErrorNotification: (id) => ({ dispatch }) => {
    dispatch({ type: 'REMOVE_ERROR_NOTIFICATION', payload: id })
  },
  doAddNotification: (message) => ({ dispatch }) => {
    dispatch({ type: 'ADD_NOTIFICATION', payload: message })
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
