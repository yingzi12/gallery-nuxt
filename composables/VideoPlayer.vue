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
      controls: true,
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

  // 监听 error 事件
  videoPlayer.value.on('error', () => {
    console.log('Error loading the video');
    // 设置播放器为黑屏或显示错误消息
    videoPlayer.value.poster('/black.jpg'); // 或使用一个黑色的图片
    videoPlayer.value.textTrackDisplay.hide(); // 隐藏字幕显示
    // 可以在这里添加更多自定义错误处理逻辑
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
