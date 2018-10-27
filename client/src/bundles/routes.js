import { createRouteBundle } from 'redux-bundler'

import Home from '../pages/home'
import SignIn from '../pages/signIn'
import Profile from '../pages/profile'
import AcceptInvitation from '../pages/acceptInvitation'
import CreateInvitation from '../pages/createInvitation'
import MyGroup from '../pages/myGroup'
import SignUp from '../pages/signUp'
import Workspaces from '../pages/workspaces'
import CreateWorkspace from '../pages/createWorkspace'

const routes = {
  '': {
    component: Home,
    protected: true
  },
  '/': {
    component: Home,
    protected: true
  },
  'sign-in': {
    component: SignIn,
    protected: false
  },
  'sign-up': {
    component: SignUp,
    protected: false
  },
  'my-profile': {
    component: Profile,
    protected: true
  },
  'accept-invitation': {
    component: AcceptInvitation,
    protected: true
  },
  'create-invitation': {
    component: CreateInvitation,
    protected: true
  },
  'my-group': {
    component: MyGroup,
    protected: true
  },
  'workspaces': {
    component: Workspaces,
    protected: true
  },
  'workspaces/new': {
    component: CreateWorkspace,
    protected: true
  },
  'workspaces/:workspaceId': {
    component: CreateWorkspace,
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
