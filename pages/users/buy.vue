<script lang="ts" setup>
const tokenCookie = useCookie('token',{domain:"aiavr.com",path:"/"});
const config = useRuntimeConfig();

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
    const response = await axios.get('/api/admin/payment/listBuy?' + tansParams(queryParams.value), {
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

function getImageUrl(imgUrl:string) {
  if (imgUrl != null && imgUrl != undefined && imgUrl != '') {
    return `${config.public.sourceWeb}${imgUrl}`; // Replace with your default image URL
  }
  return `/empty.png`;
}
</script>

<template>
  <div class="q-pa-md" style="max-width: 350px">
    <q-list bordered padding>
      <q-item-label header>列表（{{total}}）</q-item-label>
      <div v-for="(album,index) in sellList">
        <q-item>
          <q-item-section class="q-ml-none" thumbnail top>
            <img :src="getImageUrl(album.image)">
          </q-item-section>

          <q-item-section>
            <q-item-label>
              <a :href='"/userAlbumDetail?aid="+album.id'>
                {{ album.title }}
              </a>
            </q-item-label>
            <q-item-label caption>{{ album.intro }}
            </q-item-label>
          </q-item-section>

          <!--        <q-item-section side top>-->
          <!--          <q-item-label caption></q-item-label>-->
          <!--          <q-item-label caption>2023-11-11</q-item-label>-->

          <!--        </q-item-section>-->
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