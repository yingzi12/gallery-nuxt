<script lang="ts" setup>
import {useRoute} from "vue-router";
const config = useRuntimeConfig();

const route = useRoute();

useHead({
  title: "图集网",
  meta: [
    {name: 'description', content: "图集网 美女 写真 摄影 秀人网 Photo Gallery, Beauty, Photo, Photography, Showman.com."},
    {name: 'title', content: "图集网"}

  ],
})
const tokenCookie = useCookie('token',{domain:"aiavr.com",path:"/"});
const token = tokenCookie.value;
const invite = ref(route.query.invite);

if(invite.value) {
  const inviteCookie = useCookie('invite');
  inviteCookie.value=invite.value
}
const current = ref(1)
const slide = ref(0)
const title = ref('')
const albumList = ref([]);
const total = ref(0);
const queryData = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    title: '',
  },
  rules: {}
});
const image = ref("")
const {queryParams, form, rules} = toRefs(queryData);

async function getList(page: number) {
  // 滚动到顶部
  current.value = page
  queryParams.value.title = title.value;
  queryParams.value.pageNum = page;
  const response = await axios.get('/api/album/listSee?' + tansParams(queryParams.value))
  const data = response.data;
  if (data.code == 200) {
    total.value = data.total
    albumList.value = data.data
  }
}

getList(1)

function imageUrl(album) {
  if (album.sourceUrl != null && album.sourceUrl.startsWith('/image')) {
    return `${config.public.sourceWeb}${album.sourceUrl}`;
  }
  return album.sourceWeb + album.imgUrl;
}

const randomList = ref([]);
const imagesLoaded = ref(false);

async function getRandom() {
  const response = await axios.get('/api/album/random');
  const data = response.data;
  if (data.code == 200) {
    randomList.value = data.data
    imagesLoaded.value = true;
  }
}

getRandom();
</script>
<template>
  <q-tabs shrink stretch>
    <q-input v-model="title" :label="$t('search') " name="title" style="width: 600px" @keyup.enter="getList(1)"/>
    <q-icon name="search" @click="getList(1)"/>
  </q-tabs>
  <div class="q-pa-md">
    <q-carousel v-if="imagesLoaded"
                v-model="slide"
                animated
                arrows
                height="400px"
                navigation
    >
      <q-carousel-slide v-for="(album, index) in randomList" :img-src="imageUrl(album)" :name="index">
        <div class="absolute-bottom custom-caption">
          <div class="text-h2">
            <a :href="'/detail?aid=' + album.id" class="album-link">{{ album.title }}</a>
          </div>
          <!--          <div class="text-subtitle1">{{ album.intro }}</div>-->
        </div>
      </q-carousel-slide>
    </q-carousel>
  </div>
  <div class="q-pa-md">
    <div class="row justify-center q-gutter-sm">
      <q-intersection
          v-for="(album ,index) in albumList"
          :key="index"
          class="example-item"
          once
          transition="scale"
      >
        <q-card bordered class="q-ma-sm" flat>
          <img :src="imageUrl(album)">
          <q-card-section>
            <div class="text-h6"><a :href='"/detail?aid="+album.id'>{{ album.title }}</a></div>
            <div class="text-subtitle2">{{ album.createTime }}</div>
          </q-card-section>
          <!--            <q-card-section class="q-pt-none">-->
          <!--              {{ lorem }}-->
          <!--            </q-card-section>-->
        </q-card>

      </q-intersection>
    </div>
    <q-pagination v-model="current"
                  active-color="primary"
                  class="caption"
                  color="grey"
                  direction-links
                  flat
                  max="100"
                  max-pages="5"
                  @update:model-value="getList"
    />
  </div>
  <div class="row">
    <div class="col-2"></div>
    <div class="col-auto" style="margin: 0px">
      <div class="footter" style="margin: 0px;text-align: center;">
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
</template>

<style lang="sass" scoped>
.custom-caption
  text-align: center
  padding: 12px
  color: white
  background-color: rgba(0, 0, 0, .3)

.q-carousel__slide
  background-size: contain

.example-item
  height: 600px
  width: 260px

.q-card img
  object-fit: cover

.q-pagination
  text-align: center

.caption
  display: flex
  justify-content: center
  align-items: center
</style>
<style>
.album-link {
  color: white; /* 设置链接颜色为白色 */
  text-decoration: none; /* 去除下划线 */
}

/* 要添加 :hover 和 :focus 状态的样式 */
.album-link:hover,
.album-link:focus {
  color: white; /* 鼠标悬浮和聚焦时的颜色 */
  text-decoration: none; /* 鼠标悬浮和聚焦时去除下划线 */
}
</style>