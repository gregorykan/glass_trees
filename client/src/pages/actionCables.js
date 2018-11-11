import React from 'react'
import { connect } from 'redux-bundler-react'
import { ActionCable } from 'react-actioncable-provider'

const ActionCables = ({
  doCreateNodeSuccess
 }) => {
  const handleReceivedNodeData = response => {
    doCreateNodeSuccess(response.node)
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
  ActionCables
)
