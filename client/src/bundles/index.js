import { composeBundles, debugBundle, createUrlBundle } from 'redux-bundler'

import routes from './routes'
import extraArgs from './extra-args'

import nodesBundle from './nodes'
import linksBundle from './links'

export default composeBundles(
  nodesBundle,
  linksBundle,
  createUrlBundle(),
  debugBundle,
  extraArgs,
  routes
)
