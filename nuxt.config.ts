// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  dir: {
    static: 'static', // 新的静态文件夹名称
  },
  buildModules: [
    'quasar/nuxt',
  ],
  modules: [
    '@nuxtjs/i18n',
    'nuxt-quasar-ui',
    'nuxt-simple-sitemap',
    '@nuxtseo/module',
  ],
  runtimeConfig: {
    // Public keys that are exposed to the client
    public: {
      baseUrl:  "https://admin.aiavr.uk",
      // baseUrl:  "http://127.0.0.1:8098",
      sourceWeb: 'https://image.51x.uk/xinshijie'
    }
  },
  quasar: {
    plugins: ['Notify','Dialog'],
  },
  meta: {
    title: '图集网-图片,美女,写真,图集',
    meta: [
          { name: 'content-language', content: 'zh-CH' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, user-scalable=no, viewport-fit=cover' },
      { hid: 'keywords', name: 'keywords', content: "图片,美女,写真,图集" },
      { hid: 'description', name: 'keywords', content: "图集网 美女 写真 摄影 秀人网 Photo Gallery, Beauty, Photo, Photography, Showman.com" },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' } // 指向你的 favicon
    ],
  },
  site: {
    url: 'https://www.aiavr.uk',
  },
  sitemap: {
    sources: ['/api/sitemap'],
  },
  i18n: {
    /* module options */
  }
})
