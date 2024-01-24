<script lang="ts" setup>
import {useRoute} from "vue-router";
import {useQuasar} from "quasar";
import ImageBatch from "~/pages/imageBatch.vue";

definePageMeta({
  key: route => route.fullPath
})

const config = useRuntimeConfig();


const $q = useQuasar();
const route = useRoute();
const aid = ref(route.query.aid);
const updateUrl = ref(`/image/uploadBatch?aid=${aid.value}`);

const imageList = ref([]);
const total = ref(0);
const maxPage = ref(0);

const current=ref(1)

const queryData = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    title: '',
    aid: aid.value,
  }
});
const {queryParams} = toRefs(queryData);

async function getList(page: number) {
  queryParams.value.aid = aid.value;
  queryParams.value.pageNum = page;
  try {
    const response = await axios.get('/api/image/list?' + tansParams(queryParams.value), {

    });
    if (response.data.code == 200) {
      total.value = response.data.total;
      maxPage.value=  total.value/queryParams.value.pageSize+1;
      imageList.value = response.data.data;
    }
  } catch (error) {
    console.error('Error fetching images:', error);
  }
}

async function deleteImage(id: number) {
  $q.dialog({
    title: '通知',
    message: '是否确认删除.',
    ok: {
      push: true
    },
    cancel: {
      push: true,
      color: 'negative'
    },
  }).onOk(async () => {
    const response = await axios.get('/api/image/remove?id=' + id.toString()+'&aid=' + aid.value, {
      method: 'get',
    });
    if (response.data.code == 200) {
      await getList(1);
    }
  }).onCancel(() => {
    // //console.log('Cancel')
  });
}

async function updateIsFree(image: any, isFree: number) {
  $q.dialog({
    title: '通知',
    message: '是否确认修改.',
    ok: {
      push: true
    },
    cancel: {
      push: true,
      color: 'negative'
    },
  }).onOk(async () => {
    const response = await axios.get('/api/image/updateIsFree?id=' + image.id + "&isFree=" + isFree, {
      headers: {
      }
    });
    const data = response.data;
    if (data.code === 200) {
      image.isFree = isFree;
      // await getList(1);
    }
  }).onCancel(() => {
    // //console.log('Cancel')
  })
  ;
}

// onMounted(() => {
//   getList(1);
// });
watch(() => route.query.aid, (newAid) => {
  aid.value = newAid;
  getList(1);
});
getList(1);
</script>

<template>
  <q-breadcrumbs gutter="none">
    <q-breadcrumbs-el >
      <router-link to="/addAlbumList">系统图集列表</router-link>
    </q-breadcrumbs-el>
    <q-breadcrumbs-el label="图片列表"/>
  </q-breadcrumbs>
  <div class="q-pa-md">
    <div class="q-gutter-sm row items-start">
      <ImageBatch :url="updateUrl" :on-upload-complete="() => getList(1)" />
    </div>
  </div>
  <q-th>图片列表（{{ total }}）</q-th>
  <div class="q-pa-md">
    <div class="row justify-center q-gutter-sm">
      <q-intersection
          v-for="(image,index) in imageList"
          :key="index"
          class="example-item"
          transition="scale"
      >
        <q-card bordered class="q-ma-sm" flat>
          <img :src="config.public.sourceWeb+image.sourceUrl">

          <q-card-section>
            <q-btn v-if="image.isFree == 2" color="primary" icon="visibility" square @click="updateIsFree(image,1)">
              预览
            </q-btn>
            <q-btn v-if="image.isFree == 1" color="primary" icon="sunny" square @click="updateIsFree(image,2)">正式
            </q-btn>
            <q-btn color="primary" icon="delete" square @click="deleteImage(image.id)">删除</q-btn>
          </q-card-section>
        </q-card>
      </q-intersection>

    </div>
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

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 350px

.example-item
  height: 490px
  width: 290px
</style>