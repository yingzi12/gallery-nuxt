<script lang="ts" setup>

import Big from "big.js/big.mjs";

const $q = useQuasar()

const router = useRouter(); // 使用 Vue Router 的 useRouter 函数

const email = ref(null)
const withdrawName = ref(null)
const withdrawType = ref(1)
const amount = ref(0.0)
const amountReceived=ref(0.0);
const accept = ref(false)
const withdrawTypeList = [
  {
    label: 'Paypal',
    value: 1
  }
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
  email.value = null
  withdrawName.value = null
  withdrawType.value = 1
  amount.value = 0.0
  amountReceived.value=0.0
  accept.value = false
}
function updateAmount(amou:number){
  amountReceived.value=multiplyAndFix(amou, 0.7);
}
function multiplyAndFix(num1, num2, precision = 2) {
  return new Big(num1).times(num2).toFixed(precision);
}


async function onSubmit() {
  const response = await axios.post("/api/admin/userWithdraw/add", JSON.stringify({
    email: email.value,
    withdrawName: withdrawName.value,
    withdrawType: withdrawType.value,
    amount: amount.value,
    amountReceived: amountReceived.value,
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
    router.push('/users/withdraw'); // Redirect to login page

  } else {
    $q.dialog({
      title: '错误',
      message: '金额错误.',
      ok: {
        push: true
      },
    }).onOk(async () => {

    }).onCancel(() => {
      // //console.log('Cancel')
    });
  }
}
</script>

<template>
  <q-card class="my-card bg-purple text-white">
    <q-card-section>
      <div class="text-h6">说明</div>
    </q-card-section>
    <q-card-section>
      <p class="text-body1">提现手续费30%</p>
      <p class="text-body1">到账时间7个工作日</p>
      <p class="text-body1">目前只支持paypal</p>
    </q-card-section>
    <q-separator dark />
  </q-card>

  <div class="q-pa-md" style="max-width: 400px">

    <q-form
        class="q-gutter-md"
        @reset="onReset"
        @submit="onSubmit"
    >
      <q-select v-model="withdrawType"
                :options="withdrawTypeList"
                emit-value
                label="提现方式"
                map-options
                outlined
      />
      <q-input
          v-model="email"
          :rules="[ val => val && val.length > 0 || 'Please type something']"
          filled
          hint="Paypal E-mail"
          label="Paypal E-mail *"
          type="email"
      />
      <q-input
          v-model="withdrawName"
          :rules="[ val => val && val.length > 0 || 'Please type something']"
          filled
          hint="Paypal 用户名"
          label="Paypal 用户名 *"
          type="text"

      />
      <q-input
          v-model="amount"
          @update:modelValue="updateAmount(amount)"
          :rules="[
          val => (val !== null && val !== '') || '请输入提现金额',
        val => (val > 10 && val < 10000) || '金额不能小于10大于10000'
                  ]"
          fill-mask="0"
          filled
          hint="Mask: #.##"
          input-class="text-right"
          label="提现金额"
          mask="#.##"
          reverse-fill-mask

      />
      <q-input
          v-model="amountReceived"
          :readonly="true"
          :rules="[
          val => (val !== null && val !== '') || '到账金额',
        val => (val > 0 && val < 10000) || '金额不能大于10000'
                  ]"
          fill-mask="0"
          filled
          hint="Mask: #.##"
          input-class="text-right"
          label="到账金额"
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