<script lang="ts" setup>
//关注
 const tokenCookie = useCookie('token');
    const token = tokenCookie.value;

definePageMeta({
  key: route => route.fullPath
})
const total = ref(0);
const maxPage = ref(0);

const current=ref(1)
const attentionList = ref([]);
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
    const response = await axios.get('/api/admin/userAttention/list?' + tansParams(queryParams.value), {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (response.data.code == 200) {
      total.value = response.data.total;
      maxPage.value=  total.value/20+1;
      attentionList.value = response.data.data;
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
      <q-item-label header>关注列表（{{ total }}）</q-item-label>

      <div v-for="(attention,index) in attentionList">
      <q-item>
        <q-item-section avatar top>
          <q-avatar>
            <img :src="attention.imgUrl">
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>
            <a :href='"/userDetail?userId="+attention.id'>
            {{ attention.nickname }}
            </a>
          </q-item-label>
          <q-item-label caption>{{ attention.intro }}</q-item-label>
        </q-item-section>

        <q-item-section side top>
          <q-badge :label="attention.countAttention"/>
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