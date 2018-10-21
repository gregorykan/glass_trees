import React from 'react'
import { connect } from 'redux-bundler-react'

import HomeComponent from '../components/home'

const Home = (props) => {
  const {
    doUpdateHash,
    nodesForRendering,
    linksForRendering
  } = props
  return (
    <HomeComponent
      doUpdateHash={doUpdateHash}
      nodes={nodesForRendering}
      links={linksForRendering}
    />
  )
}

export default connect(
  'doUpdateHash',
  'selectNodesForRendering',
  'selectLinksForRendering',
  Home
)
