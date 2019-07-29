<template>
    <el-row>
        <navmenu/>
        <el-col :span="24" v-if="searchedBookList.length > 0">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>My書籍</span>
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

    export default {
        name: 'Currency',
        components: { Navmenu },
        data () {
            return {
                bookRequest: {
                    bookName: undefined,
                    isbn: undefined
                },
                bookList: []
            }
        },
        created: async function () {
            await this.refresh()
        },
        methods: {
            refresh: async function () {
                const res = await axios.get('http://localhost:8090/book')
                this.bookList = res.data.currencies
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
