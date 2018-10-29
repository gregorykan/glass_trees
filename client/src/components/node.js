import React from 'react'
import ThreeSixtyIcon from '@material-ui/icons/ThreeSixty';

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center'
}

const headerStyle = {
  textAlign: 'center'
}

const iconStyle = {
  height: 100
}

const Node = (props) => {
  const {
    doUpdateHash
  } = props
  return (
    <div style={containerStyle}>
      <ThreeSixtyIcon style={iconStyle} />
    </div>
  )
}

export default Node
