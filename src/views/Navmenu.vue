<template>
    <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
        background-color="#bfea95"
        text-color="#fff"
        active-text-color="#6ab123"
        router>
        <el-menu-item class="el-menu" index="1" :route="{name: 'mypage'}">My Page</el-menu-item>
        <el-menu-item class="el-menu" index="2" :route="{name: 'searchbook'}">Search Book</el-menu-item>
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
        <el-menu-item class="el-menu" index="3" :route="{name: 'mybook'}">My Book</el-menu-item>
        <el-menu-item class="el-menu" index="4" @click="signout">Sign Out</el-menu-item>
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

        props: ['index'],
        //         mounted() {
        //     // 読み込まれたページをアクティブ
        //     this.activeIndex = this.$route.name;
        // },

        created: function() {
            this.activeIndex = this.index  
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

.el-menu {
    font-weight:bold;
}

</style>
