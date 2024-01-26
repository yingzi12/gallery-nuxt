<script lang="ts" setup>
//收藏
const tokenCookie = useCookie('token',{path:"/"});
const config = useRuntimeConfig();

const token = tokenCookie.value;

definePageMeta({
  key: route => route.fullPath
})
const total = ref(0);
const maxPage = ref(0);

const current=ref(1)
const collectionSystemList = ref([]);
const collectionUserList = ref([]);

const queryData = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 20,
  }
});
const {queryParams} = toRefs(queryData);

async function getListSystem(page: number) {
  queryParams.value.pageNum = page;
  try {
    //server/api/admin/userCollection/list.get.ts
    const response = await axios.get('/api/admin/userCollection/listSystem?' + tansParams(queryParams.value), {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (response.data.code == 200) {
      total.value = response.data.total;
      maxPage.value=  total.value/20+1;
      collectionSystemList.value = response.data.data;
    }
  } catch (error) {
    console.error('Error fetching images:', error);
  }
}
async function getListUser(page: number) {
  queryParams.value.pageNum = page;
  try {
    //server/api/admin/userCollection/list.get.ts
    const response = await axios.get('/api/admin/userCollection/listUser?' + tansParams(queryParams.value), {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (response.data.code == 200) {
      total.value = response.data.total;
      maxPage.value=  total.value/20+1;
      collectionUserList.value = response.data.data;
    }
  } catch (error) {
    console.error('Error fetching images:', error);
  }
}
getListSystem(1);
getListUser(1);

const tab = ref('mails')

function getImageUrl(imgUrl:string) {
  if (imgUrl != null && imgUrl != undefined && imgUrl != '') {
    return `${config.public.sourceWeb}${imgUrl}`; // Replace with your default image URL
  }
  return `/empty.png`;
}
</script>

<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md" style="max-width: 600px">
      <q-card>
        <q-tabs
            v-model="tab"
            align="justify"
            class="bg-purple text-white"
            narrow-indicator
        >
          <q-tab label="系统" name="mails"/>
          <q-tab label="用户" name="alarms"/>
        </q-tabs>

        <q-tab-panels v-model="tab" animated class="bg-orange-1 text-dark ">
          <q-tab-panel class="bg-lime-1 text-dark" name="mails">
            <div class="q-pa-md" style="width: 100%">
              <q-list bordered padding>
                <div v-for="(collectionSystem,index) in collectionSystemList ">
                <q-item>
                  <q-item-section class="q-ml-none" thumbnail top>
                    <img :src="getImageUrl(collectionSystem.imgUrl)">
                  </q-item-section>

                  <q-item-section>
                    <q-item-label>
                      <a :href='"/detail?aid="+collectionSystem.id'>
                      {{ collectionSystem.title }}
                    </a>
                    </q-item-label>
                    <q-item-label caption>{{ collectionSystem.intro }}
                    </q-item-label>
                  </q-item-section>

                  <q-item-section side top>
                    <q-item-label caption>{{ collectionSystem.createTime }}</q-item-label>
                    <q-icon color="yellow" name="star"/>
                    <q-icon color="white" name="star_border"/>

                  </q-item-section>
                </q-item>
                <q-separator spaced/>
                </div>
              </q-list>
            </div>

          </q-tab-panel>

          <q-tab-panel class="bg-lime-1 text-dark" name="alarms">
            <div class="q-pa-md" style="width: 100%">
              <q-list bordered padding>
                <div v-for="(collectionUser,index) in collectionUserList ">
                  <q-item>
                    <q-item-section class="q-ml-none" thumbnail top>
                      <img :src="getImageUrl(collectionUser.imgUrl)">
                    </q-item-section>

                    <q-item-section>
                      <q-item-label>
                        <a :href='"/userAlbumDetail?aid="+collectionUser.id'>
                        {{ collectionUser.title }}
                        </a>
                      </q-item-label>
                      <q-item-label caption>{{ collectionUser.intro }}
                      </q-item-label>
                    </q-item-section>

                    <q-item-section side top>
                      <q-item-label caption>{{ collectionUser.createTime }}</q-item-label>
                      <q-icon color="yellow" name="star"/>
                      <q-icon color="white" name="star_border"/>
                    </q-item-section>
                  </q-item>
                  <q-separator spaced/>
                </div>
              </q-list>

            </div>

          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>
  </div>
</template>

<style scoped>

</style>