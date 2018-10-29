import React from 'react'
import ContactSupportIcon from '@material-ui/icons/ContactSupport'
import RoomIcon from '@material-ui/icons/Room'

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center'
}

const headerStyle = {
  textAlign: 'center'
}

const iconStyle = {
  fontSize: 60,
  color: 'green'
}

const optionIconStyle = {
  fontSize: 40,
  color: 'orange'
}

const Node = (props) => {
  const {
    doUpdateHash,
    node
  } = props

  const isQuestion = node.nodeType === 'question'

  return (
    <div style={containerStyle}>
      {
        isQuestion
        ? <ContactSupportIcon style={iconStyle} color='black' />
        : <RoomIcon style={optionIconStyle} color='black' />
      }
    </div>
  )
}

export default Node
