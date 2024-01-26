<script lang="ts" setup>
const tokenCookie = useCookie('token',{path:"/"});
const token = tokenCookie.value;
definePageMeta({
  key: route => route.fullPath
})
const total = ref(0);
const maxPage = ref(0);

const current=ref(1)
const sellList = ref([]);
const queryData = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 20,
  }
});
const {queryParams} = toRefs(queryData);

async function getList(page: number) {
  queryParams.value.pageNum = page;
  try {
    const response = await axios.get('/api/admin/payment/listLog?' + tansParams(queryParams.value), {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (response.data.code == 200) {
      total.value = response.data.total;
      maxPage.value=  total.value/20+1;
      sellList.value = response.data.data;
    }
  } catch (error) {
    console.error('Error fetching images:', error);
  }
}
getList(1)

</script>

<template>
  <div class="q-pa-md" style="max-width: 350px">
    <q-list bordered padding>
      <q-item-label header>购买列表（{{total}}）</q-item-label>
      <div v-for="(sell,index) in sellList">
        <q-item>
          <q-item-section>
            <q-item-label>{{ sell.id }}</q-item-label>
            <q-item-label v-if=" sell.kind ==1 ">网站会员</q-item-label>
            <q-item-label v-if=" sell.kind ==2 ">用户会员</q-item-label>
            <q-item-label v-if=" sell.kind ==3 ">网站消费</q-item-label>
            <q-item-label v-if=" sell.kind ==4 ">购买图集</q-item-label>

            <q-item-label caption lines="2">{{ sell.productName }}</q-item-label>
          </q-item-section>

          <q-item-section side top>
            <q-item-label caption>{{ sell.createTime }}</q-item-label>
            <q-item-label caption>{{ sell.amount }}</q-item-label>
            <!--          <q-icon color="yellow" name="star"/>-->
          </q-item-section>
        </q-item>

        <q-separator inset="item" spaced/>
      </div>
    </q-list>
    <div class="q-pa-lg flex flex-center">
      <q-pagination
          v-model="current"
          :max="maxPage"
          direction-links
          @update:modelValue="getList(current)"

      />
    </div>
  </div>
</template>

<style scoped>

</style>