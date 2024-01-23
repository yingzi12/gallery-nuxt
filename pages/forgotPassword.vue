<script lang="ts" setup>
const email = ref(null)

function onSubmit(){

}
</script>


<template>
  <div class="center-container">
    <div class="q-pa-md" style="max-width: 600px">
      <q-card class="my-card">
        <q-card-section>
          <div class="text-h6">发送验证邮件</div>
          <div class="text-subtitle2">在下方输入邮箱，发送邮箱验证码</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form class="q-gutter-md" @submit.prevent="onSubmit">
            <!-- 账号输入框 -->
            <q-input
                v-model="email"
                :rules="[val => val && val.length > 0 || '请输入你的邮箱']"
                filled
                :label="$t('login.email')+' *'"
                lazy-rules
            />
            <div>
              <q-btn color="primary" label="发送验证邮件" style="width: 100%;" type="submit"/>
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