<script lang="ts" setup>
import PayaplCard from "~/pages/payaplCard.vue";
const tokenCookie = useCookie('token',{path:"/"});
const token = tokenCookie.value;
const current = ref(1)
const slide = ref('first')
const intro = ref('')
const imgUrl = ref("/favicon.png");
const countSee = ref(0);

const productName = ref(null);
const productId = ref(null);
const productAmount = ref(null);
const productIntro = ref(null);

const vips = ref([
  {
    id: 1,
    name: 'monthly', // 对应于 messages 中的键
    intro:"monthly",
    sourcePrice: "",
    price: '2.99',
    date: 'month', // 对应于 messages 中的键
    features: ['download', 'exclusiveLogo', 'videos']
  },
  {
    id: 3,
    name: 'halfYear',
    intro:"halfYear",
    sourcePrice: "16.9$",
    price: '14.90',
    date: 'halfYear',
    features: ['download', 'exclusiveLogo', 'discount98', 'videos']
  },
  {
    id: 4,
    name: 'yearly',
    intro:"yearly",
    sourcePrice: "35.9$",
    price: '28.90',
    date: 'year',
    features: ['download', 'exclusiveLogo', 'fullAlbum', 'discount95', 'videos']
  },
  // {
  //   id: 5,
  //   name: 'lifetime',
  //   intro:"lifetime",
  //   sourcePrice: "99.9$",
  //   price: '49.90',
  //   date: 'lifetime',
  //   features: ['download', 'exclusiveLogo', 'fullAlbum', 'discount90', 'exclusiveServices', 'videos']
  // }
]);
const url="/vip"
const paypalDialog = ref(false);

function openPayPalDialog (vip:any){
  //console.log("------------openPayPalDialog---------------------------")
  paypalDialog.value = true;
  productId.value=vip.id;
  productName.value=vip.name;
  productIntro.value=vip.intro;
  productAmount.value=vip.price;

};
</script>

<template>
  <div>
    <div class="flex flex-center q-gutter-md" style="padding: 20px">
      <div v-for="vip in vips" :key="vip.id" class="row justify-center">
        <div class="col">
          <q-card class="my-card">
            <q-card-section class="bg-secondary text-white">
              <div class="text-h5" style="padding: 10px;">{{ $t(`vip.${vip.name}`) }}</div>
              <div class="text-subtitle2">
                <p id="cache47" style="font-size: 36px;">
                  <span id="cache48">{{ vip.price }}</span>
                  <span id="cache38" class="strikethrough">{{ vip.sourcePrice }}</span>
                  <span id="cache49" style="font-size: 20px;">/{{ $t(`vip.date.${vip.date}`) }}</span>
                </p>
              </div>
              <div><span style="font-size: 10px;">{{ $t(`vip.cancellation`) }}</span></div>
            </q-card-section>
            <q-separator dark/>

            <q-card-section class="card-section" style="min-height: 176px">
              <div v-for="feature in vip.features" :key="feature" class="q-mb-sm">
                <p style="color:#999999;"> {{ $t(`vip.features.${feature}`) }}</p>
              </div>
            </q-card-section>

            <q-card-actions align="right" style="padding: 10px">
              <q-btn color="primary" icon="shopping_cart" label="购买" @click="openPayPalDialog(vip)"/>
            </q-card-actions>
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
    <PayaplCard :amount="productAmount" :productId="productId" :kind="1" :intro="productIntro" :productName="productName" :url="url"/>
  </q-dialog>
</template>

<style scoped>
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
</style>
