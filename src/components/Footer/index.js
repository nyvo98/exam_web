import React from 'react'
import { Layout } from 'antd'

export default class Footer extends React.Component {
  render () {
    return (
      <Layout.Footer style={{ bottom: 0, position: 'fixed', width: '100vw' }}>
                   Footer
      </Layout.Footer>
    )
  }
}
