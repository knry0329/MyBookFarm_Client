<template>
    <user-info ref="userInfo" :myuid="uid" :userRefFlg="userRefFlg" navIndex="" >
    </user-info>
</template>

<script>
/* eslint-disable no-console */

    import axios from 'axios'
    import bookApiConfig from '../config/bookapi'
    import firebase from 'firebase'
    import UserInfo from '../components/UserInfo'

    export default {
        name: 'UserDetail',
        components: { UserInfo },
        data () {
            return {
                //自分自身のUID（現在参照しているユーザのUIDではない！）
                uid: undefined,
                userRefFlg: undefined
            }
        },
        created: async function () {
            firebase.auth().onAuthStateChanged(user => {
                this.user = user ? user : {}
                if (user) {
                    this.uid = this.user.uid
                    this.userRefFlg = true
                    //https://teratail.com/questions/88988
                    this.$refs.userInfo.refresh(this.$route.params.uid)
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
