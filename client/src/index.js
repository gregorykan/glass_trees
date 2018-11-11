import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'redux-bundler-react'
import { ThemeProvider } from 'react-fela'
import { isNil } from 'lodash'
import { isPast } from 'date-fns'
import { ActionCableProvider } from 'react-actioncable-provider'

import FelaProvider from './hocs/felaProvider'
import theme from './theme'
import getStore from './bundles'
import Landing from './pages/landing'
import { getObject } from './util/cache'

const credentials = getObject(['uid', 'expiry', 'tokenType', 'accessToken', 'client', 'currentUserId'])

const initialState = {
  accounts: {
    credentials,
    isSignedIn: !isNil(credentials.accessToken) && !isPast(credentials.expiry)
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const rootNode = document.getElementById('root')
  ReactDOM.render(
    <ActionCableProvider url={process.env.REACT_APP_API_WS_ROOT}>
      <Provider store={getStore(initialState)}>
        <ThemeProvider theme={theme}>
          <FelaProvider>
            <Landing />
          </FelaProvider>
        </ThemeProvider>
      </Provider>
    </ActionCableProvider>,
    rootNode
  )
})
