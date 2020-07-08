import React from 'react'
import { Col, Row, Card, Input, Button, Modal } from 'antd'
import { DoubleRightOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import BaseAPI from '../../common'
import ExamItem from './ExamItem'
import { convertDateFormat, getDataLocal } from '../../common/function'
export default class ListExam extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      lExam: [],
      isDetail: false,
      curExam: {},
      code: '',
      isEnterCode: false,
      localUser: {}
    }
  }

  componentDidMount () {
    this.getData()
  }

  getData=async () => {
    const { listExamId } = this.props.course
    const localUser = JSON.parse(getDataLocal('USER_DATA'))
    const listExam = []
    for (let i = 0; i < listExamId.length; i++) {
      const type = 'test/me/' + listExamId[i]
      const res = await BaseAPI.getData(type)
      if (res) {
        listExam.push(res.data)
      }
    }
    this.setState({ lExam: listExam, localUser })
  }

  handleShowInputCode=(item) => () => {
    const code = item.code
    this.setState({ isEnterCode: true, code, curExam: item })
  }

  handleEnterCode =(e) => {
    const { code } = this.state
    if (e.target.value === code) {
      this.setState({ isDetail: true })
    }
  }

  checkStudentAttend=(list) => {
    const { localUser } = this.state
    const index = list.findIndex(item => item.user.id === localUser.email)
    if (index === -1) {
      return index
    }
    return list[index].point
  }

  inputCode=(
    <Modal
      visible
      title='Enter code for this test'
      footer={null}
      onCancel={() => this.setState({ isEnterCode: false })}
    >
      <Input
        placeholder='Enter 6 digit code'
        onChange={this.handleEnterCode}
      />
    </Modal>
  )

  render () {
    const { lExam, isDetail, curExam, isEnterCode } = this.state
    const { onCloseDetail } = this.props
    if (isDetail) {
      return <ExamItem exam = {curExam} onCloseDetail={onCloseDetail}/>
    }
    return (
      <>
        <Button icon={<ArrowLeftOutlined />} onClick={onCloseDetail}>Back to courses</Button>
        <Row justify='space-around'>
          {
            lExam.map((item, key) => (
              <Col span={10} key={key}>
                {isEnterCode && this.inputCode}
                <Card title={item.name}
                  extra={this.checkStudentAttend(item.listStudentId) === -1 && <Button onClick={this.handleShowInputCode(item)} icon={<DoubleRightOutlined />} type='text'>Attend</Button>}
                  style={style.cardItem}>
                  <p>Start At: {convertDateFormat(item.startDate)}</p>
                  <p>End At: {convertDateFormat(item.endDate)}</p>
                  {this.checkStudentAttend(item.listStudentId) !== -1 && <p>Your Score: {this.checkStudentAttend(item.listStudentId).toString()}</p>}
                </Card>
              </Col>
            ))
          }
        </Row>
      </>
    )
  }
}
const style = {
  cardItem: {
    marginTop: 20,
    borderRadius: '20px',
    backgroundColor: 'rgba(51, 102, 204,0.4)'
  }
}
