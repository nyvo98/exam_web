import React from 'react'
import { Input, Row, Col, Dropdown, Button, Menu, Alert } from 'antd'
import { UserOutlined, DownOutlined } from '@ant-design/icons'
import BaseAPI from '../../common'
import { get } from 'lodash'

export default class AddUser extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      role: 'student',
      isAlert: false
    }
  }

 handleMenuClick= (e) => {
   const role = e.key
   this.setState({ role: role })
 }

 onChangeText = (e) => {
   const { name, value } = e.target
   this.setState({ [name]: value })
 }

  menu = (
    <Menu onClick={this.handleMenuClick}>
      <Menu.Item key="student" icon={<UserOutlined />}>
          Student
      </Menu.Item>
      <Menu.Item key="lecture" icon={<UserOutlined />}>
          Lecture
      </Menu.Item>
    </Menu>
  )

  onShowAlert = (type, message) => {
    this.setState({
      type,
      message,
      isAlert: true
    })

    setTimeout(() => {
      this.setState({
        isAlert: false
      })
    }, 2000)
  }

  onsubmit = async () => {
    const { email, password, confirmPassword, role } = this.state
    if (email && password && confirmPassword && role) {
      console.log('AddUser -> onsubmit -> email, password, confirmPassword, role', email, password, confirmPassword, role)
      if (password !== confirmPassword) return this.onShowAlert('error', 'password not match !')
      const payload = await BaseAPI.postData('user/register', { email, password, role })
      if (get(payload, 'success')) return this.onShowAlert('error', 'Some thing went wrong !')
      this.onShowAlert('success', 'Successfully Added !')
      this.setState({
        email: '',
        password: '',
        confirmPassword: ''
      })
    }
  }

  render () {
    const { role, isAlert, message, type } = this.state
    return (
      <Row>
        <Col span={12} offset={6}>
          <h1>Add new account</h1>
          <Input
            name='email'
            style={style.textInput}
            placeholder='Enter username'
            size='large'
            onChange={this.onChangeText}
            prefix={<UserOutlined/>}/>
          <Input
            name='password'
            type="password"
            style={style.textInput}
            placeholder='Enter password'
            size='large'
            onChange={this.onChangeText}
            prefix={<UserOutlined/>}/>
          <Input
            name='confirmPassword'
            type="password"
            style={style.textInput}
            placeholder='Confirm password'
            size='large'
            onChange={this.onChangeText}
            prefix={<UserOutlined/>}/>
          <Row style={{ marginTop: 10 }}>
            <h3>Role : </h3>
            <Dropdown
              overlay={this.menu}>
              <Button>
                {role} <DownOutlined />
              </Button>
            </Dropdown>
          </Row>
          <Row style={{ marginTop: 10 }}>
            <Col>
              <Button onClick={this.onsubmit} type='primary'>Add</Button>
            </Col>
          </Row>
        </Col>
        {
          isAlert ? (
            <Alert
              style={{ margin: '0 auto', position: 'absolute' }}
              message={message}
              type={type}
              showIco
            />
          ) : ''
        }
      </Row>
    )
  }
}

const style = {
  textInput: {
    marginTop: 10
  }
}
