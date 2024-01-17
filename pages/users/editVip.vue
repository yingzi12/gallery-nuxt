<script lang="ts" setup>
 const tokenCookie = useCookie('token');
    const token = tokenCookie.value;
import {ref} from "vue";
import {useRoute} from "vue-router";

const router = useRouter(); // 使用 Vue Router 的 useRouter 函数

const $q = useQuasar()
const route = useRoute();

const vid = ref(route.query.id);
const title = ref(null)
const desc = ref(null)
const intro = ref(null)
const tags = ref(null)
const price = ref(0);
const accept = ref(false)
const introduce = ref(null)
const timeType = ref(1)
const timeLong = ref(1);
const timeTypeList = [
  {
    label: '天',
    value: 1
  },
  {
    label: '周',
    value: 2
  },

  {
    label: '月',
    value: 3
  },
  {
    label: '年',
    value: 4
  },
  // {
  //   label: '永久',
  //   value: 5
  // }
]
if (accept.value !== true) {
  $q.notify({
    color: 'red-5',
    textColor: 'white',
    icon: 'warning',
    message: 'You need to accept the license and terms first'
  })
} else {
  $q.notify({
    color: 'green-4',
    textColor: 'white',
    icon: 'cloud_done',
    message: 'Submitted'
  })
}

function onReset() {
  title.value = null
  desc.value = null
  intro.value = null
  tags.value = null
  accept.value = false
  introduce.value = null
}

async function onSubmit() {
  // if (!accept.value) {
  //   notify('You need to accept the license and terms first', 'red-5');
  // } else {server≈.get.ts
  const response = await axios.post("/api/admin/userSettingVip/edit", JSON.stringify({
    id: vid.value,
    title: title.value,
    intro: intro.value,
    tags: tags.value,
    price: price.value,
    timeType: timeType.value,
    timeLong: timeLong.value,
    introduce: introduce.value
  }), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = response.data;
  if (data.code == 200) {
    $q.notify({
      color: 'green-4',
      textColor: 'white',
      icon: 'cloud_done',
      message: 'Create Success'
    });
    router.push('/users/vip'); // Redirect to login page

  } else {
    $q.notify({
      color: 'green-4',
      textColor: 'white',
      icon: 'cloud_done',
      message: 'Update Error'
    });
  }
  // 这里添加您的提交逻辑
  // }
}

async function getDetail() {
  const response = await axios.get('/api/admin/userSettingVip/info?id=' + vid.value, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = response.data;
  if (data.code == 200) {
    title.value = data.data.title;
    intro.value = data.data.intro;
    tags.value = data.data.tags;
    price.value = data.data.price;
    timeType.value = data.data.timeType;
    timeLong.value = data.data.timeLong;
    introduce.value = data.data.introduce;
  }
}

getDetail()
</script>

<template>

  <div class="q-pa-md" style="max-width: 400px">

    <q-form
        class="q-gutter-md"
        @reset="onReset"
        @submit="onSubmit"
    >
      <q-input
          v-model="title"
          :rules="[ val => val && val.length > 0 || 'Please type something']"
          filled
          hint="会员名称"
          label="会员名称 *"
          lazy-rules
      />
      <q-input
          v-model="intro"
          :rules="[ val => val && val.length > 0 || 'Please type something']"
          filled
          label="简介 *"
          type="textarea"
      />
      <q-input
          v-model="introduce"
          :rules="[ val => val && val.length > 0 || 'Please type something']"
          filled
          label="说明 *"
          type="textarea"
      />
      <div>
        <q-input v-if="timeType != 5 "
                 v-model="timeLong"
                 :rules="[
          val => (val !== null && val !== '') || '请输入时长',
        val => (val > 0 && val < 1000) || '不能小与0，大于1000'
                  ]"
                 filled
                 label="会员时长 *"
                 lazy-rules
                 type="number"
        />
        <q-select v-model="timeType"
                  :options="timeTypeList"
                  emit-value
                  label="单位"
                  map-options
                  outlined
        />
      </div>

      <q-input
          v-model="price"
          :rules="[
          val => (val !== null && val !== '') || '请输入金额',
        val => (val > 0 && val < 10000) || '金额不能大于1000'
                  ]"
          fill-mask="0"
          filled
          hint="美元: #.##"
          input-class="text-right"
          label="Price with 2 decimals"
          mask="#.##"
          reverse-fill-mask

      />
      <div>
        <q-btn color="primary" label="Submit" type="submit"/>
        <q-btn class="q-ml-sm" color="primary" flat label="Reset" type="reset"/>
      </div>
    </q-form>
  </div>
</template>

<style scoped>

</style>