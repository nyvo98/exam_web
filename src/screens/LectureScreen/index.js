import React from 'react'
import { Row, Col, Card, Calendar } from 'antd'
import { UserAddOutlined, UnorderedListOutlined, CaretDownOutlined } from '@ant-design/icons'
import ListSubject from './ListSubject'
import ChangePw from '../../components/ChangePw'
import { getDataLocal } from '../../common/function'
import BaseAPI from '../../common'
export default class LectureScreen extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      curKey: 'subjects',
      curUser: undefined,
      lCourses: []
    }
  }

  componentDidMount () {
    this.getData()
  }

  getData=async () => {
    const res = await BaseAPI.getData('subject/lecture')
    if (res) {
      console.log('LectureScreen -> getData -> res', res)
      if (!res.success) {
        this.props.reset()
      } else {
        this.setState({ lCourses: res.data })
      }
    }
  }

  render () {
    const { lCourses } = this.state
    return (
      <Row style={{ height: '100vh' }}>
        <Col span={12} offset={1} >
          <ListSubject lCourses={lCourses}/>
        </Col>
        <Col span={6} offset={3}>
          <Row>
            <Card title="Event" style={style.rightCard} extra={<CaretDownOutlined />}>
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
