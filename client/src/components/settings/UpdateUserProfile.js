import React, { Component } from 'react'

export default class UpdatePersonalData extends Component {
  render() {
    const h1Heading = this.props.linkName;
    return (
      <div>{h1Heading}</div>
    )
  }
}
