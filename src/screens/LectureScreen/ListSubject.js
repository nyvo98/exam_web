import React from 'react'
import { Col, Row, Card, Input, Button, Breadcrumb, Modal } from 'antd'
import { DoubleRightOutlined, FolderAddOutlined, ProfileOutlined, UsergroupAddOutlined } from '@ant-design/icons'
import ListExam from './ListExam'
import BaseAPI from '../../common'
import { getDataLocal } from '../../common/function'

export default class ListSubject extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      lCourses: [],
      isDetail: false,
      curCourse: {},
      isAddNew: false,
      name: '',
      description: '',
      curKey: undefined,
      isAddStudent: false,
      newStudent: ''
    }
  }

  componentDidMount () {
    this.getData()
  }

  getData= async () => {
    const res = await BaseAPI.getData('subject/lecture')
    if (res) {
      this.setState({ lCourses: res.data })
    }
  }

  onChangeText = (e) => {
    const { name, value } = e.target
    this.setState({ [name]: value })
  }

  handleAddCourse= async () => {
    const { name, description } = this.state
    const payload = {
      name, description
    }
    const res = await BaseAPI.postData('subject', payload)
    if (res) {
      this.setState({ isAddNew: false })
      this.getData()
    }
  }

  addForm =(
    <Modal
      title="Add New Course"
      visible
      footer={null}
      onCancel={() => this.setState({ isAddNew: false })}
    >
      <Input
        name='name'
        // style={style.textInput}
        placeholder='Course Title'
        size='large'
        onChange={this.onChangeText}
        prefix={<ProfileOutlined />}/>
      <Input
        name='description'
        style={{ marginTop: 10 }}
        placeholder='Course description'
        size='large'
        onChange={this.onChangeText}
        prefix={<ProfileOutlined />}/>
      <Row justify='center' style={{ marginTop: 10 }}>
        <Col>
          <Button type='primary' onClick={this.handleAddCourse} icon={<FolderAddOutlined />}>Add</Button>
        </Col>
      </Row>
    </Modal>
  )

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

  handleViewForm =() => {
    this.setState({ isAddNew: true })
  }

  onCloseDetail=() => {
    this.setState({ isDetail: false })
  }

  onShowAddForm=(key, item) => () => {
    this.setState({ isAddStudent: !this.state.isAddStudent, curKey: key, curCourse: item })
  }

  handleAddStudent =async () => {
    const { newStudent, curCourse } = this.state
    // const listUserId = []
    // listUserId.push(newStudent)
    const payload = {
      id: curCourse.id,
      listUserId: [newStudent]
    }
    const res = await BaseAPI.postData('subject/addUser', payload)
    if (res) {
      if (res.errMess === 'notExistsData') {
        alert('Error ! PLease check email again!')
      } else {
        alert('Add student successfully')
        this.setState({ isAddStudent: false })
        this.getData()
      }
    }
  }

  addStudentForm =(
    <Modal
      title='Add new student'
      footer={null}
      visible
      onCancel={() => this.setState({ isAddStudent: false })}
    >
      <Input
        name='newStudent'
        placeholder='Enter student email'
        onChange={this.onChangeText}
      />
      <Button
        style={{ marginTop: 10 }}
        type='primary'
        onClick={this.handleAddStudent}>Add</Button>
    </Modal>
  )

  render () {
    const { lCourses, isDetail, curCourse, isAddNew, isAddStudent, curKey } = this.state
    console.log(lCourses)
    return (
      <Row >
        <Col>
          {isAddNew && this.addForm}
          <Card title='List Courses Overview'
            extra={<Input.Search placeholder='Search course' onSearch={value => console.log(value)}/>}
            style={style.cardContainer}>
            {
              isDetail
                ? <ListExam course={curCourse} onCloseDetail={this.onCloseDetail} reloadData={this.getData}/>
                : <Row>
                  <Button icon={<FolderAddOutlined />} onClick={this.handleViewForm}>Add New Course</Button>
                  <Col>
                    <Row justify='space-around'>
                      {
                        lCourses && lCourses.map((item, key) => (
                          <Col span={10} key={key}>
                            <Card title={item.name}
                              extra={<Button onClick={this.handleViewExams(item)} icon={<DoubleRightOutlined />} type='text'></Button>}
                              style={style.cardItem}>
                              <p>{item.description}</p>
                              <p>Student Number: {item.listUserExtend.length}</p>
                              <p>Test Number: {item.listExamId.length}</p>
                              <Button icon={<UsergroupAddOutlined />} onClick={this.onShowAddForm(key, item)}>Add Student</Button>
                              {isAddStudent && curKey === key && this.addStudentForm }
                            </Card>
                          </Col>
                        ))
                      }
                    </Row>
                  </Col>
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
    backgroundColor: 'rgba(51, 102, 204,0.4)',
    width: '350px'
  }
}
