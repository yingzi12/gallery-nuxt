<script lang="ts" setup>
import {reactive, ref, toRefs} from 'vue'
import {tansParams} from "~/server/utils/urlUtils";
const config = useRuntimeConfig();

const current = ref(1)
const slide = ref('first')
const title = ref('')
const userList = ref([]);
const total = ref(0);
const queryData = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    title: '',
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
  queryParams.value.title = title.value;
  queryParams.value.pageNum = page;
  const response = await axios.get('/api/systemUser/list?' + tansParams(queryParams.value))
  const data = response.data
  if (data.code == 200) {
    total.value = data.total
    userList.value = data.data
  }
}

getList(1)

function getImageUrl(imgUrl:string) {
  if (imgUrl != null && imgUrl != undefined && imgUrl != '') {
    return `${config.public.sourceWeb}${imgUrl}`; // Replace with your default image URL
  }
  return `/empty.png`;
}
</script>
<template>
  <q-tabs shrink stretch>
    <q-input v-model="title" :label="$t('search') " name="title" style="width: 600px" @keyup.enter="getList(1)"/>
    <q-icon name="search" @click="getList(1)"/>
  </q-tabs>
  <div class="q-pa-md">
    <div class="row justify-center q-gutter-sm">
      <q-intersection
          v-for="(user ,index) in userList"
          :key="index"
          class="example-item"
          once
          transition="scale"
      >
        <q-card bordered class="q-ma-sm" flat>
          <div class="row justify-center">
            <q-avatar font-size="52px" size="100px" class="q-mb-md">
              <img :src="getImageUrl(user.imgUrl)">
            </q-avatar>
          </div>
          <q-card-section class="text-center">
            <div class="text-h6"><a :href='"/userDetail?userId="+user.id'>{{ user.nickname }}</a></div>
            <div class="text-subtitle2"><a :href='"/userDetail?userId="+user.id'>{{ user.intro }}</a></div>
          </q-card-section>
          <q-separator dark/>
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
  height: auto
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
