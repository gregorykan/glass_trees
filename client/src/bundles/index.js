import { composeBundles, debugBundle, createUrlBundle } from 'redux-bundler'

import routes from './routes'
import extraArgs from './extra-args'

import nodesBundle from './nodes'

export default composeBundles(
  nodesBundle,
  createUrlBundle(),
  debugBundle,
  extraArgs,
  routes
)
