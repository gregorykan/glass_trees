import React from 'react'
import { connect } from 'redux-bundler-react'

import HomeComponent from '../components/home'

const Home = (props) => {
  const {
    doUpdateHash,
    nodesForRendering,
    linksForRendering,
    doSelectNode,
    currentNode
  } = props
  return (
    <HomeComponent
      doUpdateHash={doUpdateHash}
      nodes={nodesForRendering}
      links={linksForRendering}
      doSelectNode={doSelectNode}
      currentNode={currentNode}
    />
  )
}

export default connect(
  'doUpdateHash',
  'selectNodesForRendering',
  'selectLinksForRendering',
  'doSelectNode',
  'selectCurrentNode',
  Home
)
