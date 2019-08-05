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
                        <p>ユーザ名: {{userDetail.uname}}</p>
                    </div>
                </el-col>
                <el-col :span="9">
                    <div class="detailArea">
                        <!-- <p>書籍名: {{bookDetail.Item.title}}</p>
                        <p>著者: {{bookDetail.Item.author}}</p>
                        <p>ページ数: {{getPage()}}</p> -->
                        <div class="block">
                            <p class="demonstration">カレンダー</p>
                            <el-calendar v-model="nowDate"></el-calendar>
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
                userDetail: {},
                bookUserRequest: {},
                nowdate: new Date()

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
        methods: {
            refresh: async function (uid) {
                this.uid = uid
                //サーバのAPIからユーザの書籍情報を取得
                await this.searchUser(uid)
            },
            searchUser: async function (uid) {
                const url = 'http://localhost:8090/user/'+uid
                const res = await axios.get(url)
                console.log(res)
                this.userDetail = res.data.muserList[0]
            },
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
