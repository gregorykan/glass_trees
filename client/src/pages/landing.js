import React from 'react'
import { connect } from 'redux-bundler-react'
import { Button } from '@material-ui/core'

import NotificationCard from '../components/notificationCard'
import SignIn from './signIn'

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center'
}

const navStyle = {
  flexDirection: 'row'
}

const Landing = (props) => {
  const { isSignedIn, doSignOut, notifications, doRemoveErrorNotification, route, routeInfo, doUpdateHash } = props
  const isAcceptingInvitation = routeInfo.pattern === 'accept-invitation'
  const isSigningUp = routeInfo.pattern === 'sign-up'
  const Page = route.component
  if (isAcceptingInvitation || isSigningUp) {
    return (
      <div style={containerStyle}>
        <NotificationCard notifications={notifications} doRemoveErrorNotification={doRemoveErrorNotification} />
        <Page {...props} />
      </div>
    )
  } else {
    return (
      <div style={containerStyle}>
        <NotificationCard notifications={notifications} doRemoveErrorNotification={doRemoveErrorNotification} />
        {
          isSignedIn
          ? <div style={containerStyle}>
              <div style={navStyle}>
                <Button onClick={() => { doUpdateHash('#') }}>Home</Button>
                <Button onClick={() => { doUpdateHash('my-profile') }}>My Profile</Button>
                <Button onClick={() => { doUpdateHash('my-group') }}>My Group</Button>
                <Button onClick={() => { doSignOut() }}>Sign Out</Button>
              </div>
              <Page {...props} />
            </div>
          : <SignIn doUpdateHash={doUpdateHash} />
        }
      </div>
    )
  }
}

export default connect(
  'selectIsSignedIn',
  'doSignOut',
  'selectNotifications',
  'doRemoveErrorNotification',
  'selectRoute',
  'selectRouteInfo',
  'selectPathname',
  'doUpdateHash',
  Landing
)
