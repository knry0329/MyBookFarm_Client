<template>
  <book-info ref="bookInfo" :propuid="uid" :propisbn="isbn" :userRefFlg="userRefFlg" navIndex="">
    <span slot="header">{{userDetail.uname}} さんの書籍詳細</span>
  </book-info>
</template>

<script>
import axios from 'axios'
import BookInfo from '../components/BookInfo'
import firebase from 'firebase'
import serverApi from '../api/serverapi'

export default {
  name: 'BookDetail',
  components: { BookInfo },
  data () {
    return {
      uid: undefined,
      isbn: undefined,
      userRefFlg: undefined,
      userDetail: {}
    }
  },
  created: function () {
    firebase.auth().onAuthStateChanged(user => {
      this.user = user ? user : {}
      if (user) {
        this.uid = this.user.uid
        this.userRefFlg = true
        this.isbn = this.$route.params.isbn
        this.searchUser(this.$route.params.uid)
        this.$refs.bookInfo.refresh(this.$route.params.uid)
      } else {
      }
    })
  },
  methods: {
    searchUser: async function(uid) {
      const res = await serverApi.searchUser(uid)
      this.userDetail = res.data.muserList[0]
    }
  }
}
</script>

<style scoped lang="scss">
    @import "../styles/base";

</style>
