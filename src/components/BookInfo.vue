<template>
  <el-row>
    <navmenu :index="navIndex"/>
    <el-col :span="24" v-loading="loading" >
      <el-card class="box-card">
        <div class="clearfix">
          <slot name="header">マイ書籍詳細</slot>
        </div>
        <el-col :span="2" :offset="3">
          <div class="imageArea">
            <!-- <img :src="bookDetail.Item.largeImageUrl"/> -->
            <el-image  v-if="'imageLinks' in bookDetail" :src="bookDetail.imageLinks.thumbnail"/>
          </div>
        </el-col>
        <el-col :span="6" :offset="1">
          <div class="detailArea">
            <p class="label">書籍名:</p> 
            <p>{{bookDetail.title}}</p>
            <p class="label">著者</p>
            <p> {{!Array.isArray(bookDetail.authors) ? bookDetail.authors : bookDetail.authors.join(',')}}</p>
            <p class="label">ページ数:</p>
            <p> {{getPage()== -1? "不明" : getPage()}}</p>
          </div>
        </el-col>
        <el-col :span="7" :offset="1">
          <div class="progressArea">
            <div class="block">
              <p class="label">進捗
              <el-tooltip class="" effect="light" content="読みすすめたページ数に更新してください。" placement="top-end">
                <i class="el-icon-question"></i>
              </el-tooltip>
              </p>
              <template v-if="!userRefFlg">
                <el-slider 
                  v-model="bookUserDetail.progress"
                  :min=0
                  :max="getPage()"
                  show-input></el-slider>
              </template>
              <template v-else>
                <el-slider 
                  v-model="bookUserDetail.progress"
                  :min=0
                  :max="getPage()"
                  show-input
                  disabled></el-slider>
              </template>

            </div>
            <div id="progress-switch">
              <template v-if="!userRefFlg">
                <el-switch
                  v-model="bookUserDetail.progress"
                  active-text="読み終わりました！"
                  :active-value="getPage()">
                </el-switch>
              </template>
              <template v-else>
                <el-switch
                  v-model="bookUserDetail.progress"
                  active-text="読み終わりました！"
                  :active-value="getPage()"
                  disabled>
                </el-switch>
              </template>
            </div>
            <p class="label" style="margin-top:2em;">書籍メモ
                                                     <el-tooltip class="" effect="light" content="学んだことや共有したいことをメモしておきましょう。" placement="top-end">
                                                       <i class="el-icon-question"></i>
                                                     </el-tooltip>
                                                     <template v-if="!userRefFlg">
                                                       <el-link v-if="refFlg" type="success" style="margin-left:1em;" @click="switchArea()">編集</el-link>
                                                       <el-link v-if="!refFlg" type="success" style="margin-left:1em;" @click="switchArea()">キャンセル</el-link>
                                                     </template>
            </p>
            <!-- <markdown v-model="memo1"/> -->
            <p v-if="refFlg" style="white-space:pre-wrap; word-wrap:break-word;" class="descriptionArea">{{bookUserDetail.memo}}</p>
            <el-input
              v-if="!refFlg"
              type="textarea"
              :rows="5"
              placeholder="Please input"
              v-model="bookUserDetail.memo">
            </el-input>
            <div id="update-button-area">
              <template v-if="!userRefFlg">
                <el-button 
                  id="update-button"
                  size="mini"
                  type="success"
                  plain
                  v-on:click="updateUserBook()">更新
                </el-button>
              </template>
            </div>
          </div>
        </el-col>
        <el-col :span="14" :offset="6">
          <div id="logArea">
            <p class="label">読書ログ</p>
          </div>
          <el-table
            :data="userProgressList"
            style="width: 100%">
            <el-table-column
              prop="ymd"
              label="更新した時間"/>
            <el-table-column
              prop="progress"
              label="進捗">
              <template slot-scope="scope">
                <div v-if="scope.row.progress > 0">{{scope.row.progress}}ページ読み進めました！</div> 
                <div v-else-if="scope.row.progress < 0">{{scope.row.progress * (-1)}}ページ戻りました。</div> 
                <div v-else-if="scope.row.progress == 0"> - </div> 
              </template>
            </el-table-column>
          </el-table>            
        </el-col>
        <el-col :span="14" :offset="6">
          <div id="relationArea">
            <p class="label">この本を読んでいる他のユーザ</p>
            <user-summary
              v-for="user in userList" v-bind:key="user.uid" 
              :uid="user.uid"
              :uname="user.uname"></user-summary>
          </div>
        </el-col>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import axios from 'axios'
import Navmenu from '../components/Navmenu'
import UserSummary from '../components/UserSummary'
import dateutil from '../util/dateutil'
import firebase from 'firebase'
import bookApi from '../api/bookapi'
import serverApi from '../api/serverapi'

export default {
  name: 'BookInfo',
  components: { Navmenu, UserSummary },
  data () {
    return {
      uid: undefined,
      isbn: undefined,
      beforeProgress: undefined,
      bookDetail: {},
      bookUserDetail: {},
      userProgressList: [],
      bookUserRequest: {},
      userProgressRequest: {},
      loading: false,
      refFlg: true,
      tmpMemo: undefined,
      userList: [],
    }
  },
  props: ['propuid', 'propisbn', 'userRefFlg', 'navIndex'],
  created: function () {
    // firebase.auth().onAuthStateChanged(user => {
    //     this.user = user ? user : {}
    //     if (user) {
    //         this.refresh(this.user.uid)
    //     } else {
    //     }
    // })
  },
  methods: {
    refresh: async function (uid) {
      this.isbn = this.$route.params.isbn
      this.uid = uid
      //書籍APIから書籍情報を取得
      this.searchBookIsbn()
      //サーバのAPIからユーザの書籍情報を取得
      this.searchBookUser(uid)
      //書籍の進捗状況を確認
      this.searchUserProgress(uid, this.isbn)
      //同じ本を読んでいるユーザを検索
      this.searchUserOnIsbn(this.isbn)
    },
    searchUserProgress: async function(uid, isbn) {
      const res = await serverApi.searchUserProgress(uid)
      this.userProgressList = res.data.tuserProgressList.filter(obj => obj.isbn == isbn)

    },
    searchBookIsbn: async function () {
      const res = await bookApi.searchBookIsbn(this.isbn)
      this.bookDetail = res.data.items[0].volumeInfo
    },
    searchBookUser: async function (uid) {
      const res = await serverApi.searchBookUser(uid, this.isbn)
      this.bookUserDetail = res.data.rbookUserList[0]
      this.beforeProgress = res.data.rbookUserList[0].progress
    },
    updateUserBook: async function() {
      this.loading = true
      this.bookUserRequest.uid = this.uid
      this.bookUserRequest.isbn = this.isbn
      this.bookUserRequest.progress = this.bookUserDetail.progress
      this.bookUserRequest.status = this.updateStatus(this.getPage(), this.bookUserDetail.progress)
      this.bookUserRequest.memo = this.bookUserDetail.memo
      const res = await serverApi.updateUserBook(this.bookUserRequest)
                
      this.userProgressRequest.uid = this.uid
      this.userProgressRequest.ymd = dateutil.formatDate(new Date(), 'YYYY-MM-DD hh:mm:ss')
      this.userProgressRequest.kbn = '0'
      this.userProgressRequest.isbn = this.isbn
      let nowProgress = this.bookUserRequest.progress - this.beforeProgress
      this.userProgressRequest.progress = nowProgress
      const res_progress = serverApi.registUserProgress(this.userProgressRequest)

      this.bookRequest = {}
      this.userProgressRequest = {}

      this.$message({
        showClose: true,
        message: 'Update Success!',
        type: 'success'
      })

      this.loading = false
      this.$router.push({ name: 'mybook'})
    },
    getPage: function() {
      // if(!("pageCount" in this.bookDetail)) {
      //     return 1
      // }
      return Number(this.bookDetail.pageCount)
    },
    updateStatus: function(pageCount, progress) {
      if (progress == 0) return 0
      if (progress == pageCount) return 2
      return 1
    },
    switchArea: function() {
      if (this.refFlg) {
        //参照からフォームへ遷移
        this.tmpMemo = this.bookUserDetail.memo
      } else {
        this.bookUserDetail.memo = this.tmpMemo 
        this.tmpMemo = undefined
      }
      this.refFlg = !this.refFlg
    },
    searchUserOnIsbn: async function(isbn) {
      const res = await serverApi.searchUserOnIsbn(isbn)
      let result = res.data.muserList.filter(val => {
        return val.uid !== this.uid
      })
      this.userList = result
      // this.userList = res.data.muserList
      console.log(this.userList.muserList)

    }

  }
}
</script>

<style scoped lang="scss">
    @import "../styles/base";
    .label {
        border-bottom: solid 1px #efefef;
    }
    .detailArea {
        text-align:left;
        // padding-left:2em;
    }
    .progressArea {
        text-align:left;
    }
    #relationArea {
        text-align:left;
        margin-top:1em;
    }
    .box-card {
        padding-bottom: 200px;
    }
    #update-button {
        margin-top: 1em;
    }
    #update-button-area {
        text-align:right;
    }
    #progress-switch {
        margin-top:1em;
    }
    #logArea {
        text-align:left;
        margin-top: 2em;
    }
    #relationArea {
        text-align:left;
        margin-top: 2em;
    }
</style>
