import React from 'react'
import { Row, Col, Card, Calendar } from 'antd'
import { UserAddOutlined, UnorderedListOutlined, CaretDownOutlined } from '@ant-design/icons'
import ListSubject from './ListSubject'
import ChangePw from '../../components/ChangePw'
import BaseAPI from '../../common'
import { convertDateFormat } from '../../common/function'
export default class StudentScreen extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      curKey: 'subjects',
      soonEvent: []
    }
  }

  componentDidMount () {
    this.getData()
  }

  getData=async () => {
    const res = await BaseAPI.getData('test/soon')
    if (res) {
      const event = res.data
      this.setState({ soonEvent: event })
    }
  }

  render () {
    const { soonEvent } = this.state
    return (
      <Row style={{ height: '100vh' }}>
        <Col span={12} offset={1} >
          <ListSubject/>
        </Col>
        <Col span={6} offset={3}>
          <Row>
            <Card title="Event" style={style.rightCard} extra={<CaretDownOutlined />}>
              {soonEvent && soonEvent.map((event, key) => (
                <Row key={key}>
                  <p>{event.name} : {convertDateFormat(event.startDate)} - {convertDateFormat(event.endDate)}</p>
                </Row>
              ))}
              <p>Go to calendar ...</p>
            </Card>
          </Row>
          <Row>
            <Card title="Calendar" style={style.rightCard} extra={<CaretDownOutlined />}>
              <Calendar
                mode='month'
                fullscreen={false}/>
            </Card>
          </Row>
        </Col>
      </Row>
    )
  }
}
const style = {
  side_menu: {
    height: '100vh'
  },
  rightCard: {
    width: 400,
    borderRadius: '20px',
    marginTop: 20
  }
}
