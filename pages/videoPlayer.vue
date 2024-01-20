<script lang="ts" setup>
import { ref } from 'vue';
import VideoPlayer from "~/composables/VideoPlayer.vue";

const videoOptions = ref({
  autoplay: true,
  controls: true,
  sources: [
    {
      src: 'https://d2zihajmogu5jn.cloudfront.net/elephantsdream/hls/manifest1/index.m3u8',
      type: 'application/x-mpegURL'
    }
  ]
});
</script>

<template>

</template>
