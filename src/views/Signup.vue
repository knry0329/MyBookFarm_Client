<template>
  <div class="signup">
    <h2>Signup</h2>
    <div class="input-form-wrapper">
      <el-input type="text" placeholder="Username" v-model="username" @keypress.enter.native="signUp"/>
    </div>
    <div class="input-form-wrapper">
      <el-input type="password" placeholder="Password" v-model="password" @keypress.enter.native="signUp"/>
    </div>

    <el-button @click="signUp">Register</el-button>
    <p>Do you have an account?
      <router-link to="/">sign in now!!</router-link>
    </p>

  </div>
</template>

<script>
import firebase from 'firebase'
import axios from 'axios'
import serverApi from '../api/serverapi'

export default {
  name: 'Signup',
  data () {
    return {
      username: undefined,
      password: undefined,
      userRequest: {

      }
    }
  },
  methods: {
    signUp: async function () {
      await firebase.auth().createUserWithEmailAndPassword(this.username, this.password)
        .then(() => {
          this.username = undefined
          this.password = undefined
          this.$message({
            showClose: true,
            message: 'Register User Success!',
            type: 'success'
          })

          let user = firebase.auth().currentUser
          // console.log(user1)
          this.registUser(user.uid)
          // firebase.auth().onAuthStateChanged(user => {
          //     if(user) {
          //         this.registUser(user.uid)
          //         return
          //     } else {
          //         console.log("none!!!!!!")
          //     }
          // })
        })
        .catch(error => {
          this.$message({
            showClose: true,
            message: error,
            type: 'error'
          })
        })
    },
    registUser: async function(uid) {
      this.userRequest.uid = uid
      this.userRequest.uname = uid
      this.userRequest.description = ''
      await serverApi.registUser(this.userRequest)
      this.userRequest = {}
    }
  }
}
</script>

<style scoped lang="scss">
    @import "../styles/base";
</style>
