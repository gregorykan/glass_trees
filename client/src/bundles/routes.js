import { createRouteBundle } from 'redux-bundler'

import Home from '../pages/home'

const routes = {
  '': {
    component: Home,
    protected: true
  },
  '/': {
    component: Home,
    protected: true
  },
  '*': {
    component: Home,
    protected: false
  }

}

export default createRouteBundle({
  ...routes
}, {
  routeInfoSelector: 'selectHash'
})
