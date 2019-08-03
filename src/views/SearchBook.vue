<template>
    <el-row>
        <navmenu/>
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
                        prop="Item.isbn"
                        label="ISBNコード"
                    />
                    <el-table-column
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
                                @click="registbook(scope.row.Item.isbn)">読んだ本として追加</el-button>
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
    import Navmenu from '../views/Navmenu'
    import bookApiConfig from '../config/bookapi'

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
            var user = firebase.auth().currentUser;
            this.bookRequest.uid = user.uid
        },
        methods: {
            refresh: async function () {
                const res = await axios.get('http://localhost:8090/')
                this.currencies = res.data.currencies
                this.request.name = undefined
                this.request.symbol = undefined
            },
            searchBook: async function () {
                // const url = 'https://www.googleapis.com/books/v1/volumes?q=' + this.request.bookName
                const url = 
                    bookApiConfig.url
                    + '?applicationId=' 
                    + bookApiConfig.appKey
                    + '&title='
                    + this.bookRequest.bookName
                console.log(url)
                const res = await axios.get(url)
                this.searchedBookList = res.data.Items
                console.log(res)
                this.bookRequest.bookName = undefined
                this.bookRequest.isbn = undefined
            },
            registbook: async function (isbn) {
                this.bookRequest.isbn = isbn
                await axios.post('http://localhost:8090/book', this.bookRequest)
                await this.refresh()
                this.$message({
                    showClose: true,
                    message: 'Register Book Success!',
                    type: 'success'
                })
                this.bookRequest.isbn = undefined
            },
        }
    }
</script>

<style scoped lang="scss">
    @import "../styles/base";
</style>