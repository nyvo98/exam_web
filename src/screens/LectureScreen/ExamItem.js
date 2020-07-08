import React from 'react'
import { Row, Col, Radio, Checkbox, Button } from 'antd'
import { UserAddOutlined, ArrowLeftOutlined, ClockCircleOutlined } from '@ant-design/icons'
export default class ExamItem extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }

  handleSubmit= () => {
    console.log('adsakdgak')
    this.setState({ isSubmit: true })
  }

  render () {
    const { listQuestionId, name, time } = this.props.exam
    const { onCloseDetail } = this.props
    return (
      <Row>
        <Button icon={<ArrowLeftOutlined />} onClick={onCloseDetail}>Back to courses</Button>
        <Col>
          <Row justify='center'>
            <Col>
              <h1>{name}</h1>
            </Col>
          </Row>
          <Row justify='center'>
            <Col>
              <h3><ClockCircleOutlined />{time}</h3>
            </Col>
          </Row>
          <Row>
            <Col>
              {listQuestionId.map((question, key) => (
                <Row key={key}>
                  {
                    question.type === 1
                      ? <Col>
                        <Row>{key + 1}.Select one correct answer :</Row>
                        <Row>
                          {question.name}
                        </Row>
                        <Row>
                          <Radio.Group>
                            {question.answerList.map((answer, key) => (
                              <Radio key={key} value={key}>{answer}</Radio>
                            ))}
                          </Radio.Group>
                        </Row>
                      </Col>
                      : <Col>
                        <Row>{key + 1}.Select two correct answer : </Row>
                        <Row>
                          {question.name}
                        </Row>
                        <Row>
                          <Checkbox.Group>
                            {question.answerList.map((answer, key) => (
                              <Checkbox key={key} value={key}>{answer}</Checkbox>
                            ))}
                          </Checkbox.Group>
                        </Row>
                      </Col>
                  }
                </Row>
              ))}
            </Col>
          </Row>
          <Row justify='center'>
            <Col >
              <Button type='primary' onClick={() => console.log('asdasigd')}>Submit</Button>
            </Col>
          </Row>
        </Col>
      </Row>
    )
  }
}
