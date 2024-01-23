<script lang="ts" setup>
import {useRoute} from "vue-router";
import PayaplCard from "~/pages/payaplCard.vue";
const tokenCookie = useCookie('token');
const token = tokenCookie.value;
const route = useRoute();
const config = useRuntimeConfig();

const userId = ref(route.query.userId);
const current = ref(1)
const slide = ref('first')
const nickname = ref('')
const intro = ref('')
const imgUrl = ref(null);
const countSee = ref(0);
const countLike = ref(0);
const countAttention = ref(0);

const productName = ref(null);
const productId = ref(null);
const productAmount = ref(null);
const productIntro = ref(null);

const vipList = ref([]);
const total = ref(0);

const queryData = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
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
  // queryParams.value.title = title.value;
  queryParams.value.pageNum = page;
  queryParams.value.userId = userId.value;
  //server/api/userSettingVip/list.get.ts
  const response = await axios.get('/api/userSettingVip/list?' + tansParams(queryParams.value))
  const data = response.data;
  //console.log(data.code)
  if (data.code == 200) {
    total.value = data.total
    vipList.value = data.data
  }
}

getList(1)
const paypalDialog = ref(false);
function openPayPalDialog (vip:any){
  //console.log("------------openPayPalDialog---------------------------")
  paypalDialog.value = true;
  productId.value=vip.id;
  productName.value=vip.title;
  productIntro.value=vip.intro;
  productAmount.value=vip.price;

};
async function getDetail() {
  const response = await axios.get(`/api/systemUser/info?userId=${userId.value}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });
  const data = response.data;
  if (data.code == 200) {
    const userData=data.data;
    nickname.value = userData.nickname;
    intro.value = userData.intro;
    imgUrl.value = userData.imgUrl ;
    countSee.value = userData.countSee;
    countLike.value = userData.countLike;
    countAttention.value = userData.countAttention;
  }
}

getDetail();

function getImageUrl(url) {
  console.log(url)
  if (url != null) {
    return `${config.public.sourceWeb}${url}`;
  }
  return "/favicon.png";
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
      </q-card-section>

      <q-card-section class="q-pt-none">
        {{ intro }}
      </q-card-section>
      <q-separator dark/>
      <q-card-actions>
        <q-btn color="red-8" flat icon="favorite" round>{{countAttention }}
        </q-btn>
        <q-btn color="red-8" flat icon="thumb_up" round>{{  countLike }}
        </q-btn>
        <q-btn color="red-8" flat icon="visibility" round>{{ countSee }}
        </q-btn>
      </q-card-actions>
      <q-separator dark/>

<!--      <q-card-actions>-->
<!--        <q-btn color="secondary" flat>关注</q-btn>-->
<!--        <q-btn color="secondary" flat><a href="/userVip">VIP</a></q-btn>-->
<!--      </q-card-actions>-->
    </q-card>

  </div>
  <div v-if="vipList.length ==0">
     <div class="flex-center">
       <p class="text-h1 content-center bg-yellow">用户未设置VIP</p>
     </div>
  </div>
  <div>
    <div class="flex flex-center q-gutter-md" style="padding: 20px">
      <div v-for="(vip,index) in vipList" :key="vip.id" class="row justify-center">
        <div class="col">
          <q-card class="my-card">
            <q-card-section class="bg-secondary text-white">
              <div class="text-h5" style="padding: 10px;">{{ vip.title }}</div>
              <div class="text-subtitle2">
                <p id="cache47" style="font-size: 36px;">
                  <span id="cache48">{{ vip.price }}$</span>
<!--                  <span id="cache38" v-if="vip.timeType != 5" class="strikethrough">{{ vip.timeLong }}</span>-->
<!--                  <span id="cache49" v-if="vip.timeType == 1" style="font-size: 20px;">{{ vip.timeLong }}/天</span>-->
<!--                  <span id="cache49" v-if="vip.timeType == 2" style="font-size: 20px;">{{ vip.timeLong }}/周</span>-->
<!--                  <span id="cache49" v-if="vip.timeType == 3" style="font-size: 20px;">{{ vip.timeLong }}/月</span>-->
<!--                  <span id="cache49" v-if="vip.timeType == 4" style="font-size: 20px;">{{ vip.timeLong }}/年</span>-->
<!--                  <span id="cache49" v-if="vip.timeType == 5" style="font-size: 20px;">永久</span>-->
                </p>
              </div>
            </q-card-section>
            <q-separator dark/>

            <q-card-section class="card-section" style="height: 176px">
<!--              <div v-for="feature in vip.features" :key="feature" class="q-mb-sm">-->
              <div  class="q-mb-sm">
                <p  v-if="vip.timeType == 1" >时长 ：{{ vip.timeLong }}天</p>
                <p  v-if="vip.timeType == 2" >时长 ：{{ vip.timeLong }}周</p>
                <p  v-if="vip.timeType == 3" >时长 ：{{ vip.timeLong }}月</p>
                <p  v-if="vip.timeType == 4" >时长 ：{{ vip.timeLong }}年</p>
                <p  v-if="vip.timeType == 5" >时长 ：永久</p>
              </div>
              <div  class="q-mb-sm">
                <pre id="myPre" style="color:#999999;"> {{ vip.introduce }}</pre>
              </div>
<!--              </div>-->
            </q-card-section>

            <q-card-actions align="right" style="padding: 10px">
              <q-btn  @click="openPayPalDialog(vip)">购买 </q-btn>
            </q-card-actions>
<!--            <div class="q-pa-md q-gutter-sm">-->
<!--              <q-btn v-if="album.charge != 1" @click="openPayPalDialog()">购买 </q-btn>-->
<!--              <q-btn v-if="isCollection == 2" icon="favorite_border" @click="onCollection()">收藏</q-btn>-->
<!--              <q-btn v-if="isCollection == 1"  icon="favorite"  @click="closeCollection()">取消收藏</q-btn>-->
<!--            </div>-->
          </q-card>
        </div>
      </div>
    </div>
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
  <q-dialog v-model="paypalDialog">
    <PayaplCard :amount="productAmount" :productId="productId" :kind="2" :intro="productIntro" :productName="productName" :url='"/userVip?userId="+userId'/>
  </q-dialog>
</template>

<style scoped>

.caption {
  display: flex;
  justify-content: center;
  align-items: center;
}

.my-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 350px;
  height: 360px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
}

.my-card:hover {
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
}

.bg-secondary, .card-section {
  width: 100%; /* 使子元素宽度与卡片相同 */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center; /* 文本居中 */
}

.card-section p {
  margin: 0; /* 移除段落默认的外边距 */
}

.flex-center {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  height: 100%; /* 或者根据需要设置高度 */
}

.strikethrough {
  text-decoration: line-through;
}
#myPre {
  white-space: pre-wrap; /* 允许自动换行，同时保留空白符 */
}
</style>
