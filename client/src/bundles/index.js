import { composeBundles, debugBundle, createUrlBundle } from 'redux-bundler'

import routes from './routes'

import extraArgs from './extra-args'

export default composeBundles(
  createUrlBundle(),
  debugBundle,
  extraArgs,
  routes
)
