<template>
  <div class="signin">
    <h2>Sign in</h2>
    <div class="input-form-wrapper">
      <el-input type="text" placeholder="Username" v-model="username" @keypress.enter.native="signIn"/>
    </div>
    <div class="input-form-wrapper">
      <el-input type="password" placeholder="Password" v-model="password"  @keypress.enter.native="signIn"/>
    </div>
    <el-button @click="signIn">Signin</el-button>
    <p>You don't have an account?
      <router-link to="/signup">create account now!!</router-link>
    </p>
  </div>
</template>

<script>
import firebase from 'firebase'

export default {
  name: 'Signin',
  data () {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    signIn: async function () {
      await firebase.auth().signInWithEmailAndPassword(this.username, this.password)
        .then(() => this.$router.push('/mypage'))
        .catch(error => {
          this.$message({
            showClose: true,
            message: error,
            type: 'error'
          })
        })
    }
  }
}
</script>

<style scoped lang="scss">
    @import "../styles/base";
</style>
