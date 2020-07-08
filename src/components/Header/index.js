import React from 'react'
import { Layout } from 'antd'

export default class Header extends React.Component {
  render () {
    return (
      <Layout.Header style={{ backgroundColor: 'white' }}>
        <h1 >Exam Online System</h1>
      </Layout.Header>
    )
  }
}
