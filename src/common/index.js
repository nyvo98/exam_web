import { getDataLocal } from './function'
import { KEY_STORE, REQUEST_TYPE } from './constants'
import axios from 'axios'
import QueryString from 'query-string'

export default class BaseAPI {
  static async getData (type, queryBody) {
    return this.postGateWay(type, REQUEST_TYPE.GET, undefined, queryBody)
  }

  static async postData (type, body) {
    return this.postGateWay(type, REQUEST_TYPE.POST, body)
  }

  static async putData (type, body) {
    return this.postGateWay(type, REQUEST_TYPE.PUT, body)
  }

  static async deleteData (type, queryBody) {
    return this.postGateWay(type, REQUEST_TYPE.DELETE, undefined, queryBody)
  }

  static async getDataByMe (type, id) {
    return this.postGateWay(type + `/me/${id}`)
  }

  static async getConfigByType (param) {
    return this.postGateWay(`config/type/${param}`)
  }

  static async getConfigByTypeMultiple (body) {
    return this.postGateWay('config/typeMultiple', REQUEST_TYPE.POST, { setting: body })
  }

  static async postGateWay (action, method = REQUEST_TYPE.GET, body, queryBody) {
    try {
      const serverUrl = process.env.EXAM_SERVER_API || 'http://doquizz.ddns.net:3031/api/'
      // const serverUrl = process.env.EXAM_SERVER_API || 'http://192.168.0.144:3031/api/'
      console.log(serverUrl)
      const token = getDataLocal(KEY_STORE.JWT_TOKEN)
      const config = {
        headers: {
          os: 'website',
          Authorization: 'Bearer ' + token
        }
      }
      const axiosInstance = axios.create(config)
      let queryStr = ''
      if (queryBody) {
        const queryFly = QueryString.stringify(queryBody)
        queryStr = '?' + queryFly
      }
      const response = await axiosInstance[method](serverUrl + action + queryStr, body, config)
      console.log('response', response)
      if (response.status === 200) {
        return response.data
      } else {
        return null
      }
    } catch (error) {
      console.log(error)
      return null
    }
  }
}
