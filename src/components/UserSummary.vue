<template>
  <div class="user-summary">
    <el-link type="success" @click="gotoUserDetail(uid)">
      <div class="user-summary-detail">
        <!-- <el-avatar id="avatar" :size="50" :src="circleUrl">
        </el-avatar> -->
        <img class="account-image" :src="photo_url" />
        <div>
          <span>{{uname}}</span>
        </div>
      </div>
    </el-link>
  </div>
</template>

<script>

import firebase from 'firebase'

export default {
  name: 'UserSummary',
  data() {
    return {
      photo_url: null,
      circleUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
    }
  },

  props: ['uid', 'uname'],
  created: function() {
    this.getAccountImage(this.uid)
  },
  methods: {
    gotoUserDetail: function(uid) {
      console.log(uid)
      this.$router.push({ name: 'userDetail', params: { uid: uid }}) 
    },
    getAccountImage: function(uid) {
      let me = this
      let storageRef = firebase.storage().ref().child(`images/${me.uid}.jpg`)
      console.log(storageRef)
      storageRef.getDownloadURL().then((url) => {
        me.photo_url = url
      }, 
      me.photo_url = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
      )
    }

  }
}

</script>
<style lang="scss">

    .user-summary {
        display: inline-block;
        text-align: center;
        margin: 1em;
    }

    .account-image {
      width: 50px;
      height: 50px;
      border-radius:133px;
      object-fit: cover; 
    }
</style>
