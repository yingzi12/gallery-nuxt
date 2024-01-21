// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  devtools: { enabled: true },
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
    '@pinia/nuxt'
  ],
  runtimeConfig: {
    turso: {
      dbUrl: "https://vedio-db-yingzi12.turso.io/",
      dbAuthToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOiIyMDIzLTEwLTMwVDA5OjUyOjU5Ljg5OTI0Njk3NVoiLCJpZCI6IjZlOWUxMjkzLTc3MDctMTFlZS04Y2I5LTFlZWY0NDFjZTM4ZiJ9.8KtwHuvcFMcU4NBsNkwV4Wn05RDh4J-GDz4BMQyAU3WrXEnUZqe-9mz7Ceqkog3Ydj4puKfCAHhtan9j3A53BA",
    },
    // Public keys that are exposed to the client
    public: {
      baseUrl:  "https://admin.aiavr.uk",
      // baseUrl:  "http://127.0.0.1:8098",
      sourceWeb: 'https://image.51x.uk/xinshijie/test'
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
  nitro: {
    prerender: {
      crawlLinks: true,
      // routes: ['/', 'sitemap.xml'],
      ignore: ['/tak', '/konfiguration', '/checkout'],
    },
  },
  site: {
    url: 'https://www.aiavr.uk',
  },
  sitemap: {
    sources: ['/api/sitemap'],
  },
  plugins: [
    '~/plugins/error-handler.ts',
  ],
  i18n: {
    /* module options */
  }
})
