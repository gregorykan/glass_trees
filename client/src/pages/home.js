import React from 'react'
import { connect } from 'redux-bundler-react'

import HomeComponent from '../components/home'

const Home = (props) => {
  const {
    doUpdateHash
  } = props
  return (
    <HomeComponent
      doUpdateHash={doUpdateHash}
    />
  )
}

export default connect(
  'doUpdateHash',
  Home
)
