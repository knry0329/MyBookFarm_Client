<template>
    <el-row :gutter="20">
        <navmenu index="1"/>
        <el-col :span="24" >
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>マイページ</span>
                </div>
                <el-col :span="9" :offset="3">
                    <!-- <div class="imageArea">
                        <img :src="bookDetail.Item.largeImageUrl"/>
                    </div> -->
                    <!-- </el-col>
                <el-col :span="6"> -->
                    <div class="detailArea">
                        
                        <el-avatar :size="100" :src="circleUrl">
                        </el-avatar>
                        <p>ユーザ名</p>
                        <p>{{userDetail.uname}}</p>
                        <p>自己紹介 </p>
                        <p> {{userDetail.description}}</p>
                    </div>
                </el-col>
                <el-col :span="9" :offset="0">
                    <div class="detailArea">
                        <!-- <p>書籍名: {{bookDetail.Item.title}}</p>
                        <p>著者: {{bookDetail.Item.author}}</p>
                        <p>ページ数: {{getPage()}}</p> -->
                        <div class="block">
                            <p class="demonstration">カレンダー</p>
                            <!-- <el-calendar v-model="nowDate"></el-calendar> -->
                            <v-calendar :attributes="attrs"
                                        :columns="1"
                                        :from-date="firstDay" >
                            </v-calendar>
                        </div>
                        <p>書籍メモ</p>
                    </div>
                </el-col>
            </el-card>
        </el-col>
    </el-row>
</template>

<script>
/* eslint-disable no-console */

    import axios from 'axios'
    import Navmenu from '../views/Navmenu'
    import bookApiConfig from '../config/bookapi'
    import firebase from 'firebase'

    export default {
        name: 'MyPage',
        components: { Navmenu },
        data () {
            return {
                first: undefined,
                uid: undefined,
                userDetail: {},
                bookUserRequest: {},
                userProgressList: {},
                userProgressbyDateList: {},
                nowdate: new Date(),
                attrs: [
                    {
                        key: 'today',
                        highlight: {
                            backgroundColor: '#ff8080',
                        },
                        dates: new Date(),
                        popover: {
                            label: 'メッセージを表示できます',
                        },
                    }
                ],
                circleUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
                firstDay: undefined

            }
        },
        created: async function () {
            firebase.auth().onAuthStateChanged(user => {
                this.first = this.getFirstDayOfLastMonth
                this.user = user ? user : {}
                if (user) {
                    this.refresh(this.user.uid)
                } else {
                }
            })
        },
        methods: {
            refresh: async function (uid) {
                this.uid = uid

                this.getLastMonth()
                //サーバのAPIからユーザの書籍情報を取得
                await this.searchUser(uid)

                var dt = new Date();
                var y = dt.getFullYear();
                var m = ("00" + (dt.getMonth()+1)).slice(-2);
                var yyyymm = y + '' + m

                await this.searchUserProgress(uid, yyyymm)
            },
            searchUser: async function (uid) {
                const url = 'http://localhost:8090/user/'+uid
                const res = await axios.get(url)
                console.log(res)
                this.userDetail = res.data.muserList[0]
            },
            searchUserProgress: async function (uid, yyyymm) {
                const url = 'http://localhost:8090/user/progress/'+uid+ '/'+yyyymm
                const res = await axios.get(url)
                console.log(res.data.tuserProgressList)
                var tmpList = []
                for(var tuserProgress of res.data.tuserProgressList) {
                    var tmp = tuserProgress
                    var ymdhms = tuserProgress.ymd
                    tmp.ymd = ymdhms.substr(0, 4) + ymdhms.substr(5, 2) + ymdhms.substr(8, 2)
                    tmpList.push(tmp)

                }
                console.log(tmpList)

                //resをフィールド変数に格納
                this.userProgressList = tmpList
                //日付ごとに集約して、別のフィールド変数に格納
                //https://zukucode.com/2017/05/javascript-object-sql-group-by.html
                this.userProgressbyDateList = this.groupByYmd(this.userProgressList)
                console.log(this.userProgressbyDateList)
            },
            groupByYmd: function(userProgressList) {
                var group = userProgressList.reduce(function (result, current) {
                    var element = result.find(function (p) {
                        return p.ymd === current.ymd
                    });
                    if (element) {
                        element.count ++; // count
                        element.progress += current.progress; // sum
                    } else {
                        result.push({
                            ymd: current.ymd,
                            count: 1,
                            progress: current.progress
                        });
                    }
                    return result;
                }, []);
                return group
            },
            getLastMonth: function() {
                var date = new Date();
                var year = date.getFullYear();
                var month = date.getMonth();

                var firstDayOfLastMonth = new Date(year, month-1, 1);
                this.firstDay = firstDayOfLastMonth
                console.log(this.firstDay)
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "../styles/base";
    .detailArea {
        text-align:left;
        padding-left:10em;
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
</style>
