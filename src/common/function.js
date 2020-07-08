// import validator from 'validator'
import moment from 'moment'
import { KEY_STORE } from './constants'
// import ReduxService from 'common/redux'
import { notification } from 'antd'
// import numeral from 'numbro'

export const saveDataLocal = (key, data) => {
  // eslint-disable-next-line no-undef
  localStorage.setItem(key, JSON.stringify(data))
}

export const getDataLocal = key => {
  // eslint-disable-next-line no-undef
  return JSON.parse(localStorage.getItem(key))
}

export const removeDataLocal = key => {
  // eslint-disable-next-line no-undef
  localStorage.removeItem(key)
}

export const updateDataLocal = (key, type, data) => {
  // eslint-disable-next-line no-undef
  const dataLocal = localStorage.getItem(key)
  switch (type) {
  case 'add':
    dataLocal.push(data)
    // eslint-disable-next-line no-undef
    localStorage.setItem(key, dataLocal)
    break
  case 'remove':
    // eslint-disable-next-line no-case-declarations
    const indexRemove = dataLocal.finIndex(item => item.id === data.id)
    dataLocal.splice(indexRemove, 1)
    // eslint-disable-next-line no-undef
    localStorage.setItem(key, dataLocal)
    break
  case 'update':
    // eslint-disable-next-line no-case-declarations
    const indexUpdate = dataLocal.finIndex(item => item.id === data.id)
    dataLocal.splice(indexUpdate, 1, data)
  }
}
export const showNotification = (
  title = 'Success',
  description = '',
  type = 'open'
) => {
  notification[type]({
    message: title,
    description: description || '',
    placement: 'bottomRight',
    className: 'notification-class',
    style: { background: 'white' },
    duration: 2
  })
}

export const shuffle = array => {
  let currentIndex = array.length
  let temporaryValue
  let randomIndex

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1

    // And swap it with the current element.
    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }

  return array
}

export const convertObjectToArray = objConvert => {
  const peopleArray = Object.keys(objConvert).map(i => objConvert[i])
  return peopleArray
}

export const getLength = value => {
  return value ? value.length : 0
}

export const lowerCase = value => {
  return value ? value.toLowerCase() : value
}

export const upperCase = value => {
  return value ? value.toUpperCase() : value
}

export const getAuthKey = () => {
  const data = getDataLocal(KEY_STORE.SET_USER)
  return data ? data.sig + '|' + data.address : ''
}

export const validateStringNumOnly = strNumber => {
  var reg = /^([0-9a-zA-Z]+)$/
  return reg.test(strNumber)
}

export const validateNumber = strNumber => {
  const reg = /^[0-9]+(\.)?[0-9]*$/
  return reg.test(strNumber)
}

export const validateInt = strNumber => {
  var reg = /^([0-9]+)$/
  return reg.test(strNumber)
}

export const validateEmail = email => {
  // eslint-disable-next-line no-useless-escape
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return !re.test(String(email).toLowerCase())
}

export const validatePw = pw => {
  var re = /^.*[0-9].*$/
  return re.test(pw)
}

export const formatDecimalJavascript = number => {
  return Math.round(number * 1e12) / 1e12
}

export const roundingNumber = (number, rounding = 7) => {
  const powNumber = Math.pow(10, parseInt(rounding))
  return Math.floor(number * powNumber) / powNumber
}

export const generateId = () => {
  let text = ''
  const possible = 'abcdefghijklmnopqrstuvwxyz'
  for (let i = 0; i < 16; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}

export const trimString = string => {
  return string ? string.trim() : ''
}

// export const isURL = str => {
//   return validator.isURL(str)
// }

export const convertDateMoment = (date = new Date(), type = 'HH:mm DD/MM/YYYY', isTimeStamp) => {
  const dateFormat = isTimeStamp ? new Date(date * 1000) : new Date(date)
  const strTime = moment(dateFormat).format(type)
  return strTime
}

export const convertDateByTimeZone = (time) => {
  const date = new Date(time).toString('HH')
  return date
}

export const convertDateFormat = strTimestamp => {
  const timeStamp = moment(strTimestamp).format('DD MMM YYYY')
  return timeStamp
}

export const calculateDiffDate = (date1 = new Date(), date2, type) => {
  const dateNow = moment(date1)
  const dateTxs = moment(date2)
  const payload = dateNow.diff(dateTxs, type)
  return payload
}

export const isValidJSONString = str => {
  try {
    JSON.parse(str)
  } catch (e) {
    return false
  }
  return true
}

export const isObject = value => {
  return value && typeof value === 'object' && value.constructor === Object
}
