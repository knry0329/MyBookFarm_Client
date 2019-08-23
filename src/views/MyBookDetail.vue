<template>
  <book-info ref="bookInfo" :propuid="uid" :propisbn="isbn" :userRefFlg="userRefFlg" navIndex="3">
    <span slot="header"></span>
  </book-info>
</template>

<script>
import axios from 'axios'
import BookInfo from '../components/BookInfo'
import firebase from 'firebase'

export default {
  name: 'MyBookDetail',
  components: { BookInfo },
  data () {
    return {
      uid: undefined,
      isbn: undefined,
      userRefFlg: undefined,
    }
  },
  created: function () {
    firebase.auth().onAuthStateChanged(user => {
      this.user = user ? user : {}
      if (user) {
        this.uid = this.user.uid
        this.userRefFlg = false
        this.isbn = this.$route.params.isbn
        console.log(this.isbn)
        this.$refs.bookInfo.refresh(this.uid)
      } else {
      }
    })
  },
  methods: {

  }
}
</script>

<style scoped lang="scss">
    @import "../styles/base";

</style>
