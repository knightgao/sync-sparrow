<script setup lang="ts">
import {useCanvas} from "../hooks/useCanvas.ts";

const {handleUndo, handleRedo, handleExport} = useCanvas("myCanvas");
</script>

<template>
  <div class="myCanvas">
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

<style scoped>

</style>