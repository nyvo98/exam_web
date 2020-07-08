import React from 'react'
import axios from 'axios'

import { Col, Row, Card, Input, Button, Popover, Modal, DatePicker, Upload } from 'antd'
import {
  DoubleRightOutlined, FolderAddOutlined, ProfileOutlined, ArrowLeftOutlined,
  ClockCircleOutlined, CloudUploadOutlined, OrderedListOutlined, QrcodeOutlined
} from '@ant-design/icons'
import BaseAPI from '../../common'
import ExamItem from './ExamItem'
import TestReport from './Report'
import { convertDateFormat, getDataLocal } from '../../common/function'
let fileReader
export default class ListExam extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      lExam: [],
      isDetail: false,
      curExam: {},
      isAddNew: false,
      isShowCode: false,
      isViewReport: false,
      name: '',
      startDate: null,
      endDate: null,
      selectedFile: null,
      time: 0,
      curKey: undefined
    }
  }

  componentDidMount () {
    this.getData()
  }

  getData=async () => {
    const { listExamId } = this.props.course
    const listExam = []
    for (let i = 0; i < listExamId.length; i++) {
      const type = 'test/me/' + listExamId[i]
      const res = await BaseAPI.getData(type)
      if (res) {
        listExam.push(res.data)
      }
    }
    this.setState({ lExam: listExam })
  }

  handleViewExam=(item) => () => {
    this.setState({ curExam: item, isDetail: true })
  }

  onChangeText = (e) => {
    const { name, value } = e.target
    this.setState({ [name]: value })
  }

  onChangeTime=(e) => {
    const { value } = e.target
    const time = parseInt(value)
    this.setState({ time })
  }

  onChangeCalendar=(dates) => {
    const startDate = dates[0]
    const endDate = dates[1]
    this.setState({ startDate, endDate })
  }

  onUploadFile= (e) => {
    const file = e.target.files[0]
    this.setState({ selectedFile: file })
  }

  handleAddTest= async () => {
    const { id } = this.props.course
    const { name, startDate, endDate, time, selectedFile } = this.state
    const payload = {
      name, time, startDate, endDate, subjectId: id
    }
    const res = await BaseAPI.postData('test', payload)
    if (res && res.success) {
      const name = res.data.id
      const token = await getDataLocal('JWT_TOKEN')
      console.log(token)
      const formData = new FormData()
      formData.append('file', selectedFile, name)
      const config = {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
          Authorization: 'Bearer ' + token
        }
      }
      const response = await axios.post('http://doquizz.ddns.net:3031/api/question/uploadTest', formData, config)
      if (response) {
        this.setState({ isAddNew: false })
        this.getData()
      }
    }
    this.props.reloadData()
  }

  addForm =(
    <Modal
      title="Add New Test"
      visible
      footer={null}
      onCancel={() => this.setState({ isAddNew: false })}
    >
      <Input
        name='name'
        // style={style.textInput}
        placeholder='Test Name'
        size='large'
        onChange={this.onChangeText}
        prefix={<ProfileOutlined />}/>
      <Row style={{ marginTop: 10 }} >
        <Col span={16}>
          <DatePicker.RangePicker size='large' onChange={this.onChangeCalendar}/>
        </Col>
        <Col span={4} >
          <Input
            name='time'
            placeholder='Minutes'
            size='large'
            // style={{ width: 150 }}
            onChange={this.onChangeTime}
            prefix={<ClockCircleOutlined />}/>
        </Col>

      </Row>
      <Row style={{ marginTop: 10 }}>
        <Input type='file'
          name='file'
          prefix={<CloudUploadOutlined />}
          placeholder='Import file'
          onChange={this.onUploadFile}
        />
      </Row>
      <Row justify='center' style={{ marginTop: 10 }}>
        <Col>
          <Button type='primary' onClick={this.handleAddTest} icon={<FolderAddOutlined />}>Add</Button>
        </Col>
      </Row>
    </Modal>
  )

  handleViewForm =() => {
    this.setState({ isAddNew: true })
  }

  handleShowCode =(key) => () => {
    const { isShowCode } = this.state
    this.setState({ isShowCode: !isShowCode, curKey: key })
  }

  handleViewReport=(key) => () => {
    const { isViewReport } = this.state
    this.setState({ isViewReport: !isViewReport, curKey: key })
  }

  render () {
    const { lExam, isDetail, curExam, isAddNew, isShowCode, isViewReport, curKey } = this.state
    const { onCloseDetail } = this.props
    if (isDetail) {
      return <ExamItem exam = {curExam} onCloseDetail={onCloseDetail}/>
    }
    return (
      <Row>
        <Button icon={<ArrowLeftOutlined />} onClick={onCloseDetail}>Back to courses</Button>
        <Button icon={<FolderAddOutlined />} onClick={this.handleViewForm}>Add New Test</Button>
        {isAddNew && this.addForm}
        <Col>
          <Row justify='space-around'>
            {
              lExam.map((item, key) => (
                <Col span={10} key={key}>
                  <Card title={item.name}
                    extra={<Button onClick={this.handleViewExam(item)} icon={<DoubleRightOutlined />} type='text'></Button>}
                    style={style.cardItem}>
                    <p>Start At: {convertDateFormat(item.startDate)}</p>
                    <p>End At: {convertDateFormat(item.endDate)}</p>
                    <p>Student Total: {item.listUserExtend.length}</p>
                    <p>Student Join Test : {item.listStudentId.length}</p>
                    <Row justify='space-around'>
                      <Col>
                        {isShowCode && curKey === key && <Popover
                          content={item.code}
                          title="Code to join test"
                          visible
                          trigger="click"
                        />}
                        <Button icon={<QrcodeOutlined />} onClick={this.handleShowCode(key)}>Code</Button>
                      </Col>
                      <Col>
                        <Button icon={<OrderedListOutlined />} onClick={this.handleViewReport(key)}>View Report</Button></Col>
                      {isViewReport && curKey === key && <TestReport studentAttend={item.listStudentId} handleViewReport={this.handleViewReport}/>}
                    </Row>
                  </Card>
                </Col>
              ))
            }
          </Row>
        </Col>
      </Row>
    )
  }
}
const style = {
  cardItem: {
    marginTop: 20,
    borderRadius: '20px',
    backgroundColor: 'rgba(51, 102, 204,0.4)',
    width: '350px'
  }
}
