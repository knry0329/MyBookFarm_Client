<template>
    <el-row>
        <navmenu :activeindex="4"/>
        <el-col :span="24" >
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>書籍詳細</span>
                </div>
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
                bookList: []
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
                // return res
            },
            bookDetail: async function (isbn) {
                this.bookRequest.isbn = isbn
                await axios.get('http://localhost:8090/book', this.bookRequest)
                await this.refresh()
                this.$message({
                    showClose: true,
                    message: 'Add Currency Success!',
                    type: 'success'
                })
                this.bookRequest.isbn = undefined
                this.bookRequest.address = undefined
            },
        }
    }
</script>

<style scoped lang="scss">
    @import "../styles/base";
</style>
