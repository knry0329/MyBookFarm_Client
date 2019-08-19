<template>
  <el-row>
    <navmenu index="3"/>
    <el-col :span="24" >
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>マイ書籍</span>
        </div>
        <el-table
          :data="bookinfoList"
          style="width: 100%">
          <el-table-column
            prop="bookinfo.volumeInfo.authors"
            label="著者"/>
          <el-table-column
            prop="bookinfo.volumeInfo.title"
            label="タイトル"/>
          <el-table-column
            label="画像">
            <template slot-scope="scope">
              <img v-if="'imageLinks' in scope.row.bookinfo.volumeInfo" :src="scope.row.bookinfo.volumeInfo.imageLinks.thumbnail" />
            </template>
          </el-table-column>
          <el-table-column
            prop="operation"
            label="詳細"
            align="left">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="success"
                plain
                v-on:click="gotoDetail(scope.row.isbn.isbn)">詳細
              <!-- <router-link :to="{ name: 'bookDetail', params: { isbn: scope.row.Item.isbn }}">詳細</router-link> -->
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="isbn.label"
            label="ステータス"/>

        </el-table>            
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
/* eslint-disable no-console */

import axios from 'axios'
import Navmenu from '../components/Navmenu'
import firebase from 'firebase'
import bookApi from '../api/bookapi'

export default {
  name: 'MyBookList',
  components: { Navmenu },
  data () {
    return {
      bookRequest: {
        bookName: undefined,
        isbn: undefined
      },
      isbnList: [],
      bookList: [],
      user: {},
      bookinfoList: []
    }
  },
  created: async function () {
    firebase.auth().onAuthStateChanged(user => {
      this.user = user ? user : {}
      console.log(this.user.uid)
      if (user) {
        this.refresh(this.user.uid)
      } 
    })
  },
  methods: {
    refresh: async function (uid) {
      const res = await axios.get('http://localhost:8090/book/'+uid)
      this.isbnList = res.data.rbookUserList
      let tmpList = []
      await this.isbnList.forEach(async ob => {
        ob = this.statusToLabel(ob)
        let tmpbookinfo = {}
        tmpbookinfo.isbn = ob
        tmpbookinfo.bookinfo = await this.searchBookIsbn(ob.isbn)
        if (tmpbookinfo.bookinfo.volumeInfo.authors) {
          tmpbookinfo.bookinfo.volumeInfo.authors = tmpbookinfo.bookinfo.volumeInfo.authors.join(',')
        }
        tmpList.push(tmpbookinfo)
      })
      this.bookinfoList = tmpList
      console.log(this.bookinfoList)

    },
    searchBookIsbn: async function (isbn) {
      const res = await bookApi.searchBookIsbn(isbn)
      this.bookList.push(res.data.items[0])
      return res.data.items[0]
    },
    statusToLabel: function(ob) {
      let label
      switch (ob.status){
      case '0':
        label='未読'
        break
      case '1':
        label='読書中'
        break
      case '2':
        label='読了'
        break
      default:
        break
      }
      ob.label=label
      return ob
    },
    // bookDetail: async function (isbn) {
    //     this.bookRequest.isbn = isbn
    //     await axios.get('http://localhost:8090/book', this.bookRequest)
    //     await this.refresh()
    //     this.$message({
    //         showClose: true,
    //         message: 'get book Success!',
    //         type: 'success'
    //     })
    //     this.bookRequest.isbn = undefined
    //     this.bookRequest.address = undefined
    // },
    gotoDetail: function (isbn) {
      this.$router.push({ name: 'myBookDetail', params: { isbn: isbn }})
    }
  }
}
</script>

<style scoped lang="scss">
    @import "../styles/base";
</style>
