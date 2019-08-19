import bookApiConfig from '../config/bookapiconfig'
import axios from 'axios'

export default {
  searchBookIsbn: async function(isbn) {
    const url = 
    bookApiConfig.urlGoogleBooks
    + '?q=isbn:'
    + isbn
    const res = await axios.get(url)
    return res
  },

  searchBook: async function (bookName) {
    const url = 
    bookApiConfig.urlGoogleBooks
    + '?q='
    + bookName
    + '&maxResults=40'
    const res = await axios.get(url)
    return res
  }
}