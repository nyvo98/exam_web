import React from 'react'
// eslint-disable-next-line
import { Table, Tag, Space, Row, Col, Input, Button, Popconfirm } from 'antd'
import Highlighter from 'react-highlight-words'
import { SearchOutlined } from '@ant-design/icons'
import { convertDateFormat } from '../../common/function'
import BaseAPI from '../../common/index'
import { get } from 'lodash'
export default class TableData extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      data: [],
      title: '',
      isDelete: false
    }
  }

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select())
      }
    },
    render: text =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
        text
      )
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm()
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex
    })
  };

  handleReset = clearFilters => {
    clearFilters()
    this.setState({ searchText: '' })
  };

  handleDelete = async key => {
    const isDelete = this.state.isDelete
    const dataSource = [...this.state.data]

    const userDelete = dataSource.find(item => item._id === key)
    const payload = await BaseAPI.deleteData('user', { id: userDelete.id, isActive: isDelete })
    if (!payload) return
    this.setState({
      data: dataSource.filter(item => item._id !== key)
    })
  }

  async componentWillReceiveProps (nextProps) {
    const { type, isDelete } = nextProps
    if (isDelete) {
      const payload = await BaseAPI.getData('user/deleted')
      if (get(payload, 'success')) {
        this.setState({
          data: get(payload, 'data'),
          isDelete
        })
      }
    } else {
      const payload = await BaseAPI.getData('user')
      if (get(payload, 'success')) {
        this.setState({
          data: get(payload, 'data').filter(item => item.role === type),
          isDelete
        })
      }
    }
  }

  async componentDidMount () {
    const { type, isDelete } = this.props
    if (isDelete) {
      const payload = await BaseAPI.getData('user/deleted')
      if (get(payload, 'success')) {
        this.setState({
          data: get(payload, 'data'),
          isDelete
        })
      }
    } else {
      const payload = await BaseAPI.getData('user')
      if (get(payload, 'success')) {
        this.setState({
          data: get(payload, 'data').filter(item => item.role === type),
          isDelete
        })
      }
    }
  }

   columns = [
     {
       title: 'Personal ID',
       dataIndex: 'id',
       key: 'id',
       ...this.getColumnSearchProps('id')
     },
     {
       title: 'Name',
       dataIndex: 'name',
       key: 'name',
       ...this.getColumnSearchProps('name')
     },
     {
       title: 'Email',
       dataIndex: 'email',
       key: 'email',
       ...this.getColumnSearchProps('email')
     },
     {
       title: 'Role',
       dataIndex: 'role',
       key: 'role'
     },
     {
       title: 'Action',
       dataIndex: 'operation',
       render: (text, record) =>
         this.state.data.length >= 1 ? (
           <Popconfirm title={`Sure to ${this.state.isDelete ? 'un delete' : 'delete'}?`} onConfirm={() => this.handleDelete(record._id)}>
             <a>{this.state.isDelete ? 'Un Delete' : 'Delete'}</a>
           </Popconfirm>
         ) : null
     }

   ];

   render () {
     const { data } = this.state
     return (
       <Row>
         <Col span={24}>
           <Table dataSource={data} columns={this.columns} />
         </Col>
       </Row>
     )
   }
}
