<template>
    <div class="user-summary">
        <el-avatar id="avatar" :size="50" :src="circleUrl">
        </el-avatar>
        <el-link type="success" @click="gotoUserDetail(uid)">
            <span>{{uname}}</span>
        </el-link>
    </div>
</template>

<script>
    export default {
        name: 'UserSummary',
        data() {
            return {
                circleUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
            };
        },

        props: ['uid', 'uname'],
        methods: {
            gotoUserDetail: function(uid) {
                this.$router.push({ name: 'userDetail', params: { uid: uid }}) 
            }
        }
    }

</script>
<style lang="scss">


</style>
