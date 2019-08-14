<template>
    <div class="global-header">
        <span class="global-header-label">MyBookFarm</span>
    </div>
</template>

<script>
    export default {
        name: 'GlobalHeader'
    }
</script>

<style scoped lang="scss">
    @import "../styles/colors";

    .global-header {
        background-color: $HEADER_BACKGROUND;
        height: 6.5vh;
        margin-left:10px;
        margin-right:10px;
        text-align:left;
    }
    .global-header-label {
        color: $HEADER_LABEL;
        font-weight: bold;
        line-height: 6.5vh;
        padding-left:1em;
    }
</style>
