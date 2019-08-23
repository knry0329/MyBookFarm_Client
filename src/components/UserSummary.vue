<template>
  <div class="user-summary">
    <el-link type="success" @click="gotoUserDetail(uid)">
      <div class="user-summary-detail">
        <el-avatar id="avatar" :size="50" :src="circleUrl">
        </el-avatar>
        <div>
          <span>{{uname}}</span>
        </div>
      </div>
    </el-link>
  </div>
</template>

<script>
export default {
  name: 'UserSummary',
  data() {
    return {
      circleUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
    }
  },

  props: ['uid', 'uname'],
  methods: {
    gotoUserDetail: function(uid) {
      console.log(uid)
      this.$router.push({ name: 'userDetail', params: { uid: uid }}) 
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
</style>
