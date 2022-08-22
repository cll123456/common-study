<script setup>
import { reactive, ref } from 'vue'
import MessageInput from './components/MessageInput.vue'
import MessageList from './components/MessageList.vue';
const messageList = reactive([])

const send = (val) => {
  messageList.push(val)
}
</script>

<template>
  <div class="app-container">
    <div class="operation-container">
      <MessageInput @send-message="send"></MessageInput>
    </div>
    <div class="show-container">
      <MessageList :message-list="messageList"></MessageList>
    </div>
  </div>
</template>

<style scoped>
.app-container {
  text-align: center;
}
</style>
