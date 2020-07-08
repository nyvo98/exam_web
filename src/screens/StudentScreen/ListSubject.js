import React from 'react'
import { Col, Row, Card, Input, Button, Breadcrumb } from 'antd'
import { DoubleRightOutlined } from '@ant-design/icons'
import ListExam from './ListExam'
import BaseAPI from '../../common'

export default class ListSubject extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      lCourses: [],
      isDetail: false,
      curCourse: {}
    }
  }

  componentDidMount () {
    this.getData()
  }

  getData= async () => {
    const res = await BaseAPI.getData('subject/me')
    if (res) {
      const data = res.data
      this.setState({ lCourses: data })
    }
  }

  onCloseDetail=() => {
    this.setState({ isDetail: false })
  }

  breadcrumb =() => {
    const { lBreadcumb } = this.state
    return (
      <Breadcrumb>
        {
          lBreadcumb.map((item, key) => (
            <Breadcrumb.Item key={key}>{item}</Breadcrumb.Item>
          ))
        }
      </Breadcrumb>
    )
  }

  handleViewExams=(item) => () => {
    this.setState({ curCourse: item, isDetail: true })
  }

  render () {
    const { lCourses, isDetail, curCourse } = this.state
    return (
      <Row >
        <Col>
          <Card title='List Courses Overview'
            extra={<Input.Search placeholder='Search course' onSearch={value => console.log(value)}/>}
            style={style.cardContainer}>
            {
              isDetail
                ? <ListExam course={curCourse} onCloseDetail={this.onCloseDetail}/>
                : <Row justify='space-around'>
                  {
                    lCourses && lCourses.map((item, key) => (
                      <Col span={10} key={key}>
                        <Card title={item.name}
                          extra={<Button onClick={this.handleViewExams(item)} icon={<DoubleRightOutlined />} type='text'></Button>}
                          style={style.cardItem}>
                          <p>{item.description}</p>
                          <p>Test Number: {item.listExamId.length}</p>
                        </Card>
                      </Col>
                    ))
                  }
                </Row>
            }
          </Card>
        </Col>
      </Row>
    )
  }
}
const style = {
  cardContainer: {
    marginTop: 20,
    borderRadius: '20px',
    width: '800px'
  },
  cardItem: {
    marginTop: 20,
    borderRadius: '20px',
    backgroundColor: 'rgba(51, 102, 204,0.4)'
  }
}
