<template>
    <user-info ref="userInfo" :myuid="uid" :userRefFlg="userRefFlg" navIndex="1" >
        <span slot="header">マイページ</span>
        <p slot="userBook">マイ本棚</p>
    </user-info>
</template>

<script>
/* eslint-disable no-console */

    import axios from 'axios'
    import bookApiConfig from '../config/bookapi'
    import firebase from 'firebase'
    import UserInfo from '../components/UserInfo'

    export default {
        name: 'MyPage',
        components: { UserInfo },
        data () {
            return {
                uid: undefined,
                userRefFlg: undefined
            }
        },
        created: async function () {
            firebase.auth().onAuthStateChanged(user => {
                this.user = user ? user : {}
                if (user) {
                    this.uid = this.user.uid
                    this.userRefFlg = false
                    //https://teratail.com/questions/88988
                    this.$refs.userInfo.refresh(this.uid)
                } else {
                }
            })
        },
        methods: {

        }
    }
</script>

<style scoped lang="scss">

</style>
