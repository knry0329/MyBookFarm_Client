<template>
    <footer>
        <div id="global-footer">
            © 2019 kanary
        </div>
    </footer>
</template>

<script>
    export default {
        name: 'GlobalFooter'
    }
</script>

<style scoped lang="scss">
    @import "../styles/colors";

    #global-footer {
        background-color: $HEADER_BACKGROUND;
        color: $HEADER_LABEL;
        margin-left:20px;
        margin-right:20px;
    }

</style>
