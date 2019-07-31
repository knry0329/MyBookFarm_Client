<template>
    <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b">
        <el-menu-item index="1"><router-link to="/currency">SearchBook</router-link></el-menu-item>
        <!-- <el-submenu index="2">
            <template slot="title">Workspace</template>
            <el-menu-item index="2-1">item one</el-menu-item>
            <el-menu-item index="2-2">item two</el-menu-item>
            <el-menu-item index="2-3">item three</el-menu-item>
            <el-submenu index="2-4">
                <template slot="title">item four</template>
                <el-menu-item index="2-4-1">item one</el-menu-item>
                <el-menu-item index="2-4-2">item two</el-menu-item>
                <el-menu-item index="2-4-3">item three</el-menu-item>
            </el-submenu>
        </el-submenu>
        <el-menu-item index="3" disabled>Info</el-menu-item> -->
        <!-- <el-menu-item index="4"><a v-bind:href="mybook"></a>MyBook</el-menu-item> -->
        <el-menu-item index="4"><router-link to="/mybook">MyBook</router-link></el-menu-item>
        <el-menu-item index="5" @click="signout">Signout</el-menu-item>
    </el-menu>
</template>

<script>
    import firebase from 'firebase'
    export default {
        name: 'Navmenu',
        data() {
            return {
                activeIndex: undefined,
            };
        },
        methods: {
            handleSelect(key, keyPath) {
                console.log(key, keyPath);
            },
            signout: function () {
                firebase.auth().signOut().then(() => {
                    this.$router.push('/signin')
                })
            }
        }
    }

</script>
<style lang="scss">
</style>
