import React from 'react'
import { connect } from 'redux-bundler-react'
import ContactSupportIcon from '@material-ui/icons/ContactSupport'
import RoomIcon from '@material-ui/icons/Room'

// https://material-ui.com/style/icons/
// https://material.io/tools/icons

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center'
}

const headerStyle = {
  textAlign: 'center'
}

const Node = (props) => {
  const {
    doUpdateHash,
    node,
  } = props

  const isQuestion = node.nodeType === 'question'
  const isResolved = node.resolved

  const iconStyle = {
    fontSize: 60,
    color: node.isHighlighted ? 'orange' : isResolved ? 'gray' : 'green'
  }

  const optionIconStyle = {
    fontSize: 50,
    color: node.isHighlighted ? 'orange' : isResolved ? 'gray' : 'purple'
  }

  return (
    <div style={containerStyle}>
      {
        isQuestion
        ? <ContactSupportIcon style={iconStyle} />
        : <RoomIcon style={optionIconStyle} />
      }
    </div>
  )
}

export default Node
