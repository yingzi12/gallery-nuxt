<script lang="ts" setup>
const router = useRouter(); // 使用 Vue Router 的 useRouter 函数
const drawer = ref(false);
const link = ref('detail')
const users = ref(null)
const previewImage = ref("/favicon.png")

const tokenCookie = useCookie('token');
//console.log("tokenCookie")
//console.log(tokenCookie)
const token = tokenCookie.value;
const idCookie = useCookie('id');
const id = idCookie.value;
const userCookie = useCookie('userInfo');
const userInfo = userCookie.value;

const name = ref(null);
const nickname = ref(null);
const email = ref(null);
const imgUrl = ref("/favicon.png");
const isEmail = ref(null);
const intro = ref(null);
const countSee = ref(0);
const countLike = ref(0);
const countAttention = ref(0);
const vip = ref(0);
const vipExpirationTime = ref(null);

// 添加注销方法

async function getDetail() {
  const response = await axios.get(`/api/admin/users/info`, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });
  const data = response.data;
  if (data.code == 200) {
    name.value = data.data.name;
    nickname.value = data.data.nickname;
    email.value = data.data.email;
    imgUrl.value = data.data.imgUrl ==null?"/favicon.png":data.data.imgUrl ;
    intro.value = data.data.intro;
    isEmail.value = data.data.isEmail;
    countSee.value = data.data.countSee;
    countLike.value = data.data.countLike;
    countAttention.value = data.data.countAttention;
    vip.value = data.data.vip;
    vipExpirationTime.value = data.data.vipExpirationTime;
  }
}

getDetail();

const logout = async () => {
  //console.log("------logout------------")
  const tokenCookie = useCookie('token');
  tokenCookie.value=null;
  const idCookie = useCookie('id');
  idCookie.value=null;
  const userCookie = useCookie('userInfo');
  userCookie.value=null;
  const response = await axios.get(`/api/admin/users/logout`, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });
  router.push('/login'); // 假设登录页面的路由为 '/login'
};

onMounted(() => {
  // 当组件挂载时检查用户的登录状态
  previewImage.value = (userInfo == null || userInfo.imgUrl == null) ? "/favicon.png" : userInfo.imgUrl;
  users.value = userInfo;
  // userStore.refreshCookieExpiration();
});
</script>

<template>
  <div class="q-pa-md" style="height: 100vh;">
    <q-layout class="shadow-2 rounded-borders" container view="lHh Lpr lff">
      <q-header class="bg-cyan-8" elevated>
        <q-toolbar>
          <q-btn dense flat icon="menu" round @click="drawer = !drawer"/>
        </q-toolbar>
      </q-header>

      <q-drawer
          v-model="drawer"
          :breakpoint="400"
          :width="200"
          show-if-above
      >
        <q-scroll-area style="height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd">
          <q-list padding>
            <q-item v-ripple
                    :active="link === 'detail'"
                    active-class="my-menu-link"
                    clickable
                    to="/users/"
                    @click="link = 'detail'"
            >
              <q-item-section avatar>
                <q-icon name="account_circle"/>
              </q-item-section>

              <q-item-section>
                {{ $t(`user.personalInfo`) }}
              </q-item-section>
            </q-item>

            <q-item v-ripple
                    :active="link === 'attention'"
                    active-class="my-menu-link"
                    clickable
                    to="/users/attention"
                    @click="link = 'attention'"
            >
              <q-item-section avatar>
                <q-icon name="favorite_border"/>
              </q-item-section>

              <q-item-section>
                {{ $t(`user.myAttention`) }}
              </q-item-section>
            </q-item>
            <q-item v-ripple
                    :active="link === 'collection'"
                    active-class="my-menu-link"
                    clickable
                    to="/users/collection"
                    @click="link = 'favorite_border'"
            >
              <q-item-section avatar>
                <q-icon name="star_rate"/>
              </q-item-section>

              <q-item-section>
                {{ $t(`user.myCollection`) }}
              </q-item-section>
            </q-item>
            <q-separator/>
            <q-item v-ripple
                    :active="link === 'buy'"
                    active-class="my-menu-link"
                    clickable
                    to="/users/buy"
                    @click="link = 'buy'"
            >
              <q-item-section avatar>
                <q-icon name="shopping_bag"/>
              </q-item-section>
              <q-item-section>
                {{ $t(`user.myPurchase`) }}
              </q-item-section>
            </q-item>
            <q-separator/>
            <q-item v-ripple
                    :active="link === 'album'"
                    active-class="my-menu-link"
                    clickable
                    to="/users/album"
                    @click="link = 'album'"
            >
              <q-item-section avatar>
                <q-icon name="perm_media"/>
              </q-item-section>
              <q-item-section>
                {{ $t(`user.myAlbum`) }}
              </q-item-section>
            </q-item>
            <q-item v-ripple
                    :active="link === 'vip'"
                    active-class="my-menu-link"
                    clickable
                    to="/users/vip"
                    @click="link = 'vip'"
            >
              <q-item-section avatar>
                <q-icon name="settings_brightness"/>
              </q-item-section>
              <q-item-section>
                {{ $t(`user.vipSettings`) }}
              </q-item-section>
            </q-item>
            <q-item v-ripple
                    :active="link === 'sell'"
                    active-class="my-menu-link"
                    clickable
                    to="/users/sell"
                    @click="link = 'sell'"
            >
              <q-item-section avatar>
                <q-icon name="view_headline"/>
              </q-item-section>
              <q-item-section>
                {{ $t(`user.userPurchase`) }}
              </q-item-section>
            </q-item>
            <q-item v-ripple
                    :active="link === 'withdraw'"
                    active-class="my-menu-link"
                    clickable
                    to="/users/withdraw"
                    @click="link = 'withdraw'"
            >
              <q-item-section avatar>
                <q-icon name="paid"/>
              </q-item-section>
              <q-item-section>
                {{ $t(`user.myWithdrawal`) }}
              </q-item-section>
            </q-item>
            <q-separator/>
            <q-item v-ripple
                    :active="link === 'invite'"
                    active-class="my-menu-link"
                    clickable
                    to="/users/invite"
                    @click="link = 'invite'"
            >
              <q-item-section avatar>
                <q-icon name="send"/>
              </q-item-section>
              <q-item-section>
                {{ $t(`user.myInvitation`) }}
              </q-item-section>
            </q-item>
            <q-item v-ripple
                    :active="link === 'password'"
                    active-class="my-menu-link"
                    clickable
                    to="/users/password"
                    @click="link = 'password'"
            >
              <q-item-section avatar>
                <q-icon name="password"/>
              </q-item-section>

              <q-item-section>
                {{ $t(`user.resetPassword`) }}
              </q-item-section>
            </q-item>
            <q-item v-ripple
                    :active="link === 'buyLog'"
                    active-class="my-menu-link"
                    clickable
                    to="/users/buyLog"
                    @click="link = 'buyLog'"
            >
              <q-item-section avatar>
                <q-icon name="vertical_split"/>
              </q-item-section>

              <q-item-section>
                {{ $t(`user.consumptionRecord`) }}
              </q-item-section>
            </q-item>
            <q-item
                v-ripple
                :active="link === 'service'"
                active-class="my-menu-link"
                clickable
                @click="link = 'service'"
            >
              <q-item-section avatar>
                <q-icon name="mail_outline"/>
              </q-item-section>

              <q-item-section>
                {{ $t(`user.customerService`) }}
              </q-item-section>
            </q-item>
            <q-item
                v-ripple
                :active="link === 'drafts'"
                active-class="my-menu-link"
                clickable
                @click="logout"
            >
              <q-item-section avatar>
                <q-icon name="exit_to_app"/>
              </q-item-section>

              <q-item-section>
                {{ $t(`user.logOut`) }}
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>

        <q-img class="absolute-top" src="https://cdn.quasar.dev/img/material.png" style="height: 150px">
          <div class="absolute-bottom bg-transparent">
            <q-avatar v-if="imgUrl" class="q-mb-sm" size="56px">
              <img :src="imgUrl">
            </q-avatar>
            <div class="text-weight-bold">{{ nickname != null ? nickname : '待登录' }}</div>
            <div v-if="email">
              {{ email }}
              <q-icon v-if="isEmail==2" name="warning" style="color: red"/>
            </div>
            <div v-if="isEmail==2">
              ( {{ $t(`user.emailVerification`) }})
            </div>
          </div>
        </q-img>
      </q-drawer>

      <q-page-container>
        <q-page padding>
          <NuxtPage :page-key="route => route.fullPath"/>
        </q-page>
      </q-page-container>
    </q-layout>
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

<style lang="sass">
.my-menu-link
  color: white
  background: #F2C037
</style>