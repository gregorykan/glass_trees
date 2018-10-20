import React from 'react'
import { Component } from 'react'
import { Provider } from 'react-fela'
import PropTypes from 'prop-types'

import felaRenderer from '../felaRenderer'
const clientRenderer = felaRenderer()

export default class FelaProvider extends Component {
  static contextTypes = {
    renderer: PropTypes.object
  }

  render () {
    if (this.context.renderer) {
      return this.props.children
    }

    const renderer = this.props.renderer || clientRenderer

    return (
      <Provider renderer={renderer}>
        {this.props.children}
      </Provider>
    )
  }
}
