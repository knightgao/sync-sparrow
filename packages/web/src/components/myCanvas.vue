<script setup lang="ts">
import {useCanvas} from "@/hooks/useCanvas";
import { useSocket } from "@/hooks/useSocket";
import {onMounted, ref, watch} from "vue";
import { useRoute } from "vue-router";
const {handleUndo, handleRedo, handleExport,drawPathShow,setPathStack} = useCanvas("myCanvas");

const route = useRoute();

let gameName = 'game-room-1';
const { isConnected, socket } = useSocket();
onMounted(
    () => {
      if(route.params.id){
        gameName = `game-room-${route.params.id}`;
      }
      socket.emit(gameName, "" );
    }
)


// 是否是画家
const isDrawer = ref(false);
watch([isConnected,drawPathShow], function (value) {
      if (value?.[0]) {
        console.log("unref(value?.[1])",value?.[1])
        if(isDrawer.value){
          socket.emit(gameName, JSON.stringify(value?.[1]) );
        }
      }
    }
)

onMounted(
    ()=>{
      socket.on("game-room-1-listen",value=>{
        if(!isDrawer.value){
          const pathList = JSON.parse(value) || [];
          setPathStack(pathList);
        }
      })
    }
)



</script>

<template>
  <div class="myCanvas">
    <div>
      <input
          v-model="isDrawer"
          type="checkbox"
          id="subscribeNews"
          name="subscribe"
          value="newsletter" />
      <label for="subscribeNews">是否是画家？</label>
    </div>

    {{isDrawer}}
    <div style="display: flex;">
      <div @click="handleUndo">撤销</div>
      <div @click="handleRedo">重做</div>
      <div @click="handleExport">导出</div>
    </div>

    <canvas ref="canvas" id="myCanvas" width="1000" height="800" style="border:1px solid #000000;">
      Your browser does not support the HTML5 canvas tag.
    </canvas>
  </div>
</template>
