<script lang="ts" setup>
import VideoPlayer from "~/composables/VideoPlayer.vue";
import {useRoute} from "vue-router";
import {useQuasar} from "quasar";
import {ref} from "vue";
const config = useRuntimeConfig();
const router = useRouter(); // 使用 Vue Router 的 useRouter 函数

const tokenCookie = useCookie('token',{domain:"aiavr.com",path:"/"});
const token = tokenCookie.value;

// 接收url里的参数
const route = useRoute();
const aid = ref(route.query.aid);
const $q = useQuasar();

const videoList = ref([]);
let videoKey = ref(-1);

const album = ref({});
const title = ref("图集网")

const description = ref('图集网 美女 写真 摄影 秀人网 Photo Gallery, Beauty, Photo, Photography, Showman.com.')
const ortTile = ref("图集网")
const orgDec = ref("图集网")
const orgImgae = ref("图集网")
useHead({
  title: title,
  meta: [
    {name: 'description', content: description},
    {name: 'title', content: title},
    {name: 'og:title', content: ortTile},
    {name: 'og:description', content: orgDec},
    {name: 'og:image', content: orgImgae}
  ],
})
const videoOptions = ref({
  autoplay: true,
  controls: true,
  sources: [
    {
      // src: 'https://d2zihajmogu5jn.cloudfront.net/elephantsdream/hls/manifest1/index.m3u8',
      src:"",
      type: 'application/x-mpegURL'
    }
  ]
});
async function getInfo() {
  // 滚动到顶部
  const response = await axios.get("/api/userAlbum/info?id=" + aid.value, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  const data = response.data;
  if (data.code === 200) {
    album.value = data.data;
    title.value = "图集网-" + album.value.title
    ortTile.value = album.value.title
    orgDec.value = album.value.description
    orgImgae.value = album.value.imgUrl
    const vieList = album.value.videoList
    videoList.value.push(...vieList);
  }
}

const randomList = ref([]);

async function getRandom() {
  const response = await axios.get('/api/userAlbum/random', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  const data = response.data;
  if (data.code === 200) {
    randomList.value = data.data
  }
}

function player(url,status,index) {
  if(status == -1){
    $q.dialog({
      title: '信息',
      message: '视频锁定中，不可播放.',
      ok: {
        push: true
      },
      cancel: {
        push: true,
        color: 'negative'
      },
    }).onOk( () => {
    }).onCancel(() => {
    });
    return;
  }
  console.log("url:"+url)
  videoOptions.value.sources = [
    {
      src: config.public.sourceWeb + url,
      type: 'application/x-mpegURL' // 或者根据你的视频格式调整
    }
  ];
  videoKey.value=index; // 改变 key 以强制重新渲染组件
}
getRandom();
getInfo();
function getImageUrl(imgUrl) {
  if (imgUrl != null && imgUrl !== undefined && imgUrl !== '') {
    return `${config.public.sourceWeb}${imgUrl}`;
  }
  return `/empty.png`; // Default image URL when imgUrl is null, undefined, or empty
}

</script>
<template>
  <q-page>
    <div class="q-pa-md">
      <div >
        <div class="q-pa-md">
          <div class="bg-cyan text-white">
            <q-toolbar inset>
              <q-breadcrumbs active-color="white" style="font-size: 16px">
                <q-breadcrumbs-el  icon="home">
                  <router-link to="/">首页</router-link>
                </q-breadcrumbs-el>
                <q-breadcrumbs-el  icon="widgets">
                  <router-link :to="'/userAlbumDetail?aid=' + album.id">图集详细</router-link>
                </q-breadcrumbs-el>

                <q-breadcrumbs-el label="视频播放" />
              </q-breadcrumbs>
            </q-toolbar>
          </div>
        </div>
        <div class="q-pa-md example-row-stacked-to-horizontal">
          <div class="row">
            <div class="col-12 col-md-7 video-container">
              <VideoPlayer :options="videoOptions" :key="videoKey" />
            </div>
            <div class="col-12 col-md-5">
              <div class="my-card-container">
                <q-card class="my-card">
                  <q-card-section>
                    <div class="text-h6">
                      <a :href="'/userAlbumDetail?aid=' + album.id" class="album-link">{{ album.title }}</a>

                    </div>
                    <div class="text-subtitle2">{{ album.intro }}</div>
                  </q-card-section>
                  <q-separator />
                  <q-card-actions vertical>
<!--                    <q-btn flat  v-for="(video,index) in videoList"-->
<!--                           :key="index" @click="player(video.url,index)" >-->
<!--                        视频- {{index}}-->
<!--                    </q-btn>-->
                    <q-btn flat v-for="(video, index) in videoList" :key="index" @click="player(video.url,video.status, index)">
                      <template v-if="video.status === -1">
                        <q-icon name="lock" /> <!-- Locked Icon -->
                        视频- {{ index }} (Locked)
                      </template>
                      <template v-else>
                        视频- {{ index }}
                      </template>
                    </q-btn>
                  </q-card-actions>
                </q-card>

              </div>
            </div>
          </div>
        </div>
      </div>
        <div>
          <!-- 在这里放置您希望在新列中显示的内容 -->
          <div class="row justify-center q-gutter-sm">
            <q-intersection
                v-for="(album ,index) in randomList"
                :key="index"
                class="example-item"
                once
                transition="scale"
            >
              <q-card bordered class="q-ma-sm" flat>
                <img :src="getImageUrl(album.imgUrl)">
                <q-card-section>
                  <div class="text-h6">
                    <a :href='"/detail?aid="+album.id'>
                      <p class="text-caption  two-line-clamp"> {{ album.title }} </p>
                    </a>
                    <p class="text-caption" style="padding: 0px"> {{ album.createTime }} </p>
                  </div>
                </q-card-section>
              </q-card>

            </q-intersection>
          </div>
        </div>
    </div>
    <div class="row">
      <div class="col-2"></div>
      <div class="col-auto" style="margin: 0px">
        <div class="footter" style="margin: 0;text-align: center;">
          <router-link to="">关于图集</router-link>
          |
          <router-link to="">联系我们</router-link>
          |
          <router-link to="">帮助中心</router-link>
          |
          <router-link to="">提交建议</router-link>
          |
          <router-link to="">举报中心</router-link>
          |
          <router-link to="/privacyPolicy">隐私政策</router-link>
          |
          <router-link to="/use">使用条款</router-link>
          |
          <router-link to="">漏洞提交</router-link>
          |
        </div>
        <div class="footerText text-weight-thin"><p>Copyright © 2002-2022 www.aiavr.uk Rights Reserved 版权所有
          心世界未来科技有限公司</p></div>
        <div class="footerText text-weight-thin"><p>图片,美女,写真,图集</p></div>
        <div class="footerText text-weight-light"><p>
          本站所收录的作品、社区话题、用户评论、用户上传内容或图片等均属用户个人行为。如前述内容侵害您的权益，欢迎举报投诉，一经核实，立即删除，本站不承担任何责任</p>
        </div>
        <div class="footerText text-weight-thin"><a href="https://www.51k.uk">心世界小说网</a>|<a
            href="https://www.30dizhi.uk">30导航</a>|<a href="https://www.aravrw.com">心世界</a></div>
      </div>
      <div class="col-2"></div>
    </div>
  </q-page>
</template>


<style lang="sass" scoped>

.video-container
  display: flex
  justify-content: flex-end // 使内容靠右对齐

.my-card-container
  display: flex
  justify-content: flex-start // 使内容靠左对齐
  align-items: flex-start // 使内容向上对齐
  width: 100% // 确保容器宽度为 100%
  margin-top: 10px // 可根据需要调整上边距


.my-card
  width: 100% // 保持卡片宽度为 100%
  max-width: 750px // 限制最大宽度

// 其他样式保持不变


.responsive-image
  max-width: 980px
  height: auto
  margin: 0 auto

.caption
  display: flex
  justify-content: center
  align-items: center
  padding: 10px

.head-iamge
  height: 400px
  width: 260px

.head-iamge img
  object-fit: cover

.example-item
  height: 273px
  width: 150px

.two-line-clamp
  display: -webkit-box
  -webkit-line-clamp: 2
  -webkit-box-orient: vertical
  overflow: hidden
  text-overflow: ellipsis

.q-card-section
  padding: 8px

.text-caption
  margin: 0
  font-size: 0.8em

.container
  max-width: 500px
  margin: 0 auto
  padding: 20px
  text-align: center

.headImage
  max-width: 200px
  height: 302px
.vedioimage
  width: 300px
  height: 200px
</style>
