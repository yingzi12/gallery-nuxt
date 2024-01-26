<script setup lang="ts">
import PayaplCard from "~/pages/payaplCard.vue";
import {useRoute} from "vue-router";
const tokenCookie = useCookie('token',{path:"/"});
const token = tokenCookie.value;
// 接收url里的参数
const route = useRoute();
const productAmount = ref(route.query.productAmount);
const productId = ref(route.query.productId);
const productIntro = ref(route.query.productIntro);
const productName = ref(route.query.productName);
const userId = ref(route.query.userId);
const kind = ref(route.query.kind);
const url = ref(route.query.url);

</script>

<template>
  <div class="m-4 bg-white">
    <p class="pb-4 text-2xl text-slate-600">这里是最外层 app.vue</p>
    <NuxtLayout name="payment">
      <template #default>
        <PayaplCard :amount="productAmount" :productId="productId" :kind="kind" :intro="productIntro" :productName="productName" :url='"/userVip?userId="+userId'/>
      </template>
    </NuxtLayout>
  </div>
</template>

<style scoped>

</style>