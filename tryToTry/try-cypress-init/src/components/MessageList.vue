<script setup>
import { ref } from "vue"
defineProps({
  messageList: {
    type: Array,
    default: () => []
  }
})
</script>
<template>
  <div>
    <ul data-test="testList">
      <li v-for="msg in messageList" :key="msg">{{ msg }}</li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
</style>
