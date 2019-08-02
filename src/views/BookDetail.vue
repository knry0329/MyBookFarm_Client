<template>
    <el-row>
        <navmenu :activeindex="4"/>
        <el-col :span="24" >
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>書籍詳細</span>
                </div>
                <el-low :gutter="20">
                    <el-col :span="12">
                        <div class="imageArea">
                            <img :src="bookDetail.Item.largeImageUrl" />
                        </div>

                    </el-col>
                    <el-col :span="12">
                        <div class="detailArea">
                            <p>書籍名: {{bookDetail.Item.title}}</p>
                            <p>著者: {{bookDetail.Item.author}}</p>
                            <p>総ページ数: {{bookDetail.Item.author}}</p>
                        </div>

                    </el-col>
                </el-low>
                <el-table
                    :data="bookList"
                    style="width: 100%">
                    <el-table-column
                        prop="Item.isbn"
                        label="ISBNコード"
                    />
                    <!-- <el-table-column
                        prop="Item.author"
                        label="著者"
                    />
                    <el-table-column
                        prop="Item.title"
                        label="タイトル"
                    />
                    <el-table-column
                        label="画像"
                    >
                        <template slot-scope="scope">
                            <img :src="scope.row.Item.mediumImageUrl" />
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="operation"
                        label="Ops"
                        align="left">
                        <template slot-scope="scope">
                            <el-button
                                size="mini"
                                type="danger"
                                >
                                <router-link to="{ name: 'bookDetail', params: { isbn: scope.row.Item.isbn }}"></router-link>
                                読んだ本として追加</el-button>
                        </template>
                    </el-table-column> -->
                </el-table>            
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
                isbn: undefined,
                bookList: [],
                bookDetail: {}
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
                console.log(this.isbn)
                this.searchBookIsbn(this.isbn)
                // const res = await axios.get('http://localhost:8090/book/'+uid)
                // this.isbnList = res.data.rbookUserList
                // await this.isbnList.forEach(ob => {
                //     this.searchBookIsbn(ob.isbn)
                // })

            },
            searchBookIsbn: async function (isbn) {
                const url = 
                    bookApiConfig.url
                    + '?applicationId=' 
                    + bookApiConfig.appKey
                    + '&isbn='
                    + isbn
                console.log('url : '+ url)
                const res = await axios.get(url)
                console.log('res : ' + res)
                this.bookList.push(res.data.Items[0])
                this.bookDetail = res.data.Items[0]
                console.log(this.bookdetail)
                // return res
            },
        }
    }
</script>

<style scoped lang="scss">
    @import "../styles/base";
    .detailArea {
        text-align:left;
    }
</style>
