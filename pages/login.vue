<script lang="ts" setup>
import {ref} from 'vue';
import {useQuasar} from 'quasar';

const router = useRouter(); // 使用 Vue Router 的 useRouter 函数

const $q = useQuasar();

const username = ref('');
const password = ref('');
const uuid = ref('');
const code = ref('');
const captcha = ref('');
const accept = ref(false);
const captchaImage = ref('');
async function refreshCaptcha() {
  try {
    const response = await axios("/api/users/captcha");
    const data = response.data;
    if (data && data.code == 200) {
      captchaImage.value = "data:image/png;base64," + data.img;
      uuid.value = data.uuid;
    } else {
      throw new Error("Invalid response");
    }
  } catch (error) {
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'error',
      message: 'Failed to load captcha'
    });
  }
}

async function onSubmit() {
  if (!accept.value) {
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: 'You need to accept the license and terms first'
    });
    return;
  }

  try {
    const response = await axios.post('/api/users/login', JSON.stringify({
      username: username.value,
      password: password.value,
      uuid: uuid.value,
      code: captcha.value,
      captcha: captcha.value,
    }), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = response.data;
    //console.log("login")
    //console.log(data)
    if (data.code == 200) {
      const tokenCookie = useCookie('token')
      tokenCookie.value=data.token
      const idCookie = useCookie('id')
      idCookie.value=data.user.id
      const userInfoCookie = useCookie('userInfo')
      userInfoCookie.value=data.user
      router.push('/users/'); // 或者其他页面
    } else {
      $q.notify({
            color: 'red-5',
            textColor: 'white',
            icon: 'error',
            message: data.message
          });
      // throw new Error(data.message || 'Login failed');
    }
  } catch (error) {
    await refreshCaptcha();
    // 处理登录错误
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'error',
      message: error.message || 'Login failed'
    });
  }
}

function isLogin() {
  const tokenCookie = useCookie('token');
  const token = tokenCookie.value;
  if (token) {
    // 如果用户未登录，则重定向到登录页面
    router.push('/users'); // 假设登录页面的路由为 '/login'
  }
}

onMounted(() => {
  isLogin();
  // 当组件挂载时，刷新验证码
  refreshCaptcha();
});
</script>


<template>
  <div class="center-container">
    <div class="q-pa-md" style="max-width: 600px">
      <q-card class="my-card">
        <q-card-section>
          <div class="text-h6">登录</div>
          <div class="text-subtitle2">登录图集，创建属于你的图集</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form class="q-gutter-md" @submit.prevent="onSubmit">
            <!-- 账号输入框 -->
            <q-input
                v-model="username"
                :rules="[val => val && val.length > 0 || 'Please enter your account']"
                filled
                label="账号 *"
                lazy-rules
            />

            <!-- 密码输入框 -->
            <q-input
                v-model="password"
                :rules="[val => val && val.length > 0 || 'Please enter your password']"
                filled
                label="密码 *"
                type="password"
            />

            <!-- 验证码输入框 -->
            <q-input
                v-model="captcha"
                :rules="[val => val && val.length > 0 || '请输入验证码']"
                filled
                label="验证码 *"
            />
            <div class="q-mb-md">
              <img :src="captchaImage" @click="refreshCaptcha">
              <div>点击图片刷新验证码</div>
            </div>

            <!-- 接受条款切换 -->
            <q-toggle v-model="accept" label="I accept the license and terms"/>

            <div>
              <q-btn color="primary" label="登录" style="width: 100%;" type="submit"/>
            </div>

            <!-- 注册与忘记密码链接 -->
            <div class="extra-links">
              <router-link to="/register">注册</router-link>
              <router-link to="/forgot-password">忘记密码?</router-link>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>
<style scoped>
.center-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh; /* 使容器至少与视口一样高 */
}

.extra-links {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
</style>