import React from 'react'
import { connect } from 'redux-bundler-react'
import { ActionCable } from 'react-actioncable-provider'
import { isEmpty } from 'lodash'

const ActionCables = ({
  doCreateNodeSuccess,
  doResolveNodeSuccess,
  doUnresolveNodeSuccess,
  doVoteForNodeSuccess
 }) => {
  const handleReceivedNodeData = response => {
    const { node } = response
    if (!isEmpty(node.target_links) || !isEmpty(node.source_links)) {
      doCreateNodeSuccess(response.node)
    }
    if (!isEmpty(node.options)) {
      doResolveNodeSuccess(response.node)
    }
    if (!isEmpty(node.votes)) {
      doVoteForNodeSuccess(response.node)
    }
  }
  return (
    <div>
      <ActionCable
        channel={{ channel: 'NodesChannel' }}
        onReceived={handleReceivedNodeData}
      />
    </div>
  )
}

export default connect(
  'doCreateNodeSuccess',
  'doResolveNodeSuccess',
  'doUnresolveNodeSuccess',
  'doVoteForNodeSuccess',
  ActionCables
)
