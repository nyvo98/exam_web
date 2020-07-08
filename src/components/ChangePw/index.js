import React from 'react'
import { Input, Row, Col, Dropdown, Button, Menu } from 'antd'
import { LockOutlined } from '@ant-design/icons'

export default class ChangPW extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      role: 'student'
    }
  }

  render () {
    return (
      <Row>
        <Col span={8} offset={4}>
          <h1>Change Password</h1>
          <Input
            name='email'
            style={style.textInput}
            placeholder='Enter old password'
            size='large'
            onChange={this.onChangeText}
            prefix={<LockOutlined/>}/>
          <Input
            name='password'
            style={style.textInput}
            placeholder='Enter new password'
            size='large'
            onChange={this.onChangeText}
            prefix={<LockOutlined/>}/>
          <Input
            name='password'
            style={style.textInput}
            placeholder='Confirm password'
            size='large'
            onChange={this.onChangeText}
            prefix={<LockOutlined/>}/>
          <Row style={{ marginTop: 10 }}>
            <Col>
              <Button type='primary'>Save</Button>
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
  }
}
