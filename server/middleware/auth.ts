// Nuxt 将自动读取其中的任何文件，为~/server/middleware您的项目创建服务器中间件。
// 中间件处理程序将在任何其他服务器路由之前对每个请求运行，以添加或检查标头、记录请求或扩展事件的请求对象。
export default defineEventHandler((event) => {
    var url=event.path;
    //console.log("auth url:"+url)
})
