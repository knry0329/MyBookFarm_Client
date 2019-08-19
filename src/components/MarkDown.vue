<script src="https://unpkg.com/marked@0.3.6"></script>
<script src="https://unpkg.com/lodash@4.16.0"></script>

<template>
  <div id="editor">
    <textarea :value="memo" @input="update"></textarea>
    <div v-html="compiledMarkdown"></div>
  </div>
</template>

<script>

import _ from 'lodash'
import marked from 'marked'

export default {
    name: 'markdown',
    data() {
        return {
        input: '# hello',
        memo: ''
        }
    },
    updated: function() {
        console.log(this.memo)
      this.$emit('input', {
        memo1: this.memo
      })
    },
    props: {
        memo1: String
    },
    computed: {
        compiledMarkdown: function () {
            return marked(this.input, { sanitize: true })
        }
    },
    mounted: function () {
        this.memo = this.memo1
    },
    methods: {
        update: _.debounce(function (e) {
        this.input = e.target.value
        }, 300)
    }
}
</script>

<style scoped lang="scss">
    @import "../styles/base";
    html, body, #editor {
  margin: 0;
  height: 100%;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  color: #333;
}

textarea, #editor div {
  display: inline-block;
  width: 49%;
  height: 100%;
  vertical-align: top;
  box-sizing: border-box;
  padding: 0 20px;
}

textarea {
  border: none;
  border-right: 1px solid #ccc;
  resize: none;
  outline: none;
  background-color: #f6f6f6;
  font-size: 14px;
  font-family: 'Monaco', courier, monospace;
  padding: 20px;
}

code {
  color: #f66;
}
</style>