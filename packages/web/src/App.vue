<script setup lang="ts">
// import MyCanvas from "./components/myCanvas.vue";
import { useSocket } from "@/hooks/useSocket.ts";
import { onMounted, watch } from "vue";

const { isConnected, socket } = useSocket();


onMounted(
  () => {
    console.log('onMounted');

  }
)

watch([isConnected], function (value) {
  if (value) {
    socket.emit("game-room", "world");
  }
}

)

</script>

<template>
  <div>
    <div>{{ isConnected }}</div>
    <!-- <my-canvas></my-canvas> -->
  </div>
</template>


