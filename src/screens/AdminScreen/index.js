import React from 'react'
import { Row, Col, Menu } from 'antd'
import { UserAddOutlined, UnorderedListOutlined } from '@ant-design/icons'
import TableData from '../../components/TableData'
import Adduser from '../../components/AddUser'
import BaseAPI from '../../common/index'
import { get } from 'lodash'
export default class AdminScreen extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      curKey: 'create'
    }
  }

  tabContent=() => {
    const { curKey } = this.state

    switch (curKey) {
    case 'create':
      return <Adduser/>
    case 'lectures':
      return <TableData isDelete={false} type='lecture'/>
    case 'students':
      return <TableData isDelete={false} type='student'/>
    case 'userDelete':
      return <TableData isDelete={true}/>
    default:
      return <Adduser/>
    }
  }

  handleTabChange=(item) => {
    const key = item.key
    this.setState({ curKey: key })
  }

  render () {
    return (
      <Row style={{ height: '100vh', paddingTop: '2rem' }}>
        <Col span={6} >
          <Menu style={style.side_menu} onClick={item => this.handleTabChange(item)}>
            <Menu.Item key ='create' icon={<UserAddOutlined/>}>
                Create New User
            </Menu.Item>
            <Menu.Item key ='lectures' icon={<UnorderedListOutlined />}>
                List Lectures
            </Menu.Item>
            <Menu.Item key ='students' icon={<UnorderedListOutlined />}>
                List Students
            </Menu.Item>
            <Menu.Item key ='userDelete' icon={<UnorderedListOutlined />}>
                List User Deleted
            </Menu.Item>
          </Menu>
        </Col>
        <Col span={16} offset={1} >
          {this.tabContent()}
        </Col>
      </Row>
    )
  }
}
const style = {
  side_menu: {
    height: '100vh'
  }
}
