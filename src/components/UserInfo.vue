<template>
  <el-row>
    <navmenu :index="navIndex" />
    <el-col :span="24" >
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>
            <slot name="header"> {{userDetail.uname}}さんのページ </slot>
          </span>
        </div>
        <el-col :span="8" :offset="2">
          <div class="detailArea">
                        
            <el-avatar id="avatar" :size="150" :src="circleUrl">
            </el-avatar>
            <div class="detailItem">
              <p class="label">ユーザ名</p>
              <p v-if="refFlg" class="userNameArea">{{userDetail.uname}}</p>
              <el-input v-if="!refFlg" class="userNameArea" v-model="tmpUname"></el-input>
              <p class="label">自己紹介 </p>
              <!-- https://qiita.com/koji77/items/435c2410d9fd7d622f4c -->
              <p v-if="refFlg" style="white-space:pre-wrap; word-wrap:break-word;" class="descriptionArea">{{userDetail.description}}</p>
              <el-input v-if="!refFlg" type="textarea" :rows="5" class="userNameArea" v-model="tmpDescription"></el-input>
              <template v-if="!userRefFlg"> 
                <div id="update-button-area">
                  <el-button
                    v-if="refFlg" 
                    id="modify-button"
                    size="mini"
                    type="success"
                    plain
                    @click="switchArea">編集
                  </el-button>
                  <el-button
                    v-if="!refFlg" 
                    id="cancel-button"
                    size="mini"
                    type="info"
                    plain
                    @click="switchArea">キャンセル
                  </el-button>
                  <el-button
                    v-if="!refFlg" 
                    id="update-button"
                    size="mini"
                    type="success"
                    plain
                    @click="updateUser">更新
                  </el-button>
                </div>
              </template>
            </div>
          </div>
        </el-col>
        <el-col :span="8" :offset="4">
          <div class="detailArea">
            <div class="block">
              <p class="demonstration label">進捗カレンダー
              <el-tooltip placement="top-end" effect="light">
                <div slot="content">たくさん本を読んだ日ほど、カレンダーの緑色が濃くなります。<br /> 草を生やしまくりましょう。</div>
                <i class="el-icon-question"></i>
              </el-tooltip>

              </p>
              <v-calendar :attributes="attrs"
                          :columns="1"
                          :max-date='new Date()'
                          :is-expanded="true"
                          @update:fromPage="move">
                <template slot='day-content' slot-scope='props'>
                  <div class="vc-day-content">
                    <div v-bind:style="addStyleTextColor(props.day)">
                      {{ props.day.day }}</div>
                  </div>
                  <template v-if="dateList.indexOf(dateToYYYYMMDD(props.day.date)) >= 0" style="text-align:center;">
                    <div class="square_0" v-if="getDateToPages(dateToYYYYMMDD(props.day.date)) <= 0" ></div>
                    <div class="square_1" v-if="0 < getDateToPages(dateToYYYYMMDD(props.day.date)) && getDateToPages(dateToYYYYMMDD(props.day.date)) < 30" ></div>
                    <div class="square_2" v-else-if="30 <= getDateToPages(dateToYYYYMMDD(props.day.date)) && getDateToPages(dateToYYYYMMDD(props.day.date)) < 50" ></div>
                    <div class="square_3" v-else-if="50 <= getDateToPages(dateToYYYYMMDD(props.day.date)) && getDateToPages(dateToYYYYMMDD(props.day.date)) < 70" ></div>
                    <div class="square_4" v-else-if="70 <= getDateToPages(dateToYYYYMMDD(props.day.date)) && getDateToPages(dateToYYYYMMDD(props.day.date)) < 100" ></div>
                    <div class="square_5" v-else-if="100 <= getDateToPages(dateToYYYYMMDD(props.day.date)) " ></div>
                  </template>
                  <template v-if="dateList.indexOf(dateToYYYYMMDD(props.day.date)) < 0" style="text-align:center;">
                    <div class="square_0"></div>
                  </template>
                </template>
              </v-calendar>
            </div>
            <div class='hanreiArea'>
              <div class="hanrei">　少ない　</div>
              <div class="square_0 hanrei"></div>
              <div class="square_1 hanrei"></div>
              <div class="square_2 hanrei"></div>
              <div class="square_3 hanrei"></div>
              <div class="square_4 hanrei"></div>
              <div class="square_5 hanrei"></div>
              <div class="hanrei">　多い　</div>
            </div>
          </div>
        </el-col>
        <el-col :span="20" :offset="2">
          <div class="userBook">
            <p class="label">
              <slot name="userBook"> {{userDetail.uname}}さんが読んでいる本 </slot>
            </p>
            <!-- vforつかって、componentを回す感じだと思う。 -->
            <div class="userBookList" v-for="bookinfo in bookinfoList" v-bind:key="bookinfo.bookinfo.id">
              <el-link type="success" @click="gotoBookDetail(uid, bookinfo.isbn.isbn)">
                <img v-if="'imageLinks' in bookinfo.bookinfo.volumeInfo" :src="bookinfo.bookinfo.volumeInfo.imageLinks.thumbnail" />
                <div>
                  {{bookinfo.bookinfo.volumeInfo.title}}
                </div>
              </el-link>
            </div>
          </div>
        </el-col>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
/* eslint-disable no-console */

import axios from 'axios'
import Navmenu from '../components/Navmenu'
import bookApi from '../api/bookapi'
import serverApi from '../api/serverapi'

export default {
  name: 'UserInfo',
  components: { Navmenu },
  data () {
    return {
      uid: undefined,
      //サーバから取得したユーザ情報
      userDetail: {},
      //サーバから取得した本の進捗情報
      userProgressList: {},
      //サーバから取得した本の進捗方法を日毎にサマリしたもの
      userProgressbyDateList: {},
      //userProgressbyDateListの日付のみを格納したList
      dateList: [],
      circleUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
      firstDay: undefined,
      attrs: [
        {
          key: 'today',
          color: 'red',
          dot: true,
          dates: undefined,
          popover: {
            label: 'メッセージを表示できます',
          },
        }
      ],
      refFlg: true,
      userRequest: {},
      tmpUname: undefined,
      tmpDescription: undefined,
      isbnList: [],
      bookinfoList: [],
      bookList: [],
    }
  },
  props: ['myuid', 'userRefFlg', 'navIndex'],
  mounted: async function () {
    // this.refresh(this.propuid)
  },
  computed: {

  },
  methods: {
    getDateToPages: function (dateYYYYMMDD) {
      const result = this.userProgressbyDateList.filter(userProgress => {
        return userProgress['ymd']===dateYYYYMMDD
      })
      return result[0]['progress']
    },
    refresh: async function (uid) {
      console.log(uid)
      this.uid = uid
      // this.attrs.dates = this.dateList
      // this.getLastMonth
      await this.searchUser(uid)
      let dt = new Date()
      let y = dt.getFullYear()
      let m = ('00' + (dt.getMonth()+1)).slice(-2)
      let yyyymm = y + '' + m
      await this.searchUserProgress(uid, yyyymm)

      await this.searchUserBook(uid)

    },
    searchUserBook: async function(uid) {
      const res = await serverApi.searchUserBook(uid)
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

    addStyleTextColor: function(day) {
      if (day.weekday === 1) {
        return {
          color: 'red'
        }
      } else if (day.weekday === 7) {
        return {
          color: '#00c0ff'
        }
      }
    },
    searchUser: async function (uid) {
      const res = await serverApi.searchUser(uid)
      this.userDetail = res.data.muserList[0]
      console.log(this.userDetail)
    },
    updateUser: async function () {
      this.userRequest.uid = this.uid
      this.userRequest.uname = this.tmpUname
      this.userRequest.description = this.tmpDescription
      await serverApi.updateUser(this.userRequest)
      this.$message({
        showClose: true,
        message: 'Update Success!',
        type: 'success'
      })

      this.switchArea()
      this.refresh(this.uid)

    },
    searchUserProgress: async function (uid, yyyymm) {
      const res = await serverApi.searchUserProgressYYYYMM(uid, yyyymm)

      //日付のフォーマット
      let tmpList = []
      for (let tuserProgress of res.data.tuserProgressList) {
        let tmp = tuserProgress
        let ymdhms = tuserProgress.ymd
        tmp.ymd = ymdhms.substr(0, 4) + ymdhms.substr(5, 2) + ymdhms.substr(8, 2)
        tmpList.push(tmp)
      }
      this.userProgressList = tmpList

      //日付ごとに集約して、別のフィールド変数に格納
      //https://zukucode.com/2017/05/javascript-object-sql-group-by.html
      this.userProgressbyDateList = this.groupByYmd(this.userProgressList)
      if (this.userProgressbyDateList.length == 0) return
      let tmpdateList = this.userProgressbyDateList.map(function(row) {
        return [row['ymd']]
      }).reduce(function(a, b) {
        return a.concat(b)
      })
      this.dateList = tmpdateList
    },
    groupByYmd: function(userProgressList) {
      let group = userProgressList.reduce(function (result, current) {
        let element = result.find(function (p) {
          return p.ymd === current.ymd
        })
        if (element) {
          element.count ++ // count
          element.progress += current.progress // sum
        } else {
          result.push({
            ymd: current.ymd,
            count: 1,
            progress: current.progress
          })
        }
        return result
      }, [])
      return group
    },
    dateToYYYYMMDD: function(date) {
      let y = date.getFullYear()
      let m = ('00' + (date.getMonth()+1)).slice(-2)
      let d = ('00' + date.getDate()).slice(-2)
      let result = y + '' + m + '' + d
      return result
    },
    move: async function(page) {
      this.userProgressList = {}
      this.userProgressbyDateList = {}
      this.dateList = []
      let yyyymm = page.year + ('0'+page.month).slice(-2)
      await this.searchUserProgress(this.uid, yyyymm)
    },
    switchArea: function() {
      if (this.refFlg) {
        //参照からフォームへ遷移
        this.tmpUname = this.userDetail.uname
        this.tmpDescription = this.userDetail.description
      } else {
        this.tmpUname = ''
        this.tmpDescription = ''
      }
      this.refFlg = !this.refFlg
    },
    getLastMonth: function() {
      let date = new Date()
      let year = date.getFullYear()
      let month = date.getMonth()

      let firstDayOfLastMonth = new Date(year, month-1, 1)
      this.firstDay = firstDayOfLastMonth
    },
    gotoBookDetail: function(uid, isbn) {
      //引数のuidとpropsのmyuidが一致すればmybookdetail、そうでなければbookdetail
      if (uid === this.myuid) {
        this.$router.push({ name: 'myBookDetail', params: { isbn: isbn }})
      } else {
        this.$router.push({ name: 'bookDetail', params: { uid: uid, isbn: isbn }}) 
      }
    },
            
  }
}
</script>

<style scoped lang="scss">
    @import "../styles/base";
    @import "../styles/colors";
    .userBookList {
        text-align:center;
        display: inline-block;
        margin:1em;
    }
    .detailArea {
        text-align:left;
        // padding-left:10em;
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
    @mixin square-mixin($color) {
        text-align:center;
        margin:auto;
        width:20px;
        height:20px;
        background:$color;
        border:solid 1px #efefef;
    }
    .square_0 {
        @include square-mixin($COLOR_0)
    }
    .square_1 {
        @include square-mixin($COLOR_1)
    }
    .square_2 {
        @include square-mixin($COLOR_2)
    }
    .square_3 {
        @include square-mixin($COLOR_3)
    }
    .square_4 {
        @include square-mixin($COLOR_4)
    }
    .square_5 {
        @include square-mixin($COLOR_5)
    }
    .hanrei {
        float: right;
        font-size:60%
        
    }
    .hanreiArea {
        margin-top:10px;
        overflow: hidden;
    }
    .label {
        border-bottom: solid 1px #efefef;
    }
    #update-button-area {
        text-align: left;
    }
    .userBook {
        text-align:left;
    }

</style>
