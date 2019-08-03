<template>
    <el-row :gutter="20">
        <navmenu :activeindex="4"/>
        <el-col :span="24" >
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>書籍詳細</span>
                </div>
                <el-col :span="12">
                    <div class="imageArea">
                        <img :src="bookDetail.Item.largeImageUrl" />
                    </div>

                </el-col>
                <el-col :span="12">
                    <div class="detailArea">
                        <p>書籍名: {{bookDetail.Item.title}}</p>
                        <p>著者: {{bookDetail.Item.author}}</p>
                        <div class="block">
                            <span class="demonstration">読み進め度</span>
                            <el-slider 
                                v-model="bookUserDetail.progress"
                                :step="10"
                                show-stops
                                :marks="marks"
                                :change="onChange()"></el-slider>
                        </div>
                        <el-button
                            size="mini"
                            type="success"
                            v-on:click="updateUserBook()"
                        >更新
                        </el-button>
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
        name: 'BookDetail',
        components: { Navmenu },
        data () {
            return {
                uid: undefined,
                isbn: undefined,
                bookDetail: {},
                bookUserDetail: {},
                marks: {
                    100: '完了！'
                },
                bookUserRequest: {
                    uid: undefined,
                    isbn: undefined,
                    progress: undefined
                }
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
                this.isbn = this.$route.params.isbn
                //書籍APIから書籍情報を取得
                this.searchBookIsbn()

                //サーバのAPIからユーザの書籍情報を取得
                this.searchBookUser(uid)

                this.uid = uid
            },
            searchBookIsbn: async function () {
                const url = 
                    bookApiConfig.url
                    + '?applicationId=' 
                    + bookApiConfig.appKey
                    + '&isbn='
                    + this.isbn
                console.log('url : '+ url)
                const res = await axios.get(url)
                console.log('res : ' + res)
                this.bookDetail = res.data.Items[0]
                console.log(this.bookdetail)
                // return res
            },
            searchBookUser: async function (uid) {
                const url = 'http://localhost:8090/book/'+uid+'/'+this.isbn
                const res = await axios.get(url)
                this.bookUserDetail = res.data.rbookUserList[0]
                console.log(this.bookUserDetail.isbn)
            },
            onChange:function() {
                console.log("hoge")
                console.log(this.bookUserDetail.progress)
            },
            updateUserBook:function() {
                
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "../styles/base";
    .detailArea {
        text-align:left;
    }
</style>
