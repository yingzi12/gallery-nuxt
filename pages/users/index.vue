<script lang="ts" setup>
definePageMeta({
  key: route => route.fullPath
})
const config = useRuntimeConfig();
const tokenCookie = useCookie('token',{domain:"aiavr.com",path:"/"});
const token = tokenCookie.value;
const idCookie = useCookie('id');
const id = idCookie.value;
const router = useRouter(); // 使用 Vue Router 的 useRouter 函数


const user = ref(null);
const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'

// const id = ref(userStore.id);
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

async function getDetail() {
  const response = await axios.get(`/api/admin/users/info`, {
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
    imgUrl.value = data.data.imgUrl ==null ? "/favicon.png": data.data.imgUrl ;
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
function getImageUrl(url) {
  if (url != null) {
    return `${config.public.sourceWeb}${url}`;
  }
  return "/favicon.png";
}
</script>

<template>
  <div>
    <router-link to="/users/userHeadImage">
      <q-btn color="primary" label="编辑头像"/>
    </router-link>
    <router-link to="/users/userEdit">
      <q-btn color="primary" label="编辑个人信息"/>
    </router-link>
  </div>

  <div class="q-pa-md row items-start q-gutter-md">
    <q-card bordered class="my-card" flat>
      <q-item>
        <q-item-section>
          <q-avatar v-if="imgUrl != null" font-size="52px" size="100px">
            <img :src="getImageUrl(imgUrl)">
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ nickname != null ? nickname : '待登录' }}
            ({{ name != null ? name : '待登录' }})
          </q-item-label>
          <q-item-label v-if="id" caption>
            ID:{{ id }}
          </q-item-label>
          <q-item-label v-if="email" caption>
            {{ email }}
            <q-icon v-if="isEmail ==2 " name="warning" style="color: red"/>
          </q-item-label>
          <q-item-label v-if="isEmail ==2 " caption>
            （点击发送邮箱验证码）
          </q-item-label>
        </q-item-section>

      </q-item>

      <q-separator/>

      <q-card-section  horizontal>
        <div class="text-body2" style="padding: 10px">
          {{ intro }}
        </div>
      </q-card-section>

      <q-separator/>

      <q-card-actions>
        <q-btn color="red-8" flat icon="favorite" round>{{countAttention }}</q-btn>
        <q-btn color="red-8" flat icon="thumb_up" round>{{countLike }}</q-btn>
        <q-btn color="red-8" flat icon="visibility" round>{{countSee }}</q-btn>
      </q-card-actions>
    </q-card>


  </div>
</template>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 350px
</style>