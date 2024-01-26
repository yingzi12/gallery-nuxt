<script lang="ts" setup>
import {useQuasar} from "quasar";

const tokenCookie = useCookie('token',{domain:"aiavr.com",path:"/"});
const token = tokenCookie.value;
const idCookie = useCookie('id');
const id = idCookie.value;

definePageMeta({
  key: route => route.fullPath
})

const $q = useQuasar();

const router = useRouter();

const vipList = ref([]);
const total = ref(0);
const maxPage = ref(0);

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
    const response = await axios.get('/api/admin/userSettingVip/list', tansParams(queryParams.value));
    // 更新数据
    total.value = response.data.total;
    vipList.value = response.data.data;
    if (total.value > 0) {
      total.value = response.data.total;
      maxPage.value=  total.value/20+1;
    }
  } catch (error) {
    console.error('获取数据失败：', error);
  }
  //console.log("token:" + token);
  queryParams.value.pageNum = page;
}


function editAlbum(id: number) {
  router.push("/users/editVip?id=" + id.toString());
}

function updateStatus(vip: any, statusChoise: number) {
  //console.log(vip)
  //console.log(statusChoise)
  // const status=ref(1);
  const message = ref("");
  if (statusChoise == 1) {
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
    const response = await axios.get(`/api/admin/userSettingVip/updateStatus?id=${vip.id}&status=${statusChoise}`, {
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
      vip.status = 2
    } else {
      vip.status = 1
    }
    // //console.log('Cancel')
  });
}

onMounted(() => {
  getList(1); // 在组件挂载时获取列表
});
</script>

<template>
  <div class="q-pa-md q-gutter-md">
    <div>
      <router-link to="/users/addVip">
        <q-btn color="primary" label="添加"/>
      </router-link>
      <router-link :to='"/userVip?userId="+id'>
        <q-btn color="primary" label="VIP页面查看"/>
      </router-link>
    </div>
    <q-list bordered class="rounded-borders" style="max-width: 600px">
      <q-item-label header>我创建的VIP（{{ total }}）</q-item-label>
      <div v-for="(vip,index) in vipList" :key="index">
        <q-item>
          <q-item-section>
            <q-item-label lines="1">
              <span class="text-weight-medium">{{ vip.title }}</span>
            </q-item-label>
            <q-item-label caption>{{ vip.createTime }}</q-item-label>
            <q-item-label caption lines="1">
              {{ vip.intro }}
            </q-item-label>
            <q-item-label caption lines="3">
              {{ vip.introduce }}
            </q-item-label>

          </q-item-section>
          <q-item-section side>
            <q-btn v-if="vip.status ==1 " class="gt-xs" dense flat icon="done" round size="12px">已发布</q-btn>
            <q-btn v-if="vip.status !=1 " class="gt-xs" dense flat icon="close" round size="12px">未发布</q-btn>
          </q-item-section>


          <q-item-section side>
            <q-item-label caption>价格：{{ vip.price }}</q-item-label>
            <q-item-label v-if="vip.timeType!=5" caption>单位：{{ vip.timeLong }}/
              <span v-if="vip.timeType==1">天</span>
              <span v-if="vip.timeType==2">周</span>
              <span v-if="vip.timeType==3">月</span>
              <span v-if="vip.timeType==4">年</span>
              <span v-if="vip.timeType==5">永久</span>
            </q-item-label>
            <q-item-label v-if="vip.timeType==5" caption>单位：
              <span v-if="vip.timeType==5">永久</span>
            </q-item-label>
            <q-item-label caption>购买：{{ vip.countBuy }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-toggle v-model="vip.status"
                      :false-value="2"
                      :true-value="1" label="发布" @update:modelValue="updateStatus(vip,vip.status)"/>
            <q-btn class="gt-xs" dense flat icon="edit" round size="12px" @click="editAlbum(vip.id)">修改</q-btn>
            <q-btn class="gt-xs" dense flat icon="delete" round size="12px">删除</q-btn>

          </q-item-section>
        </q-item>

        <q-separator spaced/>
      </div>
    </q-list>
  </div>

</template>

<style scoped>

</style>