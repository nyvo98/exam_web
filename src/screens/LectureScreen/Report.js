import React from 'react'
import { Col, Row, Table, Modal } from 'antd'
import { convertDateFormat } from '../../common/function'

export default class TestReport extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      dataSource: [],
      columns: [
        {
          title: 'Student',
          dataIndex: 'email',
          key: 'email'
        },
        {
          title: 'Point',
          dataIndex: 'point',
          key: 'point'
        },
        {
          title: 'Time',
          dataIndex: 'time',
          key: 'time'
        }
      ]

    }
  }

  componentDidMount () {
    this.getData()
  }

  getData=() => {
    const { studentAttend } = this.props
    const dataSource = studentAttend.map((item, key) => {
      return {
        key,
        email: item.user.email,
        point: item.point,
        time: convertDateFormat(item.user.createdAt)
      }
    }
    )
    this.setState({ dataSource })
  }

  render () {
    const { dataSource, columns } = this.state
    return (
      <Modal
        title='Test Report'
        visible
        footer={null}
        onCancel={this.props.handleViewReport('')}
      >
        <Table dataSource={dataSource} columns={columns} />
      </Modal>
    )
  }
}
