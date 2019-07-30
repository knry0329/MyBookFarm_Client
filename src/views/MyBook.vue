<template>
    <el-row>
        <navmenu :activeindex="4"/>
        <el-col :span="24" v-if="bookList.length < 0">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>My書籍</span>
                </div>
                <el-table
                    :data="bookList"
                    style="width: 100%">
                    <el-table-column
                        prop="isbn"
                        label="ISBNコード"
                    />
                    <el-table-column
                        prop="isbn"
                        label="著者"
                    />
                    <el-table-column
                        prop="isbn"
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
        name: 'MyBook',
        components: { Navmenu },
        data () {
            return {
                bookRequest: {
                    bookName: undefined,
                    isbn: undefined
                },
                isbnList: [],
                bookList: [],
                uid:undefined
            }
        },
        created: async function () {
            firebase.auth().onAuthStateChanged(async function(user) {
                if(user) {
                // const res = await axios.get('http://localhost:8090/book/'+currentUser.uid)
                // this.bookList = await res.data.rbookUserList
                // console.log(this.bookList)
                this.uid = user.uid
                await this.refresh(this.uid)
                }
            })
            console.log(this.bookList)

            // await this.refresh(user)
        },
        methods: {
            refresh: async function (uid) {
                // firebase.auth().onAuthStateChanged(async user => {
                //     if(user) {
                //         const res = await axios.get('http://localhost:8090/book/'+user.uid)
                //         this.bookList =await res.data.rbookUserList
                //         console.log('changed:::::' + this.bookList)
                //     }
                //     console.log(this.bookList)
                // })
                // console.log(this.bookList)
                // var user = await firebase.auth().currentUser;
                const res = await axios.get('http://localhost:8090/book/'+uid)
                this.bookList = res.data.rbookUserList
            },
            addCurrency: async function () {
                await axios.post('http://localhost:8090/', this.request)
                await this.refresh()
                this.$message({
                    showClose: true,
                    message: 'Add Currency Success!',
                    type: 'success'
                })
            },
            deleteCurrency: async function (id) {
                await axios.delete('http://localhost:8090/' + id)
                await this.refresh()
                this.$message({
                    showClose: true,
                    message: 'Delete Currency Success!',
                    type: 'success'
                })
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
                this.bookRequest.address = 'xx@gmail.com'
                await axios.post('http://localhost:8090/book', this.bookRequest)
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
