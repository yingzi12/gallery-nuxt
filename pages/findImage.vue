<script lang="ts" setup>
import {useQuasar} from 'quasar'
const $q = useQuasar();
const config = useRuntimeConfig();
const total = ref(0);
const maxPage = ref(0);

const current=ref(1)

const queryData = reactive({
  queryParams: {
    pageNum: 1,
    pageSize:20,
    title: '',
  }
});
const {queryParams} = toRefs(queryData);
useHead({
  title: "图集网",
  meta: [
    {name: 'description', content: "图集网 美女 写真 摄影 秀人网 Photo Gallery, Beauty, Photo, Photography, Showman.com."},
    {name: 'title', content: "图集网"}

  ],
})
const data = reactive({
  form: {
    title: "",
    girl: "",
    createTime: ""
  },
});
const {form,} = toRefs(data);

async function onSubmit() {
  if (form.value.title == undefined || form.value.title == null || form.value.title.trim() == '' || form.value.title.trim().length == 0) {
    useQuasar().dialog({
      title: '信息',
      message: '必须填写图集名称.'
    }).onOk(() => {
      // //console.log('OK')
    }).onCancel(() => {
      // //console.log('Cancel')
    }).onDismiss(() => {
      // //console.log('I am triggered on both OK and Cancel')
    })
    return;
  }
  const response = await axios.post("/api/findImage/add",form.value, {
    // body: form.value,
  });

  const data = response.data;
  if (data.code == 200) {
    $q.dialog({
      title: '通知',
      message: '提交成功,等待管理员处理中.',
      ok: {
        push: true
      },
    }).onOk(async () => {
       getList(1);
    }).onCancel(() => {
       getList(1);
    });
  }
}

const findImageList = ref([]);

async function getList(page: number) {
  queryParams.value.pageNum = page;
  const response = await axios.get('/api/findImage/list?' + tansParams(queryParams.value))
  const data = response.data;
  if (data.code == 200) {
    total.value = data.total
    maxPage.value=  total.value/ queryParams.value.pageSize+1;
    findImageList.value = data.data
  }
}

async function handleAdd(id: number) {
  const response = await axios.get('/api/findImage/addFind?id=' + id.toString())
  const data = response.data;
  if (data.code === 200) {
    $q.dialog({
      title: '通知',
      message: '增加成功.',
      ok: {
        push: true
      },
    }).onOk(async () => {
      getList(1);
    }).onCancel(() => {
      getList(1);
    });
  }
}


getList(1)

function imageUrl(album) {
  if (album.sourceUrl != null && album.sourceUrl.startsWith('/image')) {
    return `${config.public.sourceWeb}${album.sourceUrl}`;
  }
  return album.sourceWeb + album.imgUrl;
}

const randomList = ref([]);

async function getRandom() {
  const response = await axios.get('/api/album/random')
  const data = response.data;
  if (data.code === 200) {
    randomList.value = data.data
  }
}

getRandom();
</script>
<template>
  <q-page>
    <div class="caption" style="max-width: 400px">
      <q-form @submit="onSubmit">
        <q-input v-model="form.title" :label="$t('form.title')"
                 :rules="[ val => val.length <= 200 || $t('form.titleLength') ]"
                 filled
        />
        <q-input v-model="form.girl
" :label="$t('form.model')"
                 :rules="[ val => val.length <= 50 || $t('form.modelLength') ]"
                 filled
        />
        <q-input v-model="form.createTime" :label="$t('form.shootTime')"
                 :rules="[ val => val.length <= 10 || $t('form.timeLength') ]"
                 filled
        />
        <q-btn :label="$t('form.submit')" type="submit"/>
      </q-form>
    </div>
    <div>
      <div class="q-pa-md">
        <p class="text-h5">{{ $t('form.findAlbum') }}</p>
        <q-markup-table>
          <thead>
          <tr>
            <th class="text-left">{{ $t('table.album') }}</th>
            <th class="text-right">{{ $t('table.model') }}</th>
            <th class="text-right">{{ $t('table.shootTime') }}</th>
            <th class="text-right">{{ $t('table.submitTime') }}</th>
            <th class="text-right">{{ $t('table.numberOfFinders') }}</th>
            <th class="text-right">{{ $t('table.action') }}</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="findImage in findImageList" :key="findImage.id">
            <td class="text-left">{{ findImage.title }}</td>
            <td class="text-right">{{findImage.girl}}
            </td>
            <td class="text-right">{{ findImage.createTime }}</td>
            <td class="text-right">{{ findImage.subTime }}</td>
            <td class="text-right">{{ findImage.countFind }}</td>
            <td class="text-right">
              <button @click="handleAdd(findImage.id)">{{ $t('table.find') }}</button>
            </td>
          </tr>
          </tbody>
        </q-markup-table>
        <div v-if="findImageList.length <=0" class="caption">
          <p class="text-h6">{{ $t('form.noData') }}</p>
        </div>
        <div class="q-pa-lg flex flex-center">
          <q-pagination
              v-model="current"
              size="20"
              :max="maxPage"
              direction-links
              @update:modelValue="getList(current)"
          />
        </div>

      </div>
    </div>
    <div>
      <!-- 在这里放置您希望在新列中显示的内容 -->
      <div class="row justify-center q-gutter-sm">
        <q-intersection
            v-for="(album ,index) in randomList"
            :key="index"
            class="example-item"
            once
            transition="scale"
        >
          <q-card bordered class="q-ma-sm" flat>
            <img :src="imageUrl(album)">
            <q-card-section>
              <div class="text-h6">
                <a :href='"/detail?aid="+album.id'>
                  <p class="text-caption  two-line-clamp"> {{ album.title }} </p>
                </a>
                <p class="text-caption" style="padding: 0px"> {{ album.createTime }} </p>
              </div>
            </q-card-section>

          </q-card>

        </q-intersection>
      </div>
    </div>
    <div class="row">
      <div class="col-2"></div>
      <div class="col-auto" style="margin: 0px">
        <div class="footer" style="margin: 0px;text-align: center;">
          <router-link to="">{{ $t('footer.about') }}</router-link>
          |
          <router-link to="">{{ $t('footer.contact') }}</router-link>
          |
          <router-link to="">{{ $t('footer.help') }}</router-link>
          |
          <router-link to="">{{ $t('footer.suggestions') }}</router-link>
          |
          <router-link to="">{{ $t('footer.report') }}</router-link>
          |
          <router-link to="/privacyPolicy">{{ $t('footer.privacyPolicy') }}</router-link>
          |
          <router-link to="/use">{{ $t('footer.termsOfUse') }}</router-link>
          |
          <router-link to="">{{ $t('footer.bugReport') }}</router-link>
          |
        </div>
        <div class="footerText text-weight-thin"><p>Copyright © 2002-2022 www.aiavr.uk Rights Reserved 版权所有
          心世界未来科技有限公司</p></div>
        <div class="footerText text-weight-thin"><p>图片,美女,写真,图集</p></div>
        <div class="footerText text-weight-light"><p>
          本站所收录的作品、社区话题、用户评论、用户上传内容或图片等均属用户个人行为。如前述内容侵害您的权益，欢迎举报投诉，一经核实，立即删除，本站不承担任何责任</p>
        </div>
        <div class="footerText text-weight-thin"><a href="https://www.51k.uk">心世界小说网</a>|<a
            href="https://www.30dizhi.uk">30导航</a>|<a href="https://www.aravrw.com">心世界</a></div>
      </div>
      <div class="col-2"></div>
    </div>
  </q-page>
</template>


<style lang="sass" scoped>
.caption
  padding: 20px
  justify-content: center
  align-items: center

.example-item
  height: 253px
  width: 150px

.two-line-clamp
  display: -webkit-box
  -webkit-line-clamp: 2
  -webkit-box-orient: vertical
  overflow: hidden
  text-overflow: ellipsis
//
//img
//  max-height: 100px
//  width: 100%
//  object-fit: cover


.q-card-section
  padding: 8px


.text-caption
  margin: 0
  font-size: 0.8em

</style>
