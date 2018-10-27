import { composeBundles, debugBundle, createUrlBundle } from 'redux-bundler'

import routes from './routes'
import extraArgs from './extra-args'

import nodesBundle from './nodes'
import linksBundle from './links'
import accountsBundle from './accounts'
import invitationsBundle from './invitations'
import myProfileBundle from './myProfile'
import notificationsBundle from './notifications'
import groupsBundle from './groups'
import workspacesBundle from './workspaces'

export default composeBundles(
  nodesBundle,
  linksBundle,
  accountsBundle,
  invitationsBundle,
  myProfileBundle,
  notificationsBundle,
  groupsBundle,
  workspacesBundle,
  createUrlBundle(),
  debugBundle,
  extraArgs,
  routes
)
