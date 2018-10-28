import React from 'react'
import { connect } from 'redux-bundler-react'
import { Button } from '@material-ui/core'
import { Graph } from 'react-d3-graph'
import { isEmpty, isNil } from 'lodash'

import CreateNodeForm from './createNodeForm'
import CreateFirstNodeForm from './createFirstNodeForm'

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
