import React from 'react'
import {
  Layout, Menu, Avatar, Modal, Input,
  Button, Row, Col, Dropdown
} from 'antd'
import {
  HomeOutlined, FlagOutlined, ContactsOutlined,
  EyeInvisibleOutlined, EyeTwoTone,
  UserOutlined, LockOutlined, LogoutOutlined
} from '@ant-design/icons'

import LoginScreen from './screens/LoginScreen'
import AdminScreen from './screens/AdminScreen'
import LectureScreen from './screens/LectureScreen'
import StudentScreen from './screens/StudentScreen'
import Header from './components/Header'
import { getDataLocal, removeDataLocal } from './common/function'
import './App.css'
import BaseAPI from './common'

export default class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isLogin: false,
      username: '',
      role: 'admin',
      oldPassword: '',
      newPassword: '',
      isChangePW: false,
      reload: 0
    }
  }

  componentDidMount () {
    this.getLocalUser()
  }

  componentWillReceiveProps (prevProps) {
    console.log('pre', prevProps)
  }

  getLocalUser= () => {
    const data = getDataLocal('USER_DATA')
    const token = getDataLocal('JWT_TOKEN')
    const user = JSON.parse(data)
    console.log('user', user)
    console.log('token', token)
    if (user && token) {
      this.setState({ username: user.email, isLogin: true, role: user.role })
    } else {
      this.setState({ isLogin: false })
    }
  }

  reset=() => {
    console.log('reset ')
    const { reload } = this.state
    this.setState({ reload: reload + 1 })
  }

  handleLogin=(role, username) => {
    if (role) {
      this.setState({ role, username, isLogin: true })
    }
  }

  onShowFormPW =() => {
    const { isChangePW } = this.state
    this.setState({ isChangePW: !isChangePW })
  }

  onChangePW=async () => {
    const { oldPassword, newPassword } = this.state
    const payload = {
      newPassword, oldPassword
    }
    const res = await BaseAPI.postData('user/pw/change', payload)
    if (res) {
      alert('Change password successfully')
      this.setState({ isChangePW: false })
    }
  }

  screenByRole=(role) => {
    switch (role) {
    case 'admin':
      return <AdminScreen reset={this.reset}/>
    case 'lecture':
      return <LectureScreen reset={this.reset}/>
    case 'student':
      return <StudentScreen reset={this.reset}/>
    default:
      return <StudentScreen/>
    }
  }

  handleSignOut=() => {
    removeDataLocal('JWT_TOKEN')
    removeDataLocal('USER_DATA')
    this.setState({ isLogin: false })
  }

  onChangeText = (e) => {
    const { name, value } = e.target
    this.setState({ [name]: value })
  }

  menu = (
    <Menu >
      <Menu.Item key="1" onClick={this.onShowFormPW} icon={<LockOutlined />}>
        Change password
      </Menu.Item>
      <Menu.Item key="2" onClick={this.handleSignOut} icon={<LogoutOutlined />}>
        Sign out
      </Menu.Item>
    </Menu>
  )

  formChangePW=(
    <Modal
      title='Change Password'
      visible
      footer={null}
      onCancel={this.onShowFormPW}
    >
      <Input.Password
        name='oldPassword'
        placeholder='Enter old password'
        style={{ marginTop: 10 }}
        onChange={this.onChangeText}
        iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
      />
      <Input.Password
        name='newPassword'
        style={{ marginTop: 10 }}
        placeholder='Enter new password'
        onChange={this.onChangeText}
        iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
      />
      <Input.Password
        name='newPassword'
        style={{ marginTop: 10 }}
        placeholder='Confirm new password'
        // onChange={this.onChangeText}
        iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
      />
      <Button type='primary'
        style={{ marginTop: 10 }}
        onClick={this.onChangePW}>Save</Button>
    </Modal>
  )

  render () {
    const { isLogin, role, username, isChangePW } = this.state
    return (
      <div>
        <Layout>
          <Header/>
          <Menu style={{ backgroundColor: '#364294', color: 'white' }} mode='horizontal'>
            <Row>
              <Col span={13} offset={3}>
                <Row>
                  <Col span={4}>
                    <Menu.Item key='home' icon={<HomeOutlined />}>
                   HOME
                    </Menu.Item>
                  </Col>
                  <Col span={4}>
                    <Menu.Item key="lang" icon={<FlagOutlined />}>
                      English
                    </Menu.Item>
                  </Col>
                  <Col span={4}>
                    <Menu.Item key="contact" icon={<ContactsOutlined />}>
                      Contact
                    </Menu.Item>
                  </Col>
                </Row>
              </Col>
              {
                isLogin && (
                  <>
                    <Col span={3} offset={1}>
                      {username}
                    </Col>
                    <Col span={2}>
                      {isChangePW && this.formChangePW}
                      <Dropdown overlay={this.menu}>
                        <Button type='text'>
                          <Avatar shape="square" size='default' icon={<UserOutlined />} />
                        </Button>
                      </Dropdown>
                    </Col>
                  </>
                )
              }
            </Row>
          </Menu>
          <Layout.Content>
            {
              isLogin
                ? this.screenByRole(role)
                : <LoginScreen handleLogin={this.handleLogin}/>
            }
          </Layout.Content>
        </Layout>
      </div>
    )
  }
}
