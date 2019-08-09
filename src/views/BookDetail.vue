<template>
    <el-row>
        <navmenu index="3"/>
        <el-col :span="24" v-loading="loading" >
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>書籍詳細</span>
                </div>
                <el-col :span="3" :offset="4">
                    <div class="imageArea">
                        <!-- <img :src="bookDetail.Item.largeImageUrl"/> -->
                        <el-image  v-if="'imageLinks' in bookDetail" :src="bookDetail.imageLinks.thumbnail"/>
                    </div>
                </el-col>
                <el-col :span="6" :offset="1">
                    <div class="detailArea">
                        <p>書籍名: {{bookDetail.title}}</p>
                        <p>著者: {{!Array.isArray(bookDetail.authors) ? bookDetail.authors : bookDetail.authors.join(',')}}</p>
                        <p>ページ数: {{getPage()== -1? "不明" : getPage()}}</p>
                    </div>
                </el-col>
                <el-col :span="7">
                    <div class="progressArea">
                        <div class="block">
                            <p class="demonstration">・何ページまで読み進めましたか？</p>
                            <el-slider 
                                v-model="bookUserDetail.progress"
                                :min=0
                                :max="getPage()"
                                show-input></el-slider>
                        </div>
                        <div id="progress-switch">
                            <el-switch
                                v-model="bookUserDetail.progress"
                                active-text="読み終わりました！"
                                :active-value="getPage()"
                            >
                            </el-switch>
                        </div>
                        <p style="padding-top:2em;">・書籍メモ：気づいたことや学んだことを記載しておきましょう</p>
                        <!-- <markdown v-model="memo1"/> -->
                        <el-input
                            type="textarea"
                            :rows="2"
                            placeholder="Please input"
                            v-model="bookUserDetail.memo">
                        </el-input>
                        <div id="update-button-area">
                            <el-button 
                                id="update-button"
                                size="mini"
                                type="success"
                                v-on:click="updateUserBook()"
                            >更新
                            </el-button>
                        </div>
                    </div>
                </el-col>
                <el-col :span="10" :offset="5">
                    <div id="logArea">読書ログ</div>
                    <el-table
                        :data="userProgressList"
                        style="width: 100%">
                        <el-table-column
                            prop="ymd"
                            label="更新した時間"
                        />
                        <el-table-column
                            prop="progress"
                            label="進捗"
                        >
                            <template slot-scope="scope">
                                <div v-if="scope.row.progress > 0">{{scope.row.progress}}ページ読み進めました！</div> 
                                <div v-else>{{scope.row.progress * (-1)}}ページ戻りました。</div> 
                            </template>
                        </el-table-column>

                    </el-table>            

                </el-col>
            </el-card>
        </el-col>
    </el-row>
</template>

<script>
    import axios from 'axios'
    import Navmenu from '../views/Navmenu'
    // import markdown from '../views/MarkDown'
    import bookApiConfig from '../config/bookapi'
    import dateutil from '../util/dateutil'
    import firebase from 'firebase'

    export default {
        name: 'BookDetail',
        components: { Navmenu },
        data () {
            return {
                uid: undefined,
                isbn: undefined,
                beforeProgress: undefined,
                bookDetail: {},
                bookUserDetail: {},
                userProgressList: [],
                bookUserRequest: {},
                userProgressRequest: {},
                loading:false
            }
        },
        created: function () {
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
                this.uid = uid
                //書籍APIから書籍情報を取得
                this.searchBookIsbn()
                //サーバのAPIからユーザの書籍情報を取得
                this.searchBookUser(uid)
                //書籍の進捗状況を確認
                this.searchUserProgress(uid, this.isbn)
            },
            searchUserProgress: async function(uid, isbn) {
                const url = 'http://localhost:8090/user/progress/'+uid
                const res = await axios.get(url)
                this.userProgressList = res.data.tuserProgressList.filter(obj => obj.isbn == isbn)


            },
            searchBookIsbn: async function () {
                const url = 
                    bookApiConfig.urlGoogleBooks
                    + '?q=isbn:'
                    + this.isbn
                const res = await axios.get(url)
                this.bookDetail = res.data.items[0].volumeInfo
            },
            searchBookUser: async function (uid) {
                const url = 'http://localhost:8090/book/'+uid+'/'+this.isbn
                const res = await axios.get(url)
                this.bookUserDetail = res.data.rbookUserList[0]
                this.beforeProgress = res.data.rbookUserList[0].progress
            },
            updateUserBook: async function() {
                this.loading = true
                this.bookUserRequest.uid = this.uid
                this.bookUserRequest.isbn = this.isbn
                this.bookUserRequest.progress = this.bookUserDetail.progress
                this.bookUserRequest.status = this.updateStatus(this.getPage(), this.bookUserDetail.progress)
                this.bookUserRequest.memo = this.bookUserDetail.memo
                const url = 'http://localhost:8090/book'
                const res = await axios.put(url, this.bookUserRequest)
                
                this.userProgressRequest.uid = this.uid
                this.userProgressRequest.ymd = dateutil.formatDate(new Date(),'YYYY-MM-DD hh:mm:ss')
                this.userProgressRequest.kbn = '0'
                this.userProgressRequest.isbn = this.isbn
                var nowProgress = this.bookUserRequest.progress - this.beforeProgress
                this.userProgressRequest.progress = nowProgress
                const url_progress = 'http://localhost:8090/user/progress'
                const res_progress = await axios.post(url_progress, this.userProgressRequest)

                this.bookRequest = {}
                this.userProgressRequest = {}

                this.$message({
                    showClose: true,
                    message: 'Update Success!',
                    type: 'success'
                })

                this.loading = false
                this.$router.push({ name: 'mybook'})
            },
            getPage: function() {
                // if(!("pageCount" in this.bookDetail)) {
                //     return 1
                // }
                return Number(this.bookDetail.pageCount)
            },
            updateStatus: function(pageCount, progress) {
                if(progress == 0) return 0
                if(progress == pageCount) return 2
                return 1
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "../styles/base";
    .detailArea {
        text-align:left;
        // padding-left:2em;
    }
    .progressArea {
        text-align:left;
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
    #logArea {
        text-align:left;
    }
</style>
