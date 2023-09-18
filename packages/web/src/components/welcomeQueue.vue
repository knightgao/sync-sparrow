<script setup lang="ts">
import {ref} from 'vue';

const userList = ref([
  {id: 1, name: 'John'},
])
</script>

<template>
  <div class="welcomeQueue">
    <div v-for="user in userList">
      {{ user.name }}
    </div>
  </div>
</template>

<style scoped></style>