import React from 'react'
import { Row, Col, Radio, Checkbox, Button } from 'antd'
import { UserAddOutlined, UnorderedListOutlined, ClockCircleOutlined } from '@ant-design/icons'
import Result from './Result'
import Countdown from './CountDown'
import moment from 'moment'
import BaseAPI from '../../common'
export default class ExamItem extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isSubmit: false,
      userAnswerList: [],
      correctAnswerCount: 0,
      questionCount: 0,
      isReview: false
    }
  }

  handleSelectAnswer= (e, key) => {
    const lAnswer = this.state.userAnswerList
    const value = e.target.value
    lAnswer[key] = value
    this.setState({ answerList: lAnswer })
    console.log(lAnswer)
  }

  handleMultiSelect=(value, index) => {
    const lAnswer = this.state.userAnswerList
    lAnswer[index] = value
    this.setState({ answerList: lAnswer })
    console.log(lAnswer)
  }

  handleSubmit= async () => {
    const { userAnswerList } = this.state
    const { listQuestionId, id } = this.props.exam
    const correctList = listQuestionId.map(item => item.correctAnswer)
    let correctAnswerCount = 0
    for (let i = 0; i < userAnswerList.length; i++) {
      if (userAnswerList[i] === correctList[i][0]) {
        correctAnswerCount = correctAnswerCount + 1
      }
    }
    const length = listQuestionId.length
    const point = 10 * (correctAnswerCount / length)
    const payload = {
      id,
      answerUser: userAnswerList,
      point
    }
    const res = await BaseAPI.postData('test/submit', payload)
    if (res) {
      this.setState({ isSubmit: true, correctAnswerCount, questionCount: length })
    }
  }

  handleReviewMode=() => {
    console.log('review')
    this.setState({ isReview: true })
  }

  render () {
    const { listQuestionId, name, time } = this.props.exam
    const { isSubmit, correctAnswerCount, questionCount, isReview, answerUser } = this.state
    const { onCloseDetail } = this.props
    const timeBox = moment().add(time, 'minutes')
    console.log(timeBox)
    return (
      <Row>
        <Col>
          <Row justify='center'>
            <Col>
              <h1>{name}</h1>
            </Col>
          </Row>
          <Row justify='center'>
            <Col>
              {isSubmit
                ? <Button type='primary' onClick={onCloseDetail}>Back to courses</Button>
                : <Countdown timeTillDate={timeBox} timeFormat="MM DD YYYY, h:mm a" time={time}/>}
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
                          <Radio.Group onChange={e => this.handleSelectAnswer(e, key)}>
                            {question.answerList.map((answer, key) => (
                              <Radio key={key} name={key}
                                disabled={isReview && answer !== question.correctAnswer[0]}
                                value={answer}>
                                { isReview ? `${answer === question.correctAnswer[0] ? `${answer} (correct)` : `${answer}`}` : `${answer}`}
                              </Radio>
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
                          <Checkbox.Group onChange={value => this.handleMultiSelect(value, key)}>
                            {question.answerList.map((answer, key) => (
                              <Checkbox key={key} name={key} value={answer}>{answer}</Checkbox>
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
              <Button type='primary' onClick={this.handleSubmit}>Submit</Button>
            </Col>
            {isSubmit && <Result totalCount={questionCount} correctCount={correctAnswerCount} onCloseDetail={onCloseDetail} review={this.handleReviewMode}/>}
          </Row>
        </Col>
      </Row>
    )
  }
}
