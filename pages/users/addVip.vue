<script lang="ts" setup>
 const tokenCookie = useCookie('token',{domain:"aiavr.com",path:"/"});
    const token = tokenCookie.value;

const router = useRouter(); // 使用 Vue Router 的 useRouter 函数

const $q = useQuasar()

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


function onReset() {
  title.value = null
  desc.value = null
  intro.value = null
  tags.value = null
  accept.value = false
  introduce.value = null
}

async function onSubmit() {

  const response = await axios.post("/api/admin/userSettingVip/add", JSON.stringify({
    title: title.value,
    intro: intro.value,
    tags: tags.value,
    price: price.value,
    timeType: timeType.value,
    timeLong: timeLong.value,
    introduce: introduce.value
  }),{
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
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
}
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
          :rules="[ val => val && val.length >= 3 && val.length <= 30  || '请输入会员名称，长度3-30']"
          filled
          hint="会员名称"
          label="会员名称 *"
          lazy-rules
      />
      <q-input
          v-model="intro"
          :rules="[ val => val && val.length >= 5 && val.length <= 100  || '请输入简介，长度5-100']"
          filled
          label="简介 *"
          type="textarea"
      />
      <q-input
          v-model="introduce"
          :rules="[ val => val && val.length >= 5 && val.length <= 300  || '请输入说明，长度5-300']"
          filled
          label="说明 *"
          type="textarea"
      />
      <div>
        <q-input v-if="timeType != 5 "
                 v-model="timeLong"
                 :rules="[
          val => (val !== null && val !== '') || '请输入时长',
        val => (val >= 1 && val < 1000) || '不能小与1，大于1000'
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
        val => (val >= 1 && val < 1000) || '金额不能小与1，大于1000'
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