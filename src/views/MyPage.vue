<template>
    <el-row>
        <navmenu index="1"/>
        <el-col :span="24" >
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>マイページ</span>
                </div>
                <el-col :span="9" :offset="2">
                    <div class="detailArea">
                        
                        <el-avatar id="avatar" :size="150" :src="circleUrl">
                        </el-avatar>
                        <div class="detailItem">
                            <p>ユーザ名</p>
                            <p v-if="refFlg" class="userNameArea">{{userDetail.uname}}</p>
                            <el-input v-if="!refFlg" class="userNameArea" v-model="tmpUname"></el-input>
                            <p>自己紹介 </p>
                            <p v-if="refFlg" class="descriptionArea"> {{userDetail.description}}</p>
                            <el-input v-if="!refFlg" type="textarea" :rows="2" class="userNameArea" v-model="tmpDescription"></el-input>
                            <div id="update-button-area">
                                <el-button
                                    v-if="refFlg" 
                                    id="modify-button"
                                    size="mini"
                                    type="success"
                                    @click="switchArea"
                                >編集
                                </el-button>
                                <el-button
                                    v-if="!refFlg" 
                                    id="cancel-button"
                                    size="mini"
                                    type="info"
                                    @click="switchArea"
                                >キャンセル
                                </el-button>
                                <el-button
                                    v-if="!refFlg" 
                                    id="update-button"
                                    size="mini"
                                    type="success"
                                    @click="updateUser"
                                >更新
                                </el-button>
                            </div>
                        </div>

                    </div>
                </el-col>
                <el-col :span="9" :offset="0">
                    <div class="detailArea">
                        <div class="block">
                            <p class="demonstration">進捗カレンダー</p>
                            <v-calendar :attributes="attrs"
                                        :columns="1"
                                        :max-date='new Date()'
                                        :is-expanded="true"
                                        @update:fromPage="move" 
                            >
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
                uid: undefined,
                //サーバから取得したユーザ情報
                userDetail: {},
                //サーバから取得した本の進捗情報
                userProgressList: {},
                //サーバから取得した本の進捗方法を日毎にサマリしたもの
                userProgressbyDateList: {},
                //userProgressbyDateListの日付のみを格納したList
                dateList: [],
                circleUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
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
            }
        },
        created: async function () {
            firebase.auth().onAuthStateChanged(user => {
                this.user = user ? user : {}
                if (user) {
                    this.refresh(this.user.uid)
                } else {
                }
            })
        },
        computed: {

        },
        methods: {
            getDateToPages: function (dateYYYYMMDD) {
                const result = this.userProgressbyDateList.filter(userProgress => {
                    return userProgress["ymd"]===dateYYYYMMDD
                })
                return result[0]["progress"]
            },
            refresh: async function (uid) {
                this.uid = uid
                this.attrs.dates = this.dateList
                this.getLastMonth
                await this.searchUser(uid)
                var dt = new Date();
                var y = dt.getFullYear();
                var m = ("00" + (dt.getMonth()+1)).slice(-2);
                var yyyymm = y + '' + m
                await this.searchUserProgress(uid, yyyymm)

            },
            addStyleTextColor: function(day) {
                if (day.weekday === 1) {
                    return {
                        color: "red"
                    };
                } else if (day.weekday === 7) {
                    return {
                        color: "#00c0ff"
                    };
                }
            },
            searchUser: async function (uid) {
                const url = 'http://localhost:8090/user/'+uid
                const res = await axios.get(url)
                this.userDetail = res.data.muserList[0]
            },
            updateUser: async function () {
                this.userRequest.uid = this.uid
                this.userRequest.uname = this.tmpUname
                this.userRequest.description = this.tmpDescription
                const url = 'http://localhost:8090/user'
                const res = await axios.put(url, this.userRequest)

                this.$message({
                    showClose: true,
                    message: 'Update Success!',
                    type: 'success'
                })

                this.switchArea()
                this.refresh(this.uid)

            },
            searchUserProgress: async function (uid, yyyymm) {
                const url = 'http://localhost:8090/user/progress/'+uid+ '/'+yyyymm
                const res = await axios.get(url)

                //日付のフォーマット
                var tmpList = []
                for(var tuserProgress of res.data.tuserProgressList) {
                    var tmp = tuserProgress
                    var ymdhms = tuserProgress.ymd
                    tmp.ymd = ymdhms.substr(0, 4) + ymdhms.substr(5, 2) + ymdhms.substr(8, 2)
                    tmpList.push(tmp)
                }
                this.userProgressList = tmpList

                //日付ごとに集約して、別のフィールド変数に格納
                //https://zukucode.com/2017/05/javascript-object-sql-group-by.html
                this.userProgressbyDateList = this.groupByYmd(this.userProgressList)
                console.log(this.userProgressbyDateList)
                if(this.userProgressbyDateList.length == 0) return
                var tmpdateList = this.userProgressbyDateList.map(function(row) {
                    return [row["ymd"]]
                }).reduce(function(a,b) {
                    return a.concat(b)
                })
                this.dateList = tmpdateList
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
            dateToYYYYMMDD: function(date) {
                var y = date.getFullYear();
                var m = ("00" + (date.getMonth()+1)).slice(-2);
                var d = ("00" + date.getDate()).slice(-2);
                var result = y + "" + m + "" + d;
                return result;
            },
            move: async function(page) {
                this.userProgressList = {}
                this.userProgressbyDateList = {}
                this.dateList = []
                var yyyymm = page.year + ("0"+page.month).slice(-2)
                await this.searchUserProgress(this.uid, yyyymm)
            },
            switchArea: function() {
                if(this.refFlg) {
                    //参照からフォームへ繊維
                    this.tmpUname = this.userDetail.uname
                    this.tmpDescription = this.userDetail.description
                } else {
                    this.tmpUname = ''
                    this.tmpDescription = ''
                }
                this.refFlg = !this.refFlg
            },
            getLastMonth: function() {
                var date = new Date();
                var year = date.getFullYear();
                var month = date.getMonth();

                var firstDayOfLastMonth = new Date(year, month-1, 1);
                this.firstDay = firstDayOfLastMonth
                console.log(this.firstDay)
            },

        }
    }
</script>

<style scoped lang="scss">
    @import "../styles/base";
    @import "../styles/colors";
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
        
    }
    .hanreiArea {
        margin-top:10px;
        overflow: hidden;
    }

    // .detailItem {
    //     float: right;
    // }
    // .detailArea {
    //     overflow: hidden;
    // }
    // #avatar {
    //     margin-top:10px;
    // }
    // #update-button {
    //     float:right;
    //     display:block;
    //     margin: 0 0 0 auto;
    // }
    #update-button-area {
        text-align: left;
    }

</style>
