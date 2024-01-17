<script lang="ts" setup>

const { locale } = useI18n()
const options= [
  {
    label: 'English',
    value: 'en'
  },
  {
    label: '中文',
    value: 'zh-CN'
  }
]
// 创建一个响应式引用作为默认语言
const defaultLanguage = ref('en');
// 设置默认语言的方法
const setDefaultLanguage = () => {
  const userLang = navigator.language || navigator.userLanguage;
  const availableLanguages = ['en', 'zh-CN']; // 示例语言列表

  if (availableLanguages.includes(userLang)) {
    locale.value = userLang;
  } else {
    locale.value = defaultLanguage.value;
  }
};

// 在组件挂载后调用设置默认语言的方法
onMounted(() => {
  setDefaultLanguage();
});
</script>
<template>
    <q-layout view="hhh LpR fff" style="height: 100vh;">
    <div>
        <q-header class="bg-primary text-black" height-hint="98" >
            <q-toolbar class="bg-purple text-white shadow-2 rounded-borders">
                <q-toolbar-title>
                    <q-avatar>
                        <img src="/album-logo.png">
                    </q-avatar>

                  {{ $t('title') }}
                </q-toolbar-title>

                <q-space />

                <q-select
                    filled
                    v-model="locale"
                    :options="options"
                    label="Standard"
                    emit-value
                    map-options
                />
            </q-toolbar>
            <q-tabs align="left">
                <q-route-tab to="/" :label="$t('home') " />
                <q-route-tab to="/see" :label="$t('trending') "  />
                <q-route-tab to="/findImage" :label="$t('findImage') "  />
              <q-route-tab to="/usersAlbum" :label="$t('usersAlbum') "  />
              <q-route-tab to="/usersIndex" :label="$t('usersIndex') "  />
              <q-route-tab to="/users" :label="$t('users') "  />
              <q-route-tab to="/down" :label="$t('down') "  />
            </q-tabs>
        </q-header>
        <div>
            <q-page-container style="height: 100%;">
        <slot />
            </q-page-container>
        </div>
    </div>
    </q-layout>
</template>



<style scoped>

</style>
