import React from 'react'
import { Row, Col, Input, Button, Modal } from 'antd'
import { UserOutlined, EyeInvisibleOutlined, EyeTwoTone, LockOutlined } from '@ant-design/icons'
import BaseAPI from '../../common'
import { saveDataLocal, getDataLocal } from '../../common/function'

export default class LoginScreen extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      resetEmail: undefined,
      isReset: false
    }
  }

  onLogin= async () => {
    const { email, password } = this.state
    const payload = {
      email,
      password,
      isLogin: true
    }
    const res = await BaseAPI.postData('user/signIn', payload)
    console.log('login', res)
    if (res) {
      if (res.errMess) {
        alert(res.errMess)
      } else {
        const token = res.jwt
        const data = res.data
        saveDataLocal('JWT_TOKEN', token)
        saveDataLocal('USER_DATA', JSON.stringify(data))
        this.props.handleLogin(res.data.role, res.data.email)
      }
    }
  }

  onChangeText = (e) => {
    const { name, value } = e.target
    this.setState({ [name]: value })
  }

  handFormReset=() => {
    this.setState({ isReset: !this.state.isReset })
  }

  handleResetPW=async () => {
    const { resetEmail } = this.state
    const payload = {
      email: resetEmail
    }
    const res = await BaseAPI.postData('user/pw/reset', payload)
    if (res) {
      console.log(res)
      if (res.errMess === 'notExistsUSer') {
        alert('Error Email! Please enter your email again')
      } else {
        alert('Sent! Please check your email')
        this.setState({ isReset: false })
      }
    }
  }

  resetPwForm=(
<Modal
  visible
  title='Reset password'
  footer={null}
  onCancel={this.handFormReset}
>
  <p>Your new password will be sent to your email</p>
  <Input
    placeholder='Enter your email'
    name='resetEmail'
    onChange={this.onChangeText}
  />
  <Button type='primary'
    style={{ marginTop: 10 }}
    onClick={this.handleResetPW}>Send</Button>
</Modal>
  )

  render () {
    const { isReset } = this.state
    return (
      <Row style={{ height: '100vh' }}>
        {isReset && this.resetPwForm}
        <Col span={8} offset={8}>
          <Row>
            <Col span={8} offset={8}>
              <h1>Sign In</h1>
            </Col>
          </Row>
          <Input
            name='email'
            style={style.textInput}
            placeholder='Enter username'
            size='large'
            onChange={this.onChangeText}
            prefix={<UserOutlined/>}/>
          <Input.Password
            name='password'
            style={style.textInput}
            size='large'
            placeholder="input password"
            prefix={<LockOutlined/>}
            iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            onChange={this.onChangeText}
          />
          <Row>
            <Col span={8} offset={8}>
              <Button
                style={style.loginBtn}
                type='primary'
                shape='round'
                onClick={this.onLogin}>
                  Sign In
              </Button>
              <Button
                style={style.loginBtn}
                onClick={this.handFormReset}
                type='link' >Forgot password ?</Button>
            </Col>
          </Row>
        </Col>
      </Row>
    )
  }
}

const style = {
  textInput: {
    marginTop: 10
  },
  loginBtn: {
    marginTop: 10,
    width: 200
  }
}
