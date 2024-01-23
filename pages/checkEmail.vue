<script lang="ts" setup>
const code = ref(null)

function onSubmit(){

}
</script>


<template>
  <div class="center-container">
    <div class="q-pa-md" style="max-width: 600px">
      <q-card class="my-card">
        <q-card-section>
          <div class="text-h6">验证邮箱</div>
          <div class="text-subtitle2">在下方输入邮箱验证码，验证邮箱</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form class="q-gutter-md" @submit.prevent="onSubmit">
            <!-- 账号输入框 -->
            <q-input
                v-model="code"
                :rules="[val => val && val.length > 0 || '请输入你的邮箱验证码']"
                filled
                :label="$t('login.email')+' *'"
                lazy-rules
            />
            <div>
              <a href="/privacyPolicy">重新发送验证码</a>
            </div>
            <div>
              <q-btn color="primary" label="验证邮箱" style="width: 100%;" type="submit"/>
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