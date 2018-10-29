import React from 'react'

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center'
}

const headerStyle = {
  textAlign: 'center'
}

const Home = (props) => {
  const {
    doUpdateHash
  } = props
  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>welcome!</h1>
    </div>
  )
}

export default Home
