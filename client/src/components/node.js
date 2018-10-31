import React from 'react'
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
    node
  } = props

  const isQuestion = node.nodeType === 'question'
  const isResolved = node.resolved
  // const iconStyleWithResolved = {
  //   ...iconStyle,
  //   color: isResolved ? 'grey' : 'green'
  // }
  const iconStyle = {
    fontSize: 60,
    color: isResolved ? 'gray' : 'green'
  }

  const optionIconStyle = {
    fontSize: 40,
    color: isResolved ? 'gray' : 'orange'
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
