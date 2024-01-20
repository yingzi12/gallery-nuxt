<template>
  <div>
    <video ref="videoPlayer" class="video-js vjs-default-skin" controls></video>
  </div>
</template>

<script setup lang="ts">
import 'video.js/dist/video-js.css';
import videojs from 'video.js';
import { ref, onMounted, onBeforeUnmount } from "vue";

const props = defineProps({
  options: {
    type: Object,
    default: () => ({
      controls: true, // 确保启用内建控件
      poster: "",
      preload: 'auto',
      src: "",
      width: 500
    }),
  },
});

const videoPlayer = ref(null);

onMounted(() => {
  videoPlayer.value = videojs(videoPlayer.value, props.options, () => {
    console.log('Player is ready');
  });
});

onBeforeUnmount(() => {
  if (videoPlayer.value) {
    videoPlayer.value.dispose();
  }
});
</script>
<style>
.video-js {
  max-width: 800px; /* 最大宽度 */
  margin: 0 auto; /* 居中显示 */
}

</style>
