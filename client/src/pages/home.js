import React from 'react'
import { connect } from 'redux-bundler-react'

import HomeComponent from '../components/home'

const Home = (props) => {
  const {
    doUpdateHash,
    nodesForRendering,
    linksForRendering,
    doSelectNode,
    currentNode,
    doUpdateNodeFormDataLabel,
    doUpdateNodeFormDataDescription,
    nodeFormData,
    doCreateNode
  } = props
  return (
    <HomeComponent
      doUpdateHash={doUpdateHash}
      nodes={nodesForRendering}
      links={linksForRendering}
      doSelectNode={doSelectNode}
      currentNode={currentNode}
      doUpdateNodeFormDataDescription={doUpdateNodeFormDataDescription}
      doUpdateNodeFormDataLabel={doUpdateNodeFormDataLabel}
      nodeFormData={nodeFormData}
      doCreateNode={doCreateNode}
    />
  )
}

export default connect(
  'doUpdateHash',
  'selectNodesForRendering',
  'selectLinksForRendering',
  'doSelectNode',
  'selectCurrentNode',
  'doUpdateNodeFormDataLabel',
  'doUpdateNodeFormDataDescription',
  'selectNodeFormData',
  'doCreateNode',
  Home
)
