<template>
  <el-row>
    <navmenu index="2"/>
    <el-col :span="24">
      <el-card class="box-card box-card-wrapper">
        <div slot="header">
          <span>書籍入力</span>
        </div>
        <el-row class="row-wrapper">
          <el-col :span="12">
            <span>名称</span>
          </el-col>
          <el-col :span="12">
            <el-input
              v-model="bookRequest.bookName"
              placeholder="本のタイトルを入力"
              clearable>
            </el-input>
          </el-col>
        </el-row>
        <el-row class="row-wrapper">
          <el-col :span="24">
            <el-button
              type="success"
              plain
              @click="searchBook">検索</el-button>
          </el-col>
        </el-row>
      </el-card>
    </el-col>
    <el-col :span="24" v-if="searchedBookList.length > 0">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>検索結果一覧</span>
        </div>
        <el-table
          :data="searchedBookList"
          style="width: 100%">
          <el-table-column
            prop="volumeInfo.industryIdentifiers[0].identifier"
            label="ISBNコード"/>
          <el-table-column
            prop="volumeInfo.authors"
            label="著者"/>
          <el-table-column
            prop="volumeInfo.title"
            label="タイトル"/>
          <el-table-column
            label="画像">
            <template slot-scope="scope">
              <img v-if="'imageLinks' in scope.row.volumeInfo" :src="scope.row.volumeInfo.imageLinks.thumbnail" />
              <div v-else>No Image</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="operation"
            label="Ops"
                            
            align="left">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="success"
                plain
                :disabled="scope.row.volumeInfo.industryIdentifiers==undefined || scope.row.volumeInfo.industryIdentifiers.length ==0"
                @click="registbook(scope.row.volumeInfo.industryIdentifiers[0].identifier)">MyBookに追加</el-button>
            </template>
          </el-table-column>
        </el-table>            
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
/* eslint-disable no-console */

import axios from 'axios'
import Navmenu from '../components/Navmenu'
import bookApiConfig from '../config/bookapiconfig'
import bookApi from '../api/bookapi'
import serverApi from '../api/serverapi'
import firebase from 'firebase'

export default {
  name: 'SearchBook',
  components: { Navmenu },
  data () {
    return {
      request: {
        name: undefined,
        symbol: undefined,
      },
      bookRequest: {
        uid: undefined,
        isbn: undefined
      },
      searchedBookList: []
    }
  },
  created: async function () {
    await this.refresh()
    let user = await firebase.auth().currentUser
    this.bookRequest.uid = user.uid
  },
  methods: {
    refresh: async function () {
    },
    searchBook: async function () {
      // const url = 'https://www.googleapis.com/books/v1/volumes?q=' + this.request.bookName
      const res = await bookApi.searchBook(this.bookRequest.bookName)
      // const newItems = res.data.items.filter(n => n.volumeInfo.industryIdentifiers !== undefined)
      // res.data.items = newItems
      res.data.items.forEach((val) => {
        if (val.volumeInfo.authors) {
          val.volumeInfo.authors = val.volumeInfo.authors.join(',')
        }
        // if(!val.volumeInfo.industryIdentifiers) {
        //     console.log(val.volumeInfo)
        //     res.data.items.splice(index, 1)
        // }
        if (val.volumeInfo.industryIdentifiers) {
          const newArray = val.volumeInfo.industryIdentifiers.filter(n => n.type==='ISBN_10')
          val.volumeInfo.industryIdentifiers = newArray
          // val.volumeInfo.industryIdentifiers.forEach((v, i) => {
          //     if(v.type ==='ISBN_13') {
          //         val.volumeInfo.industryIdentifiers.splice(i, 1)
          //     }
          // })
          console.log(val.volumeInfo.industryIdentifiers)
        }
      })
      this.searchedBookList = res.data.items
      console.log(res)
      this.bookRequest.bookName = undefined
      this.bookRequest.isbn = undefined
    },
    registbook: async function (isbn) {
      this.bookRequest.isbn = isbn
      await serverApi.registUserBook(this.bookRequest)
      await this.refresh()
      this.$message({
        showClose: true,
        message: 'Register Book Success!',
        type: 'success'
      })
      this.bookRequest.isbn = undefined
    },
    authorSplit: function(arr) {
      return arr
    }
  }
}
</script>

<style scoped lang="scss">
    @import "../styles/base";
</style>