import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'redux-bundler-react'
import { ThemeProvider } from 'react-fela'

import FelaProvider from './hocs/felaProvider'
import theme from './theme'
import getStore from './bundles'
import Landing from './pages/landing'

document.addEventListener('DOMContentLoaded', () => {
  const rootNode = document.getElementById('root')
  ReactDOM.render(
    <Provider store={getStore()}>
      <ThemeProvider theme={theme}>
        <FelaProvider>
          <Landing />
        </FelaProvider>
      </ThemeProvider>
    </Provider>,
    rootNode
  )
})
