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
                        label="ISBNコード"
                    />
                    <el-table-column
                        prop="volumeInfo.authors"
                        label="著者"
                    />
                    <el-table-column
                        prop="volumeInfo.title"
                        label="タイトル"
                    />
                    <el-table-column
                        label="画像"
                    >
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
                                type="danger"
                                :disabled="scope.row.volumeInfo.industryIdentifiers==undefined || scope.row.volumeInfo.industryIdentifiers.length ==0"
                                @click="registbook(scope.row.volumeInfo.industryIdentifiers[0].identifier)">読んだ本として追加</el-button>
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
    import { defaultCoreCipherList } from 'constants';

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
            var user = await firebase.auth().currentUser;
            this.bookRequest.uid = user.uid
        },
        methods: {
            refresh: async function () {
                // const res = await axios.get('http://localhost:8090/')
                // this.currencies = res.data.currencies
                // this.request.name = undefined
                // this.request.symbol = undefined
            },
            searchBook: async function () {
                // const url = 'https://www.googleapis.com/books/v1/volumes?q=' + this.request.bookName
                const url = 
                    bookApiConfig.urlGoogleBooks
                    + '?q='
                    + this.bookRequest.bookName
                    + '&maxResults=40'
                console.log(url)
                const res = await axios.get(url)
                // const newItems = res.data.items.filter(n => n.volumeInfo.industryIdentifiers !== undefined)
                // res.data.items = newItems
                res.data.items.forEach((val, index, arr) => {
                    if(val.volumeInfo.authors) {
                        val.volumeInfo.authors = val.volumeInfo.authors.join(',')
                    }
                    // if(!val.volumeInfo.industryIdentifiers) {
                    //     console.log(val.volumeInfo)
                    //     res.data.items.splice(index, 1)
                    // }
                    if(val.volumeInfo.industryIdentifiers) {
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
                console.log(this.bookRequest)
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
            authorSplit: function(arr) {
                return arr
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "../styles/base";
</style>