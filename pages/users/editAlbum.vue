<script lang="ts" setup>
import {useQuasar} from 'quasar';
 const tokenCookie = useCookie('token');
    const token = tokenCookie.value;

const router = useRouter(); // 使用 Vue Router 的 useRouter 函数

const config = useRuntimeConfig();
const $q = useQuasar();
const route = useRoute();
const aid = ref(route.query.id);
const title = ref(null);
const girl = ref(null);
const intro = ref(null);
const payIntro = ref(null);

const tags = ref(null);
const imgUrl = ref("");
const vipPrice = ref(0.0);
const price = ref(0.0);
const accept = ref(false);
const charge = ref(1);
const previewImage = ref("/favicon.png");
const selectedImage = ref<File | null>(null);

function notify(message: string, color: string) {
  $q.notify({
    color: color,
    textColor: 'white',
    icon: color === 'red-5' ? 'warning' : 'cloud_done',
    message: message
  });
}

function onReset() {
  title.value = null;
  girl.value = null;
  intro.value = null;
  payIntro.value = null;
  tags.value = null;
  imgUrl.value = "";
  charge.value = 1;
  accept.value = false;
}

async function onSubmit() {
  const response = await axios.post("/api/admin/userAlbum/edit",
      JSON.stringify({
        id: aid.value,
        title: title.value,
        intro: intro.value,
        payIntro: payIntro.value,
        girl: girl.value,
        imgUrl: imgUrl.value,
        tags: tags.value,
        charge: charge.value,
        price: price.value,
        vipPrice: vipPrice.value,
      }),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  const data = response.data;
  if (data.code == 200) {
    $q.notify({
      color: 'green-4',
      textColor: 'white',
      icon: 'cloud_done',
      message: 'Create Success'
    });
    router.push('/users/album'); // Redirect to login page

  } else {
    $q.notify({
      color: 'green-4',
      textColor: 'white',
      icon: 'cloud_done',
      message: 'Update Error'
    });
  }
}

async function getDetail() {
  const response = await axios.get('/api/admin/userAlbum/info?id=' + aid.value, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = response.data;
  //console.log(data.code)
  if (data.code == 200) {
    title.value = data.data.title;
    intro.value = data.data.intro;
    girl.value = data.data.girl;
    imgUrl.value = data.data.imgUrl;
    tags.value = data.data.tags;
    charge.value = data.data.charge;
    price.value = data.data.price;
    vipPrice.value = data.data.vipPrice;
  }

}

async function handleImageUpload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file && file.size <= 2 * 1024 * 1024) { // 2MB限制
    selectedImage.value = file;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(config.public.baseUrl + '/admin/userAlbum/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include', // 确保携带 cookie
        headers: new Headers({
          'Authorization': `Bearer ${token}`
        })
      });

      if (response.ok) {
        const data = response.data;
        //console.log(data.data)
        previewImage.value = config.public.sourceWeb + data.data;
        imgUrl.value =  data.data;
      } else {
        throw new Error('Image upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      notify('Error uploading image', 'red-5');
    }
  } else {
    alert('图片大小不能超过2MB');
  }
}

const chargeList = [
  {
    label: '免费',
    value: 1
  },
  {
    label: 'VIP免费',
    value: 2
  },

  {
    label: 'VIP折扣',
    value: 3
  },
  {
    label: 'VIP独享',
    value: 4
  },
  {
    label: '统一价格',
    value: 5
  }
]

function updateCharge(charge: number) {
  price.value = 0.5;
  vipPrice.value = 0.5;
}

getDetail()

</script>

<template>

  <div class="q-pa-md" style="max-width: 400px">

    <q-form
        class="q-gutter-md"
        @reset="onReset"
        @submit="onSubmit"
    >
      <div class="q-pa-md q-gutter-sm">
        <div>
          <q-img
              :src="previewImage"
              spinner-color="white"
              style="height: 140px; max-width: 150px"
          />
        </div>
        <input accept="image/*" type="file" @change="handleImageUpload"/>
      </div>
      <q-input
          v-model="title"
          :rules="[ val => val && val.length > 0 || '请输入图集名称']"
          filled
          hint="输入图集名称"
          label="图集名称 *"
          lazy-rules
      />
      <q-input
          v-model="girl"
          :rules="[ val => val && val.length > 0 || '请输入模特']"
          filled
          hint="Name and surname"
          label="模特 *"
          lazy-rules
      />
      <q-input
          v-model="intro"
          :rules="[ val => val && val.length > 0 || '请输入简介']"
          filled
          label="简介 *"
          type="textarea"
      />
      <q-input v-if="charge !='1'"
               v-model="payIntro"
               filled
               label="付费说明(购买图集之后才能看到) *"
               type="textarea"
      />
      <!--      </div>-->
      <q-input
          v-model="tags"
          :rules="[ val => val && val.length > 0 || 'Please type something']"
          filled
          label="标签 *"
          lazy-rules
          type="text"
      />

      <div>
        <q-select v-model="charge" :options="chargeList" emit-value hint="付费方式" label="付费方式"
                  map-options
                  outlined
                  @update:modelValue="updateCharge"/>
        <q-input v-if="charge =='2' || charge =='3' || charge=='5'"
                 v-model="price"
                 :rules="[
          val => (val !== null && val !== '') || '请输入金额',
        val => (val > 0.5 && val < 10000) || '金额不能小与0.5大于1000'
                  ]"
                 fill-mask="0"
                 filled
                 hint="Mask: #.##"
                 input-class="text-right"
                 label="价格"
                 mask="#.##"
                 reverse-fill-mask
        />
        <q-input v-if="charge =='3' || charge=='4'"
                 v-model="vipPrice"
                 :rules="[
          val => (val !== null && val !== '') || '请输入金额',
        val => (val > 0.5 && val < 10000) || '金额不能小与0.5不能大于1000'
                  ]"
                 fill-mask="0"
                 filled
                 hint="Mask: #.##"
                 input-class="text-right"
                 label="VIP价格"
                 mask="#.##"
                 reverse-fill-mask
        />
      </div>
      <div>
        <q-btn color="primary" label="Submit" type="submit"/>
        <q-btn class="q-ml-sm" color="primary" flat label="Reset" type="reset"/>
      </div>
    </q-form>
  </div>
</template>

<style scoped>

</style>