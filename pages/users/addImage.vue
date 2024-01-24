<script lang="ts" setup>
import pica from 'pica';
import { compressAccurately } from 'image-conversion';
const tokenCookie = useCookie('token');
const token = tokenCookie.value;
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
const status = ref(Number(route.query.status));
const canUpload = computed(() => status.value === 2); // 计算是否可以上传

const updateUrl = ref(`/admin/userImage/uploadBatch?aid=${aid.value}`);
const isFree=ref(1);
const imageList = ref([]);
const total = ref(0);
const maxPage = ref(0);

const current=ref(1)

const queryData = reactive({
  queryParams: {
    pageNum: 1,
    pageSize:10,
    title: '',
    aid: aid.value,
  }
});
const {queryParams} = toRefs(queryData);

async function getList(page: number) {
  current.value=page
  queryParams.value.aid = aid.value;
  queryParams.value.pageNum = page;
  try {
    const response = await axios.get('/api/admin/userImage/list?' + tansParams(queryParams.value), {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (response.data.code == 200) {
      total.value = response.data.total;
      maxPage.value=  total.value/10+1;
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
    const response = await axios.get('/api/admin/userImage/remove?id=' + id.toString()+'&aid=' + aid.value, {
      method: 'get',
      headers: {
        'Authorization': `Bearer ${token}`
      }
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
    const response = await axios.get('/api/admin/userImage/updateIsFree?id=' + image.id + "&isFree=" + isFree, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = response.data;
    if (data.code === 200) {
      image.isFree = isFree;
      // await getList(1);
    };
  }).onCancel(() => {
    console.log('Cancel')
  });
};


watch(() => route.query.aid, (newAid) => {
  aid.value = newAid;
  getList(1);
});
getList(1);
</script>

<template>
  <q-breadcrumbs gutter="none">
    <q-breadcrumbs-el >
      <router-link to="/users/album">图集列表</router-link>
    </q-breadcrumbs-el>
    <q-breadcrumbs-el label="图片列表"/>
  </q-breadcrumbs>

  <div class="q-pa-md" v-if="canUpload">
    <ImageBatch :url="updateUrl" :on-upload-complete="() => getList(1)" />
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
          <img :src="config.public.sourceWeb+image.imgUrl">

          <q-card-section>
            <div>
            <q-th v-if="image.isFree == 1" style="color: black"  square>
              公开
            </q-th>
            <q-th v-if="image.isFree == 2" style="color:blue " square>私有
            </q-th>
            </div>
            <div>
            <q-btn color="red" icon="delete" square @click="deleteImage(image.id)">删除</q-btn>
            </div>
          </q-card-section>
        </q-card>
      </q-intersection>

    </div>
  </div>
  <div class="q-pa-lg flex flex-center">
    <q-pagination
        v-model="current"
        :max="maxPage"
        direction-links
        @update:modelValue="getList(current)"

    />
  </div>
</template>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 350px

.example-item
  height: 490px
  width: 290px
  margin-bottom: 10px // 添加底部外边距

.flex-center
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
.flex-center
  margin-top: 20px

</style>