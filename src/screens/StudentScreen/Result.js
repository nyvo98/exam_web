import React from 'react'
import { Col, Row, Result, Button, Modal } from 'antd'
import { isImageUrl } from 'antd/lib/upload/utils'

export default class ResultForm extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isVisible: true
    }
  }

  handleBackToCourse= () => {
    this.setState({ isVisible: false })
    this.props.onCloseDetail()
  }

  handleReviewMode=() => {
    this.setState({ isVisible: false })
    this.props.review()
  }

  render () {
    const { totalCount, correctCount } = this.props
    const { isVisible } = this.state
    return (
      <Modal visible={isVisible}
        footer={null}
        title="Test Result Confirmation">
        <Result
          status="success"
          title="Successfully Submitted!"
          subTitle={`Your score :${correctCount}/${totalCount}`}
          extra={[
            <Button type="primary"
              key="console"
              onClick={this.handleBackToCourse}
            >
               Back to Courses
            </Button>,
            <Button key="buy"
              onClick={this.handleReviewMode}
            >Review</Button>
          ]}
        />
      </Modal>
    )
  }
}
