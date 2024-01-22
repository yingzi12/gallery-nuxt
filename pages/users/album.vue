<script lang="ts" setup>
const tokenCookie = useCookie('token');
const config = useRuntimeConfig();

const token = tokenCookie.value;
import {useQuasar} from "quasar";

const router = useRouter();
const albumList = ref([]);
const total = ref(0);
const maxPage = ref(0);

const current=ref(1)
const $q = useQuasar();

const queryData = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    title: '',
  },
  rules: {}
});
const {queryParams, form, rules} = toRefs(queryData);

// 通过 inject 获取 axios 的 get 方法

async function getList(page: number) {
  try {
    // 使用 get 方法发送 GET 请求
    const response = await axios.get('/api/admin/userAlbum/list', tansParams(queryParams.value));
    // 更新数据
    total.value = response.data.total;
    albumList.value = response.data.data;
    if (total.value > 0) {
      // total.value = albumList.value.length;
      total.value = response.data.total;
      maxPage.value=  total.value/20+1;
    }
  } catch (error) {
    console.error('获取数据失败：', error);
  }
  //console.log("token:" + token);
  queryParams.value.pageNum = page;
}

onMounted(() => {
  getList(1); // 在组件挂载时获取列表
});

function editAlbum(id: number) {

  router.push("/users/editAlbum?id=" + id.toString());
}

function updateStatus(album: any, statusChoise: number) {
  const message = ref("");
  if (statusChoise == 1) {
    const count = album.numberPhotos + album.numberVideo;
    if (count == 0 || !count) {
      album.status = 2;
      statusChoise = 2;
      $q.dialog({
        title: '通知',
        message: '照片与视频为0不能发布.',
        ok: {
          push: true
        },
      }).onOk(async () => {
        return;
      });
      return;
    }
    message.value = "发布";
  } else {
    message.value = "下架";
  }
  $q.dialog({
    title: '通知',
    message: '是否确认' + message.value + '.',
    ok: {
      push: true
    },
    cancel: {
      push: true,
      color: 'negative'
    },
  }).onOk(async () => {
    // server/api/admin/userSettingVip/updateStatus.get.ts
    const response = await axios.get(`/api/admin/userAlbum/updateStatus?id=${album.id}&status=${statusChoise}`, {
      method: 'get',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (response.data.code == 200) {
      await getList(1);
    }
  }).onCancel(() => {
    if (statusChoise == 1) {
      album.status = 2
    } else {
      album.status = 1
    }
    // //console.log('Cancel')
  });
}

function getImageUrl(imgUrl:string) {
  if (imgUrl != null && imgUrl != undefined && imgUrl != '') {
    return `${config.public.sourceWeb}${imgUrl}`; // Replace with your default image URL
  }
  return `/empty.png`;
}
</script>


<template>
  <div class="q-pa-md q-gutter-md">
    <router-link to="/users/addAlbum">
      <q-btn color="primary" label="添加"/>
    </router-link>
    <q-list bordered class="rounded-borders" style="max-width: 600px">
      <q-item-label header>我创建的图集（{{ total }}）</q-item-label>
      <div v-for="(album ,index) in albumList"
           :key="index">
        <q-item>
          <q-item-section>
            <q-img
                :src="getImageUrl(album.imgUrl)"
                spinner-color="white"
                style="height: 140px; max-width: 150px"
            />
          </q-item-section>
          <q-item-section>
            <q-item-label lines="1">
              <span class="text-weight-medium">{{ album.title }}</span>
            </q-item-label>
            <q-item-label caption>
              {{ album.intro }}
            </q-item-label>
            <q-item-label class="q-mt-xs text-body2 text-weight-bold text-primary text-uppercase">
              <span class="cursor-pointer"><a
                  :href="'/users/addVideo?aid='+album.id+'&title='+album.title+'&status='+album.status">视频： {{ album.numberVideo }}</a></span>
            </q-item-label>
            <q-item-label class="q-mt-xs text-body2 text-weight-bold text-primary text-uppercase">
              <span class="cursor-pointer"><a :href="'/users/addImage?aid='+album.id+'&status='+album.status+'&title='+album.title">照片： {{album.numberPhotos}}</a></span>
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <span v-if="album.charge ==1 ">免费</span>
            <span v-if="album.charge ==2 ">VIP免费</span>
            <span v-if="album.charge ==3 ">VIP折扣</span>
            <span v-if="album.charge ==4 ">VIP独享</span>
            <span v-if="album.charge ==5 ">统一</span>
            <span v-if="album.charge ==2 || album.charge ==3 || album.charge ==5 ">价格:{{ album.price }}</span>
            <span v-if="album.charge ==3 || album.charge ==4 ">VIP价格：{{ album.vipPrice }}</span>
            <q-btn v-if="album.status ==1 " class="gt-xs" dense flat icon="done" round size="12px">已发布</q-btn>
            <q-btn v-if="album.status !=1 " class="gt-xs" dense flat icon="close" round size="12px">未发布</q-btn>
          </q-item-section>
          <q-item-section side>
            <q-item-label caption>收藏： {{ album.countCollection }}</q-item-label>
            <q-item-label caption>购买： {{ album.countBuy }}</q-item-label>
            <q-item-label caption>查看： {{ album.countSee }}</q-item-label>
            <q-item-label caption>模特： {{ album.girl }}
            </q-item-label>
            <q-item-label caption>{{ album.createTime }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-toggle v-model="album.status"
                      :false-value="2"
                      :true-value="1" label="发布" @update:modelValue="updateStatus(album,album.status)"/>
            <q-btn class="gt-xs" dense flat icon="edit" round size="12px" @click="editAlbum(album.id)">修改</q-btn>
            <q-btn class="gt-xs" dense flat icon="delete" round size="12px">删除</q-btn>
          </q-item-section>
        </q-item>

        <q-separator spaced/>
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