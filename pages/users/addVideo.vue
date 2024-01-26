<script lang="ts" setup>
import SparkMD5 from 'spark-md5';
import {useRoute} from "vue-router";
import {useQuasar} from "quasar";
const tokenCookie = useCookie('token',{domain:"aiavr.com",path:"/"});
const token = tokenCookie.value;
const $q = useQuasar();
const config = useRuntimeConfig();
definePageMeta({
  key: route => route.fullPath
})
const isFree=ref(1);
const route = useRoute();
const aid = ref(route.query.aid);
const videoList = ref([]);
const total = ref(0);
const status = ref(Number(route.query.status));
const canUpload = computed(() => status.value === 2); // 计算是否可以上传
async function getList(page: number) {
  const response = await axios.get(`/api/admin/userVideo/list?aid=${aid.value}&pageNum=${1}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    },
  });
  const data =  response.data;
  if (data.code == 200) {
    total.value = data.total || videoList.value.length;
    videoList.value = data.data;
  }
}

async function deleteVideo(video: any, index: number) {
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
    const response = await axios.get('/api/admin/userVideo/remove?id=' + video.id+'&aid=' + video.aid, {
      method: 'get',
      headers: {
        'Authorization': `Bearer ${token}`
      },
    });
    const data = response.data;
    if (data.code === 200) {
      await getList(1);
    }
  }).onCancel(() => {
    // //console.log('Cancel')
  });
}

async function updateIsFree(id: number, isFree: number) {
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
    const response = await axios.get('/api/admin/userVideo/updateIsFree?id=' + id.toString() + "&isFree=" + isFree.toString(), {
      headers: {
        'Authorization': `Bearer ${token}`
      },
    });
    const data = response.data;
    //console.log(data.code)
    if (data.code == 200) {
      await getList(1);
    }
  }).onCancel(() => {
    // //console.log('Cancel')
  })
  ;
}

const file = ref(null);
//视频分段上传
const selectedFile = ref<File | null>(null);
const uploadVideoProgress = ref<number | null>(null);
const uploaderVideo = new FileUploader(config.public.baseUrl, updateVideoProgress);

const day = getCurrentDateFormatted();

function handleVideoFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    const file = target.files[0];
    // 检查文件类型是否为视频
    // if (!file.type.startsWith('video/')) {
    //   alert('Please select a video file.');
    //   return;
    // }
    // 检查文件 MIME 类型是否为 MP4 视频
    if (file.type !== 'video/mp4') {
      alert('Please select an MP4 video file.');
      return;
    }
    // 检查文件大小是否超过1GB
    const maxSize = 1024 * 1024 * 1024; // 1GB in bytes
    if (file.size > maxSize) {
      alert('File size should not exceed 1GB.');
      return;
    }
    selectedFile.value = file;
  }
}

function updateVideoProgress(chunkNumber: number, totalChunks: number) {
  uploadVideoProgress.value = Math.round((chunkNumber / totalChunks) * 100);
}

async function uploadVideoFile() {
  if (selectedFile.value) {
    try {
      const md5 = await calculateMd5(selectedFile.value);
      const response = await fetch(`${config.public.baseUrl}/admin/userVideo/checkAllMd5?md5=${md5}`, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      const data =await response.json();
      // const data= checkFileExistence(md5);
      //console.log(data);
      // const isFree = 2;
      if (data != null && data.code == 200) {
        await addVideoRecord(md5, data.data.sourceUrl, isFree.value);
        //console.log('Upload update complete');
      } else {
        // 生成唯一标识符：文件名-时间戳
        const identifier = `${md5}_${selectedFile.value.name}`;
        // const identifier = 'unique-file-id'; // 根据需要生成或获取唯一标识符
        await uploaderVideo.uploadFile(selectedFile.value, identifier, token, day, aid.value, isFree.value, md5);
        //console.log('Upload complete');
      }
      uploadVideoProgress.value = 100; // 更新进度条到100
      selectedFile.value = null;
    } catch (error) {
      console.error('Upload failed', error);
      uploadVideoProgress.value = 0; // 更新进度条到100%
    }
  }
}
//计算md5
async function calculateMd5(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!(file instanceof Blob)) {
      reject(new TypeError("calculateMd5 The provided value is not a Blob"));
      return;
    }
    const reader = new FileReader();
    reader.onload = function (e) {
      const data = e.target.result;
      if (data instanceof ArrayBuffer) {
        const md5 = SparkMD5.ArrayBuffer.hash(data);
        resolve(md5);
      } else {
        reject(new Error(" calculateMd5 File reading did not result in ArrayBuffer"));
      }
    };
    reader.onerror = function (e) {
      reject(new Error("FileReader error: " + e.target.error));
    };
    reader.readAsArrayBuffer(file);
  });
}

async function addVideoRecord(md5: string, url: string, isFree: number) {
  try {
    const response = await axios.post('/api/admin/userVideo/add',
        JSON.stringify({aid: aid.value, md5: md5, url: url, isFree: isFree})
        , {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });
    const data = response.data;
    if (data.code == 200) {
      $q.notify({
        type: 'positive',
        message: '视频已成功添加'
      });
      getList(1);
    } else {
      $q.notify({
        type: 'negative',
        message: '添加视频记录失败'
      });
    }
  } catch (error) {
    console.error('Error adding video record', error);
  }
}


function getCurrentDateFormatted() {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0'); // 月份从0开始，所以加1，并确保两位数
  const day = now.getDate().toString().padStart(2, '0'); // 确保天数是两位数

  return `${year}-${month}-${day}`;
}
onMounted(() => {
  getList(1);
});
watch(() => route.query.aid, (newAid) => {
  aid.value = newAid;
  getList(1);
});
</script>

<template>
  <q-breadcrumbs gutter="none">
    <q-breadcrumbs-el >
      <router-link to="/users/album">图集列表</router-link>
    </q-breadcrumbs-el>
    <q-breadcrumbs-el label="视频列表"/>
  </q-breadcrumbs>
  <div class="q-pa-md" v-if="canUpload">
    <div>
      <p class="text-body2">视频最大1024M</p>
      <p class="text-body2">最多3个视频</p>
      <p class="text-body2">视频文件只支持.mp4</p>
      <p class="text-body2">推荐电脑端免费转码工具:<a
          href="http://www.pcfreetime.com/formatfactory/cn/index.html">格式工厂</a></p>
    </div>
  </div>
  <div>
    <div class="q-pa-md" v-if="canUpload">
      <div>
        <q-toggle
            :false-value="1"
            :label="`上传图片是否私有`"
            :true-value="2"
            color="green"
            v-model="isFree"
        />
      </div>

      <q-card class="my-card">
        <q-card-section style="background-color: blue;">
          <div class="text-subtitle1" style="color: white;">上传{{isFree==1? '公开':'私有'}}视频</div>
        </q-card-section>
        <q-separator/>
        <q-card-actions vertical>
          <q-btn flat><input accept=".mp4" type="file" @change="handleVideoFileChange"/></q-btn>
          <q-btn flat>
            <button @click="uploadVideoFile">Upload</button>
          </q-btn>
        </q-card-actions>
        <q-separator/>
        <q-card-actions vertical>
          <div v-if="uploadVideoProgress">
            <p>Uploading: {{ uploadVideoProgress }}%</p>
          </div>
        </q-card-actions>
      </q-card>
    </div>
  </div>
  <!--  <q-th>视频列表（{{total}}）</q-th>-->
  <q-list bordered class="rounded-borders" style="max-width: 400px">
    <q-item-label header>视频列表（{{ total }}）</q-item-label>
    <div v-for="(video,index) in videoList"
         :key="index"
    >
      <q-item>
        <q-item-section>
          <img  v-if="video.status == 3" :src="config.public.sourceWeb+video.imgUrl" style="height: 140px;width: 150px">
          <q-img v-if="video.status != 3"
                 src="/zhuanma.webp"
                 spinner-color="white"
                 style="height: 140px; max-width: 150px"
          />
        </q-item-section>

        <q-item-section side>
          <q-item-label v-if="video.isFree == 1" caption>预览视频</q-item-label>
          <q-item-label v-if="video.isFree == 2" caption>正式视频</q-item-label>
          <q-item-label v-if="video.status == 1" caption>等待转码</q-item-label>
          <q-item-label v-if="video.status == 2" caption>转码中</q-item-label>
          <q-item-label v-if="video.status == 3" caption>可以播放</q-item-label>

          <q-item-label caption>{{ video.createTime }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn class="gt-xs" dense flat icon="delete" round size="12px" @click="deleteVideo(video,index)">删除</q-btn>
        </q-item-section>
      </q-item>

      <q-separator spaced/>
    </div>
  </q-list>

</template>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 350px

.example-item
  height: 290px
  width: 290px
</style>