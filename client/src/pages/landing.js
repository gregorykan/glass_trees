import React from 'react'
import { connect } from 'redux-bundler-react'
import { Button } from '@material-ui/core'

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
  const { route, routeInfo, doUpdateHash } = props
  const Page = route.component
  return (
    <div style={containerStyle}>
      <Page {...props} />
    </div>
  )
}

export default connect(
  'selectRoute',
  'selectRouteInfo',
  'selectPathname',
  'doUpdateHash',
  Landing
)
