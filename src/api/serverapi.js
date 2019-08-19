import globalConfig from '../config/globalconfig'
import axios from 'axios'

const SERVER_HOST = globalConfig.server_url
export default {
  searchUserProgress: async function(uid) {
    const url = SERVER_HOST + '/user/progress/' +uid
    const res = await axios.get(url)
    return res
  },
  searchUserProgressYYYYMM: async function(uid, yyyymm) {
    const url = SERVER_HOST + '/user/progress/'+uid+ '/'+yyyymm
    const res = await axios.get(url)
    return res
  },
  registUserProgress: async function(userProgressRequest) {
    const url = SERVER_HOST + '/user/progress'
    const res = await axios.post(url, userProgressRequest)

  },
  searchBookUser: async function (uid, isbn) {
    const url = SERVER_HOST +'/book/'+uid+'/'+isbn
    const res = await axios.get(url)
    return res
  },
  searchUserBook: async function(uid) {
    const url = SERVER_HOST + '/book/'+uid
    const res = await axios.get(url)
    return res
  },
  registUserBook: async function(bookRequest) {
    const url = SERVER_HOST +'/book'
    const res = await axios.post(url, bookRequest)

  },
  updateUserBook: async function(bookUserRequest) {
    const url = SERVER_HOST +'/book'
    const res = await axios.put(url, bookUserRequest)
  },
  searchUser: async function (uid) {
    const url = SERVER_HOST +'/user/'+uid
    const res = await axios.get(url)
    return res
  },
  registUser: async function(userRequest) {
    const url = SERVER_HOST +'/user'
    await axios.post(url, userRequest)
  },
  updateUser: async function (userRequest) {
    const url = SERVER_HOST +'/user'
    await axios.put(url, userRequest)
  },
  searchUserOnIsbn: async function(isbn) {
    const url = SERVER_HOST +'/user/search?isbn='+isbn
    const res = await axios.get(url)
    return res
  },

}