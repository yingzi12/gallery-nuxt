<script lang="ts" setup>

import {useRoute} from "vue-router";
const route = useRoute();

const tokenCookie = useCookie('token');
const token = tokenCookie.value;
const userId = ref(route.query.userId);
const current = ref(1)
const slide = ref('first')
const nickname = ref(null)
const intro = ref('')
const imgUrl = ref("/favicon.png");
const countSee = ref(0);
const countLike = ref(0);
const countAttention = ref(0);

const albumList = ref([]);
const total = ref(0);
const isAttention = ref(2)

const queryData = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    title: '',
    userId: userId.value,
  },
  rules: {}
});
useHead({
  title: "图集网",
  meta: [
    {name: 'description', content: "图集网 美女 写真 摄影 秀人网 Photo Gallery, Beauty, Photo, Photography, Showman.com."},
    {name: 'title', content: "图集网"}

  ],
})
const image = ref("")
const {queryParams, form, rules} = toRefs(queryData);

async function getList(page: number) {
  // 滚动到顶部
  current.value = page
  queryParams.value.pageNum = page;
  const response = await axios.get('/api/userAlbum/list?' + tansParams(queryParams.value))
  const data = response.data;
  //console.log(data.code)
  if (data.code == 200) {
    total.value = data.total
    albumList.value = data.data
  }
}

getList(1)

async function getDetail() {
  const response = await axios.get(`/api/systemUser/info?userId=${userId.value}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });
  const data = response.data;

  if (data.code == 200) {
    const userData = data.data;
    //console.log("userData")
    //console.log(userData)

    nickname.value=userData.nickname;
    //console.log("nickname")
    //console.log(nickname.value)
    isAttention.value=userData.isAttention
    intro.value = userData.intro;
    imgUrl.value = userData.imgUrl ==null ? "/favicon.png": userData.imgUrl ;
    countSee.value = userData.countSee;
    countLike.value = userData.countLike;
    countAttention.value = userData.countAttention;
  }
}

getDetail();

async function onAttention() {
  if ( isAttention.value==1) {
    return; // 如果已经在处理收藏请求，则不执行任何操作
  }else{
    isAttention.value=1;
  }
  // 滚动到顶部
  const response = await axios.get(`/api/admin/userAttention/on?attUserId=${userId.value}&attUserName=${nickname.value}`)
  const data = response.data;
  if (data.code == 200) {
    isAttention.value=1;
  }else{
    isAttention.value=2;
  }
}
async function closeAttention() {
  if ( isAttention.value==2) {
    return; // 如果已经在处理收藏请求，则不执行任何操作
  }
  // 滚动到顶部
  const response = await axios.get(`/api/admin/userAttention/close?attUserId=${userId.value}&attUserName=${nickname.value}`)
  const data = response.data;
  if (data.code == 200) {
    isAttention.value=2;
  }
}
function getImageUrl(imgUrl) {
  if (imgUrl != null && imgUrl !== undefined && imgUrl !== '') {
    return `https://image.51x.uk/xinshijie${imgUrl}`;
  }
  return `/empty.png`; // Default image URL when imgUrl is null, undefined, or empty
}
</script>

<template>
  <div class="caption">
    <q-card class="my-card">
      <div class="row justify-center">
        <q-avatar font-size="52px" size="100px" class="q-mb-md">
          <img :src="getImageUrl(imgUrl)">
        </q-avatar>
      </div>
      <q-card-section class="text-center">
        <div class="text-h6"><a :href='"/userDetail?userId="+userId'>{{ nickname }}</a></div>
        <div class="text-subtitle2"><a :href='"/userDetail?userId="+userId'>{{ intro }}</a></div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        {{ intro }}
      </q-card-section>
      <q-separator dark/>
      <q-card-actions>
        <q-btn color="red-8" flat icon="favorite" round>{{ countAttention }}</q-btn>
        <q-btn color="red-8" flat icon="thumb_up" round>{{  countLike }}</q-btn>
        <q-btn color="red-8" flat icon="visibility" round>{{ countSee }}</q-btn>
      </q-card-actions>
      <q-separator dark/>

      <q-card-actions>
        <q-btn v-if="isAttention == 2" icon="favorite_border" @click="onAttention()">关注</q-btn>
        <q-btn v-if="isAttention == 1"  icon="favorite"  @click="closeAttention()">取消关注</q-btn>
        <q-btn color="secondary" flat> <a :href="'/userVip?userId=' + userId">VIP</a> </q-btn>

      </q-card-actions>
    </q-card>

  </div>
  <div v-if="albumList.length ==0">
    <div class="caption">
      <p class="text-h1 content-center bg-yellow">用户未创建图集</p>
    </div>
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
          <img :src="getImageUrl(album.imgUrl)">
          <q-card-section>
<!--            <div class="text-h6"><a :href=`/userAlbumDetail?aid=${album.id}`>{{ album.title }}</a></div>-->
            <div class="text-h6"><a :href="'/userAlbumDetail?aid=' + album.id">{{ album.title }}</a></div>
            <div class="text-subtitle2">{{ album.createTime }}</div>
          </q-card-section>
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