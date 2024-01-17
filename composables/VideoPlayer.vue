<template>
  <div>
    <video ref="videoPlayer" class="video-js"></video>
    <button @click="playOrPause">{{ isPlaying ? '暂停' : '播放' }}</button>
    <input type="range" min="0" max="1" step="0.1" v-model="volume" />
  </div>
</template>

<script setup lang="ts">
import videojs from 'video.js';
import { onBeforeUnmount, onMounted, ref, watch } from "vue";

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
// //  全局拦截器
// videojs.Vhs.xhr.beforeRequest = function (options: any) {
//   let headers = options.headers || {};
//   headers["referer"] = "https://missav.com/dm5/en/fc2-ppv-1045033";
//   headers["token"] = "J2LqH1mnoXE0ZL5typ3VT3n4fe7RFYAO";
//
//   options.headers = headers;
//
//   //console.log("options", options);
//
//   return options;
// };

const videoPlayer = ref(null);
const isPlaying = ref(false);
const volume = ref(1);

onMounted(() => {
  videoPlayer.value = videojs(videoPlayer.value, props.options, () => {
    videoPlayer.value.log('onPlayerReady', this);
    //console.log("onMounted      ")

    var vhs = videoPlayer.value.tech().vhs;
    //console.log(vhs);

    videoPlayer.value.tech().vhs.xhr.onRequest(playerRequestHook);
  });
});
// player.on('xhr-hooks-ready', () => {
//   const playerXhrRequestHook = (options) => {
//     options.beforeSend = (xhr) => {
//       xhr.setRequestHeader('foo', 'bar');
//     };
//     return options;
//   };
//   player.tech().vhs.xhr.onRequest(playerXhrRequestHook);
// });
const playerRequestHook = (options: any) => {
  // //console.log("playerRequestHook      "+JSON.stringify(options))
  // //console.log("uri      "+options.uri)
  // options.beforeSend = (xhr) => {
  //   //console.log("  beforeSend       ")
  // Referer不能修改，会报错
  //   xhr.setRequestHeader('Referer', "https://missav.com/");
  // };
  // options.uri=options.uri.replace('worker-daili.xun335610.workers.dev', 'cdn152.akamai-content-network.com');
  return options;
};
// onMounted(() => {
//
// });
onBeforeUnmount(() => {
  if (videoPlayer.value) {
    videoPlayer.value.dispose();
  }
});

const playOrPause = () => {
  if (videoPlayer.value) {
    if (isPlaying.value) {
      videoPlayer.value.pause();
    } else {
      videoPlayer.value.play();
    }
    isPlaying.value = !isPlaying.value;
  }
};

watch(volume, (newVolume) => {
  if (videoPlayer.value) {
    videoPlayer.value.volume(newVolume);
  }
});
</script>
